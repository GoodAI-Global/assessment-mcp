/**
 * Good AI - Recommend Team Composition Tool
 * Optimal team staffing recommendations for AI consulting engagements
 */
import { z } from "zod";
export declare const RecommendTeamCompositionInputSchema: z.ZodObject<{
    project_name: z.ZodString;
    client_name: z.ZodString;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    engagement_type: z.ZodEnum<["assessment", "pilot", "implementation", "transformation", "managed_service"]>;
    duration_weeks: z.ZodNumber;
    budget_usd: z.ZodOptional<z.ZodNumber>;
    complexity: z.ZodObject<{
        technical_complexity: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
        integration_scope: z.ZodDefault<z.ZodEnum<["single_system", "multiple_systems", "enterprise_wide"]>>;
        ai_components: z.ZodDefault<z.ZodArray<z.ZodEnum<["ml_models", "nlp", "computer_vision", "predictive_analytics", "generative_ai", "robotic_process_automation", "data_engineering", "business_intelligence"]>, "many">>;
        custom_development_required: z.ZodDefault<z.ZodBoolean>;
        data_complexity: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
    }, "strip", z.ZodTypeAny, {
        technical_complexity: "low" | "medium" | "high";
        custom_development_required: boolean;
        integration_scope: "single_system" | "multiple_systems" | "enterprise_wide";
        ai_components: ("ml_models" | "nlp" | "computer_vision" | "predictive_analytics" | "generative_ai" | "robotic_process_automation" | "data_engineering" | "business_intelligence")[];
        data_complexity: "low" | "medium" | "high";
    }, {
        technical_complexity?: "low" | "medium" | "high" | undefined;
        custom_development_required?: boolean | undefined;
        integration_scope?: "single_system" | "multiple_systems" | "enterprise_wide" | undefined;
        ai_components?: ("ml_models" | "nlp" | "computer_vision" | "predictive_analytics" | "generative_ai" | "robotic_process_automation" | "data_engineering" | "business_intelligence")[] | undefined;
        data_complexity?: "low" | "medium" | "high" | undefined;
    }>;
    client_context: z.ZodObject<{
        client_technical_capability: z.ZodDefault<z.ZodEnum<["strong", "moderate", "limited"]>>;
        client_ai_maturity: z.ZodDefault<z.ZodEnum<["advanced", "developing", "nascent"]>>;
        change_management_needs: z.ZodDefault<z.ZodEnum<["minimal", "moderate", "significant"]>>;
        executive_visibility: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
        regulatory_requirements: z.ZodDefault<z.ZodEnum<["none", "standard", "strict"]>>;
    }, "strip", z.ZodTypeAny, {
        regulatory_requirements: "none" | "standard" | "strict";
        client_ai_maturity: "developing" | "advanced" | "nascent";
        client_technical_capability: "moderate" | "limited" | "strong";
        change_management_needs: "moderate" | "significant" | "minimal";
        executive_visibility: "low" | "medium" | "high";
    }, {
        regulatory_requirements?: "none" | "standard" | "strict" | undefined;
        client_ai_maturity?: "developing" | "advanced" | "nascent" | undefined;
        client_technical_capability?: "moderate" | "limited" | "strong" | undefined;
        change_management_needs?: "moderate" | "significant" | "minimal" | undefined;
        executive_visibility?: "low" | "medium" | "high" | undefined;
    }>;
    preferences: z.ZodOptional<z.ZodObject<{
        prefer_onsite: z.ZodDefault<z.ZodBoolean>;
        client_timezone: z.ZodOptional<z.ZodString>;
        language_requirements: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        specific_certifications: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        prefer_senior_heavy: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        prefer_onsite: boolean;
        language_requirements: string[];
        specific_certifications: string[];
        prefer_senior_heavy: boolean;
        client_timezone?: string | undefined;
    }, {
        prefer_onsite?: boolean | undefined;
        client_timezone?: string | undefined;
        language_requirements?: string[] | undefined;
        specific_certifications?: string[] | undefined;
        prefer_senior_heavy?: boolean | undefined;
    }>>;
    constraints: z.ZodOptional<z.ZodObject<{
        max_team_size: z.ZodOptional<z.ZodNumber>;
        must_include_roles: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        exclude_roles: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        blended_rate_target_usd: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        must_include_roles: string[];
        exclude_roles: string[];
        max_team_size?: number | undefined;
        blended_rate_target_usd?: number | undefined;
    }, {
        max_team_size?: number | undefined;
        must_include_roles?: string[] | undefined;
        exclude_roles?: string[] | undefined;
        blended_rate_target_usd?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    complexity: {
        technical_complexity: "low" | "medium" | "high";
        custom_development_required: boolean;
        integration_scope: "single_system" | "multiple_systems" | "enterprise_wide";
        ai_components: ("ml_models" | "nlp" | "computer_vision" | "predictive_analytics" | "generative_ai" | "robotic_process_automation" | "data_engineering" | "business_intelligence")[];
        data_complexity: "low" | "medium" | "high";
    };
    duration_weeks: number;
    engagement_type: "pilot" | "assessment" | "implementation" | "transformation" | "managed_service";
    client_name: string;
    project_name: string;
    client_context: {
        regulatory_requirements: "none" | "standard" | "strict";
        client_ai_maturity: "developing" | "advanced" | "nascent";
        client_technical_capability: "moderate" | "limited" | "strong";
        change_management_needs: "moderate" | "significant" | "minimal";
        executive_visibility: "low" | "medium" | "high";
    };
    constraints?: {
        must_include_roles: string[];
        exclude_roles: string[];
        max_team_size?: number | undefined;
        blended_rate_target_usd?: number | undefined;
    } | undefined;
    budget_usd?: number | undefined;
    preferences?: {
        prefer_onsite: boolean;
        language_requirements: string[];
        specific_certifications: string[];
        prefer_senior_heavy: boolean;
        client_timezone?: string | undefined;
    } | undefined;
}, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    complexity: {
        technical_complexity?: "low" | "medium" | "high" | undefined;
        custom_development_required?: boolean | undefined;
        integration_scope?: "single_system" | "multiple_systems" | "enterprise_wide" | undefined;
        ai_components?: ("ml_models" | "nlp" | "computer_vision" | "predictive_analytics" | "generative_ai" | "robotic_process_automation" | "data_engineering" | "business_intelligence")[] | undefined;
        data_complexity?: "low" | "medium" | "high" | undefined;
    };
    duration_weeks: number;
    engagement_type: "pilot" | "assessment" | "implementation" | "transformation" | "managed_service";
    client_name: string;
    project_name: string;
    client_context: {
        regulatory_requirements?: "none" | "standard" | "strict" | undefined;
        client_ai_maturity?: "developing" | "advanced" | "nascent" | undefined;
        client_technical_capability?: "moderate" | "limited" | "strong" | undefined;
        change_management_needs?: "moderate" | "significant" | "minimal" | undefined;
        executive_visibility?: "low" | "medium" | "high" | undefined;
    };
    constraints?: {
        max_team_size?: number | undefined;
        must_include_roles?: string[] | undefined;
        exclude_roles?: string[] | undefined;
        blended_rate_target_usd?: number | undefined;
    } | undefined;
    budget_usd?: number | undefined;
    preferences?: {
        prefer_onsite?: boolean | undefined;
        client_timezone?: string | undefined;
        language_requirements?: string[] | undefined;
        specific_certifications?: string[] | undefined;
        prefer_senior_heavy?: boolean | undefined;
    } | undefined;
}>;
export type RecommendTeamCompositionInput = z.infer<typeof RecommendTeamCompositionInputSchema>;
export interface TeamCompositionRecommendation {
    project_name: string;
    client_name: string;
    recommendation_date: string;
    /** Executive summary of team recommendation */
    summary: {
        total_team_size: number;
        total_fte: number;
        estimated_monthly_cost_usd: number;
        blended_rate_usd_per_hour: number;
        team_experience_level: "senior_heavy" | "balanced" | "junior_heavy";
        key_staffing_rationale: string;
    };
    /** Recommended team members */
    recommended_team: {
        role: string;
        seniority_level: "principal" | "senior" | "mid" | "junior";
        fte_allocation: number;
        billable_rate_usd_per_hour: number;
        monthly_cost_usd: number;
        responsibilities: string[];
        required_skills: string[];
        optional_skills: string[];
        start_week: number;
        end_week: number;
        critical_role: boolean;
        substitution_options: string[];
    }[];
    /** Team structure by phase */
    phased_staffing: {
        phase_name: string;
        start_week: number;
        end_week: number;
        team_size: number;
        total_fte: number;
        roles: {
            role: string;
            fte: number;
        }[];
        phase_objectives: string[];
    }[];
    /** Skill coverage analysis */
    skill_coverage: {
        required_skills: {
            skill: string;
            covered_by: string[];
            coverage_strength: "strong" | "adequate" | "gap";
        }[];
        skill_gaps: {
            skill: string;
            gap_severity: "critical" | "moderate" | "minor";
            mitigation: string;
        }[];
        skill_overlaps: {
            skill: string;
            covered_by: string[];
            benefit: string;
        }[];
    };
    /** Team dynamics */
    team_dynamics: {
        leadership_structure: string;
        reporting_hierarchy: {
            role: string;
            reports_to: string;
        }[];
        collaboration_model: string;
        communication_cadence: string;
        decision_authority: {
            area: string;
            authority: string;
        }[];
    };
    /** Risk factors */
    staffing_risks: {
        risk: string;
        severity: "low" | "medium" | "high";
        mitigation: string;
    }[];
    /** Alternatives */
    alternative_configurations: {
        name: string;
        description: string;
        trade_offs: string;
        cost_difference_percent: number;
        recommended_when: string;
    }[];
    /** Recommendations */
    recommendations: {
        hiring_recommendations: string[];
        training_recommendations: string[];
        external_resource_recommendations: string[];
        client_resource_recommendations: string[];
    };
    methodology_note: string;
}
export declare const RECOMMEND_TEAM_COMPOSITION_TOOL: {
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
            engagement_type: {
                type: string;
                enum: string[];
            };
            duration_weeks: {
                type: string;
                description: string;
            };
            budget_usd: {
                type: string;
                description: string;
            };
            complexity: {
                type: string;
                description: string;
            };
            client_context: {
                type: string;
                description: string;
            };
            preferences: {
                type: string;
                description: string;
            };
            constraints: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function recommendTeamComposition(input: RecommendTeamCompositionInput): TeamCompositionRecommendation;
//# sourceMappingURL=recommend_team_composition.d.ts.map