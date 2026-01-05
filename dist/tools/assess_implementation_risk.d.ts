/**
 * Good AI - Assess Implementation Risk Tool
 * Comprehensive risk assessment for AI project implementations
 */
import { z } from "zod";
export declare const AssessImplementationRiskInputSchema: z.ZodObject<{
    project_name: z.ZodString;
    company_name: z.ZodString;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    project_type: z.ZodEnum<["assessment", "pilot", "implementation", "transformation", "managed_service"]>;
    estimated_duration_weeks: z.ZodNumber;
    estimated_budget_usd: z.ZodNumber;
    technical_factors: z.ZodObject<{
        technology_maturity: z.ZodDefault<z.ZodEnum<["proven", "emerging", "experimental"]>>;
        integration_complexity: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
        data_quality_rating: z.ZodDefault<z.ZodNumber>;
        legacy_system_involvement: z.ZodDefault<z.ZodBoolean>;
        custom_development_required: z.ZodDefault<z.ZodBoolean>;
        ai_model_type: z.ZodDefault<z.ZodEnum<["off_the_shelf", "fine_tuned", "custom_trained", "novel_research"]>>;
    }, "strip", z.ZodTypeAny, {
        integration_complexity: "low" | "medium" | "high";
        custom_development_required: boolean;
        technology_maturity: "proven" | "emerging" | "experimental";
        data_quality_rating: number;
        legacy_system_involvement: boolean;
        ai_model_type: "off_the_shelf" | "fine_tuned" | "custom_trained" | "novel_research";
    }, {
        integration_complexity?: "low" | "medium" | "high" | undefined;
        custom_development_required?: boolean | undefined;
        technology_maturity?: "proven" | "emerging" | "experimental" | undefined;
        data_quality_rating?: number | undefined;
        legacy_system_involvement?: boolean | undefined;
        ai_model_type?: "off_the_shelf" | "fine_tuned" | "custom_trained" | "novel_research" | undefined;
    }>;
    organizational_factors: z.ZodObject<{
        executive_sponsorship: z.ZodDefault<z.ZodEnum<["strong", "moderate", "weak", "none"]>>;
        change_readiness: z.ZodDefault<z.ZodEnum<["high", "medium", "low"]>>;
        prior_ai_experience: z.ZodDefault<z.ZodEnum<["extensive", "some", "limited", "none"]>>;
        dedicated_resources: z.ZodDefault<z.ZodBoolean>;
        cross_functional_alignment: z.ZodDefault<z.ZodEnum<["strong", "moderate", "weak"]>>;
    }, "strip", z.ZodTypeAny, {
        executive_sponsorship: "none" | "moderate" | "strong" | "weak";
        change_readiness: "low" | "medium" | "high";
        prior_ai_experience: "some" | "none" | "limited" | "extensive";
        dedicated_resources: boolean;
        cross_functional_alignment: "moderate" | "strong" | "weak";
    }, {
        executive_sponsorship?: "none" | "moderate" | "strong" | "weak" | undefined;
        change_readiness?: "low" | "medium" | "high" | undefined;
        prior_ai_experience?: "some" | "none" | "limited" | "extensive" | undefined;
        dedicated_resources?: boolean | undefined;
        cross_functional_alignment?: "moderate" | "strong" | "weak" | undefined;
    }>;
    external_factors: z.ZodOptional<z.ZodObject<{
        regulatory_requirements: z.ZodDefault<z.ZodEnum<["none", "standard", "strict", "critical"]>>;
        vendor_dependencies: z.ZodDefault<z.ZodNumber>;
        market_pressure: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
        economic_uncertainty: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
    }, "strip", z.ZodTypeAny, {
        regulatory_requirements: "none" | "critical" | "standard" | "strict";
        vendor_dependencies: number;
        market_pressure: "low" | "medium" | "high";
        economic_uncertainty: "low" | "medium" | "high";
    }, {
        regulatory_requirements?: "none" | "critical" | "standard" | "strict" | undefined;
        vendor_dependencies?: number | undefined;
        market_pressure?: "low" | "medium" | "high" | undefined;
        economic_uncertainty?: "low" | "medium" | "high" | undefined;
    }>>;
    team_factors: z.ZodOptional<z.ZodObject<{
        team_experience_level: z.ZodDefault<z.ZodEnum<["expert", "experienced", "mixed", "junior"]>>;
        team_stability: z.ZodDefault<z.ZodEnum<["stable", "moderate_turnover", "high_turnover"]>>;
        skill_gaps_identified: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        remote_team_percentage: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        team_experience_level: "expert" | "experienced" | "mixed" | "junior";
        team_stability: "stable" | "moderate_turnover" | "high_turnover";
        skill_gaps_identified: string[];
        remote_team_percentage: number;
    }, {
        team_experience_level?: "expert" | "experienced" | "mixed" | "junior" | undefined;
        team_stability?: "stable" | "moderate_turnover" | "high_turnover" | undefined;
        skill_gaps_identified?: string[] | undefined;
        remote_team_percentage?: number | undefined;
    }>>;
    known_issues: z.ZodOptional<z.ZodArray<z.ZodObject<{
        issue: z.ZodString;
        severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
        status: z.ZodEnum<["open", "in_progress", "mitigated"]>;
    }, "strip", z.ZodTypeAny, {
        status: "open" | "in_progress" | "mitigated";
        issue: string;
        severity: "low" | "medium" | "high" | "critical";
    }, {
        status: "open" | "in_progress" | "mitigated";
        issue: string;
        severity: "low" | "medium" | "high" | "critical";
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    project_name: string;
    project_type: "pilot" | "assessment" | "implementation" | "transformation" | "managed_service";
    estimated_duration_weeks: number;
    estimated_budget_usd: number;
    technical_factors: {
        integration_complexity: "low" | "medium" | "high";
        custom_development_required: boolean;
        technology_maturity: "proven" | "emerging" | "experimental";
        data_quality_rating: number;
        legacy_system_involvement: boolean;
        ai_model_type: "off_the_shelf" | "fine_tuned" | "custom_trained" | "novel_research";
    };
    organizational_factors: {
        executive_sponsorship: "none" | "moderate" | "strong" | "weak";
        change_readiness: "low" | "medium" | "high";
        prior_ai_experience: "some" | "none" | "limited" | "extensive";
        dedicated_resources: boolean;
        cross_functional_alignment: "moderate" | "strong" | "weak";
    };
    external_factors?: {
        regulatory_requirements: "none" | "critical" | "standard" | "strict";
        vendor_dependencies: number;
        market_pressure: "low" | "medium" | "high";
        economic_uncertainty: "low" | "medium" | "high";
    } | undefined;
    team_factors?: {
        team_experience_level: "expert" | "experienced" | "mixed" | "junior";
        team_stability: "stable" | "moderate_turnover" | "high_turnover";
        skill_gaps_identified: string[];
        remote_team_percentage: number;
    } | undefined;
    known_issues?: {
        status: "open" | "in_progress" | "mitigated";
        issue: string;
        severity: "low" | "medium" | "high" | "critical";
    }[] | undefined;
}, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    project_name: string;
    project_type: "pilot" | "assessment" | "implementation" | "transformation" | "managed_service";
    estimated_duration_weeks: number;
    estimated_budget_usd: number;
    technical_factors: {
        integration_complexity?: "low" | "medium" | "high" | undefined;
        custom_development_required?: boolean | undefined;
        technology_maturity?: "proven" | "emerging" | "experimental" | undefined;
        data_quality_rating?: number | undefined;
        legacy_system_involvement?: boolean | undefined;
        ai_model_type?: "off_the_shelf" | "fine_tuned" | "custom_trained" | "novel_research" | undefined;
    };
    organizational_factors: {
        executive_sponsorship?: "none" | "moderate" | "strong" | "weak" | undefined;
        change_readiness?: "low" | "medium" | "high" | undefined;
        prior_ai_experience?: "some" | "none" | "limited" | "extensive" | undefined;
        dedicated_resources?: boolean | undefined;
        cross_functional_alignment?: "moderate" | "strong" | "weak" | undefined;
    };
    external_factors?: {
        regulatory_requirements?: "none" | "critical" | "standard" | "strict" | undefined;
        vendor_dependencies?: number | undefined;
        market_pressure?: "low" | "medium" | "high" | undefined;
        economic_uncertainty?: "low" | "medium" | "high" | undefined;
    } | undefined;
    team_factors?: {
        team_experience_level?: "expert" | "experienced" | "mixed" | "junior" | undefined;
        team_stability?: "stable" | "moderate_turnover" | "high_turnover" | undefined;
        skill_gaps_identified?: string[] | undefined;
        remote_team_percentage?: number | undefined;
    } | undefined;
    known_issues?: {
        status: "open" | "in_progress" | "mitigated";
        issue: string;
        severity: "low" | "medium" | "high" | "critical";
    }[] | undefined;
}>;
export type AssessImplementationRiskInput = z.infer<typeof AssessImplementationRiskInputSchema>;
export interface ImplementationRiskAssessment {
    project_name: string;
    company_name: string;
    assessment_date: string;
    /** Overall risk summary */
    risk_summary: {
        overall_risk_score: number;
        overall_risk_level: "low" | "medium" | "high" | "critical";
        risk_trend: "improving" | "stable" | "deteriorating";
        confidence_in_success: "high" | "medium" | "low";
        key_risk_drivers: string[];
    };
    /** Risk scores by category */
    risk_categories: {
        technical_risk: {
            score: number;
            level: "low" | "medium" | "high" | "critical";
            factors: {
                factor: string;
                impact: number;
                description: string;
            }[];
        };
        organizational_risk: {
            score: number;
            level: "low" | "medium" | "high" | "critical";
            factors: {
                factor: string;
                impact: number;
                description: string;
            }[];
        };
        external_risk: {
            score: number;
            level: "low" | "medium" | "high" | "critical";
            factors: {
                factor: string;
                impact: number;
                description: string;
            }[];
        };
        execution_risk: {
            score: number;
            level: "low" | "medium" | "high" | "critical";
            factors: {
                factor: string;
                impact: number;
                description: string;
            }[];
        };
    };
    /** Individual risks identified */
    identified_risks: {
        id: string;
        category: "technical" | "organizational" | "external" | "execution";
        title: string;
        description: string;
        probability: "low" | "medium" | "high";
        impact: "low" | "medium" | "high" | "critical";
        risk_score: number;
        mitigation_strategy: string;
        contingency_plan: string;
        owner_recommendation: string;
        early_warning_indicators: string[];
    }[];
    /** Risk heat map data */
    risk_heatmap: {
        high_probability_high_impact: string[];
        high_probability_low_impact: string[];
        low_probability_high_impact: string[];
        low_probability_low_impact: string[];
    };
    /** Mitigation plan */
    mitigation_plan: {
        immediate_actions: {
            action: string;
            priority: "high" | "medium";
            effort: string;
        }[];
        short_term_actions: {
            action: string;
            priority: "high" | "medium" | "low";
            timeline: string;
        }[];
        ongoing_monitoring: {
            item: string;
            frequency: string;
            owner: string;
        }[];
    };
    /** Risk scenarios */
    scenarios: {
        best_case: {
            probability: number;
            description: string;
            conditions: string[];
        };
        expected_case: {
            probability: number;
            description: string;
            conditions: string[];
        };
        worst_case: {
            probability: number;
            description: string;
            conditions: string[];
            recovery_options: string[];
        };
    };
    /** Recommendations */
    recommendations: {
        proceed_recommendation: "proceed" | "proceed_with_caution" | "reassess" | "do_not_proceed";
        rationale: string;
        key_success_factors: string[];
        critical_dependencies: string[];
        risk_acceptance_areas: string[];
    };
    /** Governance */
    governance_recommendations: {
        review_frequency: string;
        escalation_triggers: string[];
        stakeholder_communication: string;
        risk_reporting_cadence: string;
    };
    methodology_note: string;
}
export declare const ASSESS_IMPLEMENTATION_RISK_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            project_name: {
                type: string;
                description: string;
            };
            company_name: {
                type: string;
                description: string;
            };
            industry: {
                type: string;
                enum: string[];
            };
            project_type: {
                type: string;
                enum: string[];
            };
            estimated_duration_weeks: {
                type: string;
            };
            estimated_budget_usd: {
                type: string;
            };
            technical_factors: {
                type: string;
                description: string;
            };
            organizational_factors: {
                type: string;
                description: string;
            };
            external_factors: {
                type: string;
                description: string;
            };
            team_factors: {
                type: string;
                description: string;
            };
            known_issues: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function assessImplementationRisk(input: AssessImplementationRiskInput): ImplementationRiskAssessment;
//# sourceMappingURL=assess_implementation_risk.d.ts.map