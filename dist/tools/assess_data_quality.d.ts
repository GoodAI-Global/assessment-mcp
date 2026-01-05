/**
 * Good AI - Assess Data Quality Tool
 * "Evidence over opinions" — Deep analysis of data assets for AI readiness
 */
import { z } from "zod";
export declare const AssessDataQualityInputSchema: z.ZodObject<{
    company_name: z.ZodString;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    data_sources: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["database", "spreadsheet", "api", "files", "sensors", "manual_entry", "third_party"]>;
        volume_records: z.ZodOptional<z.ZodNumber>;
        update_frequency: z.ZodOptional<z.ZodEnum<["real_time", "hourly", "daily", "weekly", "monthly", "ad_hoc"]>>;
        estimated_completeness_percent: z.ZodOptional<z.ZodNumber>;
        has_documentation: z.ZodOptional<z.ZodBoolean>;
        owner_identified: z.ZodOptional<z.ZodBoolean>;
        historical_depth_months: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "database" | "spreadsheet" | "api" | "files" | "sensors" | "manual_entry" | "third_party";
        name: string;
        volume_records?: number | undefined;
        update_frequency?: "real_time" | "hourly" | "daily" | "weekly" | "monthly" | "ad_hoc" | undefined;
        estimated_completeness_percent?: number | undefined;
        has_documentation?: boolean | undefined;
        owner_identified?: boolean | undefined;
        historical_depth_months?: number | undefined;
    }, {
        type: "database" | "spreadsheet" | "api" | "files" | "sensors" | "manual_entry" | "third_party";
        name: string;
        volume_records?: number | undefined;
        update_frequency?: "real_time" | "hourly" | "daily" | "weekly" | "monthly" | "ad_hoc" | undefined;
        estimated_completeness_percent?: number | undefined;
        has_documentation?: boolean | undefined;
        owner_identified?: boolean | undefined;
        historical_depth_months?: number | undefined;
    }>, "many">;
    target_use_case: z.ZodOptional<z.ZodString>;
    data_governance_exists: z.ZodOptional<z.ZodBoolean>;
    data_catalog_exists: z.ZodOptional<z.ZodBoolean>;
    data_quality_monitoring: z.ZodOptional<z.ZodBoolean>;
    integration_complexity: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
}, "strip", z.ZodTypeAny, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    data_sources: {
        type: "database" | "spreadsheet" | "api" | "files" | "sensors" | "manual_entry" | "third_party";
        name: string;
        volume_records?: number | undefined;
        update_frequency?: "real_time" | "hourly" | "daily" | "weekly" | "monthly" | "ad_hoc" | undefined;
        estimated_completeness_percent?: number | undefined;
        has_documentation?: boolean | undefined;
        owner_identified?: boolean | undefined;
        historical_depth_months?: number | undefined;
    }[];
    target_use_case?: string | undefined;
    data_governance_exists?: boolean | undefined;
    data_catalog_exists?: boolean | undefined;
    data_quality_monitoring?: boolean | undefined;
    integration_complexity?: "low" | "medium" | "high" | undefined;
}, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    data_sources: {
        type: "database" | "spreadsheet" | "api" | "files" | "sensors" | "manual_entry" | "third_party";
        name: string;
        volume_records?: number | undefined;
        update_frequency?: "real_time" | "hourly" | "daily" | "weekly" | "monthly" | "ad_hoc" | undefined;
        estimated_completeness_percent?: number | undefined;
        has_documentation?: boolean | undefined;
        owner_identified?: boolean | undefined;
        historical_depth_months?: number | undefined;
    }[];
    target_use_case?: string | undefined;
    data_governance_exists?: boolean | undefined;
    data_catalog_exists?: boolean | undefined;
    data_quality_monitoring?: boolean | undefined;
    integration_complexity?: "low" | "medium" | "high" | undefined;
}>;
export type AssessDataQualityInput = z.infer<typeof AssessDataQualityInputSchema>;
export interface DataSourceAssessment {
    name: string;
    type: string;
    ai_readiness_score: number;
    quality_dimensions: {
        completeness: {
            score: number;
            finding: string;
        };
        freshness: {
            score: number;
            finding: string;
        };
        accessibility: {
            score: number;
            finding: string;
        };
        consistency: {
            score: number;
            finding: string;
        };
    };
    risks: string[];
    recommendations: string[];
}
export interface DataQualityAssessment {
    overall_data_quality_score: number;
    ai_readiness_rating: "not_ready" | "needs_work" | "ready" | "excellent";
    data_sources_assessed: DataSourceAssessment[];
    aggregate_metrics: {
        total_sources: number;
        sources_ai_ready: number;
        sources_needs_work: number;
        sources_not_ready: number;
        average_completeness: number;
        has_real_time_data: boolean;
        has_historical_depth: boolean;
    };
    data_gaps: {
        gap: string;
        impact: "low" | "medium" | "high";
        remediation: string;
        effort_weeks: number;
    }[];
    governance_assessment: {
        score: number;
        findings: string[];
        recommendations: string[];
    };
    integration_assessment: {
        complexity: "low" | "medium" | "high";
        estimated_effort_weeks: number;
        key_challenges: string[];
    };
    quick_wins: string[];
    critical_actions: string[];
    estimated_data_prep_weeks: number;
}
export declare const ASSESS_DATA_QUALITY_TOOL: {
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
            data_sources: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        type: {
                            type: string;
                            enum: string[];
                        };
                        volume_records: {
                            type: string;
                        };
                        update_frequency: {
                            type: string;
                            enum: string[];
                        };
                        estimated_completeness_percent: {
                            type: string;
                        };
                        has_documentation: {
                            type: string;
                        };
                        owner_identified: {
                            type: string;
                        };
                        historical_depth_months: {
                            type: string;
                        };
                    };
                    required: string[];
                };
            };
            target_use_case: {
                type: string;
                description: string;
            };
            data_governance_exists: {
                type: string;
            };
            data_catalog_exists: {
                type: string;
            };
            data_quality_monitoring: {
                type: string;
            };
            integration_complexity: {
                type: string;
                enum: string[];
            };
        };
        required: string[];
    };
};
export declare function assessDataQuality(input: AssessDataQualityInput): DataQualityAssessment;
//# sourceMappingURL=assess_data_quality.d.ts.map