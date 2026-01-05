/**
 * Good AI - Prioritize Use Cases Tool
 * "Leverage, not lore" — Rank potential AI projects by impact and feasibility
 */
import { z } from "zod";
// ============================================
// Input Schema
// ============================================
const UseCaseSchema = z.object({
    name: z.string().min(1).max(200),
    description: z.string().min(10).max(2000),
    category: z.enum([
        "automation",
        "prediction",
        "optimization",
        "classification",
        "generation",
        "analysis",
    ]),
    estimated_annual_value_usd: z.number().min(0).max(100000000).optional(),
    estimated_implementation_cost_usd: z.number().min(0).max(50000000).optional(),
    data_availability: z.enum(["none", "partial", "available", "excellent"]).optional(),
    stakeholder_support: z.enum(["low", "medium", "high"]).optional(),
    technical_complexity: z.enum(["low", "medium", "high"]).optional(),
    time_to_implement_weeks: z.number().min(1).max(104).optional(),
    dependencies: z.array(z.string().max(200)).max(10).optional(),
    strategic_alignment: z.enum(["low", "medium", "high"]).optional(),
});
export const PrioritizeUseCasesInputSchema = z.object({
    company_name: z.string().min(1).max(200),
    industry: z.enum([
        "manufacturing",
        "insurance",
        "aquaculture",
        "healthcare",
        "general",
    ]),
    use_cases: z.array(UseCaseSchema).min(1).max(20),
    budget_constraint_usd: z.number().min(0).max(100000000).optional(),
    timeline_constraint_weeks: z.number().min(1).max(156).optional(),
    prioritization_weights: z.object({
        business_value: z.number().min(0).max(1).optional(),
        feasibility: z.number().min(0).max(1).optional(),
        strategic_fit: z.number().min(0).max(1).optional(),
        quick_wins: z.number().min(0).max(1).optional(),
    }).optional(),
    organizational_readiness_score: z.number().min(0).max(10).optional(),
});
// ============================================
// Tool Definition
// ============================================
export const PRIORITIZE_USE_CASES_TOOL = {
    name: "prioritize_use_cases",
    description: "Ranks potential AI projects by business value, feasibility, and strategic fit. Creates a phased implementation roadmap with ROI projections and resource requirements.",
    inputSchema: {
        type: "object",
        properties: {
            company_name: { type: "string" },
            industry: {
                type: "string",
                enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
            },
            use_cases: {
                type: "array",
                description: "List of potential AI use cases to prioritize",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        category: {
                            type: "string",
                            enum: ["automation", "prediction", "optimization", "classification", "generation", "analysis"],
                        },
                        estimated_annual_value_usd: { type: "number" },
                        estimated_implementation_cost_usd: { type: "number" },
                        data_availability: { type: "string", enum: ["none", "partial", "available", "excellent"] },
                        stakeholder_support: { type: "string", enum: ["low", "medium", "high"] },
                        technical_complexity: { type: "string", enum: ["low", "medium", "high"] },
                        time_to_implement_weeks: { type: "number" },
                        strategic_alignment: { type: "string", enum: ["low", "medium", "high"] },
                    },
                    required: ["name", "description", "category"],
                },
            },
            budget_constraint_usd: { type: "number" },
            timeline_constraint_weeks: { type: "number" },
            prioritization_weights: { type: "object" },
            organizational_readiness_score: { type: "number" },
        },
        required: ["company_name", "industry", "use_cases"],
    },
};
// ============================================
// Implementation
// ============================================
const DEFAULT_WEIGHTS = {
    business_value: 0.35,
    feasibility: 0.30,
    strategic_fit: 0.20,
    quick_wins: 0.15,
};
const CATEGORY_COMPLEXITY = {
    automation: 0.6,
    classification: 0.5,
    analysis: 0.5,
    prediction: 0.7,
    optimization: 0.8,
    generation: 0.9,
};
const INDUSTRY_VALUE_MULTIPLIERS = {
    manufacturing: {
        automation: 1.3,
        prediction: 1.2,
        optimization: 1.4,
        classification: 1.1,
        generation: 0.8,
        analysis: 1.0,
    },
    insurance: {
        automation: 1.2,
        prediction: 1.3,
        classification: 1.4,
        optimization: 1.1,
        generation: 1.0,
        analysis: 1.2,
    },
    aquaculture: {
        prediction: 1.4,
        optimization: 1.3,
        automation: 1.1,
        analysis: 1.2,
        classification: 1.0,
        generation: 0.7,
    },
    healthcare: {
        classification: 1.4,
        prediction: 1.3,
        analysis: 1.3,
        automation: 1.0,
        optimization: 1.1,
        generation: 0.9,
    },
    general: {
        automation: 1.0,
        prediction: 1.0,
        optimization: 1.0,
        classification: 1.0,
        generation: 1.0,
        analysis: 1.0,
    },
};
function estimateDefaultValue(category, industry) {
    const baseValues = {
        automation: 150000,
        prediction: 200000,
        optimization: 250000,
        classification: 120000,
        generation: 100000,
        analysis: 80000,
    };
    const base = baseValues[category] || 100000;
    const multiplier = INDUSTRY_VALUE_MULTIPLIERS[industry]?.[category] || 1;
    return Math.round(base * multiplier);
}
function estimateDefaultCost(category, complexity) {
    const categoryBase = CATEGORY_COMPLEXITY[category] || 0.6;
    const complexityMultiplier = complexity === "high" ? 1.5 : complexity === "low" ? 0.6 : 1;
    return Math.round(50000 * categoryBase * complexityMultiplier);
}
function calculateBusinessValue(useCase, industry) {
    const annualValue = useCase.estimated_annual_value_usd ||
        estimateDefaultValue(useCase.category, industry);
    const cost = useCase.estimated_implementation_cost_usd ||
        estimateDefaultCost(useCase.category, useCase.technical_complexity);
    // Value score based on ROI potential
    const roi = ((annualValue - cost) / cost) * 100;
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
function calculateFeasibility(useCase, orgReadiness) {
    let score = 5;
    // Data availability
    const dataScores = { none: -2, partial: 0, available: 2, excellent: 3 };
    score += dataScores[useCase.data_availability || "partial"];
    // Technical complexity
    const complexityScores = { low: 2, medium: 0, high: -2 };
    score += complexityScores[useCase.technical_complexity || "medium"];
    // Organizational readiness adjustment
    score += (orgReadiness - 5) * 0.3;
    // Category complexity
    score -= (CATEGORY_COMPLEXITY[useCase.category] - 0.5) * 2;
    return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}
function calculateStrategicFit(useCase) {
    let score = 5;
    // Strategic alignment
    const alignmentScores = { low: -2, medium: 1, high: 3 };
    score += alignmentScores[useCase.strategic_alignment || "medium"];
    // Stakeholder support
    const supportScores = { low: -2, medium: 0, high: 2 };
    score += supportScores[useCase.stakeholder_support || "medium"];
    return Math.max(1, Math.min(10, score));
}
function calculateQuickWinPotential(useCase) {
    let score = 5;
    // Time to implement
    const weeks = useCase.time_to_implement_weeks || 12;
    if (weeks <= 4) {
        score += 4;
    }
    else if (weeks <= 8) {
        score += 2;
    }
    else if (weeks <= 12) {
        score += 1;
    }
    else if (weeks > 24) {
        score -= 2;
    }
    // Technical complexity
    if (useCase.technical_complexity === "low") {
        score += 2;
    }
    else if (useCase.technical_complexity === "high") {
        score -= 2;
    }
    // Data availability
    if (useCase.data_availability === "excellent") {
        score += 1;
    }
    else if (useCase.data_availability === "none") {
        score -= 2;
    }
    return Math.max(1, Math.min(10, score));
}
function generateRationale(useCase, scores, rank) {
    const parts = [];
    if (rank === 1) {
        parts.push("Top priority due to");
    }
    else if (rank <= 3) {
        parts.push("High priority with");
    }
    else {
        parts.push("Evaluated with");
    }
    if (scores.business_value >= 8) {
        parts.push("exceptional ROI potential");
    }
    else if (scores.business_value >= 6) {
        parts.push("strong business value");
    }
    if (scores.feasibility >= 8) {
        parts.push("and high implementation feasibility");
    }
    else if (scores.feasibility < 5) {
        parts.push("but faces feasibility challenges");
    }
    if (scores.quick_win_potential >= 8) {
        parts.push("— ideal for quick win");
    }
    return parts.join(" ") + ".";
}
function generateRisks(useCase) {
    const risks = [];
    if (useCase.data_availability === "none" || useCase.data_availability === "partial") {
        risks.push("Data availability may delay implementation");
    }
    if (useCase.stakeholder_support === "low") {
        risks.push("Low stakeholder buy-in increases adoption risk");
    }
    if (useCase.technical_complexity === "high") {
        risks.push("Technical complexity may require specialized talent");
    }
    if (useCase.dependencies && useCase.dependencies.length > 2) {
        risks.push("Multiple dependencies create scheduling constraints");
    }
    if (useCase.category === "generation") {
        risks.push("Generative AI may have accuracy and governance challenges");
    }
    return risks.slice(0, 3);
}
function generatePrerequisites(useCase) {
    const prereqs = [];
    if (useCase.data_availability !== "excellent") {
        prereqs.push("Ensure data pipeline and quality");
    }
    if (useCase.stakeholder_support !== "high") {
        prereqs.push("Secure executive sponsorship");
    }
    if (useCase.dependencies && useCase.dependencies.length > 0) {
        prereqs.push(`Complete: ${useCase.dependencies.slice(0, 2).join(", ")}`);
    }
    prereqs.push("Define success metrics and baseline");
    return prereqs.slice(0, 3);
}
function generateSuccessFactors(useCase) {
    const factors = [];
    factors.push("Clear ownership and accountability");
    if (useCase.category === "automation") {
        factors.push("Process documentation and exception handling");
    }
    else if (useCase.category === "prediction") {
        factors.push("Sufficient historical data for model training");
    }
    else if (useCase.category === "optimization") {
        factors.push("Measurable KPIs and feedback loops");
    }
    factors.push("User training and change management");
    return factors.slice(0, 3);
}
function scoreUseCase(useCase, industry, orgReadiness, weights) {
    const business_value = calculateBusinessValue(useCase, industry);
    const feasibility = calculateFeasibility(useCase, orgReadiness);
    const strategic_fit = calculateStrategicFit(useCase);
    const quick_win_potential = calculateQuickWinPotential(useCase);
    const overall = business_value * weights.business_value +
        feasibility * weights.feasibility +
        strategic_fit * weights.strategic_fit +
        quick_win_potential * weights.quick_wins;
    return {
        business_value,
        feasibility,
        strategic_fit,
        quick_win_potential,
        overall: Math.round(overall * 10) / 10,
    };
}
function determinePhase(rank, scores, complexity) {
    // Quick wins go to phase 1
    if (scores.quick_win_potential >= 7 && scores.feasibility >= 6) {
        return 1;
    }
    // Top priorities go to phase 1 or 2
    if (rank <= 3 && scores.overall >= 7) {
        return complexity === "high" ? 2 : 1;
    }
    // Medium priorities go to phase 2
    if (rank <= 6 && scores.overall >= 5) {
        return 2;
    }
    // Rest go to phase 3
    return 3;
}
function determineTier(overall) {
    if (overall >= 8) {
        return "critical";
    }
    if (overall >= 6.5) {
        return "high";
    }
    if (overall >= 5) {
        return "medium";
    }
    return "low";
}
export function prioritizeUseCases(input) {
    const { company_name, industry, use_cases, budget_constraint_usd, timeline_constraint_weeks, prioritization_weights, organizational_readiness_score = 5, } = input;
    const weights = {
        ...DEFAULT_WEIGHTS,
        ...prioritization_weights,
    };
    // Score all use cases
    const scored = use_cases.map((uc) => {
        const scores = scoreUseCase(uc, industry, organizational_readiness_score, weights);
        const annualValue = uc.estimated_annual_value_usd ||
            estimateDefaultValue(uc.category, industry);
        const cost = uc.estimated_implementation_cost_usd ||
            estimateDefaultCost(uc.category, uc.technical_complexity);
        return {
            useCase: uc,
            scores,
            annualValue,
            cost,
            roi: Math.round(((annualValue - cost) / cost) * 100),
        };
    });
    // Sort by overall score
    scored.sort((a, b) => b.scores.overall - a.scores.overall);
    // Assign ranks and phases
    const prioritized = scored.map((item, index) => {
        const rank = index + 1;
        const phase = determinePhase(rank, item.scores, item.useCase.technical_complexity);
        return {
            name: item.useCase.name,
            description: item.useCase.description,
            category: item.useCase.category,
            priority_rank: rank,
            priority_tier: determineTier(item.scores.overall),
            scores: item.scores,
            estimated_roi_percent: item.roi,
            recommended_phase: phase,
            rationale: generateRationale(item.useCase, item.scores, rank),
            risks: generateRisks(item.useCase),
            prerequisites: generatePrerequisites(item.useCase),
            success_factors: generateSuccessFactors(item.useCase),
        };
    });
    // Build roadmap phases
    const phase1Cases = prioritized.filter((p) => p.recommended_phase === 1);
    const phase2Cases = prioritized.filter((p) => p.recommended_phase === 2);
    const phase3Cases = prioritized.filter((p) => p.recommended_phase === 3);
    const getPhaseMetrics = (cases) => {
        const useCaseData = cases.map((c) => {
            const original = use_cases.find((u) => u.name === c.name);
            return {
                name: c.name,
                cost: original.estimated_implementation_cost_usd ||
                    estimateDefaultCost(original.category, original.technical_complexity),
                value: original.estimated_annual_value_usd ||
                    estimateDefaultValue(original.category, industry),
                weeks: original.time_to_implement_weeks || 12,
            };
        });
        return {
            use_cases: useCaseData.map((u) => u.name),
            total_investment_usd: useCaseData.reduce((sum, u) => sum + u.cost, 0),
            expected_value_usd: useCaseData.reduce((sum, u) => sum + u.value, 0),
            duration_weeks: Math.max(...useCaseData.map((u) => u.weeks), 0),
        };
    };
    const phase1Metrics = getPhaseMetrics(phase1Cases);
    const phase2Metrics = getPhaseMetrics(phase2Cases);
    const phase3Metrics = getPhaseMetrics(phase3Cases);
    // Portfolio summary
    const totalValue = scored.reduce((sum, s) => sum + s.annualValue, 0);
    const totalCost = scored.reduce((sum, s) => sum + s.cost, 0);
    const quickWins = prioritized.filter((p) => p.scores.quick_win_potential >= 7).length;
    const strategic = prioritized.filter((p) => p.scores.strategic_fit >= 7).length;
    // Constraints analysis
    const totalPhase1Cost = phase1Metrics.total_investment_usd;
    const totalTimeline = phase1Metrics.duration_weeks + phase2Metrics.duration_weeks;
    const fitsBudget = !budget_constraint_usd || totalPhase1Cost <= budget_constraint_usd;
    const fitsTimeline = !timeline_constraint_weeks || totalTimeline <= timeline_constraint_weeks;
    const adjustments = [];
    if (!fitsBudget && budget_constraint_usd) {
        adjustments.push(`Consider phasing Phase 1 implementation to stay within ${budget_constraint_usd.toLocaleString()} budget`);
    }
    if (!fitsTimeline && timeline_constraint_weeks) {
        adjustments.push(`Parallelize initiatives or reduce scope to meet ${timeline_constraint_weeks}-week timeline`);
    }
    if (quickWins === 0) {
        adjustments.push("Consider breaking larger initiatives into smaller quick wins");
    }
    // Key recommendations
    const recommendations = [];
    if (phase1Cases.length > 0) {
        recommendations.push(`Start with ${phase1Cases[0].name} — highest priority with ${phase1Cases[0].estimated_roi_percent}% expected ROI`);
    }
    if (quickWins > 0) {
        recommendations.push(`${quickWins} quick win opportunities can demonstrate early value`);
    }
    if (totalValue / totalCost > 2) {
        recommendations.push(`Portfolio shows ${Math.round((totalValue / totalCost) * 100)}% overall ROI potential`);
    }
    recommendations.push("Validate assumptions with pilot before full-scale implementation");
    return {
        company_name,
        industry,
        total_use_cases_analyzed: use_cases.length,
        prioritized_use_cases: prioritized,
        recommended_roadmap: {
            phase_1: {
                name: "Quick Wins & Foundation",
                ...phase1Metrics,
            },
            phase_2: {
                name: "Scale & Expand",
                ...phase2Metrics,
            },
            phase_3: {
                name: "Strategic Transformation",
                ...phase3Metrics,
            },
        },
        portfolio_summary: {
            total_potential_value_usd: totalValue,
            total_investment_required_usd: totalCost,
            portfolio_roi_percent: Math.round(((totalValue - totalCost) / totalCost) * 100),
            quick_wins_count: quickWins,
            strategic_initiatives_count: strategic,
        },
        constraints_analysis: {
            fits_budget: fitsBudget,
            fits_timeline: fitsTimeline,
            recommended_adjustments: adjustments,
        },
        key_recommendations: recommendations.slice(0, 4),
        methodology_note: "Prioritization uses weighted scoring across business value, feasibility, strategic fit, and quick-win potential following Good AI methodology: Leverage, not lore.",
    };
}
//# sourceMappingURL=prioritize_use_cases.js.map