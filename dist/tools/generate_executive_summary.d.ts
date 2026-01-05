/**
 * Good AI - Generate Executive Summary Tool
 * "Leverage, not lore" — Comprehensive one-page overview for leadership
 */
import { z } from "zod";
export declare const GenerateExecutiveSummaryInputSchema: z.ZodObject<{
    company_name: z.ZodString;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    assessment_date: z.ZodOptional<z.ZodString>;
    readiness_assessment: z.ZodObject<{
        overall_score: z.ZodNumber;
        dimensions: z.ZodObject<{
            data_readiness: z.ZodObject<{
                score: z.ZodNumber;
                findings: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                score: number;
                findings: string[];
            }, {
                score: number;
                findings: string[];
            }>;
            technical_capability: z.ZodObject<{
                score: z.ZodNumber;
                findings: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                score: number;
                findings: string[];
            }, {
                score: number;
                findings: string[];
            }>;
            process_maturity: z.ZodObject<{
                score: z.ZodNumber;
                findings: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                score: number;
                findings: string[];
            }, {
                score: number;
                findings: string[];
            }>;
            organizational_readiness: z.ZodObject<{
                score: z.ZodNumber;
                findings: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                score: number;
                findings: string[];
            }, {
                score: number;
                findings: string[];
            }>;
        }, "strip", z.ZodTypeAny, {
            data_readiness: {
                score: number;
                findings: string[];
            };
            technical_capability: {
                score: number;
                findings: string[];
            };
            process_maturity: {
                score: number;
                findings: string[];
            };
            organizational_readiness: {
                score: number;
                findings: string[];
            };
        }, {
            data_readiness: {
                score: number;
                findings: string[];
            };
            technical_capability: {
                score: number;
                findings: string[];
            };
            process_maturity: {
                score: number;
                findings: string[];
            };
            organizational_readiness: {
                score: number;
                findings: string[];
            };
        }>;
        strengths: z.ZodArray<z.ZodString, "many">;
        gaps: z.ZodArray<z.ZodString, "many">;
        recommended_starting_point: z.ZodString;
        estimated_time_to_value_weeks: z.ZodNumber;
        red_flags: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        overall_score: number;
        dimensions: {
            data_readiness: {
                score: number;
                findings: string[];
            };
            technical_capability: {
                score: number;
                findings: string[];
            };
            process_maturity: {
                score: number;
                findings: string[];
            };
            organizational_readiness: {
                score: number;
                findings: string[];
            };
        };
        strengths: string[];
        gaps: string[];
        recommended_starting_point: string;
        estimated_time_to_value_weeks: number;
        red_flags: string[];
    }, {
        overall_score: number;
        dimensions: {
            data_readiness: {
                score: number;
                findings: string[];
            };
            technical_capability: {
                score: number;
                findings: string[];
            };
            process_maturity: {
                score: number;
                findings: string[];
            };
            organizational_readiness: {
                score: number;
                findings: string[];
            };
        };
        strengths: string[];
        gaps: string[];
        recommended_starting_point: string;
        estimated_time_to_value_weeks: number;
        red_flags: string[];
    }>;
    top_bottlenecks: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        estimated_annual_cost_usd: z.ZodNumber;
        ai_solution_fit_score: z.ZodNumber;
        recommended_ai_approach: z.ZodString;
        complexity: z.ZodEnum<["low", "medium", "high"]>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        estimated_annual_cost_usd: number;
        ai_solution_fit_score: number;
        recommended_ai_approach: string;
        complexity: "low" | "medium" | "high";
    }, {
        name: string;
        estimated_annual_cost_usd: number;
        ai_solution_fit_score: number;
        recommended_ai_approach: string;
        complexity: "low" | "medium" | "high";
    }>, "many">;
    pilot_plan: z.ZodOptional<z.ZodObject<{
        pilot_name: z.ZodString;
        duration_weeks: z.ZodNumber;
        estimated_cost_usd: z.ZodNumber;
        success_metrics: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        pilot_name: string;
        duration_weeks: number;
        estimated_cost_usd: number;
        success_metrics: string[];
    }, {
        pilot_name: string;
        duration_weeks: number;
        estimated_cost_usd: number;
        success_metrics: string[];
    }>>;
    roi_projection: z.ZodOptional<z.ZodObject<{
        expected_roi_percent: z.ZodNumber;
        payback_period_months: z.ZodNumber;
        net_present_value_usd: z.ZodNumber;
        annual_savings_usd: z.ZodNumber;
        confidence_level: z.ZodEnum<["low", "medium", "high"]>;
    }, "strip", z.ZodTypeAny, {
        expected_roi_percent: number;
        payback_period_months: number;
        net_present_value_usd: number;
        annual_savings_usd: number;
        confidence_level: "low" | "medium" | "high";
    }, {
        expected_roi_percent: number;
        payback_period_months: number;
        net_present_value_usd: number;
        annual_savings_usd: number;
        confidence_level: "low" | "medium" | "high";
    }>>;
    executive_sponsor: z.ZodOptional<z.ZodString>;
    prepared_by: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    readiness_assessment: {
        overall_score: number;
        dimensions: {
            data_readiness: {
                score: number;
                findings: string[];
            };
            technical_capability: {
                score: number;
                findings: string[];
            };
            process_maturity: {
                score: number;
                findings: string[];
            };
            organizational_readiness: {
                score: number;
                findings: string[];
            };
        };
        strengths: string[];
        gaps: string[];
        recommended_starting_point: string;
        estimated_time_to_value_weeks: number;
        red_flags: string[];
    };
    top_bottlenecks: {
        name: string;
        estimated_annual_cost_usd: number;
        ai_solution_fit_score: number;
        recommended_ai_approach: string;
        complexity: "low" | "medium" | "high";
    }[];
    assessment_date?: string | undefined;
    pilot_plan?: {
        pilot_name: string;
        duration_weeks: number;
        estimated_cost_usd: number;
        success_metrics: string[];
    } | undefined;
    roi_projection?: {
        expected_roi_percent: number;
        payback_period_months: number;
        net_present_value_usd: number;
        annual_savings_usd: number;
        confidence_level: "low" | "medium" | "high";
    } | undefined;
    executive_sponsor?: string | undefined;
    prepared_by?: string | undefined;
}, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    readiness_assessment: {
        overall_score: number;
        dimensions: {
            data_readiness: {
                score: number;
                findings: string[];
            };
            technical_capability: {
                score: number;
                findings: string[];
            };
            process_maturity: {
                score: number;
                findings: string[];
            };
            organizational_readiness: {
                score: number;
                findings: string[];
            };
        };
        strengths: string[];
        gaps: string[];
        recommended_starting_point: string;
        estimated_time_to_value_weeks: number;
        red_flags: string[];
    };
    top_bottlenecks: {
        name: string;
        estimated_annual_cost_usd: number;
        ai_solution_fit_score: number;
        recommended_ai_approach: string;
        complexity: "low" | "medium" | "high";
    }[];
    assessment_date?: string | undefined;
    pilot_plan?: {
        pilot_name: string;
        duration_weeks: number;
        estimated_cost_usd: number;
        success_metrics: string[];
    } | undefined;
    roi_projection?: {
        expected_roi_percent: number;
        payback_period_months: number;
        net_present_value_usd: number;
        annual_savings_usd: number;
        confidence_level: "low" | "medium" | "high";
    } | undefined;
    executive_sponsor?: string | undefined;
    prepared_by?: string | undefined;
}>;
export type GenerateExecutiveSummaryInput = z.infer<typeof GenerateExecutiveSummaryInputSchema>;
export interface ExecutiveSummary {
    /** Document header */
    header: {
        title: string;
        company: string;
        date: string;
        prepared_by: string;
        executive_sponsor?: string;
    };
    /** High-level snapshot for executives */
    snapshot: {
        readiness_score: number;
        readiness_label: string;
        primary_opportunity: string;
        estimated_annual_value_usd: number;
        recommended_investment_usd: number;
        expected_roi_percent: number;
        time_to_value_weeks: number;
        risk_level: "low" | "medium" | "high";
    };
    /** Key findings organized for quick scanning */
    key_findings: {
        strengths: string[];
        challenges: string[];
        opportunities: string[];
    };
    /** Strategic recommendation summary */
    recommendation: {
        title: string;
        description: string;
        approach: string;
        why_now: string;
    };
    /** Financial summary */
    financial_summary: {
        investment_required_usd: number;
        annual_savings_usd: number;
        payback_period_months: number;
        three_year_value_usd: number;
        roi_percent: number;
        confidence: string;
    };
    /** Implementation timeline summary */
    implementation_timeline: {
        phase_1: {
            name: string;
            duration: string;
            outcome: string;
        };
        phase_2: {
            name: string;
            duration: string;
            outcome: string;
        };
        phase_3: {
            name: string;
            duration: string;
            outcome: string;
        };
    };
    /** Success criteria for pilot */
    success_criteria: string[];
    /** Risk factors and mitigations */
    risk_summary: {
        risk: string;
        mitigation: string;
    }[];
    /** Next steps for decision makers */
    next_steps: string[];
    /** Good AI methodology note */
    methodology_note: string;
}
export declare const GENERATE_EXECUTIVE_SUMMARY_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            company_name: {
                type: string;
                description: string;
            };
            industry: {
                type: string;
                enum: string[];
            };
            assessment_date: {
                type: string;
                description: string;
            };
            readiness_assessment: {
                type: string;
                description: string;
            };
            top_bottlenecks: {
                type: string;
                description: string;
            };
            pilot_plan: {
                type: string;
                description: string;
            };
            roi_projection: {
                type: string;
                description: string;
            };
            executive_sponsor: {
                type: string;
                description: string;
            };
            prepared_by: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function generateExecutiveSummary(input: GenerateExecutiveSummaryInput): ExecutiveSummary;
//# sourceMappingURL=generate_executive_summary.d.ts.map