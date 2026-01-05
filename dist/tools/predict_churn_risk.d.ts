/**
 * Good AI - Predict Churn Risk Tool
 * Predicts client churn risk based on engagement, satisfaction, and value metrics
 */
import { z } from "zod";
export declare const PredictChurnRiskInputSchema: z.ZodObject<{
    client_name: z.ZodString;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    account_info: z.ZodObject<{
        contract_start_date: z.ZodString;
        contract_end_date: z.ZodString;
        contract_value_annual_usd: z.ZodNumber;
        account_tier: z.ZodDefault<z.ZodEnum<["enterprise", "strategic", "growth", "standard"]>>;
        number_of_solutions: z.ZodDefault<z.ZodNumber>;
        active_users: z.ZodDefault<z.ZodNumber>;
        licensed_users: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        contract_start_date: string;
        contract_end_date: string;
        contract_value_annual_usd: number;
        account_tier: "enterprise" | "strategic" | "standard" | "growth";
        number_of_solutions: number;
        active_users: number;
        licensed_users: number;
    }, {
        contract_start_date: string;
        contract_end_date: string;
        contract_value_annual_usd: number;
        account_tier?: "enterprise" | "strategic" | "standard" | "growth" | undefined;
        number_of_solutions?: number | undefined;
        active_users?: number | undefined;
        licensed_users?: number | undefined;
    }>;
    engagement_metrics: z.ZodObject<{
        monthly_active_user_percent: z.ZodOptional<z.ZodNumber>;
        login_frequency_trend: z.ZodOptional<z.ZodEnum<["increasing", "stable", "decreasing", "significantly_decreasing"]>>;
        feature_utilization_percent: z.ZodOptional<z.ZodNumber>;
        support_ticket_volume: z.ZodOptional<z.ZodEnum<["low", "moderate", "high", "very_high"]>>;
        support_sentiment: z.ZodOptional<z.ZodEnum<["positive", "neutral", "negative", "very_negative"]>>;
        last_engagement_days_ago: z.ZodOptional<z.ZodNumber>;
        executive_engagement: z.ZodOptional<z.ZodEnum<["regular", "occasional", "rare", "none"]>>;
    }, "strip", z.ZodTypeAny, {
        monthly_active_user_percent?: number | undefined;
        login_frequency_trend?: "stable" | "increasing" | "decreasing" | "significantly_decreasing" | undefined;
        feature_utilization_percent?: number | undefined;
        support_ticket_volume?: "low" | "high" | "moderate" | "very_high" | undefined;
        support_sentiment?: "neutral" | "positive" | "negative" | "very_negative" | undefined;
        last_engagement_days_ago?: number | undefined;
        executive_engagement?: "none" | "regular" | "occasional" | "rare" | undefined;
    }, {
        monthly_active_user_percent?: number | undefined;
        login_frequency_trend?: "stable" | "increasing" | "decreasing" | "significantly_decreasing" | undefined;
        feature_utilization_percent?: number | undefined;
        support_ticket_volume?: "low" | "high" | "moderate" | "very_high" | undefined;
        support_sentiment?: "neutral" | "positive" | "negative" | "very_negative" | undefined;
        last_engagement_days_ago?: number | undefined;
        executive_engagement?: "none" | "regular" | "occasional" | "rare" | undefined;
    }>;
    satisfaction_indicators: z.ZodObject<{
        nps_score: z.ZodOptional<z.ZodNumber>;
        csat_score: z.ZodOptional<z.ZodNumber>;
        recent_survey_response: z.ZodOptional<z.ZodEnum<["very_satisfied", "satisfied", "neutral", "dissatisfied", "very_dissatisfied"]>>;
        complaint_count_last_90_days: z.ZodOptional<z.ZodNumber>;
        escalation_count_last_90_days: z.ZodOptional<z.ZodNumber>;
        reference_willingness: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        nps_score?: number | undefined;
        csat_score?: number | undefined;
        recent_survey_response?: "neutral" | "very_satisfied" | "satisfied" | "dissatisfied" | "very_dissatisfied" | undefined;
        complaint_count_last_90_days?: number | undefined;
        escalation_count_last_90_days?: number | undefined;
        reference_willingness?: boolean | undefined;
    }, {
        nps_score?: number | undefined;
        csat_score?: number | undefined;
        recent_survey_response?: "neutral" | "very_satisfied" | "satisfied" | "dissatisfied" | "very_dissatisfied" | undefined;
        complaint_count_last_90_days?: number | undefined;
        escalation_count_last_90_days?: number | undefined;
        reference_willingness?: boolean | undefined;
    }>;
    value_metrics: z.ZodObject<{
        roi_achieved_percent: z.ZodOptional<z.ZodNumber>;
        value_vs_expectation: z.ZodOptional<z.ZodEnum<["exceeding", "meeting", "below", "significantly_below"]>>;
        business_case_status: z.ZodOptional<z.ZodEnum<["validated", "tracking", "at_risk", "failed"]>>;
        expansion_discussions: z.ZodOptional<z.ZodBoolean>;
        budget_changes: z.ZodOptional<z.ZodEnum<["increased", "stable", "reduced", "significantly_reduced"]>>;
    }, "strip", z.ZodTypeAny, {
        roi_achieved_percent?: number | undefined;
        value_vs_expectation?: "below" | "exceeding" | "significantly_below" | "meeting" | undefined;
        business_case_status?: "failed" | "at_risk" | "validated" | "tracking" | undefined;
        expansion_discussions?: boolean | undefined;
        budget_changes?: "stable" | "increased" | "reduced" | "significantly_reduced" | undefined;
    }, {
        roi_achieved_percent?: number | undefined;
        value_vs_expectation?: "below" | "exceeding" | "significantly_below" | "meeting" | undefined;
        business_case_status?: "failed" | "at_risk" | "validated" | "tracking" | undefined;
        expansion_discussions?: boolean | undefined;
        budget_changes?: "stable" | "increased" | "reduced" | "significantly_reduced" | undefined;
    }>;
    relationship_health: z.ZodObject<{
        executive_sponsor_status: z.ZodOptional<z.ZodEnum<["engaged", "passive", "disengaged", "departed"]>>;
        champion_count: z.ZodOptional<z.ZodNumber>;
        key_contact_changes: z.ZodOptional<z.ZodNumber>;
        competitor_mentions: z.ZodOptional<z.ZodNumber>;
        renewal_discussions_started: z.ZodOptional<z.ZodBoolean>;
        payment_issues: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        executive_sponsor_status?: "engaged" | "passive" | "disengaged" | "departed" | undefined;
        champion_count?: number | undefined;
        key_contact_changes?: number | undefined;
        competitor_mentions?: number | undefined;
        renewal_discussions_started?: boolean | undefined;
        payment_issues?: boolean | undefined;
    }, {
        executive_sponsor_status?: "engaged" | "passive" | "disengaged" | "departed" | undefined;
        champion_count?: number | undefined;
        key_contact_changes?: number | undefined;
        competitor_mentions?: number | undefined;
        renewal_discussions_started?: boolean | undefined;
        payment_issues?: boolean | undefined;
    }>;
    recent_events: z.ZodOptional<z.ZodObject<{
        major_incidents: z.ZodDefault<z.ZodNumber>;
        service_disruptions: z.ZodDefault<z.ZodNumber>;
        missed_slas: z.ZodDefault<z.ZodNumber>;
        successful_projects: z.ZodDefault<z.ZodNumber>;
        expansion_wins: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        major_incidents: number;
        service_disruptions: number;
        missed_slas: number;
        successful_projects: number;
        expansion_wins: number;
    }, {
        major_incidents?: number | undefined;
        service_disruptions?: number | undefined;
        missed_slas?: number | undefined;
        successful_projects?: number | undefined;
        expansion_wins?: number | undefined;
    }>>;
    external_factors: z.ZodOptional<z.ZodObject<{
        client_financial_health: z.ZodOptional<z.ZodEnum<["strong", "stable", "challenged", "distressed"]>>;
        industry_disruption: z.ZodOptional<z.ZodBoolean>;
        leadership_changes: z.ZodOptional<z.ZodBoolean>;
        m_and_a_activity: z.ZodOptional<z.ZodBoolean>;
        strategic_shift: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        client_financial_health?: "strong" | "stable" | "challenged" | "distressed" | undefined;
        industry_disruption?: boolean | undefined;
        leadership_changes?: boolean | undefined;
        m_and_a_activity?: boolean | undefined;
        strategic_shift?: boolean | undefined;
    }, {
        client_financial_health?: "strong" | "stable" | "challenged" | "distressed" | undefined;
        industry_disruption?: boolean | undefined;
        leadership_changes?: boolean | undefined;
        m_and_a_activity?: boolean | undefined;
        strategic_shift?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    client_name: string;
    account_info: {
        contract_start_date: string;
        contract_end_date: string;
        contract_value_annual_usd: number;
        account_tier: "enterprise" | "strategic" | "standard" | "growth";
        number_of_solutions: number;
        active_users: number;
        licensed_users: number;
    };
    engagement_metrics: {
        monthly_active_user_percent?: number | undefined;
        login_frequency_trend?: "stable" | "increasing" | "decreasing" | "significantly_decreasing" | undefined;
        feature_utilization_percent?: number | undefined;
        support_ticket_volume?: "low" | "high" | "moderate" | "very_high" | undefined;
        support_sentiment?: "neutral" | "positive" | "negative" | "very_negative" | undefined;
        last_engagement_days_ago?: number | undefined;
        executive_engagement?: "none" | "regular" | "occasional" | "rare" | undefined;
    };
    satisfaction_indicators: {
        nps_score?: number | undefined;
        csat_score?: number | undefined;
        recent_survey_response?: "neutral" | "very_satisfied" | "satisfied" | "dissatisfied" | "very_dissatisfied" | undefined;
        complaint_count_last_90_days?: number | undefined;
        escalation_count_last_90_days?: number | undefined;
        reference_willingness?: boolean | undefined;
    };
    value_metrics: {
        roi_achieved_percent?: number | undefined;
        value_vs_expectation?: "below" | "exceeding" | "significantly_below" | "meeting" | undefined;
        business_case_status?: "failed" | "at_risk" | "validated" | "tracking" | undefined;
        expansion_discussions?: boolean | undefined;
        budget_changes?: "stable" | "increased" | "reduced" | "significantly_reduced" | undefined;
    };
    relationship_health: {
        executive_sponsor_status?: "engaged" | "passive" | "disengaged" | "departed" | undefined;
        champion_count?: number | undefined;
        key_contact_changes?: number | undefined;
        competitor_mentions?: number | undefined;
        renewal_discussions_started?: boolean | undefined;
        payment_issues?: boolean | undefined;
    };
    external_factors?: {
        client_financial_health?: "strong" | "stable" | "challenged" | "distressed" | undefined;
        industry_disruption?: boolean | undefined;
        leadership_changes?: boolean | undefined;
        m_and_a_activity?: boolean | undefined;
        strategic_shift?: boolean | undefined;
    } | undefined;
    recent_events?: {
        major_incidents: number;
        service_disruptions: number;
        missed_slas: number;
        successful_projects: number;
        expansion_wins: number;
    } | undefined;
}, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    client_name: string;
    account_info: {
        contract_start_date: string;
        contract_end_date: string;
        contract_value_annual_usd: number;
        account_tier?: "enterprise" | "strategic" | "standard" | "growth" | undefined;
        number_of_solutions?: number | undefined;
        active_users?: number | undefined;
        licensed_users?: number | undefined;
    };
    engagement_metrics: {
        monthly_active_user_percent?: number | undefined;
        login_frequency_trend?: "stable" | "increasing" | "decreasing" | "significantly_decreasing" | undefined;
        feature_utilization_percent?: number | undefined;
        support_ticket_volume?: "low" | "high" | "moderate" | "very_high" | undefined;
        support_sentiment?: "neutral" | "positive" | "negative" | "very_negative" | undefined;
        last_engagement_days_ago?: number | undefined;
        executive_engagement?: "none" | "regular" | "occasional" | "rare" | undefined;
    };
    satisfaction_indicators: {
        nps_score?: number | undefined;
        csat_score?: number | undefined;
        recent_survey_response?: "neutral" | "very_satisfied" | "satisfied" | "dissatisfied" | "very_dissatisfied" | undefined;
        complaint_count_last_90_days?: number | undefined;
        escalation_count_last_90_days?: number | undefined;
        reference_willingness?: boolean | undefined;
    };
    value_metrics: {
        roi_achieved_percent?: number | undefined;
        value_vs_expectation?: "below" | "exceeding" | "significantly_below" | "meeting" | undefined;
        business_case_status?: "failed" | "at_risk" | "validated" | "tracking" | undefined;
        expansion_discussions?: boolean | undefined;
        budget_changes?: "stable" | "increased" | "reduced" | "significantly_reduced" | undefined;
    };
    relationship_health: {
        executive_sponsor_status?: "engaged" | "passive" | "disengaged" | "departed" | undefined;
        champion_count?: number | undefined;
        key_contact_changes?: number | undefined;
        competitor_mentions?: number | undefined;
        renewal_discussions_started?: boolean | undefined;
        payment_issues?: boolean | undefined;
    };
    external_factors?: {
        client_financial_health?: "strong" | "stable" | "challenged" | "distressed" | undefined;
        industry_disruption?: boolean | undefined;
        leadership_changes?: boolean | undefined;
        m_and_a_activity?: boolean | undefined;
        strategic_shift?: boolean | undefined;
    } | undefined;
    recent_events?: {
        major_incidents?: number | undefined;
        service_disruptions?: number | undefined;
        missed_slas?: number | undefined;
        successful_projects?: number | undefined;
        expansion_wins?: number | undefined;
    } | undefined;
}>;
export type PredictChurnRiskInput = z.infer<typeof PredictChurnRiskInputSchema>;
export interface ChurnRiskPrediction {
    client_name: string;
    prediction_date: string;
    /** Risk summary */
    risk_summary: {
        churn_risk_score: number;
        risk_level: "low" | "moderate" | "elevated" | "high" | "critical";
        risk_trend: "improving" | "stable" | "deteriorating";
        confidence: "high" | "medium" | "low";
        days_until_contract_end: number;
        renewal_probability_percent: number;
        at_risk_revenue_usd: number;
        urgency: "immediate" | "this_quarter" | "this_half" | "monitor";
    };
    /** Risk factor analysis */
    risk_factors: {
        category: string;
        factor: string;
        impact_score: number;
        trend: "improving" | "stable" | "worsening";
        evidence: string;
    }[];
    /** Category scores */
    category_scores: {
        engagement_score: number;
        satisfaction_score: number;
        value_realization_score: number;
        relationship_score: number;
        overall_health_score: number;
    };
    /** Warning signals */
    warning_signals: {
        signal: string;
        severity: "critical" | "warning" | "caution";
        detected_date: string;
        recommended_response: string;
    }[];
    /** Churn indicators */
    churn_indicators: {
        leading_indicators: string[];
        lagging_indicators: string[];
        predictive_patterns: string[];
    };
    /** Risk scenarios */
    scenarios: {
        most_likely: {
            outcome: "renew" | "reduce" | "churn";
            probability_percent: number;
            description: string;
        };
        best_case: {
            outcome: "expand" | "renew";
            probability_percent: number;
            conditions: string[];
        };
        worst_case: {
            outcome: "churn" | "reduce";
            probability_percent: number;
            triggers: string[];
        };
    };
    /** Retention strategy */
    retention_strategy: {
        priority_actions: {
            action: string;
            owner: string;
            timeline: string;
            expected_impact: string;
        }[];
        relationship_actions: string[];
        value_demonstration_actions: string[];
        executive_engagement_actions: string[];
        save_plays: string[];
    };
    /** Account health timeline */
    health_timeline: {
        current_status: string;
        next_30_days: string;
        next_90_days: string;
        renewal_readiness: "ready" | "needs_work" | "at_risk" | "critical";
    };
    /** Competitive threat assessment */
    competitive_assessment: {
        threat_level: "low" | "moderate" | "high";
        likely_competitors: string[];
        vulnerability_areas: string[];
        differentiation_opportunities: string[];
    };
    /** Revenue impact analysis */
    revenue_impact: {
        current_arr_usd: number;
        at_risk_arr_usd: number;
        expansion_potential_usd: number;
        expected_outcome_arr_usd: number;
        revenue_confidence: "high" | "medium" | "low";
    };
    /** Success indicators */
    success_indicators: {
        positive_signals: string[];
        momentum_builders: string[];
        quick_wins_available: string[];
    };
    methodology_note: string;
}
export declare const PREDICT_CHURN_RISK_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            client_name: {
                type: string;
                description: string;
            };
            industry: {
                type: string;
                enum: string[];
            };
            account_info: {
                type: string;
                description: string;
            };
            engagement_metrics: {
                type: string;
                description: string;
            };
            satisfaction_indicators: {
                type: string;
                description: string;
            };
            value_metrics: {
                type: string;
                description: string;
            };
            relationship_health: {
                type: string;
                description: string;
            };
            recent_events: {
                type: string;
                description: string;
            };
            external_factors: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function predictChurnRisk(input: PredictChurnRiskInput): ChurnRiskPrediction;
//# sourceMappingURL=predict_churn_risk.d.ts.map