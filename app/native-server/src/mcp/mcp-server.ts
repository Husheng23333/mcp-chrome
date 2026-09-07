import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { setupTools } from './register-tools';

export let mcpServer: Server | null = null;

/**
 * Create an MCP Server for one HTTP transport/session.
 * A Server instance owns its transport, so it must not be shared by clients.
 */
export const createMcpServer = (): Server => {
  const server = new Server(
    {
      name: 'ChromeMcpServer',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  setupTools(server);
  return server;
};

/**
 * Return the legacy singleton for callers that do not attach a transport.
 * HTTP routes should use createMcpServer() so sessions remain isolated.
 */
export const getMcpServer = () => {
  if (mcpServer) {
    return mcpServer;
  }
  mcpServer = createMcpServer();
  return mcpServer;
};
