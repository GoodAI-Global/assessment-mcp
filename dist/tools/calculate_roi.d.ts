/**
 * Good AI - Calculate ROI Tool
 * "Evidence over opinions" — Assessments based on measurable criteria
 */
import { z } from "zod";
import type { CalculateROIInput, CalculateROIOutput } from "../types/index.js";
export declare const CalculateROIInputSchema: z.ZodObject<{
    current_metrics: z.ZodObject<{
        process_cost_per_month_usd: z.ZodNumber;
        error_rate_percent: z.ZodOptional<z.ZodNumber>;
        cycle_time_hours: z.ZodOptional<z.ZodNumber>;
        manual_fte_count: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        process_cost_per_month_usd: number;
        cycle_time_hours?: number | undefined;
        error_rate_percent?: number | undefined;
        manual_fte_count?: number | undefined;
    }, {
        process_cost_per_month_usd: number;
        cycle_time_hours?: number | undefined;
        error_rate_percent?: number | undefined;
        manual_fte_count?: number | undefined;
    }>;
    target_improvement_percent: z.ZodNumber;
    implementation_cost_usd: z.ZodNumber;
    ongoing_monthly_cost_usd: z.ZodOptional<z.ZodNumber>;
    time_horizon_months: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    current_metrics: {
        process_cost_per_month_usd: number;
        cycle_time_hours?: number | undefined;
        error_rate_percent?: number | undefined;
        manual_fte_count?: number | undefined;
    };
    target_improvement_percent: number;
    implementation_cost_usd: number;
    ongoing_monthly_cost_usd?: number | undefined;
    time_horizon_months?: number | undefined;
}, {
    current_metrics: {
        process_cost_per_month_usd: number;
        cycle_time_hours?: number | undefined;
        error_rate_percent?: number | undefined;
        manual_fte_count?: number | undefined;
    };
    target_improvement_percent: number;
    implementation_cost_usd: number;
    ongoing_monthly_cost_usd?: number | undefined;
    time_horizon_months?: number | undefined;
}>;
export declare function calculateROI(input: CalculateROIInput): CalculateROIOutput;
export declare const CALCULATE_ROI_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            current_metrics: {
                type: string;
                properties: {
                    process_cost_per_month_usd: {
                        type: string;
                        description: string;
                    };
                    error_rate_percent: {
                        type: string;
                        description: string;
                    };
                    cycle_time_hours: {
                        type: string;
                        description: string;
                    };
                    manual_fte_count: {
                        type: string;
                        description: string;
                    };
                };
                required: string[];
            };
            target_improvement_percent: {
                type: string;
                description: string;
            };
            implementation_cost_usd: {
                type: string;
                description: string;
            };
            ongoing_monthly_cost_usd: {
                type: string;
                description: string;
            };
            time_horizon_months: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=calculate_roi.d.ts.map