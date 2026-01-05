/**
 * Good AI - Prioritize Use Cases Tool
 * "Leverage, not lore" — Rank potential AI projects by impact and feasibility
 */
import { z } from "zod";
declare const UseCaseSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    category: z.ZodEnum<["automation", "prediction", "optimization", "classification", "generation", "analysis"]>;
    estimated_annual_value_usd: z.ZodOptional<z.ZodNumber>;
    estimated_implementation_cost_usd: z.ZodOptional<z.ZodNumber>;
    data_availability: z.ZodOptional<z.ZodEnum<["none", "partial", "available", "excellent"]>>;
    stakeholder_support: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    technical_complexity: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    time_to_implement_weeks: z.ZodOptional<z.ZodNumber>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    strategic_alignment: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    category: "prediction" | "automation" | "optimization" | "classification" | "generation" | "analysis";
    estimated_annual_value_usd?: number | undefined;
    estimated_implementation_cost_usd?: number | undefined;
    data_availability?: "excellent" | "none" | "partial" | "available" | undefined;
    stakeholder_support?: "low" | "medium" | "high" | undefined;
    technical_complexity?: "low" | "medium" | "high" | undefined;
    time_to_implement_weeks?: number | undefined;
    dependencies?: string[] | undefined;
    strategic_alignment?: "low" | "medium" | "high" | undefined;
}, {
    name: string;
    description: string;
    category: "prediction" | "automation" | "optimization" | "classification" | "generation" | "analysis";
    estimated_annual_value_usd?: number | undefined;
    estimated_implementation_cost_usd?: number | undefined;
    data_availability?: "excellent" | "none" | "partial" | "available" | undefined;
    stakeholder_support?: "low" | "medium" | "high" | undefined;
    technical_complexity?: "low" | "medium" | "high" | undefined;
    time_to_implement_weeks?: number | undefined;
    dependencies?: string[] | undefined;
    strategic_alignment?: "low" | "medium" | "high" | undefined;
}>;
export declare const PrioritizeUseCasesInputSchema: z.ZodObject<{
    company_name: z.ZodString;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    use_cases: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        category: z.ZodEnum<["automation", "prediction", "optimization", "classification", "generation", "analysis"]>;
        estimated_annual_value_usd: z.ZodOptional<z.ZodNumber>;
        estimated_implementation_cost_usd: z.ZodOptional<z.ZodNumber>;
        data_availability: z.ZodOptional<z.ZodEnum<["none", "partial", "available", "excellent"]>>;
        stakeholder_support: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
        technical_complexity: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
        time_to_implement_weeks: z.ZodOptional<z.ZodNumber>;
        dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        strategic_alignment: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        category: "prediction" | "automation" | "optimization" | "classification" | "generation" | "analysis";
        estimated_annual_value_usd?: number | undefined;
        estimated_implementation_cost_usd?: number | undefined;
        data_availability?: "excellent" | "none" | "partial" | "available" | undefined;
        stakeholder_support?: "low" | "medium" | "high" | undefined;
        technical_complexity?: "low" | "medium" | "high" | undefined;
        time_to_implement_weeks?: number | undefined;
        dependencies?: string[] | undefined;
        strategic_alignment?: "low" | "medium" | "high" | undefined;
    }, {
        name: string;
        description: string;
        category: "prediction" | "automation" | "optimization" | "classification" | "generation" | "analysis";
        estimated_annual_value_usd?: number | undefined;
        estimated_implementation_cost_usd?: number | undefined;
        data_availability?: "excellent" | "none" | "partial" | "available" | undefined;
        stakeholder_support?: "low" | "medium" | "high" | undefined;
        technical_complexity?: "low" | "medium" | "high" | undefined;
        time_to_implement_weeks?: number | undefined;
        dependencies?: string[] | undefined;
        strategic_alignment?: "low" | "medium" | "high" | undefined;
    }>, "many">;
    budget_constraint_usd: z.ZodOptional<z.ZodNumber>;
    timeline_constraint_weeks: z.ZodOptional<z.ZodNumber>;
    prioritization_weights: z.ZodOptional<z.ZodObject<{
        business_value: z.ZodOptional<z.ZodNumber>;
        feasibility: z.ZodOptional<z.ZodNumber>;
        strategic_fit: z.ZodOptional<z.ZodNumber>;
        quick_wins: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        business_value?: number | undefined;
        feasibility?: number | undefined;
        strategic_fit?: number | undefined;
        quick_wins?: number | undefined;
    }, {
        business_value?: number | undefined;
        feasibility?: number | undefined;
        strategic_fit?: number | undefined;
        quick_wins?: number | undefined;
    }>>;
    organizational_readiness_score: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    use_cases: {
        name: string;
        description: string;
        category: "prediction" | "automation" | "optimization" | "classification" | "generation" | "analysis";
        estimated_annual_value_usd?: number | undefined;
        estimated_implementation_cost_usd?: number | undefined;
        data_availability?: "excellent" | "none" | "partial" | "available" | undefined;
        stakeholder_support?: "low" | "medium" | "high" | undefined;
        technical_complexity?: "low" | "medium" | "high" | undefined;
        time_to_implement_weeks?: number | undefined;
        dependencies?: string[] | undefined;
        strategic_alignment?: "low" | "medium" | "high" | undefined;
    }[];
    budget_constraint_usd?: number | undefined;
    timeline_constraint_weeks?: number | undefined;
    prioritization_weights?: {
        business_value?: number | undefined;
        feasibility?: number | undefined;
        strategic_fit?: number | undefined;
        quick_wins?: number | undefined;
    } | undefined;
    organizational_readiness_score?: number | undefined;
}, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    use_cases: {
        name: string;
        description: string;
        category: "prediction" | "automation" | "optimization" | "classification" | "generation" | "analysis";
        estimated_annual_value_usd?: number | undefined;
        estimated_implementation_cost_usd?: number | undefined;
        data_availability?: "excellent" | "none" | "partial" | "available" | undefined;
        stakeholder_support?: "low" | "medium" | "high" | undefined;
        technical_complexity?: "low" | "medium" | "high" | undefined;
        time_to_implement_weeks?: number | undefined;
        dependencies?: string[] | undefined;
        strategic_alignment?: "low" | "medium" | "high" | undefined;
    }[];
    budget_constraint_usd?: number | undefined;
    timeline_constraint_weeks?: number | undefined;
    prioritization_weights?: {
        business_value?: number | undefined;
        feasibility?: number | undefined;
        strategic_fit?: number | undefined;
        quick_wins?: number | undefined;
    } | undefined;
    organizational_readiness_score?: number | undefined;
}>;
export type PrioritizeUseCasesInput = z.infer<typeof PrioritizeUseCasesInputSchema>;
export type UseCase = z.infer<typeof UseCaseSchema>;
export interface ScoredUseCase {
    name: string;
    description: string;
    category: string;
    priority_rank: number;
    priority_tier: "critical" | "high" | "medium" | "low";
    scores: {
        business_value: number;
        feasibility: number;
        strategic_fit: number;
        quick_win_potential: number;
        overall: number;
    };
    estimated_roi_percent: number;
    recommended_phase: 1 | 2 | 3;
    rationale: string;
    risks: string[];
    prerequisites: string[];
    success_factors: string[];
}
export interface UseCasePrioritization {
    company_name: string;
    industry: string;
    total_use_cases_analyzed: number;
    prioritized_use_cases: ScoredUseCase[];
    recommended_roadmap: {
        phase_1: {
            name: string;
            use_cases: string[];
            total_investment_usd: number;
            expected_value_usd: number;
            duration_weeks: number;
        };
        phase_2: {
            name: string;
            use_cases: string[];
            total_investment_usd: number;
            expected_value_usd: number;
            duration_weeks: number;
        };
        phase_3: {
            name: string;
            use_cases: string[];
            total_investment_usd: number;
            expected_value_usd: number;
            duration_weeks: number;
        };
    };
    portfolio_summary: {
        total_potential_value_usd: number;
        total_investment_required_usd: number;
        portfolio_roi_percent: number;
        quick_wins_count: number;
        strategic_initiatives_count: number;
    };
    constraints_analysis: {
        fits_budget: boolean;
        fits_timeline: boolean;
        recommended_adjustments: string[];
    };
    key_recommendations: string[];
    methodology_note: string;
}
export declare const PRIORITIZE_USE_CASES_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            company_name: {
                type: string;
            };
            industry: {
                type: string;
                enum: string[];
            };
            use_cases: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        description: {
                            type: string;
                        };
                        category: {
                            type: string;
                            enum: string[];
                        };
                        estimated_annual_value_usd: {
                            type: string;
                        };
                        estimated_implementation_cost_usd: {
                            type: string;
                        };
                        data_availability: {
                            type: string;
                            enum: string[];
                        };
                        stakeholder_support: {
                            type: string;
                            enum: string[];
                        };
                        technical_complexity: {
                            type: string;
                            enum: string[];
                        };
                        time_to_implement_weeks: {
                            type: string;
                        };
                        strategic_alignment: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                };
            };
            budget_constraint_usd: {
                type: string;
            };
            timeline_constraint_weeks: {
                type: string;
            };
            prioritization_weights: {
                type: string;
            };
            organizational_readiness_score: {
                type: string;
            };
        };
        required: string[];
    };
};
export declare function prioritizeUseCases(input: PrioritizeUseCasesInput): UseCasePrioritization;
export {};
//# sourceMappingURL=prioritize_use_cases.d.ts.map