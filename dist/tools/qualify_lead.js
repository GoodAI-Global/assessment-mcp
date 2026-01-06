/**
 * Good AI - Qualify Lead Tool
 * "Leverage, not lore" — Score prospect fit based on company profile for Sales
 */
import { z } from "zod";
// ============================================
// Input Schema
// ============================================
export const QualifyLeadInputSchema = z.object({
    company_name: z.string().min(1).max(200),
    industry: z.enum(["manufacturing", "insurance", "aquaculture", "healthcare", "general"]),
    employee_count: z.number().min(1).max(1000000),
    annual_revenue_usd: z.number().min(0).max(100000000000).optional(),
    pain_points: z.array(z.string().max(500)).min(1).max(10),
    current_technology_maturity: z.enum(["low", "medium", "high"]).optional(),
    decision_timeline: z.enum(["immediate", "this_quarter", "this_year", "exploring"]).optional(),
    budget_indication: z.enum(["undefined", "limited", "moderate", "significant"]).optional(),
    champion_identified: z.boolean().optional(),
    executive_sponsor: z.boolean().optional(),
    previous_ai_experience: z.enum(["none", "failed", "limited", "successful"]).optional(),
    competitive_situation: z.enum(["none", "evaluating", "incumbent"]).optional(),
    source: z.string().max(100).optional(),
    initial_contact_notes: z.string().max(2000).optional(),
});
// ============================================
// Tool Definition
// ============================================
export const QUALIFY_LEAD_TOOL = {
    name: "qualify_lead",
    description: "Scores prospect fit based on company profile using BANT framework (Budget, Authority, Need, Timeline). Provides qualification tier, deal potential, and recommended next steps for Sales.",
    inputSchema: {
        type: "object",
        properties: {
            company_name: { type: "string" },
            industry: {
                type: "string",
                enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
            },
            employee_count: { type: "number" },
            annual_revenue_usd: { type: "number" },
            pain_points: {
                type: "array",
                description: "Key business challenges the prospect mentioned",
                items: { type: "string" },
            },
            current_technology_maturity: {
                type: "string",
                enum: ["low", "medium", "high"],
            },
            decision_timeline: {
                type: "string",
                enum: ["immediate", "this_quarter", "this_year", "exploring"],
            },
            budget_indication: {
                type: "string",
                enum: ["undefined", "limited", "moderate", "significant"],
            },
            champion_identified: { type: "boolean" },
            executive_sponsor: { type: "boolean" },
            previous_ai_experience: {
                type: "string",
                enum: ["none", "failed", "limited", "successful"],
            },
            competitive_situation: {
                type: "string",
                enum: ["none", "evaluating", "incumbent"],
            },
            source: { type: "string" },
            initial_contact_notes: { type: "string" },
        },
        required: ["company_name", "industry", "employee_count", "pain_points"],
    },
};
// ============================================
// Implementation
// ============================================
const IDEAL_COMPANY_SIZE = {
    manufacturing: { min: 100, max: 10000, ideal: 500 },
    insurance: { min: 200, max: 20000, ideal: 1000 },
    aquaculture: { min: 50, max: 2000, ideal: 200 },
    healthcare: { min: 100, max: 15000, ideal: 800 },
    general: { min: 100, max: 5000, ideal: 500 },
};
const CORE_INDUSTRIES = ["manufacturing", "insurance", "aquaculture"];
function calculateFitScore(input) {
    let score = 5;
    const sizeProfile = IDEAL_COMPANY_SIZE[input.industry];
    // Company size fit
    if (input.employee_count >= sizeProfile.min && input.employee_count <= sizeProfile.max) {
        const idealDiff = Math.abs(input.employee_count - sizeProfile.ideal) / sizeProfile.ideal;
        if (idealDiff < 0.5) {
            score += 2;
        }
        else {
            score += 1;
        }
    }
    else if (input.employee_count < sizeProfile.min) {
        score -= 1;
    }
    // Industry fit
    if (CORE_INDUSTRIES.includes(input.industry)) {
        score += 2;
    }
    else if (input.industry === "healthcare") {
        score += 1;
    }
    // Technology maturity
    if (input.current_technology_maturity === "high") {
        score += 1;
    }
    else if (input.current_technology_maturity === "low") {
        score -= 1;
    }
    // Revenue indicator (if provided)
    if (input.annual_revenue_usd) {
        if (input.annual_revenue_usd >= 50000000) {
            score += 1;
        }
        else if (input.annual_revenue_usd >= 10000000) {
            score += 0.5;
        }
    }
    return Math.max(1, Math.min(10, score));
}
function calculateBudgetScore(input) {
    const budgetScores = {
        significant: 9,
        moderate: 7,
        limited: 4,
        undefined: 5,
    };
    let score = budgetScores[input.budget_indication || "undefined"];
    // Adjust for company size (larger companies have more budget)
    if (input.employee_count > 1000) {
        score += 1;
    }
    // Adjust for revenue
    if (input.annual_revenue_usd && input.annual_revenue_usd >= 100000000) {
        score += 1;
    }
    return Math.max(1, Math.min(10, score));
}
function calculateAuthorityScore(input) {
    let score = 4;
    if (input.executive_sponsor) {
        score += 4;
    }
    if (input.champion_identified) {
        score += 2;
    }
    // Larger companies may need more authority validation
    if (input.employee_count > 5000 && !input.executive_sponsor) {
        score -= 1;
    }
    return Math.max(1, Math.min(10, score));
}
function calculateNeedScore(input) {
    let score = 3;
    // More pain points = stronger need
    const painPointCount = input.pain_points.length;
    if (painPointCount >= 4) {
        score += 4;
    }
    else if (painPointCount >= 2) {
        score += 2;
    }
    else {
        score += 1;
    }
    // Check for AI-relevant keywords in pain points
    const aiKeywords = [
        "automat",
        "predict",
        "optim",
        "manual",
        "error",
        "quality",
        "forecast",
        "efficien",
        "cost",
        "time",
    ];
    const painText = input.pain_points.join(" ").toLowerCase();
    const keywordMatches = aiKeywords.filter((kw) => painText.includes(kw)).length;
    score += Math.min(2, keywordMatches * 0.5);
    // Previous AI experience
    if (input.previous_ai_experience === "failed") {
        score += 1; // They know they need help
    }
    else if (input.previous_ai_experience === "successful") {
        score += 1; // They understand value
    }
    return Math.max(1, Math.min(10, score));
}
function calculateTimingScore(input) {
    const timingScores = {
        immediate: 10,
        this_quarter: 8,
        this_year: 5,
        exploring: 3,
    };
    let score = timingScores[input.decision_timeline || "exploring"];
    // Competitive pressure increases urgency
    if (input.competitive_situation === "evaluating") {
        score += 1;
    }
    return Math.max(1, Math.min(10, score));
}
function determineQualificationTier(overall) {
    if (overall >= 7.5) {
        return "hot";
    }
    if (overall >= 5.5) {
        return "warm";
    }
    if (overall >= 3.5) {
        return "nurture";
    }
    return "disqualify";
}
function assessCompanySizeFit(employees, industry) {
    const profile = IDEAL_COMPANY_SIZE[industry];
    if (employees >= profile.min && employees <= profile.max) {
        const idealDiff = Math.abs(employees - profile.ideal) / profile.ideal;
        if (idealDiff < 0.3) {
            return "ideal";
        }
        return "acceptable";
    }
    if (employees < profile.min * 0.5 || employees > profile.max * 2) {
        return "poor";
    }
    return "stretch";
}
function assessIndustryFit(industry) {
    if (CORE_INDUSTRIES.includes(industry)) {
        return "core";
    }
    if (industry === "healthcare") {
        return "adjacent";
    }
    return "exploratory";
}
function assessTechnologyReadiness(maturity) {
    if (maturity === "high") {
        return "ready";
    }
    if (maturity === "medium") {
        return "developing";
    }
    return "not_ready";
}
function generateStrengths(input, scores) {
    const strengths = [];
    if (scores.need_score >= 7) {
        strengths.push("Strong, well-articulated pain points");
    }
    if (scores.authority_score >= 7) {
        strengths.push("Executive sponsorship or strong champion");
    }
    if (scores.timing_score >= 8) {
        strengths.push("Immediate decision timeline");
    }
    if (scores.budget_score >= 7) {
        strengths.push("Clear budget allocated");
    }
    if (scores.fit_score >= 7) {
        strengths.push("Ideal company profile for AI solutions");
    }
    if (CORE_INDUSTRIES.includes(input.industry)) {
        strengths.push(`Strong fit with ${input.industry} expertise`);
    }
    if (input.previous_ai_experience === "successful") {
        strengths.push("Positive previous AI experience");
    }
    return strengths.slice(0, 4);
}
function generateConcerns(input, scores) {
    const concerns = [];
    if (scores.authority_score < 5) {
        concerns.push("No clear decision-maker or champion identified");
    }
    if (scores.budget_score < 5) {
        concerns.push("Budget unclear or limited");
    }
    if (scores.timing_score < 4) {
        concerns.push("No defined timeline for decision");
    }
    if (input.current_technology_maturity === "low") {
        concerns.push("Low technology maturity may slow adoption");
    }
    if (input.previous_ai_experience === "failed") {
        concerns.push("Previous AI failure may create skepticism");
    }
    if (input.competitive_situation === "incumbent") {
        concerns.push("Existing vendor relationship to displace");
    }
    if (input.employee_count < 50) {
        concerns.push("Company may be too small for enterprise solution");
    }
    return concerns.slice(0, 4);
}
function generateRecommendedActions(tier, input, scores) {
    const actions = [];
    if (tier === "hot") {
        actions.push("Schedule executive briefing within 1 week");
        if (!input.executive_sponsor) {
            actions.push("Identify and engage executive sponsor");
        }
        actions.push("Prepare tailored ROI analysis");
    }
    else if (tier === "warm") {
        actions.push("Schedule discovery call to deepen understanding");
        if (scores.authority_score < 5) {
            actions.push("Map decision-making process and stakeholders");
        }
        if (scores.budget_score < 5) {
            actions.push("Explore budget planning cycle and allocation");
        }
    }
    else if (tier === "nurture") {
        actions.push("Add to nurture campaign for industry content");
        actions.push("Schedule follow-up in 30-60 days");
        actions.push("Share relevant case study or thought leadership");
    }
    else {
        actions.push("Document disqualification reason");
        actions.push("Add to long-term nurture if timing issue");
    }
    return actions.slice(0, 4);
}
function estimateDealSize(input) {
    let baseSize = 75000; // Default pilot size
    // Scale by company size
    if (input.employee_count > 5000) {
        baseSize = 300000;
    }
    else if (input.employee_count > 1000) {
        baseSize = 150000;
    }
    else if (input.employee_count > 250) {
        baseSize = 100000;
    }
    // Adjust for budget indication
    if (input.budget_indication === "significant") {
        baseSize *= 2;
    }
    else if (input.budget_indication === "limited") {
        baseSize *= 0.5;
    }
    // Determine deal type
    let dealType = "pilot";
    if (baseSize >= 500000) {
        dealType = "strategic";
    }
    else if (baseSize >= 200000) {
        dealType = "enterprise";
    }
    else if (baseSize >= 100000) {
        dealType = "project";
    }
    // Confidence based on info completeness
    const hasFullInfo = input.budget_indication && input.decision_timeline && input.annual_revenue_usd;
    const confidence = hasFullInfo
        ? "high"
        : input.budget_indication
            ? "medium"
            : "low";
    return {
        estimated_deal_size_usd: Math.round(baseSize),
        confidence,
        deal_type: dealType,
    };
}
function generateNextSteps(tier, input) {
    const steps = [];
    if (tier === "hot") {
        steps.push({
            action: "Book executive demo within 5 business days",
            priority: "high",
            owner: "Account Executive",
        });
        steps.push({
            action: "Prepare custom ROI calculator",
            priority: "high",
            owner: "Solutions Consultant",
        });
        if (!input.champion_identified) {
            steps.push({
                action: "Identify internal champion",
                priority: "medium",
                owner: "Account Executive",
            });
        }
    }
    else if (tier === "warm") {
        steps.push({
            action: "Schedule discovery call",
            priority: "high",
            owner: "SDR",
        });
        steps.push({
            action: "Send industry case study",
            priority: "medium",
            owner: "SDR",
        });
    }
    else if (tier === "nurture") {
        steps.push({
            action: "Add to nurture sequence",
            priority: "medium",
            owner: "Marketing",
        });
        steps.push({
            action: "Schedule follow-up for next quarter",
            priority: "low",
            owner: "SDR",
        });
    }
    return steps.slice(0, 3);
}
function generateDisqualificationReasons(scores, input) {
    const reasons = [];
    if (scores.fit_score < 3) {
        reasons.push("Company profile does not fit target market");
    }
    if (input.employee_count < 25) {
        reasons.push("Company too small for solution");
    }
    if (scores.need_score < 3 && scores.timing_score < 3) {
        reasons.push("No clear need or urgency identified");
    }
    if (input.competitive_situation === "incumbent" && scores.need_score < 5) {
        reasons.push("Happy with existing solution, no switching intent");
    }
    return reasons;
}
export function qualifyLead(input) {
    const scores = {
        fit_score: calculateFitScore(input),
        budget_score: calculateBudgetScore(input),
        authority_score: calculateAuthorityScore(input),
        need_score: calculateNeedScore(input),
        timing_score: calculateTimingScore(input),
    };
    // BANT-weighted overall score
    const overall = scores.budget_score * 0.2 +
        scores.authority_score * 0.2 +
        scores.need_score * 0.35 +
        scores.timing_score * 0.25;
    const qualificationScore = Math.round(overall * 10) / 10;
    const tier = determineQualificationTier(qualificationScore);
    return {
        company_name: input.company_name,
        industry: input.industry,
        qualification_score: qualificationScore,
        qualification_tier: tier,
        scores,
        fit_assessment: {
            company_size_fit: assessCompanySizeFit(input.employee_count, input.industry),
            industry_fit: assessIndustryFit(input.industry),
            technology_readiness: assessTechnologyReadiness(input.current_technology_maturity),
        },
        key_strengths: generateStrengths(input, scores),
        key_concerns: generateConcerns(input, scores),
        recommended_actions: generateRecommendedActions(tier, input, scores),
        qualification_rationale: `${input.company_name} scores ${qualificationScore}/10 overall with ${tier} priority. ${scores.need_score >= 7 ? "Strong need identified." : "Need requires further validation."} ${scores.timing_score >= 7 ? "Active buying timeline." : "Timeline unclear or extended."}`,
        deal_potential: estimateDealSize(input),
        next_steps: generateNextSteps(tier, input),
        disqualification_reasons: tier === "disqualify" ? generateDisqualificationReasons(scores, input) : [],
        methodology_note: "Lead qualification uses BANT framework (Budget, Authority, Need, Timeline) with industry-specific fit scoring following Good AI methodology.",
    };
}
//# sourceMappingURL=qualify_lead.js.map