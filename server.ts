import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import axios, { isCancel, AxiosError } from 'axios';

const BASE_URL = 'https://api.sola.day';
// const BASE_URL = 'http://localhost:3333';

// Create an MCP server
export const server = new McpServer({
  name: 'Sola',
  version: '1.0.0',
  description: 'MCP server for Social Layer',
  license: 'MIT',
  author: 'jiangplus',
});

server.tool('get_event', { eventId: z.string() }, async ({ eventId }) => {
  // console.log('event/get', eventId);
  // console.log(`${BASE_URL}/api/event/get?id=${eventId}`);
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

server.tool(
  'list_event',
  {
    groupId: z.string().describe('Group ID or Group Name, like 3579 or "edge-esmeralda-2025"'),
    start_date: z.string().describe('Start date, like 2025-05-28'),
    end_date: z.string().describe('End date, like 2025-05-28'),
    limit: z.number().optional().describe('Limit, like 10'),
  },
  async ({ groupId, start_date, end_date, limit }) => {
    // console.log('event/list', groupId, start_date, end_date, limit);
    limit = limit || 10;
    try {
      const url = `${BASE_URL}/api/event/list?group_id=${groupId}&start_date=${start_date}&end_date=${end_date}&limit=${limit}`;
      // console.log('event/list', url);
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
  },
);

server.tool(
  'search_event',
  {
    groupId: z.string().describe('Group ID or Group Name, like 3579 or "edge-esmeralda-2025"'),
    keyword: z.string().describe('Keyword, like "music"'),
    start_date: z.string().describe('Start date, like 2025-05-28'),
    end_date: z.string().describe('End date, like 2025-05-28'),
    limit: z.number().optional().describe('Limit, like 10'),
  },
  async ({ groupId, start_date, end_date, limit, keyword }) => {
    // console.log('event/search', groupId, start_date, end_date, limit, keyword);
    limit = limit || 10;

    try {
      const response = await axios.get(
        `${BASE_URL}/api/event/list?group_id=${groupId}&start_date=${start_date}&end_date=${end_date}&limit=${limit}&search_title=${keyword}`,
      );
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
  },
);

server.tool(
  'get_group',
  { groupId: z.string().describe('Group ID or Group Name, like 3579 or "edge-esmeralda-2025"') },
  async ({ groupId }) => {
    // console.log('group/get', groupId);

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
  },
);

server.tool(
  'get_profile',
  { id: z.string().describe('Profile ID or Profile Name, like 123 or "jiang"') },
  async ({ id }) => {
    // console.log('profile/get', id);

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
  },
);

server.tool(
  'get_venue',
  { venueId: z.string().describe('Venue ID, like 123') },
  async ({ venueId }) => {
    // console.log('venue/get', venueId);

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
  },
);

// server.tool('group/is_member', { groupId: z.string(), profileId: z.string() }, async ({ groupId, profileId }) => {
//   return {
//     content: [{ type: 'text', text: String(a + b) }],
//   };
// });
