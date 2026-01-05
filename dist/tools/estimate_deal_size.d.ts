/**
 * Good AI - Estimate Deal Size Tool
 * Data-driven deal sizing for AI consulting engagements
 */
import { z } from "zod";
export declare const EstimateDealSizeInputSchema: z.ZodObject<{
    company_name: z.ZodString;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    employee_count: z.ZodNumber;
    annual_revenue_usd: z.ZodOptional<z.ZodNumber>;
    engagement_type: z.ZodEnum<["assessment", "pilot", "implementation", "transformation", "managed_service"]>;
    scope_dimensions: z.ZodObject<{
        departments_involved: z.ZodDefault<z.ZodNumber>;
        locations_count: z.ZodDefault<z.ZodNumber>;
        integrations_required: z.ZodDefault<z.ZodNumber>;
        data_sources_count: z.ZodDefault<z.ZodNumber>;
        user_count: z.ZodDefault<z.ZodNumber>;
        custom_development_required: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        departments_involved: number;
        locations_count: number;
        integrations_required: number;
        data_sources_count: number;
        user_count: number;
        custom_development_required: boolean;
    }, {
        departments_involved?: number | undefined;
        locations_count?: number | undefined;
        integrations_required?: number | undefined;
        data_sources_count?: number | undefined;
        user_count?: number | undefined;
        custom_development_required?: boolean | undefined;
    }>;
    complexity_factors: z.ZodOptional<z.ZodObject<{
        regulatory_requirements: z.ZodDefault<z.ZodEnum<["none", "standard", "strict", "critical"]>>;
        legacy_system_integration: z.ZodDefault<z.ZodBoolean>;
        multi_language_support: z.ZodDefault<z.ZodBoolean>;
        real_time_requirements: z.ZodDefault<z.ZodBoolean>;
        high_availability_sla: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        regulatory_requirements: "none" | "critical" | "standard" | "strict";
        legacy_system_integration: boolean;
        multi_language_support: boolean;
        real_time_requirements: boolean;
        high_availability_sla: boolean;
    }, {
        regulatory_requirements?: "none" | "critical" | "standard" | "strict" | undefined;
        legacy_system_integration?: boolean | undefined;
        multi_language_support?: boolean | undefined;
        real_time_requirements?: boolean | undefined;
        high_availability_sla?: boolean | undefined;
    }>>;
    timeline_preference: z.ZodDefault<z.ZodEnum<["accelerated", "standard", "extended"]>>;
    client_ai_maturity: z.ZodDefault<z.ZodEnum<["none", "experimenting", "scaling", "mature"]>>;
    existing_relationship: z.ZodDefault<z.ZodBoolean>;
    competitive_situation: z.ZodDefault<z.ZodEnum<["sole_source", "preferred", "competitive", "highly_competitive"]>>;
}, "strip", z.ZodTypeAny, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    employee_count: number;
    competitive_situation: "sole_source" | "preferred" | "competitive" | "highly_competitive";
    engagement_type: "pilot" | "assessment" | "implementation" | "transformation" | "managed_service";
    scope_dimensions: {
        departments_involved: number;
        locations_count: number;
        integrations_required: number;
        data_sources_count: number;
        user_count: number;
        custom_development_required: boolean;
    };
    timeline_preference: "standard" | "accelerated" | "extended";
    client_ai_maturity: "none" | "experimenting" | "scaling" | "mature";
    existing_relationship: boolean;
    annual_revenue_usd?: number | undefined;
    complexity_factors?: {
        regulatory_requirements: "none" | "critical" | "standard" | "strict";
        legacy_system_integration: boolean;
        multi_language_support: boolean;
        real_time_requirements: boolean;
        high_availability_sla: boolean;
    } | undefined;
}, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    employee_count: number;
    engagement_type: "pilot" | "assessment" | "implementation" | "transformation" | "managed_service";
    scope_dimensions: {
        departments_involved?: number | undefined;
        locations_count?: number | undefined;
        integrations_required?: number | undefined;
        data_sources_count?: number | undefined;
        user_count?: number | undefined;
        custom_development_required?: boolean | undefined;
    };
    annual_revenue_usd?: number | undefined;
    competitive_situation?: "sole_source" | "preferred" | "competitive" | "highly_competitive" | undefined;
    complexity_factors?: {
        regulatory_requirements?: "none" | "critical" | "standard" | "strict" | undefined;
        legacy_system_integration?: boolean | undefined;
        multi_language_support?: boolean | undefined;
        real_time_requirements?: boolean | undefined;
        high_availability_sla?: boolean | undefined;
    } | undefined;
    timeline_preference?: "standard" | "accelerated" | "extended" | undefined;
    client_ai_maturity?: "none" | "experimenting" | "scaling" | "mature" | undefined;
    existing_relationship?: boolean | undefined;
}>;
export type EstimateDealSizeInput = z.infer<typeof EstimateDealSizeInputSchema>;
export interface DealSizeEstimate {
    company_name: string;
    industry: string;
    engagement_type: string;
    /** Primary deal size estimate */
    estimate: {
        base_value_usd: number;
        complexity_adjustment_usd: number;
        scope_adjustment_usd: number;
        timeline_adjustment_usd: number;
        total_estimated_value_usd: number;
        value_range: {
            low_usd: number;
            mid_usd: number;
            high_usd: number;
        };
        confidence: "low" | "medium" | "high";
    };
    /** Deal structure breakdown */
    deal_structure: {
        services_breakdown: {
            category: string;
            percentage: number;
            estimated_value_usd: number;
        }[];
        recommended_phases: {
            phase: string;
            duration_weeks: number;
            value_usd: number;
            deliverables: string[];
        }[];
        payment_structure: string;
    };
    /** Pricing factors analysis */
    pricing_factors: {
        factor: string;
        impact: "increases" | "decreases" | "neutral";
        adjustment_percent: number;
        rationale: string;
    }[];
    /** Margin analysis */
    margin_analysis: {
        estimated_cost_usd: number;
        estimated_margin_percent: number;
        margin_risk: "low" | "medium" | "high";
        margin_improvement_opportunities: string[];
    };
    /** Competitive positioning */
    competitive_positioning: {
        market_rate_range_usd: {
            low: number;
            mid: number;
            high: number;
        };
        recommended_position: "value" | "market" | "premium";
        positioning_rationale: string;
        differentiation_points: string[];
    };
    /** Upsell opportunities */
    expansion_potential: {
        year_1_expansion_usd: number;
        year_2_expansion_usd: number;
        year_3_expansion_usd: number;
        total_account_potential_usd: number;
        expansion_opportunities: string[];
    };
    /** Risk factors affecting deal size */
    deal_risks: {
        risk: string;
        impact_on_value: "high" | "medium" | "low";
        mitigation: string;
    }[];
    /** Negotiation guidance */
    negotiation_guidance: {
        walk_away_threshold_usd: number;
        target_value_usd: number;
        anchor_value_usd: number;
        key_value_levers: string[];
        common_objections: {
            objection: string;
            response: string;
        }[];
    };
    /** Recommendations */
    recommendations: string[];
    methodology_note: string;
}
export declare const ESTIMATE_DEAL_SIZE_TOOL: {
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
            employee_count: {
                type: string;
                description: string;
            };
            annual_revenue_usd: {
                type: string;
                description: string;
            };
            engagement_type: {
                type: string;
                enum: string[];
                description: string;
            };
            scope_dimensions: {
                type: string;
                description: string;
            };
            complexity_factors: {
                type: string;
                description: string;
            };
            timeline_preference: {
                type: string;
                enum: string[];
            };
            client_ai_maturity: {
                type: string;
                enum: string[];
            };
            existing_relationship: {
                type: string;
            };
            competitive_situation: {
                type: string;
                enum: string[];
            };
        };
        required: string[];
    };
};
export declare function estimateDealSize(input: EstimateDealSizeInput): DealSizeEstimate;
//# sourceMappingURL=estimate_deal_size.d.ts.map