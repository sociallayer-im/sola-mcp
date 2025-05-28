import express from 'express';
import { randomUUID } from 'node:crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import axios, {isCancel, AxiosError} from 'axios';


const BASE_URL = 'https://api.sola.day';
// const BASE_URL = 'http://localhost:3333';

// Create an MCP server
const server = new McpServer({
  name: 'Sola',
  version: '1.0.0',
  description: 'MCP server for Social Layer',
  license: 'MIT',
  author: 'jiangplus',
});

server.tool('event/get', { eventId: z.string() }, async ({ eventId }) => {
  console.log('event/get', eventId);
  console.log(`${BASE_URL}/api/event/get?id=${eventId}`);
  try {
    const response = await axios.get(`${BASE_URL}/api/event/get?id=${eventId}`);
    return {
      content: [{ type: 'text', text: JSON.stringify(response.data) }],
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return {
      content: [{ type: 'text', text: `Error fetching event: ${error}` }],
    };
  }
});

server.tool('event/list', {
  groupId: z.string().describe('Group ID or Group Name, like 3579 or "edge-esmeralda-2025"'),
  start_date: z.string().describe('Start date, like 2025-05-28'),
  end_date: z.string().describe('End date, like 2025-05-28'),
  limit: z.number().optional().describe('Limit, like 10'),
 }, async ({ groupId, start_date, end_date, limit }) => {
  console.log('event/list', groupId, start_date, end_date, limit);
  limit = limit || 10;
  try {
    const url = `${BASE_URL}/api/event/list?group_id=${groupId}&start_date=${start_date}&end_date=${end_date}&limit=${limit}`;
    console.log('event/list', url);
    const response = await axios.get(url);
  const events = response.data;
    return {
      content: [{ type: 'text', text: JSON.stringify(events) }],
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return {
      content: [{ type: 'text', text: `Error fetching event: ${error}` }],
    };
  }
});

server.tool('event/search', {
  groupId: z.string().describe('Group ID or Group Name, like 3579 or "edge-esmeralda-2025"'),
  keyword: z.string().describe('Keyword, like "music"'),
  start_date: z.string().describe('Start date, like 2025-05-28'),
  end_date: z.string().describe('End date, like 2025-05-28'),
  limit: z.number().optional().describe('Limit, like 10'),
 }, async ({ groupId, start_date, end_date, limit, keyword }) => {
  console.log('event/search', groupId, start_date, end_date, limit, keyword);
  limit = limit || 10;

  try {
  const response = await axios.get(`${BASE_URL}/api/event/list?group_id=${groupId}&start_date=${start_date}&end_date=${end_date}&limit=${limit}&search_title=${keyword}`);
  const events = response.data;
    return {
      content: [{ type: 'text', text: JSON.stringify(events) }],
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return {
      content: [{ type: 'text', text: `Error fetching event: ${error}` }],
    };
  }
});

server.tool('group/get', { groupId: z.string().describe('Group ID or Group Name, like 3579 or "edge-esmeralda-2025"') }, async ({ groupId }) => {
  console.log('group/get', groupId);

  try {
    const response = await axios.get(`${BASE_URL}/group/get?group_id=${groupId}`);
    const group = response.data;
      return {
        content: [{ type: 'text', text: JSON.stringify(group) }],
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      return {
        content: [{ type: 'text', text: `Error fetching event: ${error}` }],
      };
    }
});

server.tool('profile/get', { id: z.string().describe('Profile ID or Profile Name, like 123 or "jiang"') }, async ({ id }) => {
  console.log('profile/get', id);

  try {
    const response = await axios.get(`${BASE_URL}/api/profile/get?id=${id}`);
    const profile = response.data;
      return {
        content: [{ type: 'text', text: JSON.stringify(profile) }],
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      return {
        content: [{ type: 'text', text: `Error fetching event: ${error}` }],
      };
    }
});

server.tool('venue/get', { venueId: z.string().describe('Venue ID, like 123') }, async ({ venueId }) => {
  console.log('venue/get', venueId);

  try {
    const response = await axios.get(`${BASE_URL}/venue/get?id=${venueId}`);
    const venue = response.data;
      return {
        content: [{ type: 'text', text: JSON.stringify(venue) }],
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      return {
        content: [{ type: 'text', text: `Error fetching event: ${error}` }],
      };
    }
});

// server.tool('group/is_member', { groupId: z.string(), profileId: z.string() }, async ({ groupId, profileId }) => {
//   console.log('group/is_member', groupId, profileId);
//   return {
//     content: [{ type: 'text', text: String(a + b) }],
//   };
// });


// Start receiving messages on stdin and sending messages on stdout
// const transport = new StdioServerTransport();
// await server.connect(transport);


const app = express();
app.use(express.json());

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Handle POST requests for client-to-server communication
app.post('/mcp/public', async (req: express.Request, res: express.Response) => {
  // Check for existing session ID
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // Store the transport by session ID
        transports[sessionId] = transport;
      },
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };


    // Connect to the MCP server
    await server.connect(transport);
  } else {
    // Invalid request
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: No valid session ID provided',
      },
      id: null,
    });
    return;
  }

  // Handle the request
  await transport.handleRequest(req, res, req.body);
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (req: express.Request, res: express.Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// Handle GET requests for server-to-client notifications via SSE
app.get('/mcp/public', handleSessionRequest);

// Handle DELETE requests for session termination
app.delete('/mcp/public', handleSessionRequest);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});
