/**
 * Good AI - Measure Adoption Tool
 * Tracks and measures AI solution adoption rates and user engagement
 */
import { z } from "zod";
export declare const MeasureAdoptionInputSchema: z.ZodObject<{
    project_name: z.ZodString;
    client_name: z.ZodString;
    solution_name: z.ZodString;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    deployment_info: z.ZodObject<{
        go_live_date: z.ZodString;
        total_target_users: z.ZodNumber;
        deployment_type: z.ZodDefault<z.ZodEnum<["pilot", "phased_rollout", "big_bang", "department_specific"]>>;
        current_phase: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        go_live_date: string;
        total_target_users: number;
        deployment_type: "pilot" | "phased_rollout" | "big_bang" | "department_specific";
        current_phase?: string | undefined;
    }, {
        go_live_date: string;
        total_target_users: number;
        deployment_type?: "pilot" | "phased_rollout" | "big_bang" | "department_specific" | undefined;
        current_phase?: string | undefined;
    }>;
    usage_metrics: z.ZodObject<{
        active_users_count: z.ZodNumber;
        daily_sessions_avg: z.ZodNumber;
        weekly_active_users: z.ZodNumber;
        monthly_active_users: z.ZodNumber;
        avg_session_duration_minutes: z.ZodOptional<z.ZodNumber>;
        features_used_count: z.ZodOptional<z.ZodNumber>;
        total_features_available: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        active_users_count: number;
        daily_sessions_avg: number;
        weekly_active_users: number;
        monthly_active_users: number;
        avg_session_duration_minutes?: number | undefined;
        features_used_count?: number | undefined;
        total_features_available?: number | undefined;
    }, {
        active_users_count: number;
        daily_sessions_avg: number;
        weekly_active_users: number;
        monthly_active_users: number;
        avg_session_duration_minutes?: number | undefined;
        features_used_count?: number | undefined;
        total_features_available?: number | undefined;
    }>;
    engagement_indicators: z.ZodOptional<z.ZodObject<{
        user_satisfaction_score: z.ZodOptional<z.ZodNumber>;
        nps_score: z.ZodOptional<z.ZodNumber>;
        support_tickets_per_week: z.ZodOptional<z.ZodNumber>;
        training_completion_percent: z.ZodOptional<z.ZodNumber>;
        voluntary_usage_percent: z.ZodOptional<z.ZodNumber>;
        power_users_count: z.ZodOptional<z.ZodNumber>;
        feedback_submissions: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        user_satisfaction_score?: number | undefined;
        nps_score?: number | undefined;
        support_tickets_per_week?: number | undefined;
        training_completion_percent?: number | undefined;
        voluntary_usage_percent?: number | undefined;
        power_users_count?: number | undefined;
        feedback_submissions?: number | undefined;
    }, {
        user_satisfaction_score?: number | undefined;
        nps_score?: number | undefined;
        support_tickets_per_week?: number | undefined;
        training_completion_percent?: number | undefined;
        voluntary_usage_percent?: number | undefined;
        power_users_count?: number | undefined;
        feedback_submissions?: number | undefined;
    }>>;
    behavioral_metrics: z.ZodOptional<z.ZodObject<{
        tasks_completed_per_user: z.ZodOptional<z.ZodNumber>;
        error_rate_percent: z.ZodOptional<z.ZodNumber>;
        time_to_proficiency_days: z.ZodOptional<z.ZodNumber>;
        process_adherence_percent: z.ZodOptional<z.ZodNumber>;
        workflow_completion_rate: z.ZodOptional<z.ZodNumber>;
        ai_recommendation_acceptance_rate: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        error_rate_percent?: number | undefined;
        tasks_completed_per_user?: number | undefined;
        time_to_proficiency_days?: number | undefined;
        process_adherence_percent?: number | undefined;
        workflow_completion_rate?: number | undefined;
        ai_recommendation_acceptance_rate?: number | undefined;
    }, {
        error_rate_percent?: number | undefined;
        tasks_completed_per_user?: number | undefined;
        time_to_proficiency_days?: number | undefined;
        process_adherence_percent?: number | undefined;
        workflow_completion_rate?: number | undefined;
        ai_recommendation_acceptance_rate?: number | undefined;
    }>>;
    change_context: z.ZodOptional<z.ZodObject<{
        change_champions_count: z.ZodOptional<z.ZodNumber>;
        resistance_incidents: z.ZodOptional<z.ZodNumber>;
        training_sessions_conducted: z.ZodOptional<z.ZodNumber>;
        communication_touchpoints: z.ZodOptional<z.ZodNumber>;
        executive_engagement_level: z.ZodOptional<z.ZodEnum<["high", "medium", "low"]>>;
    }, "strip", z.ZodTypeAny, {
        change_champions_count?: number | undefined;
        resistance_incidents?: number | undefined;
        training_sessions_conducted?: number | undefined;
        communication_touchpoints?: number | undefined;
        executive_engagement_level?: "low" | "medium" | "high" | undefined;
    }, {
        change_champions_count?: number | undefined;
        resistance_incidents?: number | undefined;
        training_sessions_conducted?: number | undefined;
        communication_touchpoints?: number | undefined;
        executive_engagement_level?: "low" | "medium" | "high" | undefined;
    }>>;
    benchmarks: z.ZodOptional<z.ZodObject<{
        industry_avg_adoption_rate: z.ZodOptional<z.ZodNumber>;
        previous_period_active_users: z.ZodOptional<z.ZodNumber>;
        target_adoption_rate: z.ZodOptional<z.ZodNumber>;
        target_satisfaction_score: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        industry_avg_adoption_rate?: number | undefined;
        previous_period_active_users?: number | undefined;
        target_adoption_rate?: number | undefined;
        target_satisfaction_score?: number | undefined;
    }, {
        industry_avg_adoption_rate?: number | undefined;
        previous_period_active_users?: number | undefined;
        target_adoption_rate?: number | undefined;
        target_satisfaction_score?: number | undefined;
    }>>;
    assessment_period: z.ZodObject<{
        start_date: z.ZodString;
        end_date: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        start_date: string;
        end_date: string;
    }, {
        start_date: string;
        end_date: string;
    }>;
}, "strip", z.ZodTypeAny, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    client_name: string;
    project_name: string;
    solution_name: string;
    deployment_info: {
        go_live_date: string;
        total_target_users: number;
        deployment_type: "pilot" | "phased_rollout" | "big_bang" | "department_specific";
        current_phase?: string | undefined;
    };
    usage_metrics: {
        active_users_count: number;
        daily_sessions_avg: number;
        weekly_active_users: number;
        monthly_active_users: number;
        avg_session_duration_minutes?: number | undefined;
        features_used_count?: number | undefined;
        total_features_available?: number | undefined;
    };
    assessment_period: {
        start_date: string;
        end_date: string;
    };
    engagement_indicators?: {
        user_satisfaction_score?: number | undefined;
        nps_score?: number | undefined;
        support_tickets_per_week?: number | undefined;
        training_completion_percent?: number | undefined;
        voluntary_usage_percent?: number | undefined;
        power_users_count?: number | undefined;
        feedback_submissions?: number | undefined;
    } | undefined;
    behavioral_metrics?: {
        error_rate_percent?: number | undefined;
        tasks_completed_per_user?: number | undefined;
        time_to_proficiency_days?: number | undefined;
        process_adherence_percent?: number | undefined;
        workflow_completion_rate?: number | undefined;
        ai_recommendation_acceptance_rate?: number | undefined;
    } | undefined;
    change_context?: {
        change_champions_count?: number | undefined;
        resistance_incidents?: number | undefined;
        training_sessions_conducted?: number | undefined;
        communication_touchpoints?: number | undefined;
        executive_engagement_level?: "low" | "medium" | "high" | undefined;
    } | undefined;
    benchmarks?: {
        industry_avg_adoption_rate?: number | undefined;
        previous_period_active_users?: number | undefined;
        target_adoption_rate?: number | undefined;
        target_satisfaction_score?: number | undefined;
    } | undefined;
}, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    client_name: string;
    project_name: string;
    solution_name: string;
    deployment_info: {
        go_live_date: string;
        total_target_users: number;
        deployment_type?: "pilot" | "phased_rollout" | "big_bang" | "department_specific" | undefined;
        current_phase?: string | undefined;
    };
    usage_metrics: {
        active_users_count: number;
        daily_sessions_avg: number;
        weekly_active_users: number;
        monthly_active_users: number;
        avg_session_duration_minutes?: number | undefined;
        features_used_count?: number | undefined;
        total_features_available?: number | undefined;
    };
    assessment_period: {
        start_date: string;
        end_date: string;
    };
    engagement_indicators?: {
        user_satisfaction_score?: number | undefined;
        nps_score?: number | undefined;
        support_tickets_per_week?: number | undefined;
        training_completion_percent?: number | undefined;
        voluntary_usage_percent?: number | undefined;
        power_users_count?: number | undefined;
        feedback_submissions?: number | undefined;
    } | undefined;
    behavioral_metrics?: {
        error_rate_percent?: number | undefined;
        tasks_completed_per_user?: number | undefined;
        time_to_proficiency_days?: number | undefined;
        process_adherence_percent?: number | undefined;
        workflow_completion_rate?: number | undefined;
        ai_recommendation_acceptance_rate?: number | undefined;
    } | undefined;
    change_context?: {
        change_champions_count?: number | undefined;
        resistance_incidents?: number | undefined;
        training_sessions_conducted?: number | undefined;
        communication_touchpoints?: number | undefined;
        executive_engagement_level?: "low" | "medium" | "high" | undefined;
    } | undefined;
    benchmarks?: {
        industry_avg_adoption_rate?: number | undefined;
        previous_period_active_users?: number | undefined;
        target_adoption_rate?: number | undefined;
        target_satisfaction_score?: number | undefined;
    } | undefined;
}>;
export type MeasureAdoptionInput = z.infer<typeof MeasureAdoptionInputSchema>;
export interface AdoptionMeasurement {
    project_name: string;
    client_name: string;
    solution_name: string;
    assessment_date: string;
    assessment_period: {
        start_date: string;
        end_date: string;
        days_since_go_live: number;
    };
    /** Overall adoption summary */
    adoption_summary: {
        overall_adoption_score: number;
        adoption_stage: "initial" | "growing" | "mainstream" | "mature" | "declining";
        adoption_velocity: "accelerating" | "steady" | "slowing" | "stalled";
        adoption_health: "healthy" | "at_risk" | "critical";
        key_metrics_snapshot: {
            adoption_rate_percent: number;
            active_user_rate_percent: number;
            engagement_score: number;
            satisfaction_indicator: "positive" | "neutral" | "negative" | "unknown";
        };
    };
    /** Detailed adoption metrics */
    adoption_metrics: {
        user_adoption: {
            adoption_rate_percent: number;
            weekly_active_rate_percent: number;
            monthly_active_rate_percent: number;
            user_growth_trend: "growing" | "stable" | "declining";
            new_users_this_period: number;
            churned_users_estimate: number;
        };
        feature_adoption: {
            feature_utilization_percent: number;
            core_features_adoption: "high" | "medium" | "low";
            advanced_features_adoption: "high" | "medium" | "low";
            underutilized_features: string[];
        };
        depth_of_use: {
            avg_session_duration_minutes: number;
            sessions_per_user_per_week: number;
            tasks_per_session: number;
            depth_score: number;
        };
    };
    /** Engagement analysis */
    engagement_analysis: {
        engagement_score: number;
        engagement_level: "highly_engaged" | "engaged" | "passive" | "disengaged";
        user_segments: {
            power_users_percent: number;
            regular_users_percent: number;
            occasional_users_percent: number;
            inactive_users_percent: number;
        };
        engagement_drivers: string[];
        engagement_barriers: string[];
    };
    /** Satisfaction metrics */
    satisfaction_metrics: {
        satisfaction_score: number | null;
        nps_score: number | null;
        nps_category: "promoter" | "passive" | "detractor" | "unknown";
        support_burden: "low" | "moderate" | "high";
        sentiment_trend: "improving" | "stable" | "declining" | "unknown";
        top_satisfaction_drivers: string[];
        top_dissatisfaction_drivers: string[];
    };
    /** Behavioral insights */
    behavioral_insights: {
        proficiency_level: "expert" | "proficient" | "learning" | "novice";
        workflow_efficiency: "optimized" | "adequate" | "needs_improvement";
        ai_trust_indicator: "high" | "medium" | "low" | "unknown";
        usage_patterns: {
            peak_usage_times: string[];
            common_workflows: string[];
            abandonment_points: string[];
        };
    };
    /** Benchmark comparison */
    benchmark_comparison: {
        vs_target: {
            adoption_rate_vs_target: number;
            satisfaction_vs_target: number | null;
            on_track: boolean;
        };
        vs_industry: {
            adoption_vs_industry_avg: "above" | "at" | "below" | "unknown";
            percentile_estimate: number | null;
        };
        vs_previous_period: {
            adoption_change_percent: number | null;
            engagement_change: "improved" | "stable" | "declined" | "unknown";
        };
    };
    /** Risk indicators */
    adoption_risks: {
        risk_level: "low" | "medium" | "high" | "critical";
        risk_factors: {
            factor: string;
            severity: "low" | "medium" | "high";
            trend: "improving" | "stable" | "worsening";
            mitigation: string;
        }[];
        churn_risk_indicator: "low" | "moderate" | "elevated" | "high";
        intervention_urgency: "none" | "monitor" | "action_needed" | "urgent";
    };
    /** Recommendations */
    recommendations: {
        immediate_actions: {
            action: string;
            priority: "high" | "medium";
            expected_impact: string;
            owner_suggestion: string;
        }[];
        engagement_strategies: {
            strategy: string;
            target_segment: string;
            expected_outcome: string;
        }[];
        training_recommendations: string[];
        communication_recommendations: string[];
    };
    /** Success indicators */
    success_indicators: {
        adoption_milestones_achieved: string[];
        upcoming_milestones: {
            milestone: string;
            target_date: string;
            likelihood: "on_track" | "at_risk" | "unlikely";
        }[];
        value_realization_indicators: string[];
    };
    /** Trend analysis */
    trend_analysis: {
        adoption_trajectory: "positive" | "neutral" | "negative";
        forecast_30_day: {
            projected_adoption_rate: number;
            confidence: "high" | "medium" | "low";
        };
        inflection_points: string[];
        seasonality_notes: string;
    };
    methodology_note: string;
}
export declare const MEASURE_ADOPTION_TOOL: {
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
            solution_name: {
                type: string;
                description: string;
            };
            industry: {
                type: string;
                enum: string[];
            };
            deployment_info: {
                type: string;
                description: string;
            };
            usage_metrics: {
                type: string;
                description: string;
            };
            engagement_indicators: {
                type: string;
                description: string;
            };
            behavioral_metrics: {
                type: string;
                description: string;
            };
            change_context: {
                type: string;
                description: string;
            };
            benchmarks: {
                type: string;
                description: string;
            };
            assessment_period: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function measureAdoption(input: MeasureAdoptionInput): AdoptionMeasurement;
//# sourceMappingURL=measure_adoption.d.ts.map