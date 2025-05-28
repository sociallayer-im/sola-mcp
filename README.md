# Sola MCP Server

A stateless, streamable HTTP server implementing the [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) for the Social Layer platform. This server exposes a set of tools for interacting with events, groups, profiles, and venues via HTTP endpoints.

## Features

- **MCP server** for Social Layer integrations
- Exposes tools for:
  - Event retrieval (`event/get`)
  - Event listing and search (`event/list`, `event/search`)
  - Group info (`group/get`)
  - Profile info (`profile/get`)
  - Venue info (`venue/get`)
- Stateless, session-based HTTP transport
- Ready for deployment on [Fly.io](https://fly.io/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (for running and installing dependencies)
- Node.js (for compatibility with some dependencies)
- [Fly.io](https://fly.io/) account (for deployment, optional)

### Installation

```bash
bun install
```

### Running the Server

```bash
bun run index.ts
```

The server will start on port `3000` by default.

### Inspecting the MCP Server

You can inspect the running server using the MCP Inspector:

```bash
bunx @modelcontextprotocol/inspector http://localhost:3000/mcp/public
```

## API Endpoints

- `POST /mcp/public` — Main endpoint for MCP client-to-server communication
- `GET /mcp/public` — Server-to-client notifications via SSE
- `DELETE /mcp/public` — Session termination

All endpoints expect and return JSON-RPC 2.0 payloads.

## Tooling

The following tools are available via the MCP protocol:

- `event/get`: Get event details by ID
- `event/list`: List events for a group and date range
- `event/search`: Search events by keyword
- `group/get`: Get group details
- `profile/get`: Get profile details
- `venue/get`: Get venue details

## Deployment

This project is ready to deploy on [Fly.io](https://fly.io/):

1. Install the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/)
2. Authenticate: `fly auth login`
3. Launch: `fly launch`
4. Deploy: `fly deploy`

The `fly.toml` is preconfigured for deployment.

## Development

- Format code: `bun run format`
- Check formatting: `bun run format:check`

## License

MIT

## Author

jiangplus
