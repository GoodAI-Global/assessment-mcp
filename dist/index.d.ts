#!/usr/bin/env node
/**
 * Good AI Enterprise Assessment MCP Server
 * "Leverage, not lore" — Tools that deliver immediate value
 *
 * @goodai/assessment-mcp
 *
 * This MCP server provides AI assessment tools for enterprise clients:
 * - assess_ai_readiness: Evaluate organizational AI readiness
 * - identify_bottlenecks: Find operational inefficiencies
 * - generate_pilot_plan: Create implementation roadmaps
 * - calculate_roi: Project financial returns
 */
import { startServer, createServer, callTool } from "./server.js";
export { createServer, callTool, startServer };
export * from "./types/index.js";
export { assessAIReadiness } from "./tools/assess_ai_readiness.js";
export { identifyBottlenecks } from "./tools/identify_bottlenecks.js";
export { generatePilotPlan } from "./tools/generate_pilot_plan.js";
export { calculateROI } from "./tools/calculate_roi.js";
//# sourceMappingURL=index.d.ts.map