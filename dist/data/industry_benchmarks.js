/**
 * Good AI Industry Benchmarks
 * Evidence-based data for enterprise AI assessments
 */
export const INDUSTRY_BENCHMARKS = {
    manufacturing: {
        industry: "manufacturing",
        typical_data_readiness_score: 5.5,
        common_bottlenecks: [
            "Quality inspection delays",
            "Predictive maintenance gaps",
            "Supply chain visibility",
            "Production scheduling inefficiencies",
        ],
        ai_adoption_rate_percent: 28,
        average_time_to_value_weeks: 12,
        typical_first_use_case: "Computer Vision for quality inspection",
    },
    insurance: {
        industry: "insurance",
        typical_data_readiness_score: 6.2,
        common_bottlenecks: [
            "Claims processing delays",
            "Underwriting inefficiencies",
            "Fraud detection gaps",
            "Customer service bottlenecks",
        ],
        ai_adoption_rate_percent: 35,
        average_time_to_value_weeks: 10,
        typical_first_use_case: "Document extraction for claims processing",
    },
    aquaculture: {
        industry: "aquaculture",
        typical_data_readiness_score: 3.8,
        common_bottlenecks: [
            "Manual feeding optimization",
            "Water quality monitoring",
            "Biomass estimation",
            "Disease detection delays",
        ],
        ai_adoption_rate_percent: 12,
        average_time_to_value_weeks: 8,
        typical_first_use_case: "Computer Vision for biomass estimation",
    },
    healthcare: {
        industry: "healthcare",
        typical_data_readiness_score: 5.0,
        common_bottlenecks: [
            "Clinical documentation burden",
            "Scheduling inefficiencies",
            "Diagnostic delays",
            "Administrative overhead",
        ],
        ai_adoption_rate_percent: 22,
        average_time_to_value_weeks: 16,
        typical_first_use_case: "Clinical documentation assistance",
    },
    general: {
        industry: "general",
        typical_data_readiness_score: 5.0,
        common_bottlenecks: [
            "Data silos",
            "Manual processes",
            "Reporting delays",
            "Customer service gaps",
        ],
        ai_adoption_rate_percent: 25,
        average_time_to_value_weeks: 12,
        typical_first_use_case: "Process automation for high-volume tasks",
    },
};
/**
 * Get industry-specific recommendations based on company characteristics
 */
export function getIndustryRecommendation(industry, hasCentralizedData, manualDataEntryPercent) {
    const benchmark = INDUSTRY_BENCHMARKS[industry];
    if (manualDataEntryPercent > 70) {
        return `Deploy non-invasive Computer Vision to digitize manual logs and establish data foundation.`;
    }
    if (!hasCentralizedData) {
        return `Implement lightweight data integration layer before AI deployment. Consider ${benchmark.typical_first_use_case.toLowerCase()} as first use case.`;
    }
    return `${benchmark.typical_first_use_case} - typical first use case for ${industry} with your profile.`;
}
/**
 * Calculate estimated time to value based on company characteristics
 */
export function calculateTimeToValue(industry, hasCentralizedData, legacySystemsCount, manualDataEntryPercent) {
    const benchmark = INDUSTRY_BENCHMARKS[industry];
    let weeks = benchmark.average_time_to_value_weeks;
    // High manual entry means CV opportunity - this bypasses data centralization needs
    // so we don't add time for missing centralized data in this case
    if (manualDataEntryPercent > 70) {
        // CV solutions are fast to deploy and create data foundation
        // No additional time needed even without centralized data
    }
    else if (!hasCentralizedData) {
        weeks += 4; // Additional time for data foundation
    }
    if (legacySystemsCount > 5) {
        weeks += 2; // Integration complexity
    }
    // Ensure reasonable bounds
    return Math.max(4, Math.min(weeks, 24));
}
//# sourceMappingURL=industry_benchmarks.js.map