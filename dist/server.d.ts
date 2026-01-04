/**
 * Good AI Enterprise Assessment MCP Server
 * "Leverage, not lore" — Tools that deliver immediate value
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
/**
 * Create and configure the MCP server
 */
export declare function createServer(): Server;
/**
 * Start the server with stdio transport
 */
export declare function startServer(): Promise<void>;
/**
 * Direct function call for testing (bypasses MCP protocol)
 */
export declare function callTool(toolName: string, args: Record<string, unknown>): unknown;
//# sourceMappingURL=server.d.ts.map