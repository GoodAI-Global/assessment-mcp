/**
 * Good AI - Identify Bottlenecks Tool
 * "Augment first" — Identify augmentation opportunities before automation
 */
import { z } from "zod";
import type { IdentifyBottlenecksInput, IdentifyBottlenecksOutput } from "../types/index.js";
export declare const IdentifyBottlenecksInputSchema: z.ZodObject<{
    process_description: z.ZodString;
    metrics: z.ZodObject<{
        cycle_time_hours: z.ZodOptional<z.ZodNumber>;
        error_rate_percent: z.ZodOptional<z.ZodNumber>;
        manual_steps_count: z.ZodOptional<z.ZodNumber>;
        cost_per_unit_usd: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        cycle_time_hours?: number | undefined;
        error_rate_percent?: number | undefined;
        manual_steps_count?: number | undefined;
        cost_per_unit_usd?: number | undefined;
    }, {
        cycle_time_hours?: number | undefined;
        error_rate_percent?: number | undefined;
        manual_steps_count?: number | undefined;
        cost_per_unit_usd?: number | undefined;
    }>;
    pain_points: z.ZodArray<z.ZodString, "many">;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
}, "strip", z.ZodTypeAny, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    process_description: string;
    metrics: {
        cycle_time_hours?: number | undefined;
        error_rate_percent?: number | undefined;
        manual_steps_count?: number | undefined;
        cost_per_unit_usd?: number | undefined;
    };
    pain_points: string[];
}, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    process_description: string;
    metrics: {
        cycle_time_hours?: number | undefined;
        error_rate_percent?: number | undefined;
        manual_steps_count?: number | undefined;
        cost_per_unit_usd?: number | undefined;
    };
    pain_points: string[];
}>;
export declare function identifyBottlenecks(input: IdentifyBottlenecksInput): IdentifyBottlenecksOutput;
export declare const IDENTIFY_BOTTLENECKS_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            process_description: {
                type: string;
                description: string;
            };
            metrics: {
                type: string;
                properties: {
                    cycle_time_hours: {
                        type: string;
                        description: string;
                    };
                    error_rate_percent: {
                        type: string;
                        description: string;
                    };
                    manual_steps_count: {
                        type: string;
                        description: string;
                    };
                    cost_per_unit_usd: {
                        type: string;
                        description: string;
                    };
                };
            };
            pain_points: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            industry: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=identify_bottlenecks.d.ts.map