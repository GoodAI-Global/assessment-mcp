/**
 * Good AI - Calculate Realized Value Tool
 * Measures and tracks actual value realized from AI implementations
 */
import { z } from "zod";
export declare const CalculateRealizedValueInputSchema: z.ZodObject<{
    project_name: z.ZodString;
    client_name: z.ZodString;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    implementation_info: z.ZodObject<{
        go_live_date: z.ZodString;
        measurement_date: z.ZodString;
        solution_type: z.ZodDefault<z.ZodEnum<["process_automation", "predictive_analytics", "document_processing", "quality_control", "customer_service", "supply_chain", "general_ai"]>>;
        implementation_cost_usd: z.ZodNumber;
        ongoing_monthly_cost_usd: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        implementation_cost_usd: number;
        ongoing_monthly_cost_usd: number;
        go_live_date: string;
        measurement_date: string;
        solution_type: "predictive_analytics" | "process_automation" | "document_processing" | "quality_control" | "customer_service" | "supply_chain" | "general_ai";
    }, {
        implementation_cost_usd: number;
        go_live_date: string;
        measurement_date: string;
        ongoing_monthly_cost_usd?: number | undefined;
        solution_type?: "predictive_analytics" | "process_automation" | "document_processing" | "quality_control" | "customer_service" | "supply_chain" | "general_ai" | undefined;
    }>;
    projected_values: z.ZodObject<{
        projected_annual_savings_usd: z.ZodNumber;
        projected_annual_revenue_increase_usd: z.ZodDefault<z.ZodNumber>;
        projected_roi_percent: z.ZodOptional<z.ZodNumber>;
        projected_payback_months: z.ZodOptional<z.ZodNumber>;
        key_projected_benefits: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        projected_annual_savings_usd: number;
        projected_annual_revenue_increase_usd: number;
        key_projected_benefits: string[];
        projected_roi_percent?: number | undefined;
        projected_payback_months?: number | undefined;
    }, {
        projected_annual_savings_usd: number;
        projected_annual_revenue_increase_usd?: number | undefined;
        projected_roi_percent?: number | undefined;
        projected_payback_months?: number | undefined;
        key_projected_benefits?: string[] | undefined;
    }>;
    actual_values: z.ZodObject<{
        labor_cost_savings_monthly_usd: z.ZodDefault<z.ZodNumber>;
        process_efficiency_savings_monthly_usd: z.ZodDefault<z.ZodNumber>;
        error_reduction_savings_monthly_usd: z.ZodDefault<z.ZodNumber>;
        compliance_savings_monthly_usd: z.ZodDefault<z.ZodNumber>;
        other_cost_savings_monthly_usd: z.ZodDefault<z.ZodNumber>;
        revenue_increase_monthly_usd: z.ZodDefault<z.ZodNumber>;
        customer_retention_value_monthly_usd: z.ZodDefault<z.ZodNumber>;
        new_capability_revenue_monthly_usd: z.ZodDefault<z.ZodNumber>;
        hours_saved_per_week: z.ZodDefault<z.ZodNumber>;
        throughput_increase_percent: z.ZodDefault<z.ZodNumber>;
        cycle_time_reduction_percent: z.ZodDefault<z.ZodNumber>;
        error_rate_reduction_percent: z.ZodDefault<z.ZodNumber>;
        quality_score_improvement: z.ZodDefault<z.ZodNumber>;
        customer_satisfaction_improvement: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        labor_cost_savings_monthly_usd: number;
        process_efficiency_savings_monthly_usd: number;
        error_reduction_savings_monthly_usd: number;
        compliance_savings_monthly_usd: number;
        other_cost_savings_monthly_usd: number;
        revenue_increase_monthly_usd: number;
        customer_retention_value_monthly_usd: number;
        new_capability_revenue_monthly_usd: number;
        hours_saved_per_week: number;
        throughput_increase_percent: number;
        cycle_time_reduction_percent: number;
        error_rate_reduction_percent: number;
        quality_score_improvement: number;
        customer_satisfaction_improvement: number;
    }, {
        labor_cost_savings_monthly_usd?: number | undefined;
        process_efficiency_savings_monthly_usd?: number | undefined;
        error_reduction_savings_monthly_usd?: number | undefined;
        compliance_savings_monthly_usd?: number | undefined;
        other_cost_savings_monthly_usd?: number | undefined;
        revenue_increase_monthly_usd?: number | undefined;
        customer_retention_value_monthly_usd?: number | undefined;
        new_capability_revenue_monthly_usd?: number | undefined;
        hours_saved_per_week?: number | undefined;
        throughput_increase_percent?: number | undefined;
        cycle_time_reduction_percent?: number | undefined;
        error_rate_reduction_percent?: number | undefined;
        quality_score_improvement?: number | undefined;
        customer_satisfaction_improvement?: number | undefined;
    }>;
    intangible_benefits: z.ZodOptional<z.ZodObject<{
        employee_satisfaction_impact: z.ZodOptional<z.ZodEnum<["significant_positive", "positive", "neutral", "negative"]>>;
        strategic_capability_value: z.ZodOptional<z.ZodEnum<["transformational", "high", "moderate", "low"]>>;
        competitive_advantage_impact: z.ZodOptional<z.ZodEnum<["significant", "moderate", "minimal", "none"]>>;
        risk_reduction_value: z.ZodOptional<z.ZodEnum<["high", "moderate", "low", "none"]>>;
        scalability_benefit: z.ZodOptional<z.ZodEnum<["high", "moderate", "low"]>>;
        data_insights_value: z.ZodOptional<z.ZodEnum<["high", "moderate", "low"]>>;
    }, "strip", z.ZodTypeAny, {
        employee_satisfaction_impact?: "neutral" | "positive" | "negative" | "significant_positive" | undefined;
        strategic_capability_value?: "low" | "high" | "moderate" | "transformational" | undefined;
        competitive_advantage_impact?: "none" | "moderate" | "significant" | "minimal" | undefined;
        risk_reduction_value?: "low" | "high" | "none" | "moderate" | undefined;
        scalability_benefit?: "low" | "high" | "moderate" | undefined;
        data_insights_value?: "low" | "high" | "moderate" | undefined;
    }, {
        employee_satisfaction_impact?: "neutral" | "positive" | "negative" | "significant_positive" | undefined;
        strategic_capability_value?: "low" | "high" | "moderate" | "transformational" | undefined;
        competitive_advantage_impact?: "none" | "moderate" | "significant" | "minimal" | undefined;
        risk_reduction_value?: "low" | "high" | "none" | "moderate" | undefined;
        scalability_benefit?: "low" | "high" | "moderate" | undefined;
        data_insights_value?: "low" | "high" | "moderate" | undefined;
    }>>;
    challenges: z.ZodOptional<z.ZodObject<{
        implementation_delays_weeks: z.ZodDefault<z.ZodNumber>;
        scope_changes_count: z.ZodDefault<z.ZodNumber>;
        adoption_challenges: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        unexpected_costs_usd: z.ZodDefault<z.ZodNumber>;
        technical_issues_count: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        implementation_delays_weeks: number;
        scope_changes_count: number;
        adoption_challenges: string[];
        unexpected_costs_usd: number;
        technical_issues_count: number;
    }, {
        implementation_delays_weeks?: number | undefined;
        scope_changes_count?: number | undefined;
        adoption_challenges?: string[] | undefined;
        unexpected_costs_usd?: number | undefined;
        technical_issues_count?: number | undefined;
    }>>;
    future_context: z.ZodOptional<z.ZodObject<{
        planned_expansions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        additional_use_cases_identified: z.ZodDefault<z.ZodNumber>;
        optimization_opportunities: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        planned_expansions: string[];
        additional_use_cases_identified: number;
        optimization_opportunities: string[];
    }, {
        planned_expansions?: string[] | undefined;
        additional_use_cases_identified?: number | undefined;
        optimization_opportunities?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    client_name: string;
    project_name: string;
    implementation_info: {
        implementation_cost_usd: number;
        ongoing_monthly_cost_usd: number;
        go_live_date: string;
        measurement_date: string;
        solution_type: "predictive_analytics" | "process_automation" | "document_processing" | "quality_control" | "customer_service" | "supply_chain" | "general_ai";
    };
    projected_values: {
        projected_annual_savings_usd: number;
        projected_annual_revenue_increase_usd: number;
        key_projected_benefits: string[];
        projected_roi_percent?: number | undefined;
        projected_payback_months?: number | undefined;
    };
    actual_values: {
        labor_cost_savings_monthly_usd: number;
        process_efficiency_savings_monthly_usd: number;
        error_reduction_savings_monthly_usd: number;
        compliance_savings_monthly_usd: number;
        other_cost_savings_monthly_usd: number;
        revenue_increase_monthly_usd: number;
        customer_retention_value_monthly_usd: number;
        new_capability_revenue_monthly_usd: number;
        hours_saved_per_week: number;
        throughput_increase_percent: number;
        cycle_time_reduction_percent: number;
        error_rate_reduction_percent: number;
        quality_score_improvement: number;
        customer_satisfaction_improvement: number;
    };
    intangible_benefits?: {
        employee_satisfaction_impact?: "neutral" | "positive" | "negative" | "significant_positive" | undefined;
        strategic_capability_value?: "low" | "high" | "moderate" | "transformational" | undefined;
        competitive_advantage_impact?: "none" | "moderate" | "significant" | "minimal" | undefined;
        risk_reduction_value?: "low" | "high" | "none" | "moderate" | undefined;
        scalability_benefit?: "low" | "high" | "moderate" | undefined;
        data_insights_value?: "low" | "high" | "moderate" | undefined;
    } | undefined;
    challenges?: {
        implementation_delays_weeks: number;
        scope_changes_count: number;
        adoption_challenges: string[];
        unexpected_costs_usd: number;
        technical_issues_count: number;
    } | undefined;
    future_context?: {
        planned_expansions: string[];
        additional_use_cases_identified: number;
        optimization_opportunities: string[];
    } | undefined;
}, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    client_name: string;
    project_name: string;
    implementation_info: {
        implementation_cost_usd: number;
        go_live_date: string;
        measurement_date: string;
        ongoing_monthly_cost_usd?: number | undefined;
        solution_type?: "predictive_analytics" | "process_automation" | "document_processing" | "quality_control" | "customer_service" | "supply_chain" | "general_ai" | undefined;
    };
    projected_values: {
        projected_annual_savings_usd: number;
        projected_annual_revenue_increase_usd?: number | undefined;
        projected_roi_percent?: number | undefined;
        projected_payback_months?: number | undefined;
        key_projected_benefits?: string[] | undefined;
    };
    actual_values: {
        labor_cost_savings_monthly_usd?: number | undefined;
        process_efficiency_savings_monthly_usd?: number | undefined;
        error_reduction_savings_monthly_usd?: number | undefined;
        compliance_savings_monthly_usd?: number | undefined;
        other_cost_savings_monthly_usd?: number | undefined;
        revenue_increase_monthly_usd?: number | undefined;
        customer_retention_value_monthly_usd?: number | undefined;
        new_capability_revenue_monthly_usd?: number | undefined;
        hours_saved_per_week?: number | undefined;
        throughput_increase_percent?: number | undefined;
        cycle_time_reduction_percent?: number | undefined;
        error_rate_reduction_percent?: number | undefined;
        quality_score_improvement?: number | undefined;
        customer_satisfaction_improvement?: number | undefined;
    };
    intangible_benefits?: {
        employee_satisfaction_impact?: "neutral" | "positive" | "negative" | "significant_positive" | undefined;
        strategic_capability_value?: "low" | "high" | "moderate" | "transformational" | undefined;
        competitive_advantage_impact?: "none" | "moderate" | "significant" | "minimal" | undefined;
        risk_reduction_value?: "low" | "high" | "none" | "moderate" | undefined;
        scalability_benefit?: "low" | "high" | "moderate" | undefined;
        data_insights_value?: "low" | "high" | "moderate" | undefined;
    } | undefined;
    challenges?: {
        implementation_delays_weeks?: number | undefined;
        scope_changes_count?: number | undefined;
        adoption_challenges?: string[] | undefined;
        unexpected_costs_usd?: number | undefined;
        technical_issues_count?: number | undefined;
    } | undefined;
    future_context?: {
        planned_expansions?: string[] | undefined;
        additional_use_cases_identified?: number | undefined;
        optimization_opportunities?: string[] | undefined;
    } | undefined;
}>;
export type CalculateRealizedValueInput = z.infer<typeof CalculateRealizedValueInputSchema>;
export interface RealizedValueCalculation {
    project_name: string;
    client_name: string;
    calculation_date: string;
    measurement_period: {
        go_live_date: string;
        measurement_date: string;
        months_since_go_live: number;
    };
    /** Value summary */
    value_summary: {
        total_realized_value_usd: number;
        annualized_value_usd: number;
        value_vs_projection_percent: number;
        value_realization_status: "exceeding" | "on_track" | "below" | "significantly_below";
        key_value_drivers: string[];
        roi_realized_percent: number;
        payback_achieved: boolean;
        payback_months_actual: number | null;
    };
    /** Detailed value breakdown */
    value_breakdown: {
        cost_savings: {
            total_monthly_usd: number;
            labor_savings_usd: number;
            efficiency_savings_usd: number;
            error_reduction_savings_usd: number;
            compliance_savings_usd: number;
            other_savings_usd: number;
            annualized_total_usd: number;
        };
        revenue_impact: {
            total_monthly_usd: number;
            direct_revenue_increase_usd: number;
            retention_value_usd: number;
            new_capability_revenue_usd: number;
            annualized_total_usd: number;
        };
        productivity_gains: {
            hours_saved_weekly: number;
            hours_saved_annually: number;
            productivity_value_usd: number;
            throughput_improvement_percent: number;
            cycle_time_improvement_percent: number;
        };
        quality_improvements: {
            error_reduction_percent: number;
            quality_score_change: number;
            customer_satisfaction_change: number;
            quality_value_estimate_usd: number;
        };
    };
    /** Comparison to projections */
    projection_comparison: {
        savings_vs_projected: {
            projected_annual_usd: number;
            actual_annualized_usd: number;
            variance_usd: number;
            variance_percent: number;
            status: "ahead" | "on_track" | "behind";
        };
        revenue_vs_projected: {
            projected_annual_usd: number;
            actual_annualized_usd: number;
            variance_usd: number;
            variance_percent: number;
            status: "ahead" | "on_track" | "behind";
        };
        roi_comparison: {
            projected_roi_percent: number | null;
            actual_roi_percent: number;
            roi_variance: number | null;
        };
        benefits_achieved: {
            benefit: string;
            status: "achieved" | "partially_achieved" | "not_achieved" | "exceeded";
            notes: string;
        }[];
    };
    /** Investment analysis */
    investment_analysis: {
        total_investment_usd: number;
        ongoing_costs_to_date_usd: number;
        total_cost_to_date_usd: number;
        total_value_generated_usd: number;
        net_value_usd: number;
        monthly_net_value_usd: number;
        cost_per_value_dollar: number;
        investment_efficiency_rating: "excellent" | "good" | "fair" | "poor";
    };
    /** Intangible value assessment */
    intangible_value: {
        overall_intangible_score: number;
        strategic_value: "high" | "medium" | "low";
        employee_impact: string;
        competitive_positioning: string;
        risk_reduction_assessment: string;
        future_option_value: string;
        estimated_intangible_value_usd: number;
    };
    /** Challenges impact */
    challenges_assessment: {
        total_challenge_impact_usd: number;
        implementation_delay_impact_usd: number;
        scope_change_impact_usd: number;
        unexpected_cost_impact_usd: number;
        net_value_after_challenges_usd: number;
        lessons_learned: string[];
    };
    /** Value trajectory */
    value_trajectory: {
        current_monthly_value_usd: number;
        trend: "increasing" | "stable" | "decreasing";
        projected_12_month_value_usd: number;
        projected_36_month_value_usd: number;
        break_even_date: string | null;
        value_acceleration_opportunities: string[];
    };
    /** Executive metrics */
    executive_metrics: {
        headline_roi: string;
        headline_savings: string;
        headline_efficiency: string;
        one_line_summary: string;
        board_ready_metrics: {
            metric: string;
            value: string;
            context: string;
        }[];
    };
    /** Recommendations */
    recommendations: {
        optimization_recommendations: string[];
        expansion_opportunities: string[];
        risk_mitigations: string[];
        success_celebration_points: string[];
    };
    methodology_note: string;
}
export declare const CALCULATE_REALIZED_VALUE_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            project_name: {
                type: string;
                description: string;
            };
            client_name: {
                type: string;
                description: string;
            };
            industry: {
                type: string;
                enum: string[];
            };
            implementation_info: {
                type: string;
                description: string;
            };
            projected_values: {
                type: string;
                description: string;
            };
            actual_values: {
                type: string;
                description: string;
            };
            intangible_benefits: {
                type: string;
                description: string;
            };
            challenges: {
                type: string;
                description: string;
            };
            future_context: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function calculateRealizedValue(input: CalculateRealizedValueInput): RealizedValueCalculation;
//# sourceMappingURL=calculate_realized_value.d.ts.map