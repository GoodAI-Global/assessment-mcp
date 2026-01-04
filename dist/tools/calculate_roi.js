/**
 * Good AI - Calculate ROI Tool
 * "Evidence over opinions" — Assessments based on measurable criteria
 */
import { z } from "zod";
// ============================================
// Input Schema (Zod validation)
// ============================================
export const CalculateROIInputSchema = z.object({
    current_metrics: z.object({
        process_cost_per_month_usd: z.number().positive("Process cost must be positive").max(1_000_000_000, "Cost unrealistic"),
        error_rate_percent: z.number().min(0).max(100).optional(),
        cycle_time_hours: z.number().positive().max(100_000, "Cycle time unrealistic").optional(),
        manual_fte_count: z.number().min(0).max(100_000, "FTE count unrealistic").optional(),
    }),
    target_improvement_percent: z.number().min(1).max(100, "Improvement must be 1-100%"),
    implementation_cost_usd: z.number().positive("Implementation cost must be positive").max(10_000_000_000, "Cost unrealistic"),
    ongoing_monthly_cost_usd: z.number().min(0).max(1_000_000_000, "Cost unrealistic").optional(),
    time_horizon_months: z.number().int().min(6).max(120, "Horizon must be 6-120 months").optional(),
});
// ============================================
// ROI Calculation Functions
// ============================================
const DISCOUNT_RATE = 0.10; // 10% annual discount rate for NPV
function calculateMonthlySavings(currentMonthlyCost, improvementPercent) {
    return currentMonthlyCost * (improvementPercent / 100);
}
function calculatePaybackPeriod(implementationCost, monthlySavings, ongoingMonthlyCost) {
    const netMonthlySavings = monthlySavings - ongoingMonthlyCost;
    if (netMonthlySavings <= 0) {
        return Infinity; // Never pays back
    }
    const paybackMonths = implementationCost / netMonthlySavings;
    return Math.round(paybackMonths * 10) / 10; // Round to 1 decimal
}
function calculateNPV(implementationCost, monthlySavings, ongoingMonthlyCost, horizonMonths) {
    const monthlyDiscountRate = DISCOUNT_RATE / 12;
    let npv = -implementationCost;
    for (let month = 1; month <= horizonMonths; month++) {
        const netCashFlow = monthlySavings - ongoingMonthlyCost;
        const discountFactor = Math.pow(1 + monthlyDiscountRate, month);
        npv += netCashFlow / discountFactor;
    }
    return Math.round(npv);
}
function calculateROIPercent(implementationCost, totalSavings, totalOngoingCosts) {
    const netBenefit = totalSavings - totalOngoingCosts - implementationCost;
    const roiPercent = (netBenefit / implementationCost) * 100;
    return Math.round(roiPercent * 10) / 10;
}
function generateSensitivityAnalysis(input, expectedMonthlySavings, horizonMonths) {
    const ongoingCost = input.ongoing_monthly_cost_usd ?? 0;
    // Conservative: 60% of expected improvement
    const conservativeImprovement = input.target_improvement_percent * 0.6;
    const conservativeMonthlySavings = calculateMonthlySavings(input.current_metrics.process_cost_per_month_usd, conservativeImprovement);
    const conservativeROI = calculateROIPercent(input.implementation_cost_usd, conservativeMonthlySavings * horizonMonths, ongoingCost * horizonMonths);
    const conservativePayback = calculatePaybackPeriod(input.implementation_cost_usd, conservativeMonthlySavings, ongoingCost);
    // Expected: 100% of target improvement
    const expectedROI = calculateROIPercent(input.implementation_cost_usd, expectedMonthlySavings * horizonMonths, ongoingCost * horizonMonths);
    const expectedPayback = calculatePaybackPeriod(input.implementation_cost_usd, expectedMonthlySavings, ongoingCost);
    // Optimistic: 130% of expected improvement
    const optimisticImprovement = Math.min(input.target_improvement_percent * 1.3, 95);
    const optimisticMonthlySavings = calculateMonthlySavings(input.current_metrics.process_cost_per_month_usd, optimisticImprovement);
    const optimisticROI = calculateROIPercent(input.implementation_cost_usd, optimisticMonthlySavings * horizonMonths, ongoingCost * horizonMonths);
    const optimisticPayback = calculatePaybackPeriod(input.implementation_cost_usd, optimisticMonthlySavings, ongoingCost);
    return [
        {
            scenario: "conservative",
            improvement_percent: Math.round(conservativeImprovement * 10) / 10,
            roi_percent: conservativeROI,
            payback_months: conservativePayback,
        },
        {
            scenario: "expected",
            improvement_percent: input.target_improvement_percent,
            roi_percent: expectedROI,
            payback_months: expectedPayback,
        },
        {
            scenario: "optimistic",
            improvement_percent: Math.round(optimisticImprovement * 10) / 10,
            roi_percent: optimisticROI,
            payback_months: optimisticPayback,
        },
    ];
}
function generateAssumptions(input) {
    const assumptions = [];
    assumptions.push(`Current monthly process cost: $${input.current_metrics.process_cost_per_month_usd.toLocaleString()}`);
    assumptions.push(`Target improvement: ${input.target_improvement_percent}%`);
    assumptions.push(`Implementation cost: $${input.implementation_cost_usd.toLocaleString()}`);
    if (input.ongoing_monthly_cost_usd) {
        assumptions.push(`Ongoing monthly cost: $${input.ongoing_monthly_cost_usd.toLocaleString()}`);
    }
    assumptions.push(`Annual discount rate: ${DISCOUNT_RATE * 100}%`);
    assumptions.push("Savings assumed to begin immediately after implementation");
    assumptions.push("No significant process changes during analysis period");
    if (input.current_metrics.manual_fte_count) {
        assumptions.push(`Current manual FTE count: ${input.current_metrics.manual_fte_count}`);
    }
    return assumptions;
}
function determineConfidence(paybackMonths, roiPercent, hasMetrics) {
    // If payback is very long or ROI is negative, low confidence
    if (paybackMonths > 36 || roiPercent < 0) {
        return "low";
    }
    // High confidence if short payback, good ROI, and detailed metrics
    if (paybackMonths < 12 && roiPercent > 100 && hasMetrics) {
        return "high";
    }
    // Medium confidence for everything else
    return "medium";
}
// ============================================
// Main Function
// ============================================
export function calculateROI(input) {
    const horizonMonths = input.time_horizon_months ?? 24;
    const ongoingMonthlyCost = input.ongoing_monthly_cost_usd ?? 0;
    const monthlySavings = calculateMonthlySavings(input.current_metrics.process_cost_per_month_usd, input.target_improvement_percent);
    const annualSavings = monthlySavings * 12;
    const totalSavings = monthlySavings * horizonMonths;
    const totalOngoingCosts = ongoingMonthlyCost * horizonMonths;
    const paybackPeriod = calculatePaybackPeriod(input.implementation_cost_usd, monthlySavings, ongoingMonthlyCost);
    const roiPercent = calculateROIPercent(input.implementation_cost_usd, totalSavings, totalOngoingCosts);
    const npv = calculateNPV(input.implementation_cost_usd, monthlySavings, ongoingMonthlyCost, horizonMonths);
    const sensitivityAnalysis = generateSensitivityAnalysis(input, monthlySavings, horizonMonths);
    const assumptions = generateAssumptions(input);
    const hasDetailedMetrics = !!(input.current_metrics.error_rate_percent ||
        input.current_metrics.cycle_time_hours ||
        input.current_metrics.manual_fte_count);
    const confidence = determineConfidence(paybackPeriod, roiPercent, hasDetailedMetrics);
    return {
        expected_roi_percent: roiPercent,
        payback_period_months: paybackPeriod === Infinity ? 999 : paybackPeriod,
        net_present_value_usd: npv,
        monthly_savings_usd: Math.round(monthlySavings),
        annual_savings_usd: Math.round(annualSavings),
        sensitivity_analysis: sensitivityAnalysis,
        assumptions,
        confidence_level: confidence,
    };
}
// Export schema for MCP server registration
export const CALCULATE_ROI_TOOL = {
    name: "calculate_roi",
    description: "Calculate return on investment for AI implementations with sensitivity analysis. Provides payback period, NPV, and confidence levels based on input quality.",
    inputSchema: {
        type: "object",
        properties: {
            current_metrics: {
                type: "object",
                properties: {
                    process_cost_per_month_usd: {
                        type: "number",
                        description: "Current monthly cost of the process in USD",
                    },
                    error_rate_percent: {
                        type: "number",
                        description: "Current error/defect rate as percentage (0-100)",
                    },
                    cycle_time_hours: {
                        type: "number",
                        description: "Current cycle time in hours",
                    },
                    manual_fte_count: {
                        type: "number",
                        description: "Number of FTEs dedicated to manual process",
                    },
                },
                required: ["process_cost_per_month_usd"],
            },
            target_improvement_percent: {
                type: "number",
                description: "Expected improvement percentage (1-100)",
            },
            implementation_cost_usd: {
                type: "number",
                description: "Total implementation cost in USD",
            },
            ongoing_monthly_cost_usd: {
                type: "number",
                description: "Ongoing monthly maintenance/license cost in USD",
            },
            time_horizon_months: {
                type: "number",
                description: "Analysis time horizon in months (default: 24)",
            },
        },
        required: ["current_metrics", "target_improvement_percent", "implementation_cost_usd"],
    },
};
//# sourceMappingURL=calculate_roi.js.map