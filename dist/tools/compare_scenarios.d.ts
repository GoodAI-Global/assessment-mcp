/**
 * Good AI - Compare Scenarios Tool
 * "Evidence over opinions" — Side-by-side comparison of AI investment options
 */
import { z } from "zod";
declare const ScenarioSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    investment_usd: z.ZodNumber;
    expected_annual_value_usd: z.ZodNumber;
    implementation_weeks: z.ZodNumber;
    risk_level: z.ZodEnum<["low", "medium", "high"]>;
    complexity: z.ZodEnum<["low", "medium", "high"]>;
    required_capabilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    strategic_alignment: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    confidence_level: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    complexity: "low" | "medium" | "high";
    investment_usd: number;
    expected_annual_value_usd: number;
    implementation_weeks: number;
    risk_level: "low" | "medium" | "high";
    confidence_level?: "low" | "medium" | "high" | undefined;
    dependencies?: string[] | undefined;
    strategic_alignment?: "low" | "medium" | "high" | undefined;
    required_capabilities?: string[] | undefined;
}, {
    name: string;
    description: string;
    complexity: "low" | "medium" | "high";
    investment_usd: number;
    expected_annual_value_usd: number;
    implementation_weeks: number;
    risk_level: "low" | "medium" | "high";
    confidence_level?: "low" | "medium" | "high" | undefined;
    dependencies?: string[] | undefined;
    strategic_alignment?: "low" | "medium" | "high" | undefined;
    required_capabilities?: string[] | undefined;
}>;
export declare const CompareScenariosInputSchema: z.ZodObject<{
    company_name: z.ZodString;
    comparison_purpose: z.ZodString;
    scenarios: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        investment_usd: z.ZodNumber;
        expected_annual_value_usd: z.ZodNumber;
        implementation_weeks: z.ZodNumber;
        risk_level: z.ZodEnum<["low", "medium", "high"]>;
        complexity: z.ZodEnum<["low", "medium", "high"]>;
        required_capabilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        strategic_alignment: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
        confidence_level: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        complexity: "low" | "medium" | "high";
        investment_usd: number;
        expected_annual_value_usd: number;
        implementation_weeks: number;
        risk_level: "low" | "medium" | "high";
        confidence_level?: "low" | "medium" | "high" | undefined;
        dependencies?: string[] | undefined;
        strategic_alignment?: "low" | "medium" | "high" | undefined;
        required_capabilities?: string[] | undefined;
    }, {
        name: string;
        description: string;
        complexity: "low" | "medium" | "high";
        investment_usd: number;
        expected_annual_value_usd: number;
        implementation_weeks: number;
        risk_level: "low" | "medium" | "high";
        confidence_level?: "low" | "medium" | "high" | undefined;
        dependencies?: string[] | undefined;
        strategic_alignment?: "low" | "medium" | "high" | undefined;
        required_capabilities?: string[] | undefined;
    }>, "many">;
    evaluation_criteria: z.ZodOptional<z.ZodObject<{
        roi_weight: z.ZodOptional<z.ZodNumber>;
        time_to_value_weight: z.ZodOptional<z.ZodNumber>;
        risk_weight: z.ZodOptional<z.ZodNumber>;
        strategic_weight: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        roi_weight?: number | undefined;
        time_to_value_weight?: number | undefined;
        risk_weight?: number | undefined;
        strategic_weight?: number | undefined;
    }, {
        roi_weight?: number | undefined;
        time_to_value_weight?: number | undefined;
        risk_weight?: number | undefined;
        strategic_weight?: number | undefined;
    }>>;
    budget_limit_usd: z.ZodOptional<z.ZodNumber>;
    timeline_limit_weeks: z.ZodOptional<z.ZodNumber>;
    risk_tolerance: z.ZodOptional<z.ZodEnum<["conservative", "moderate", "aggressive"]>>;
}, "strip", z.ZodTypeAny, {
    company_name: string;
    comparison_purpose: string;
    scenarios: {
        name: string;
        description: string;
        complexity: "low" | "medium" | "high";
        investment_usd: number;
        expected_annual_value_usd: number;
        implementation_weeks: number;
        risk_level: "low" | "medium" | "high";
        confidence_level?: "low" | "medium" | "high" | undefined;
        dependencies?: string[] | undefined;
        strategic_alignment?: "low" | "medium" | "high" | undefined;
        required_capabilities?: string[] | undefined;
    }[];
    evaluation_criteria?: {
        roi_weight?: number | undefined;
        time_to_value_weight?: number | undefined;
        risk_weight?: number | undefined;
        strategic_weight?: number | undefined;
    } | undefined;
    budget_limit_usd?: number | undefined;
    timeline_limit_weeks?: number | undefined;
    risk_tolerance?: "conservative" | "moderate" | "aggressive" | undefined;
}, {
    company_name: string;
    comparison_purpose: string;
    scenarios: {
        name: string;
        description: string;
        complexity: "low" | "medium" | "high";
        investment_usd: number;
        expected_annual_value_usd: number;
        implementation_weeks: number;
        risk_level: "low" | "medium" | "high";
        confidence_level?: "low" | "medium" | "high" | undefined;
        dependencies?: string[] | undefined;
        strategic_alignment?: "low" | "medium" | "high" | undefined;
        required_capabilities?: string[] | undefined;
    }[];
    evaluation_criteria?: {
        roi_weight?: number | undefined;
        time_to_value_weight?: number | undefined;
        risk_weight?: number | undefined;
        strategic_weight?: number | undefined;
    } | undefined;
    budget_limit_usd?: number | undefined;
    timeline_limit_weeks?: number | undefined;
    risk_tolerance?: "conservative" | "moderate" | "aggressive" | undefined;
}>;
export type CompareScenariosInput = z.infer<typeof CompareScenariosInputSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export interface ScoredScenario {
    name: string;
    description: string;
    rank: number;
    scores: {
        roi_score: number;
        time_to_value_score: number;
        risk_score: number;
        strategic_score: number;
        overall_score: number;
    };
    metrics: {
        roi_percent: number;
        payback_months: number;
        net_value_3yr_usd: number;
        risk_adjusted_value_usd: number;
    };
    pros: string[];
    cons: string[];
    fit_assessment: "excellent" | "good" | "acceptable" | "poor";
    meets_constraints: boolean;
}
export interface ScenarioComparison {
    company_name: string;
    comparison_purpose: string;
    scenarios_compared: number;
    scored_scenarios: ScoredScenario[];
    recommendation: {
        recommended_scenario: string;
        rationale: string;
        confidence: "low" | "medium" | "high";
        key_differentiators: string[];
    };
    comparison_matrix: {
        criterion: string;
        weights: number;
        scenario_values: Record<string, number>;
        winner: string;
    }[];
    risk_analysis: {
        scenario: string;
        risk_level: string;
        key_risks: string[];
        mitigation_suggestions: string[];
    }[];
    sensitivity_insights: string[];
    trade_offs: string[];
    decision_factors: string[];
    methodology_note: string;
}
export declare const COMPARE_SCENARIOS_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            company_name: {
                type: string;
            };
            comparison_purpose: {
                type: string;
                description: string;
            };
            scenarios: {
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
                        investment_usd: {
                            type: string;
                        };
                        expected_annual_value_usd: {
                            type: string;
                        };
                        implementation_weeks: {
                            type: string;
                        };
                        risk_level: {
                            type: string;
                            enum: string[];
                        };
                        complexity: {
                            type: string;
                            enum: string[];
                        };
                        strategic_alignment: {
                            type: string;
                            enum: string[];
                        };
                        confidence_level: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                };
            };
            evaluation_criteria: {
                type: string;
            };
            budget_limit_usd: {
                type: string;
            };
            timeline_limit_weeks: {
                type: string;
            };
            risk_tolerance: {
                type: string;
                enum: string[];
            };
        };
        required: string[];
    };
};
export declare function compareScenarios(input: CompareScenariosInput): ScenarioComparison;
export {};
//# sourceMappingURL=compare_scenarios.d.ts.map