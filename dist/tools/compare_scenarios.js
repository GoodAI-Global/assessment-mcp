/**
 * Good AI - Compare Scenarios Tool
 * "Evidence over opinions" — Side-by-side comparison of AI investment options
 */
import { z } from "zod";
// ============================================
// Input Schema
// ============================================
const ScenarioSchema = z.object({
    name: z.string().min(1).max(200),
    description: z.string().min(10).max(2000),
    investment_usd: z.number().min(0).max(100000000),
    expected_annual_value_usd: z.number().min(0).max(100000000),
    implementation_weeks: z.number().min(1).max(156),
    risk_level: z.enum(["low", "medium", "high"]),
    complexity: z.enum(["low", "medium", "high"]),
    required_capabilities: z.array(z.string().max(200)).max(10).optional(),
    dependencies: z.array(z.string().max(200)).max(10).optional(),
    strategic_alignment: z.enum(["low", "medium", "high"]).optional(),
    confidence_level: z.enum(["low", "medium", "high"]).optional(),
});
export const CompareScenariosInputSchema = z.object({
    company_name: z.string().min(1).max(200),
    comparison_purpose: z.string().min(10).max(1000),
    scenarios: z.array(ScenarioSchema).min(2).max(5),
    evaluation_criteria: z
        .object({
        roi_weight: z.number().min(0).max(1).optional(),
        time_to_value_weight: z.number().min(0).max(1).optional(),
        risk_weight: z.number().min(0).max(1).optional(),
        strategic_weight: z.number().min(0).max(1).optional(),
    })
        .optional(),
    budget_limit_usd: z.number().min(0).max(100000000).optional(),
    timeline_limit_weeks: z.number().min(1).max(156).optional(),
    risk_tolerance: z.enum(["conservative", "moderate", "aggressive"]).optional(),
});
// ============================================
// Tool Definition
// ============================================
export const COMPARE_SCENARIOS_TOOL = {
    name: "compare_scenarios",
    description: "Side-by-side comparison of different AI investment scenarios. Evaluates ROI, time to value, risk, and strategic alignment to provide clear recommendation with supporting analysis.",
    inputSchema: {
        type: "object",
        properties: {
            company_name: { type: "string" },
            comparison_purpose: {
                type: "string",
                description: "What decision is this comparison supporting?",
            },
            scenarios: {
                type: "array",
                description: "2-5 scenarios to compare",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        investment_usd: { type: "number" },
                        expected_annual_value_usd: { type: "number" },
                        implementation_weeks: { type: "number" },
                        risk_level: { type: "string", enum: ["low", "medium", "high"] },
                        complexity: { type: "string", enum: ["low", "medium", "high"] },
                        strategic_alignment: { type: "string", enum: ["low", "medium", "high"] },
                        confidence_level: { type: "string", enum: ["low", "medium", "high"] },
                    },
                    required: [
                        "name",
                        "description",
                        "investment_usd",
                        "expected_annual_value_usd",
                        "implementation_weeks",
                        "risk_level",
                        "complexity",
                    ],
                },
            },
            evaluation_criteria: { type: "object" },
            budget_limit_usd: { type: "number" },
            timeline_limit_weeks: { type: "number" },
            risk_tolerance: { type: "string", enum: ["conservative", "moderate", "aggressive"] },
        },
        required: ["company_name", "comparison_purpose", "scenarios"],
    },
};
// ============================================
// Implementation
// ============================================
const DEFAULT_WEIGHTS = {
    roi_weight: 0.35,
    time_to_value_weight: 0.25,
    risk_weight: 0.25,
    strategic_weight: 0.15,
};
const RISK_DISCOUNT_FACTORS = {
    low: 0.95,
    medium: 0.8,
    high: 0.6,
};
const CONFIDENCE_FACTORS = {
    low: 0.7,
    medium: 0.85,
    high: 1.0,
};
function calculateROIScore(scenario) {
    const roi = ((scenario.expected_annual_value_usd - scenario.investment_usd) / scenario.investment_usd) *
        100;
    if (roi >= 300) {
        return 10;
    }
    if (roi >= 200) {
        return 9;
    }
    if (roi >= 150) {
        return 8;
    }
    if (roi >= 100) {
        return 7;
    }
    if (roi >= 50) {
        return 6;
    }
    if (roi >= 25) {
        return 5;
    }
    if (roi >= 0) {
        return 4;
    }
    return 2;
}
function calculateTimeToValueScore(scenario) {
    const weeks = scenario.implementation_weeks;
    if (weeks <= 4) {
        return 10;
    }
    if (weeks <= 8) {
        return 9;
    }
    if (weeks <= 12) {
        return 8;
    }
    if (weeks <= 16) {
        return 7;
    }
    if (weeks <= 24) {
        return 6;
    }
    if (weeks <= 36) {
        return 5;
    }
    if (weeks <= 52) {
        return 4;
    }
    return 3;
}
function calculateRiskScore(scenario, riskTolerance) {
    const baseScores = {
        low: 9,
        medium: 6,
        high: 3,
    };
    let score = baseScores[scenario.risk_level];
    // Adjust for complexity
    if (scenario.complexity === "high") {
        score -= 1;
    }
    else if (scenario.complexity === "low") {
        score += 1;
    }
    // Adjust for confidence
    if (scenario.confidence_level === "low") {
        score -= 1;
    }
    else if (scenario.confidence_level === "high") {
        score += 1;
    }
    // Adjust for risk tolerance
    if (riskTolerance === "aggressive" && scenario.risk_level === "high") {
        score += 1;
    }
    else if (riskTolerance === "conservative" && scenario.risk_level === "high") {
        score -= 1;
    }
    return Math.max(1, Math.min(10, score));
}
function calculateStrategicScore(scenario) {
    const alignmentScores = {
        low: 4,
        medium: 6,
        high: 9,
    };
    let score = alignmentScores[scenario.strategic_alignment || "medium"];
    // Bonus for dependencies (shows integration thinking)
    if (scenario.dependencies && scenario.dependencies.length > 0) {
        score += 0.5;
    }
    return Math.min(10, score);
}
function calculateMetrics(scenario) {
    const annualValue = scenario.expected_annual_value_usd;
    const investment = scenario.investment_usd;
    const roiPercent = Math.round(((annualValue - investment) / investment) * 100);
    const monthlyValue = annualValue / 12;
    const paybackMonths = monthlyValue > 0 ? Math.ceil(investment / monthlyValue) : 999;
    const threeYearGrossValue = annualValue * 3;
    const netValue3yr = threeYearGrossValue - investment;
    const riskFactor = RISK_DISCOUNT_FACTORS[scenario.risk_level];
    const confidenceFactor = CONFIDENCE_FACTORS[scenario.confidence_level || "medium"];
    const riskAdjustedValue = Math.round(annualValue * riskFactor * confidenceFactor);
    return {
        roi_percent: roiPercent,
        payback_months: paybackMonths,
        net_value_3yr_usd: Math.round(netValue3yr),
        risk_adjusted_value_usd: riskAdjustedValue,
    };
}
function generatePros(scenario, metrics) {
    const pros = [];
    if (metrics.roi_percent >= 100) {
        pros.push(`Strong ROI of ${metrics.roi_percent}%`);
    }
    if (scenario.implementation_weeks <= 12) {
        pros.push(`Quick implementation (${scenario.implementation_weeks} weeks)`);
    }
    if (scenario.risk_level === "low") {
        pros.push("Low risk profile");
    }
    if (scenario.strategic_alignment === "high") {
        pros.push("High strategic alignment");
    }
    if (scenario.confidence_level === "high") {
        pros.push("High confidence in estimates");
    }
    if (metrics.payback_months <= 6) {
        pros.push(`Fast payback (${metrics.payback_months} months)`);
    }
    if (scenario.complexity === "low") {
        pros.push("Low implementation complexity");
    }
    return pros.slice(0, 4);
}
function generateCons(scenario, metrics) {
    const cons = [];
    if (metrics.roi_percent < 50) {
        cons.push("Modest ROI potential");
    }
    if (scenario.implementation_weeks > 24) {
        cons.push(`Extended timeline (${scenario.implementation_weeks} weeks)`);
    }
    if (scenario.risk_level === "high") {
        cons.push("Higher risk profile");
    }
    if (scenario.strategic_alignment === "low") {
        cons.push("Limited strategic alignment");
    }
    if (scenario.confidence_level === "low") {
        cons.push("Lower confidence in estimates");
    }
    if (metrics.payback_months > 18) {
        cons.push("Long payback period");
    }
    if (scenario.complexity === "high") {
        cons.push("High implementation complexity");
    }
    if (scenario.dependencies && scenario.dependencies.length > 2) {
        cons.push("Multiple dependencies");
    }
    return cons.slice(0, 4);
}
function determineFitAssessment(overall, meetsConstraints) {
    if (!meetsConstraints) {
        return "poor";
    }
    if (overall >= 8) {
        return "excellent";
    }
    if (overall >= 6) {
        return "good";
    }
    if (overall >= 4) {
        return "acceptable";
    }
    return "poor";
}
function scoreScenario(scenario, weights, riskTolerance, budgetLimit, timelineLimit) {
    const roi_score = calculateROIScore(scenario);
    const time_to_value_score = calculateTimeToValueScore(scenario);
    const risk_score = calculateRiskScore(scenario, riskTolerance);
    const strategic_score = calculateStrategicScore(scenario);
    const overall_score = roi_score * weights.roi_weight +
        time_to_value_score * weights.time_to_value_weight +
        risk_score * weights.risk_weight +
        strategic_score * weights.strategic_weight;
    const metrics = calculateMetrics(scenario);
    const meetsBudget = !budgetLimit || scenario.investment_usd <= budgetLimit;
    const meetsTimeline = !timelineLimit || scenario.implementation_weeks <= timelineLimit;
    const meets_constraints = meetsBudget && meetsTimeline;
    return {
        name: scenario.name,
        description: scenario.description,
        rank: 0, // Set later
        scores: {
            roi_score,
            time_to_value_score,
            risk_score,
            strategic_score,
            overall_score: Math.round(overall_score * 10) / 10,
        },
        metrics,
        pros: generatePros(scenario, metrics),
        cons: generateCons(scenario, metrics),
        fit_assessment: determineFitAssessment(overall_score, meets_constraints),
        meets_constraints,
    };
}
function buildComparisonMatrix(_scenarios, scored, weights) {
    const criteria = [
        {
            name: "ROI Potential",
            weight: weights.roi_weight,
            getter: (s) => s.scores.roi_score,
        },
        {
            name: "Time to Value",
            weight: weights.time_to_value_weight,
            getter: (s) => s.scores.time_to_value_score,
        },
        {
            name: "Risk Profile",
            weight: weights.risk_weight,
            getter: (s) => s.scores.risk_score,
        },
        {
            name: "Strategic Fit",
            weight: weights.strategic_weight,
            getter: (s) => s.scores.strategic_score,
        },
    ];
    return criteria.map((c) => {
        const values = {};
        let maxValue = 0;
        let winner = "";
        scored.forEach((s) => {
            const value = c.getter(s);
            values[s.name] = value;
            if (value > maxValue) {
                maxValue = value;
                winner = s.name;
            }
        });
        return {
            criterion: c.name,
            weights: c.weight,
            scenario_values: values,
            winner,
        };
    });
}
function generateRiskAnalysis(scenarios) {
    return scenarios.map((s) => {
        const risks = [];
        const mitigations = [];
        if (s.risk_level === "high") {
            risks.push("High overall risk profile");
            mitigations.push("Consider phased approach with early validation");
        }
        if (s.complexity === "high") {
            risks.push("Implementation complexity may cause delays");
            mitigations.push("Engage experienced implementation partners");
        }
        if (s.confidence_level === "low") {
            risks.push("Lower confidence in value estimates");
            mitigations.push("Validate assumptions with pilot before full commitment");
        }
        if (s.dependencies && s.dependencies.length > 0) {
            risks.push(`Depends on: ${s.dependencies.slice(0, 2).join(", ")}`);
            mitigations.push("Ensure dependencies are tracked and managed");
        }
        if (s.implementation_weeks > 24) {
            risks.push("Long timeline increases market and technology risk");
            mitigations.push("Build in milestone reviews and pivot points");
        }
        return {
            scenario: s.name,
            risk_level: s.risk_level,
            key_risks: risks.slice(0, 3),
            mitigation_suggestions: mitigations.slice(0, 3),
        };
    });
}
function generateTradeOffs(scored) {
    const tradeoffs = [];
    const sortedByROI = [...scored].sort((a, b) => b.metrics.roi_percent - a.metrics.roi_percent);
    const sortedByTime = [...scored]
        .sort((a, b) => scored.find((s) => s.name === a.name).scores.time_to_value_score -
        scored.find((s) => s.name === b.name).scores.time_to_value_score)
        .reverse();
    if (sortedByROI[0].name !== sortedByTime[0].name) {
        tradeoffs.push(`${sortedByROI[0].name} offers best ROI but ${sortedByTime[0].name} delivers value faster`);
    }
    const lowRisk = scored.filter((s) => s.scores.risk_score >= 8);
    const highROI = scored.filter((s) => s.metrics.roi_percent >= 100);
    if (lowRisk.length > 0 && highROI.length > 0 && !lowRisk.some((lr) => highROI.includes(lr))) {
        tradeoffs.push("Lower risk scenarios have more modest returns");
    }
    const constraintMet = scored.filter((s) => s.meets_constraints);
    const constraintMissed = scored.filter((s) => !s.meets_constraints);
    if (constraintMissed.length > 0 &&
        constraintMissed.some((m) => m.scores.overall_score > (constraintMet[0]?.scores.overall_score || 0))) {
        tradeoffs.push("Some high-scoring scenarios exceed budget/timeline constraints");
    }
    return tradeoffs.slice(0, 3);
}
function generateSensitivityInsights(scored) {
    const insights = [];
    const scoreRange = Math.max(...scored.map((s) => s.scores.overall_score)) -
        Math.min(...scored.map((s) => s.scores.overall_score));
    if (scoreRange < 1) {
        insights.push("Scenarios are closely matched — decision may depend on qualitative factors");
    }
    else if (scoreRange > 3) {
        insights.push("Clear differentiation between scenarios supports confident decision");
    }
    const roiVariance = Math.max(...scored.map((s) => s.metrics.roi_percent)) -
        Math.min(...scored.map((s) => s.metrics.roi_percent));
    if (roiVariance > 100) {
        insights.push(`ROI varies significantly (${roiVariance}% spread) — validate assumptions carefully`);
    }
    const allHighConfidence = scored.every((s) => s.pros.some((p) => p.includes("High confidence")));
    if (!allHighConfidence) {
        insights.push("Consider confidence levels when comparing estimates");
    }
    return insights.slice(0, 3);
}
function generateDecisionFactors(scored, riskTolerance) {
    const factors = [];
    factors.push(`Risk tolerance is ${riskTolerance} — weight risk scores accordingly`);
    const meetsConstraints = scored.filter((s) => s.meets_constraints);
    if (meetsConstraints.length < scored.length) {
        factors.push("Some scenarios exceed constraints — consider only viable options");
    }
    if (scored.some((s) => s.fit_assessment === "excellent")) {
        factors.push("At least one excellent-fit scenario available");
    }
    factors.push("Consider organizational capacity for change alongside metrics");
    return factors.slice(0, 4);
}
export function compareScenarios(input) {
    const { company_name, comparison_purpose, scenarios, evaluation_criteria, budget_limit_usd, timeline_limit_weeks, risk_tolerance = "moderate", } = input;
    const weights = { ...DEFAULT_WEIGHTS, ...evaluation_criteria };
    // Score all scenarios
    const scored = scenarios.map((s) => scoreScenario(s, weights, risk_tolerance, budget_limit_usd, timeline_limit_weeks));
    // Sort by overall score and assign ranks
    scored.sort((a, b) => b.scores.overall_score - a.scores.overall_score);
    scored.forEach((s, i) => {
        s.rank = i + 1;
    });
    // Build recommendation
    const winner = scored[0];
    const runnerUp = scored[1];
    const differentiators = [];
    if (winner.metrics.roi_percent > runnerUp.metrics.roi_percent) {
        differentiators.push(`Higher ROI (${winner.metrics.roi_percent}% vs ${runnerUp.metrics.roi_percent}%)`);
    }
    if (winner.scores.risk_score > runnerUp.scores.risk_score) {
        differentiators.push("Better risk profile");
    }
    if (winner.scores.time_to_value_score > runnerUp.scores.time_to_value_score) {
        differentiators.push("Faster time to value");
    }
    if (winner.scores.strategic_score > runnerUp.scores.strategic_score) {
        differentiators.push("Stronger strategic alignment");
    }
    const confidenceLevel = winner.scores.overall_score - runnerUp.scores.overall_score > 2
        ? "high"
        : winner.scores.overall_score - runnerUp.scores.overall_score > 0.5
            ? "medium"
            : "low";
    return {
        company_name,
        comparison_purpose,
        scenarios_compared: scenarios.length,
        scored_scenarios: scored,
        recommendation: {
            recommended_scenario: winner.name,
            rationale: `${winner.name} scores highest overall (${winner.scores.overall_score}/10) with ${winner.fit_assessment} fit. ${winner.pros.slice(0, 2).join(". ")}.`,
            confidence: confidenceLevel,
            key_differentiators: differentiators.slice(0, 3),
        },
        comparison_matrix: buildComparisonMatrix(scenarios, scored, weights),
        risk_analysis: generateRiskAnalysis(scenarios),
        sensitivity_insights: generateSensitivityInsights(scored),
        trade_offs: generateTradeOffs(scored),
        decision_factors: generateDecisionFactors(scored, risk_tolerance),
        methodology_note: "Comparison uses weighted multi-criteria decision analysis following Good AI methodology: Evidence over opinions, with transparent scoring across ROI, time to value, risk, and strategic alignment.",
    };
}
//# sourceMappingURL=compare_scenarios.js.map