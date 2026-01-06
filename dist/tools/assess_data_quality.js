/**
 * Good AI - Assess Data Quality Tool
 * "Evidence over opinions" — Deep analysis of data assets for AI readiness
 */
import { z } from "zod";
// ============================================
// Input Schema
// ============================================
const DataSourceSchema = z.object({
    name: z.string().min(1).max(200),
    type: z.enum([
        "database",
        "spreadsheet",
        "api",
        "files",
        "sensors",
        "manual_entry",
        "third_party",
    ]),
    volume_records: z.number().min(0).optional(),
    update_frequency: z
        .enum(["real_time", "hourly", "daily", "weekly", "monthly", "ad_hoc"])
        .optional(),
    estimated_completeness_percent: z.number().min(0).max(100).optional(),
    has_documentation: z.boolean().optional(),
    owner_identified: z.boolean().optional(),
    historical_depth_months: z.number().min(0).max(600).optional(),
});
export const AssessDataQualityInputSchema = z.object({
    company_name: z.string().min(1).max(200),
    industry: z.enum(["manufacturing", "insurance", "aquaculture", "healthcare", "general"]),
    data_sources: z.array(DataSourceSchema).min(1).max(50),
    target_use_case: z.string().min(10).max(1000).optional(),
    data_governance_exists: z.boolean().optional(),
    data_catalog_exists: z.boolean().optional(),
    data_quality_monitoring: z.boolean().optional(),
    integration_complexity: z.enum(["low", "medium", "high"]).optional(),
});
// ============================================
// Tool Definition
// ============================================
export const ASSESS_DATA_QUALITY_TOOL = {
    name: "assess_data_quality",
    description: "Deep analysis of data assets for AI readiness. Evaluates data sources across completeness, freshness, accessibility, and consistency dimensions. Identifies gaps and provides remediation recommendations.",
    inputSchema: {
        type: "object",
        properties: {
            company_name: { type: "string", description: "Company name" },
            industry: {
                type: "string",
                enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
            },
            data_sources: {
                type: "array",
                description: "List of data sources to assess",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        type: {
                            type: "string",
                            enum: [
                                "database",
                                "spreadsheet",
                                "api",
                                "files",
                                "sensors",
                                "manual_entry",
                                "third_party",
                            ],
                        },
                        volume_records: { type: "number" },
                        update_frequency: {
                            type: "string",
                            enum: ["real_time", "hourly", "daily", "weekly", "monthly", "ad_hoc"],
                        },
                        estimated_completeness_percent: { type: "number" },
                        has_documentation: { type: "boolean" },
                        owner_identified: { type: "boolean" },
                        historical_depth_months: { type: "number" },
                    },
                    required: ["name", "type"],
                },
            },
            target_use_case: { type: "string", description: "Target AI use case" },
            data_governance_exists: { type: "boolean" },
            data_catalog_exists: { type: "boolean" },
            data_quality_monitoring: { type: "boolean" },
            integration_complexity: {
                type: "string",
                enum: ["low", "medium", "high"],
            },
        },
        required: ["company_name", "industry", "data_sources"],
    },
};
// ============================================
// Implementation
// ============================================
function assessCompleteness(source) {
    const completeness = source.estimated_completeness_percent;
    if (completeness === undefined) {
        return {
            score: 5,
            finding: "Completeness unknown - assessment recommended",
        };
    }
    if (completeness >= 95) {
        return { score: 10, finding: "Excellent data completeness" };
    }
    if (completeness >= 85) {
        return { score: 8, finding: "Good completeness with minor gaps" };
    }
    if (completeness >= 70) {
        return { score: 6, finding: "Moderate completeness - data enrichment needed" };
    }
    if (completeness >= 50) {
        return { score: 4, finding: "Significant data gaps present" };
    }
    return { score: 2, finding: "Critical completeness issues - major data collection needed" };
}
function assessFreshness(source) {
    const frequency = source.update_frequency;
    if (!frequency) {
        return { score: 5, finding: "Update frequency unknown" };
    }
    const scores = {
        real_time: { score: 10, finding: "Real-time data available" },
        hourly: { score: 9, finding: "Near real-time updates" },
        daily: { score: 7, finding: "Daily updates - suitable for most AI use cases" },
        weekly: { score: 5, finding: "Weekly updates - may limit real-time applications" },
        monthly: { score: 3, finding: "Monthly updates - limits time-sensitive AI" },
        ad_hoc: { score: 2, finding: "Irregular updates - freshness risk" },
    };
    return scores[frequency] || { score: 5, finding: "Unknown update frequency" };
}
function assessAccessibility(source) {
    let score = 5;
    const findings = [];
    // Type-based accessibility
    const typeScores = {
        api: 3,
        database: 2,
        sensors: 2,
        third_party: 1,
        files: 0,
        spreadsheet: -1,
        manual_entry: -2,
    };
    score += typeScores[source.type] || 0;
    // Documentation bonus
    if (source.has_documentation) {
        score += 1;
        findings.push("Documentation available");
    }
    else {
        findings.push("No documentation");
    }
    // Owner identified bonus
    if (source.owner_identified) {
        score += 1;
        findings.push("Data owner identified");
    }
    else {
        findings.push("No clear data owner");
    }
    score = Math.max(1, Math.min(10, score));
    return {
        score,
        finding: findings.join("; ") || `${source.type} data source`,
    };
}
function assessConsistency(source) {
    let score = 6;
    const findings = [];
    // Type-based consistency assumptions
    if (source.type === "database" || source.type === "api") {
        score += 2;
        findings.push("Structured data source");
    }
    else if (source.type === "spreadsheet" || source.type === "files") {
        score -= 1;
        findings.push("Semi-structured - consistency review needed");
    }
    else if (source.type === "manual_entry") {
        score -= 2;
        findings.push("Manual entry prone to inconsistencies");
    }
    // Historical depth suggests established data practices
    if (source.historical_depth_months && source.historical_depth_months > 24) {
        score += 1;
        findings.push("Long data history suggests established practices");
    }
    score = Math.max(1, Math.min(10, score));
    return {
        score,
        finding: findings.join("; ") || "Consistency assessment needed",
    };
}
function generateSourceRisks(source, assessment) {
    const risks = [];
    if (assessment.completeness.score < 5) {
        risks.push("Data gaps may lead to biased AI models");
    }
    if (assessment.freshness.score < 5) {
        risks.push("Stale data may not reflect current patterns");
    }
    if (assessment.accessibility.score < 5) {
        risks.push("Access challenges may delay implementation");
    }
    if (assessment.consistency.score < 5) {
        risks.push("Inconsistent data requires significant cleaning");
    }
    if (source.type === "manual_entry") {
        risks.push("Manual entry introduces human error risk");
    }
    if (!source.owner_identified) {
        risks.push("No data owner may slow governance decisions");
    }
    return risks.slice(0, 3);
}
function generateSourceRecommendations(source, assessment) {
    const recommendations = [];
    if (assessment.completeness.score < 7) {
        recommendations.push("Implement data completeness monitoring and alerting");
    }
    if (assessment.freshness.score < 6) {
        recommendations.push("Increase update frequency or implement change data capture");
    }
    if (!source.has_documentation) {
        recommendations.push("Create data dictionary and lineage documentation");
    }
    if (!source.owner_identified) {
        recommendations.push("Assign data steward with clear ownership");
    }
    if (source.type === "spreadsheet") {
        recommendations.push("Migrate to database for better scalability and consistency");
    }
    if (source.type === "manual_entry") {
        recommendations.push("Automate data capture to reduce errors");
    }
    return recommendations.slice(0, 3);
}
function assessDataSource(source) {
    const completeness = assessCompleteness(source);
    const freshness = assessFreshness(source);
    const accessibility = assessAccessibility(source);
    const consistency = assessConsistency(source);
    const quality_dimensions = {
        completeness,
        freshness,
        accessibility,
        consistency,
    };
    const avgScore = (completeness.score + freshness.score + accessibility.score + consistency.score) / 4;
    return {
        name: source.name,
        type: source.type,
        ai_readiness_score: Math.round(avgScore * 10) / 10,
        quality_dimensions,
        risks: generateSourceRisks(source, quality_dimensions),
        recommendations: generateSourceRecommendations(source, quality_dimensions),
    };
}
function identifyDataGaps(sources, input) {
    const gaps = [];
    // Check for completeness gaps
    const lowCompleteness = sources.filter((s) => s.quality_dimensions.completeness.score < 6);
    if (lowCompleteness.length > 0) {
        gaps.push({
            gap: `${lowCompleteness.length} data source(s) have significant completeness issues`,
            impact: lowCompleteness.length > 2 ? "high" : "medium",
            remediation: "Implement data collection processes and validation rules",
            effort_weeks: lowCompleteness.length * 2,
        });
    }
    // Check for freshness gaps
    const staleSources = sources.filter((s) => s.quality_dimensions.freshness.score < 5);
    if (staleSources.length > 0) {
        gaps.push({
            gap: "Data freshness insufficient for real-time AI applications",
            impact: "medium",
            remediation: "Implement automated data pipelines with higher frequency",
            effort_weeks: staleSources.length * 1.5,
        });
    }
    // Check for documentation gaps
    const undocumented = input.data_sources.filter((s) => !s.has_documentation);
    if (undocumented.length > sources.length / 2) {
        gaps.push({
            gap: "Majority of data sources lack documentation",
            impact: "medium",
            remediation: "Create data catalog with schemas, definitions, and lineage",
            effort_weeks: Math.ceil(undocumented.length * 0.5),
        });
    }
    // Check for governance gaps
    if (!input.data_governance_exists) {
        gaps.push({
            gap: "No formal data governance framework",
            impact: "high",
            remediation: "Establish data governance policies, roles, and processes",
            effort_weeks: 4,
        });
    }
    // Check for historical data
    const hasHistory = input.data_sources.some((s) => s.historical_depth_months && s.historical_depth_months >= 12);
    if (!hasHistory) {
        gaps.push({
            gap: "Insufficient historical data for model training",
            impact: "high",
            remediation: "Begin historical data collection; consider synthetic data augmentation",
            effort_weeks: 8,
        });
    }
    return gaps.slice(0, 5);
}
function assessGovernance(input) {
    let score = 3;
    const findings = [];
    const recommendations = [];
    if (input.data_governance_exists) {
        score += 3;
        findings.push("Data governance framework exists");
    }
    else {
        findings.push("No formal data governance");
        recommendations.push("Establish data governance council and policies");
    }
    if (input.data_catalog_exists) {
        score += 2;
        findings.push("Data catalog available");
    }
    else {
        findings.push("No centralized data catalog");
        recommendations.push("Implement data catalog for discoverability");
    }
    if (input.data_quality_monitoring) {
        score += 2;
        findings.push("Data quality monitoring in place");
    }
    else {
        findings.push("No automated quality monitoring");
        recommendations.push("Implement automated data quality checks and alerts");
    }
    const ownedSources = input.data_sources.filter((s) => s.owner_identified);
    if (ownedSources.length === input.data_sources.length) {
        score += 1;
        findings.push("All data sources have identified owners");
    }
    else {
        findings.push(`${input.data_sources.length - ownedSources.length} sources without clear ownership`);
        recommendations.push("Assign data stewards to all critical sources");
    }
    return {
        score: Math.min(10, score),
        findings,
        recommendations: recommendations.slice(0, 3),
    };
}
function assessIntegration(input, sources) {
    const complexity = input.integration_complexity || "medium";
    const challenges = [];
    // Identify integration challenges
    const manualSources = input.data_sources.filter((s) => s.type === "manual_entry" || s.type === "spreadsheet");
    if (manualSources.length > 0) {
        challenges.push(`${manualSources.length} manual/spreadsheet sources need automation`);
    }
    const thirdPartySources = input.data_sources.filter((s) => s.type === "third_party");
    if (thirdPartySources.length > 0) {
        challenges.push("Third-party data requires API integration and SLA management");
    }
    if (sources.length > 5) {
        challenges.push("Multiple data sources increase integration complexity");
    }
    const lowAccessibility = sources.filter((s) => s.quality_dimensions.accessibility.score < 5);
    if (lowAccessibility.length > 0) {
        challenges.push("Some sources have accessibility challenges");
    }
    // Estimate effort
    let effortWeeks = sources.length * 0.5;
    if (complexity === "high") {
        effortWeeks *= 2;
    }
    else if (complexity === "low") {
        effortWeeks *= 0.6;
    }
    effortWeeks += manualSources.length * 1.5;
    effortWeeks += thirdPartySources.length * 2;
    return {
        complexity,
        estimated_effort_weeks: Math.ceil(effortWeeks),
        key_challenges: challenges.slice(0, 4),
    };
}
function identifyQuickWins(sources, input) {
    const quickWins = [];
    // High readiness sources
    const readySources = sources.filter((s) => s.ai_readiness_score >= 7);
    if (readySources.length > 0) {
        quickWins.push(`Start with ${readySources[0].name} - already AI-ready (score: ${readySources[0].ai_readiness_score})`);
    }
    // API sources
    const apiSources = input.data_sources.filter((s) => s.type === "api");
    if (apiSources.length > 0) {
        quickWins.push("Leverage existing API integrations for faster data access");
    }
    // Real-time sources
    const realTimeSources = input.data_sources.filter((s) => s.update_frequency === "real_time");
    if (realTimeSources.length > 0) {
        quickWins.push("Real-time data available - enables responsive AI applications");
    }
    // Documentation exists
    const documented = input.data_sources.filter((s) => s.has_documentation);
    if (documented.length > 0) {
        quickWins.push(`${documented.length} documented source(s) can accelerate development`);
    }
    if (!input.data_catalog_exists && !input.data_governance_exists) {
        quickWins.push("Start with lightweight data catalog before full governance");
    }
    return quickWins.slice(0, 4);
}
function identifyCriticalActions(sources, gaps) {
    const actions = [];
    // Critical data quality issues
    const notReady = sources.filter((s) => s.ai_readiness_score < 4);
    if (notReady.length > 0) {
        actions.push(`Address critical quality issues in ${notReady.map((s) => s.name).join(", ")}`);
    }
    // High impact gaps
    const highImpactGaps = gaps.filter((g) => g.impact === "high");
    highImpactGaps.forEach((g) => {
        actions.push(g.remediation);
    });
    // General critical actions
    if (sources.every((s) => s.quality_dimensions.completeness.score < 6)) {
        actions.push("Prioritize data completeness improvement across all sources");
    }
    return [...new Set(actions)].slice(0, 4);
}
export function assessDataQuality(input) {
    // Assess each data source
    const assessedSources = input.data_sources.map(assessDataSource);
    // Calculate aggregate metrics
    const avgScore = assessedSources.reduce((sum, s) => sum + s.ai_readiness_score, 0) / assessedSources.length;
    const avgCompleteness = assessedSources.reduce((sum, s) => sum + s.quality_dimensions.completeness.score, 0) /
        assessedSources.length;
    const sourcesReady = assessedSources.filter((s) => s.ai_readiness_score >= 7).length;
    const sourcesNeedsWork = assessedSources.filter((s) => s.ai_readiness_score >= 4 && s.ai_readiness_score < 7).length;
    const sourcesNotReady = assessedSources.filter((s) => s.ai_readiness_score < 4).length;
    const hasRealTime = input.data_sources.some((s) => s.update_frequency === "real_time" || s.update_frequency === "hourly");
    const hasHistory = input.data_sources.some((s) => s.historical_depth_months && s.historical_depth_months >= 12);
    // Identify gaps and assessments
    const dataGaps = identifyDataGaps(assessedSources, input);
    const governanceAssessment = assessGovernance(input);
    const integrationAssessment = assessIntegration(input, assessedSources);
    const quickWins = identifyQuickWins(assessedSources, input);
    const criticalActions = identifyCriticalActions(assessedSources, dataGaps);
    // Calculate data prep estimate
    const dataPrepWeeks = Math.ceil(dataGaps.reduce((sum, g) => sum + g.effort_weeks, 0) * 0.6 +
        integrationAssessment.estimated_effort_weeks * 0.4);
    // Determine overall rating
    let rating;
    if (avgScore >= 8) {
        rating = "excellent";
    }
    else if (avgScore >= 6) {
        rating = "ready";
    }
    else if (avgScore >= 4) {
        rating = "needs_work";
    }
    else {
        rating = "not_ready";
    }
    return {
        overall_data_quality_score: Math.round(avgScore * 10) / 10,
        ai_readiness_rating: rating,
        data_sources_assessed: assessedSources,
        aggregate_metrics: {
            total_sources: assessedSources.length,
            sources_ai_ready: sourcesReady,
            sources_needs_work: sourcesNeedsWork,
            sources_not_ready: sourcesNotReady,
            average_completeness: Math.round(avgCompleteness * 10),
            has_real_time_data: hasRealTime,
            has_historical_depth: hasHistory,
        },
        data_gaps: dataGaps,
        governance_assessment: governanceAssessment,
        integration_assessment: integrationAssessment,
        quick_wins: quickWins,
        critical_actions: criticalActions,
        estimated_data_prep_weeks: Math.max(2, dataPrepWeeks),
    };
}
//# sourceMappingURL=assess_data_quality.js.map