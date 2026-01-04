/**
 * Good AI - Assess AI Readiness Tool
 * "Evidence over opinions" — Assessments based on measurable criteria
 */
import { z } from "zod";
import type { AssessAIReadinessInput, AssessAIReadinessOutput } from "../types/index.js";
export declare const AssessAIReadinessInputSchema: z.ZodObject<{
    company_name: z.ZodString;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    employee_count: z.ZodNumber;
    annual_revenue_usd: z.ZodOptional<z.ZodNumber>;
    data_infrastructure: z.ZodObject<{
        centralized_data: z.ZodBoolean;
        data_quality_score: z.ZodOptional<z.ZodNumber>;
        manual_data_entry_percent: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        centralized_data: boolean;
        manual_data_entry_percent: number;
        data_quality_score?: number | undefined;
    }, {
        centralized_data: boolean;
        manual_data_entry_percent: number;
        data_quality_score?: number | undefined;
    }>;
    current_systems: z.ZodObject<{
        erp: z.ZodNullable<z.ZodString>;
        crm: z.ZodNullable<z.ZodString>;
        legacy_systems_count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        erp: string | null;
        crm: string | null;
        legacy_systems_count: number;
    }, {
        erp: string | null;
        crm: string | null;
        legacy_systems_count: number;
    }>;
    previous_ai_attempts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    employee_count: number;
    data_infrastructure: {
        centralized_data: boolean;
        manual_data_entry_percent: number;
        data_quality_score?: number | undefined;
    };
    current_systems: {
        erp: string | null;
        crm: string | null;
        legacy_systems_count: number;
    };
    annual_revenue_usd?: number | undefined;
    previous_ai_attempts?: string[] | undefined;
}, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    employee_count: number;
    data_infrastructure: {
        centralized_data: boolean;
        manual_data_entry_percent: number;
        data_quality_score?: number | undefined;
    };
    current_systems: {
        erp: string | null;
        crm: string | null;
        legacy_systems_count: number;
    };
    annual_revenue_usd?: number | undefined;
    previous_ai_attempts?: string[] | undefined;
}>;
export declare function assessAIReadiness(input: AssessAIReadinessInput): AssessAIReadinessOutput;
export declare const ASSESS_AI_READINESS_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
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
            annual_revenue_usd: {
                type: string;
                description: string;
            };
            data_infrastructure: {
                type: string;
                properties: {
                    centralized_data: {
                        type: string;
                        description: string;
                    };
                    data_quality_score: {
                        type: string;
                        description: string;
                    };
                    manual_data_entry_percent: {
                        type: string;
                        description: string;
                    };
                };
                required: string[];
            };
            current_systems: {
                type: string;
                properties: {
                    erp: {
                        type: string[];
                        description: string;
                    };
                    crm: {
                        type: string[];
                        description: string;
                    };
                    legacy_systems_count: {
                        type: string;
                        description: string;
                    };
                };
                required: string[];
            };
            previous_ai_attempts: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=assess_ai_readiness.d.ts.map