/**
 * Good AI Enterprise Assessment MCP Server
 * "Leverage, not lore" — Tools that deliver immediate value
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListPromptsRequestSchema, GetPromptRequestSchema, ErrorCode, McpError, } from "@modelcontextprotocol/sdk/types.js";
import { assessAIReadiness, AssessAIReadinessInputSchema, ASSESS_AI_READINESS_TOOL, } from "./tools/assess_ai_readiness.js";
import { identifyBottlenecks, IdentifyBottlenecksInputSchema, IDENTIFY_BOTTLENECKS_TOOL, } from "./tools/identify_bottlenecks.js";
import { generatePilotPlan, GeneratePilotPlanInputSchema, GENERATE_PILOT_PLAN_TOOL, } from "./tools/generate_pilot_plan.js";
import { calculateROI, CalculateROIInputSchema, CALCULATE_ROI_TOOL, } from "./tools/calculate_roi.js";
import { ENTERPRISE_ASSESSMENT_PROMPT, PILOT_RECOMMENDATION_PROMPT, } from "./prompts/index.js";
import { createAuditTrail, logger, getConfig, } from "./lib/index.js";
// Server metadata
const SERVER_NAME = "goodai-assessment";
const SERVER_VERSION = "1.0.0";
const TOOL_REGISTRY = {
    assess_ai_readiness: {
        execute: (input) => assessAIReadiness(AssessAIReadinessInputSchema.parse(input)),
    },
    identify_bottlenecks: {
        execute: (input) => identifyBottlenecks(IdentifyBottlenecksInputSchema.parse(input)),
    },
    generate_pilot_plan: {
        execute: (input) => generatePilotPlan(GeneratePilotPlanInputSchema.parse(input)),
    },
    calculate_roi: {
        execute: (input) => calculateROI(CalculateROIInputSchema.parse(input)),
    },
};
/**
 * Execute a tool with audit logging
 */
function executeToolWithAudit(name, args, audit) {
    const handler = TOOL_REGISTRY[name];
    if (!handler) {
        audit.recordSecurityViolation("unknown_tool_access", { toolName: name });
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
    const auditId = audit.recordToolInvocation(name, args);
    const startTime = Date.now();
    try {
        const result = handler.execute(args);
        const durationMs = Date.now() - startTime;
        audit.recordToolSuccess(auditId, name, result, durationMs);
        return result;
    }
    catch (error) {
        const durationMs = Date.now() - startTime;
        // Handle Zod validation errors
        if (error && typeof error === "object" && "issues" in error) {
            const zodError = error;
            const messages = zodError.issues
                .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                .join("; ");
            audit.recordValidationError(name, zodError.issues.map((i) => `${i.path.join(".")}: ${i.message}`), args);
            throw new McpError(ErrorCode.InvalidParams, `Validation error: ${messages}`);
        }
        // Handle other errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        audit.recordToolError(auditId, name, { code: "EXECUTION_ERROR", message: errorMessage }, durationMs);
        throw new McpError(ErrorCode.InternalError, `Error executing ${name}: ${errorMessage}`);
    }
}
/**
 * Create and configure the MCP server
 */
export function createServer() {
    const config = getConfig();
    logger.info("Creating MCP server", {
        serverName: SERVER_NAME,
        version: SERVER_VERSION,
        environment: config.environment,
    });
    const server = new Server({
        name: SERVER_NAME,
        version: SERVER_VERSION,
    }, {
        capabilities: {
            tools: {},
            prompts: {},
        },
    });
    // Register tool listing handler
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        logger.debug("Listing available tools");
        return {
            tools: [
                ASSESS_AI_READINESS_TOOL,
                IDENTIFY_BOTTLENECKS_TOOL,
                GENERATE_PILOT_PLAN_TOOL,
                CALCULATE_ROI_TOOL,
            ],
        };
    });
    // Register tool call handler with audit logging
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        const audit = createAuditTrail();
        logger.debug("Tool call received", {
            toolName: name,
            correlationId: audit.getCorrelationId(),
        });
        try {
            const result = executeToolWithAudit(name, args, audit);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            if (error instanceof McpError) {
                throw error;
            }
            logger.error("Unexpected error in tool execution", error instanceof Error ? error : new Error(String(error)), { toolName: name });
            throw new McpError(ErrorCode.InternalError, `Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
    // Register prompt listing handler
    server.setRequestHandler(ListPromptsRequestSchema, async () => {
        logger.debug("Listing available prompts");
        return {
            prompts: [ENTERPRISE_ASSESSMENT_PROMPT, PILOT_RECOMMENDATION_PROMPT],
        };
    });
    // Register prompt get handler
    server.setRequestHandler(GetPromptRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        logger.debug("Prompt requested", { promptName: name });
        switch (name) {
            case "enterprise_assessment": {
                const companyName = args?.company_name || "the company";
                const industry = args?.industry || "general";
                return {
                    description: ENTERPRISE_ASSESSMENT_PROMPT.description,
                    messages: [
                        {
                            role: "user",
                            content: {
                                type: "text",
                                text: `You are a Good AI enterprise consultant. Conduct a comprehensive AI readiness assessment for ${companyName} in the ${industry} industry.

Follow the Good AI methodology:
1. "Leverage, not lore" — Focus on tools that deliver immediate value
2. "Evidence over opinions" — Base recommendations on measurable criteria
3. "Augment first" — Identify augmentation opportunities before automation
4. "Non-invasive by default" — Propose solutions that bypass legacy constraints

Start by using the assess_ai_readiness tool to evaluate the company's current state.
Then use identify_bottlenecks to find opportunities.
Finally, use generate_pilot_plan and calculate_roi for the recommended opportunity.

Provide actionable insights, not just scores.`,
                            },
                        },
                    ],
                };
            }
            case "pilot_recommendation": {
                const focusArea = args?.focus_area || "highest impact opportunity";
                return {
                    description: PILOT_RECOMMENDATION_PROMPT.description,
                    messages: [
                        {
                            role: "user",
                            content: {
                                type: "text",
                                text: `As a Good AI consultant, create a detailed pilot recommendation focusing on ${focusArea}.

Use the generate_pilot_plan tool with appropriate constraints.
Calculate ROI using the calculate_roi tool.
Ensure recommendations follow the "leverage, not lore" principle.

Provide a complete implementation roadmap with success metrics.`,
                            },
                        },
                    ],
                };
            }
            default:
                logger.warn("Unknown prompt requested", { promptName: name });
                throw new McpError(ErrorCode.MethodNotFound, `Unknown prompt: ${name}`);
        }
    });
    return server;
}
/**
 * Start the server with stdio transport
 */
export async function startServer() {
    const config = getConfig();
    logger.info("Starting Good AI Assessment MCP Server", {
        version: SERVER_VERSION,
        environment: config.environment,
        auditEnabled: config.audit.enabled,
    });
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info("Server connected and ready");
}
/**
 * Direct function call for testing (bypasses MCP protocol)
 */
export function callTool(toolName, args) {
    const audit = createAuditTrail();
    return executeToolWithAudit(toolName, args, audit);
}
//# sourceMappingURL=server.js.map