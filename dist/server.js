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
// Server metadata
const SERVER_NAME = "goodai-assessment";
const SERVER_VERSION = "1.0.0";
/**
 * Create and configure the MCP server
 */
export function createServer() {
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
        return {
            tools: [
                ASSESS_AI_READINESS_TOOL,
                IDENTIFY_BOTTLENECKS_TOOL,
                GENERATE_PILOT_PLAN_TOOL,
                CALCULATE_ROI_TOOL,
            ],
        };
    });
    // Register tool call handler
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        try {
            switch (name) {
                case "assess_ai_readiness": {
                    const validatedInput = AssessAIReadinessInputSchema.parse(args);
                    const result = assessAIReadiness(validatedInput);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(result, null, 2),
                            },
                        ],
                    };
                }
                case "identify_bottlenecks": {
                    const validatedInput = IdentifyBottlenecksInputSchema.parse(args);
                    const result = identifyBottlenecks(validatedInput);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(result, null, 2),
                            },
                        ],
                    };
                }
                case "generate_pilot_plan": {
                    const validatedInput = GeneratePilotPlanInputSchema.parse(args);
                    const result = generatePilotPlan(validatedInput);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(result, null, 2),
                            },
                        ],
                    };
                }
                case "calculate_roi": {
                    const validatedInput = CalculateROIInputSchema.parse(args);
                    const result = calculateROI(validatedInput);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(result, null, 2),
                            },
                        ],
                    };
                }
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
            }
        }
        catch (error) {
            if (error instanceof McpError) {
                throw error;
            }
            // Handle Zod validation errors
            if (error && typeof error === "object" && "issues" in error) {
                const zodError = error;
                const messages = zodError.issues
                    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                    .join("; ");
                throw new McpError(ErrorCode.InvalidParams, `Validation error: ${messages}`);
            }
            throw new McpError(ErrorCode.InternalError, `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
    // Register prompt listing handler
    server.setRequestHandler(ListPromptsRequestSchema, async () => {
        return {
            prompts: [ENTERPRISE_ASSESSMENT_PROMPT, PILOT_RECOMMENDATION_PROMPT],
        };
    });
    // Register prompt get handler
    server.setRequestHandler(GetPromptRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
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
                throw new McpError(ErrorCode.MethodNotFound, `Unknown prompt: ${name}`);
        }
    });
    return server;
}
/**
 * Start the server with stdio transport
 */
export async function startServer() {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // Log to stderr to avoid interfering with stdio transport
    console.error(`Good AI Assessment MCP Server v${SERVER_VERSION} started`);
}
/**
 * Direct function call for testing (bypasses MCP protocol)
 */
export function callTool(toolName, args) {
    switch (toolName) {
        case "assess_ai_readiness": {
            const validatedInput = AssessAIReadinessInputSchema.parse(args);
            return assessAIReadiness(validatedInput);
        }
        case "identify_bottlenecks": {
            const validatedInput = IdentifyBottlenecksInputSchema.parse(args);
            return identifyBottlenecks(validatedInput);
        }
        case "generate_pilot_plan": {
            const validatedInput = GeneratePilotPlanInputSchema.parse(args);
            return generatePilotPlan(validatedInput);
        }
        case "calculate_roi": {
            const validatedInput = CalculateROIInputSchema.parse(args);
            return calculateROI(validatedInput);
        }
        default:
            throw new Error(`Unknown tool: ${toolName}`);
    }
}
//# sourceMappingURL=server.js.map