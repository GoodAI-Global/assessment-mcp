/**
 * Good AI - Generate Pilot Plan Tool
 * "Non-invasive by default" — Solutions that bypass legacy constraints
 */
import { z } from "zod";
import type { GeneratePilotPlanInput, GeneratePilotPlanOutput } from "../types/index.js";
export declare const GeneratePilotPlanInputSchema: z.ZodObject<{
    selected_bottleneck: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        estimated_annual_cost_usd: z.ZodNumber;
        ai_solution_fit_score: z.ZodNumber;
        recommended_ai_approach: z.ZodString;
        complexity: z.ZodEnum<["low", "medium", "high"]>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        estimated_annual_cost_usd: number;
        ai_solution_fit_score: number;
        recommended_ai_approach: string;
        complexity: "low" | "medium" | "high";
    }, {
        name: string;
        description: string;
        estimated_annual_cost_usd: number;
        ai_solution_fit_score: number;
        recommended_ai_approach: string;
        complexity: "low" | "medium" | "high";
    }>;
    constraints: z.ZodObject<{
        max_budget_usd: z.ZodOptional<z.ZodNumber>;
        max_duration_weeks: z.ZodOptional<z.ZodNumber>;
        required_stakeholder_approval: z.ZodOptional<z.ZodBoolean>;
        technical_constraints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        max_budget_usd?: number | undefined;
        max_duration_weeks?: number | undefined;
        required_stakeholder_approval?: boolean | undefined;
        technical_constraints?: string[] | undefined;
    }, {
        max_budget_usd?: number | undefined;
        max_duration_weeks?: number | undefined;
        required_stakeholder_approval?: boolean | undefined;
        technical_constraints?: string[] | undefined;
    }>;
    company_context: z.ZodObject<{
        company_name: z.ZodString;
        industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
        employee_count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        company_name: string;
        industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
        employee_count: number;
    }, {
        company_name: string;
        industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
        employee_count: number;
    }>;
}, "strip", z.ZodTypeAny, {
    selected_bottleneck: {
        name: string;
        description: string;
        estimated_annual_cost_usd: number;
        ai_solution_fit_score: number;
        recommended_ai_approach: string;
        complexity: "low" | "medium" | "high";
    };
    constraints: {
        max_budget_usd?: number | undefined;
        max_duration_weeks?: number | undefined;
        required_stakeholder_approval?: boolean | undefined;
        technical_constraints?: string[] | undefined;
    };
    company_context: {
        company_name: string;
        industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
        employee_count: number;
    };
}, {
    selected_bottleneck: {
        name: string;
        description: string;
        estimated_annual_cost_usd: number;
        ai_solution_fit_score: number;
        recommended_ai_approach: string;
        complexity: "low" | "medium" | "high";
    };
    constraints: {
        max_budget_usd?: number | undefined;
        max_duration_weeks?: number | undefined;
        required_stakeholder_approval?: boolean | undefined;
        technical_constraints?: string[] | undefined;
    };
    company_context: {
        company_name: string;
        industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
        employee_count: number;
    };
}>;
export declare function generatePilotPlan(input: GeneratePilotPlanInput): GeneratePilotPlanOutput;
export declare const GENERATE_PILOT_PLAN_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            selected_bottleneck: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        description: string;
                    };
                    description: {
                        type: string;
                        description: string;
                    };
                    estimated_annual_cost_usd: {
                        type: string;
                        description: string;
                    };
                    ai_solution_fit_score: {
                        type: string;
                        description: string;
                    };
                    recommended_ai_approach: {
                        type: string;
                        description: string;
                    };
                    complexity: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                };
                required: string[];
            };
            constraints: {
                type: string;
                properties: {
                    max_budget_usd: {
                        type: string;
                        description: string;
                    };
                    max_duration_weeks: {
                        type: string;
                        description: string;
                    };
                    required_stakeholder_approval: {
                        type: string;
                        description: string;
                    };
                    technical_constraints: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                    };
                };
            };
            company_context: {
                type: string;
                properties: {
                    company_name: {
                        type: string;
                        description: string;
                    };
                    industry: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    employee_count: {
                        type: string;
                        description: string;
                    };
                };
                required: string[];
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=generate_pilot_plan.d.ts.map