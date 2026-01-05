/**
 * Good AI - Estimate Deal Size Tool
 * Data-driven deal sizing for AI consulting engagements
 */
import { z } from "zod";
// ============================================
// Input Schema
// ============================================
export const EstimateDealSizeInputSchema = z.object({
    company_name: z.string().min(1).max(200),
    industry: z.enum([
        "manufacturing",
        "insurance",
        "aquaculture",
        "healthcare",
        "general",
    ]),
    employee_count: z.number().min(1).max(1000000),
    annual_revenue_usd: z.number().min(0).optional(),
    engagement_type: z.enum([
        "assessment",
        "pilot",
        "implementation",
        "transformation",
        "managed_service",
    ]),
    scope_dimensions: z.object({
        departments_involved: z.number().min(1).max(50).default(1),
        locations_count: z.number().min(1).max(500).default(1),
        integrations_required: z.number().min(0).max(50).default(0),
        data_sources_count: z.number().min(1).max(100).default(1),
        user_count: z.number().min(1).max(100000).default(10),
        custom_development_required: z.boolean().default(false),
    }),
    complexity_factors: z.object({
        regulatory_requirements: z.enum(["none", "standard", "strict", "critical"]).default("none"),
        legacy_system_integration: z.boolean().default(false),
        multi_language_support: z.boolean().default(false),
        real_time_requirements: z.boolean().default(false),
        high_availability_sla: z.boolean().default(false),
    }).optional(),
    timeline_preference: z.enum([
        "accelerated",
        "standard",
        "extended",
    ]).default("standard"),
    client_ai_maturity: z.enum([
        "none",
        "experimenting",
        "scaling",
        "mature",
    ]).default("experimenting"),
    existing_relationship: z.boolean().default(false),
    competitive_situation: z.enum([
        "sole_source",
        "preferred",
        "competitive",
        "highly_competitive",
    ]).default("competitive"),
});
// ============================================
// Tool Definition
// ============================================
export const ESTIMATE_DEAL_SIZE_TOOL = {
    name: "estimate_deal_size",
    description: "Estimates the potential deal value for AI consulting engagements based on company profile, engagement scope, complexity factors, and market positioning. Provides detailed pricing breakdown, margin analysis, and negotiation guidance.",
    inputSchema: {
        type: "object",
        properties: {
            company_name: { type: "string", description: "Company name" },
            industry: {
                type: "string",
                enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
            },
            employee_count: { type: "number", description: "Number of employees" },
            annual_revenue_usd: { type: "number", description: "Annual revenue in USD (optional)" },
            engagement_type: {
                type: "string",
                enum: ["assessment", "pilot", "implementation", "transformation", "managed_service"],
                description: "Type of engagement",
            },
            scope_dimensions: {
                type: "object",
                description: "Dimensions affecting scope",
            },
            complexity_factors: {
                type: "object",
                description: "Factors that increase complexity",
            },
            timeline_preference: {
                type: "string",
                enum: ["accelerated", "standard", "extended"],
            },
            client_ai_maturity: {
                type: "string",
                enum: ["none", "experimenting", "scaling", "mature"],
            },
            existing_relationship: { type: "boolean" },
            competitive_situation: {
                type: "string",
                enum: ["sole_source", "preferred", "competitive", "highly_competitive"],
            },
        },
        required: ["company_name", "industry", "employee_count", "engagement_type", "scope_dimensions"],
    },
};
// ============================================
// Implementation
// ============================================
/** Base pricing by engagement type (USD) */
const BASE_PRICING = {
    assessment: { base: 25000, perUser: 0, perIntegration: 2000 },
    pilot: { base: 75000, perUser: 50, perIntegration: 5000 },
    implementation: { base: 200000, perUser: 100, perIntegration: 15000 },
    transformation: { base: 500000, perUser: 150, perIntegration: 25000 },
    managed_service: { base: 150000, perUser: 200, perIntegration: 10000 }, // Annual
};
/** Industry multipliers */
const INDUSTRY_MULTIPLIERS = {
    manufacturing: 1.1,
    insurance: 1.2,
    aquaculture: 1.0,
    healthcare: 1.3,
    general: 1.0,
};
/** Company size multipliers based on employee count */
function getCompanySizeMultiplier(employeeCount) {
    if (employeeCount >= 10000) {
        return 2.0;
    }
    if (employeeCount >= 5000) {
        return 1.7;
    }
    if (employeeCount >= 1000) {
        return 1.4;
    }
    if (employeeCount >= 500) {
        return 1.2;
    }
    if (employeeCount >= 100) {
        return 1.0;
    }
    return 0.8;
}
/** Calculate complexity adjustment */
function calculateComplexityAdjustment(baseValue, factors) {
    const pricingFactors = [];
    let totalAdjustment = 0;
    if (!factors) {
        return { adjustment: 0, factors: [] };
    }
    // Regulatory requirements
    const regulatoryMultipliers = {
        none: 0,
        standard: 0.1,
        strict: 0.25,
        critical: 0.4,
    };
    const regAdjust = regulatoryMultipliers[factors.regulatory_requirements] || 0;
    if (regAdjust > 0) {
        totalAdjustment += baseValue * regAdjust;
        pricingFactors.push({
            factor: "Regulatory Requirements",
            impact: "increases",
            adjustment_percent: regAdjust * 100,
            rationale: `${factors.regulatory_requirements} regulatory environment requires additional compliance work`,
        });
    }
    // Legacy system integration
    if (factors.legacy_system_integration) {
        const legacyAdjust = 0.2;
        totalAdjustment += baseValue * legacyAdjust;
        pricingFactors.push({
            factor: "Legacy System Integration",
            impact: "increases",
            adjustment_percent: 20,
            rationale: "Legacy systems require custom adapters and additional testing",
        });
    }
    // Multi-language support
    if (factors.multi_language_support) {
        const langAdjust = 0.15;
        totalAdjustment += baseValue * langAdjust;
        pricingFactors.push({
            factor: "Multi-language Support",
            impact: "increases",
            adjustment_percent: 15,
            rationale: "Localization and multi-language AI models required",
        });
    }
    // Real-time requirements
    if (factors.real_time_requirements) {
        const rtAdjust = 0.25;
        totalAdjustment += baseValue * rtAdjust;
        pricingFactors.push({
            factor: "Real-time Processing",
            impact: "increases",
            adjustment_percent: 25,
            rationale: "Real-time infrastructure and optimization requirements",
        });
    }
    // High availability SLA
    if (factors.high_availability_sla) {
        const haAdjust = 0.2;
        totalAdjustment += baseValue * haAdjust;
        pricingFactors.push({
            factor: "High Availability SLA",
            impact: "increases",
            adjustment_percent: 20,
            rationale: "Redundancy, monitoring, and SLA management overhead",
        });
    }
    return { adjustment: Math.round(totalAdjustment), factors: pricingFactors };
}
/** Calculate scope adjustment */
function calculateScopeAdjustment(baseValue, scope, engagementType) {
    let adjustment = 0;
    const pricing = BASE_PRICING[engagementType];
    // User scaling (beyond base 10 users)
    if (scope.user_count > 10) {
        adjustment += (scope.user_count - 10) * pricing.perUser;
    }
    // Integration costs
    adjustment += scope.integrations_required * pricing.perIntegration;
    // Department/location scaling
    if (scope.departments_involved > 1) {
        adjustment += baseValue * 0.1 * (scope.departments_involved - 1);
    }
    if (scope.locations_count > 1) {
        adjustment += baseValue * 0.05 * Math.min(scope.locations_count - 1, 10);
    }
    // Data sources
    if (scope.data_sources_count > 2) {
        adjustment += baseValue * 0.08 * (scope.data_sources_count - 2);
    }
    // Custom development
    if (scope.custom_development_required) {
        adjustment += baseValue * 0.35;
    }
    return Math.round(adjustment);
}
/** Calculate timeline adjustment */
function calculateTimelineAdjustment(baseValue, timeline) {
    if (timeline === "accelerated") {
        return {
            adjustment: Math.round(baseValue * 0.25),
            factor: {
                factor: "Accelerated Timeline",
                impact: "increases",
                adjustment_percent: 25,
                rationale: "Rush delivery requires additional resources and overtime",
            },
        };
    }
    if (timeline === "extended") {
        return {
            adjustment: Math.round(baseValue * -0.1),
            factor: {
                factor: "Extended Timeline",
                impact: "decreases",
                adjustment_percent: -10,
                rationale: "Longer timeline allows for resource optimization",
            },
        };
    }
    return { adjustment: 0, factor: null };
}
/** Generate services breakdown */
function generateServicesBreakdown(totalValue, engagementType, hasCustomDev) {
    const breakdowns = {
        assessment: [
            { category: "Discovery & Analysis", percentage: 40 },
            { category: "Strategy & Roadmap", percentage: 35 },
            { category: "Documentation & Presentation", percentage: 25 },
        ],
        pilot: [
            { category: "Discovery & Design", percentage: 20 },
            { category: "Development & Configuration", percentage: 45 },
            { category: "Testing & Validation", percentage: 20 },
            { category: "Training & Handoff", percentage: 15 },
        ],
        implementation: [
            { category: "Project Management", percentage: 15 },
            { category: "Architecture & Design", percentage: 20 },
            { category: "Development & Integration", percentage: 40 },
            { category: "Testing & QA", percentage: 15 },
            { category: "Training & Change Management", percentage: 10 },
        ],
        transformation: [
            { category: "Program Management", percentage: 15 },
            { category: "Strategy & Architecture", percentage: 15 },
            { category: "Development & Integration", percentage: 35 },
            { category: "Change Management", percentage: 15 },
            { category: "Training & Enablement", percentage: 10 },
            { category: "Governance & Optimization", percentage: 10 },
        ],
        managed_service: [
            { category: "Platform Operations", percentage: 40 },
            { category: "Support & Maintenance", percentage: 25 },
            { category: "Continuous Improvement", percentage: 20 },
            { category: "Reporting & Governance", percentage: 15 },
        ],
    };
    let breakdown = breakdowns[engagementType] || breakdowns.implementation;
    if (hasCustomDev && engagementType !== "assessment") {
        breakdown = breakdown.map((item) => {
            if (item.category.includes("Development")) {
                return { ...item, percentage: item.percentage + 10 };
            }
            return item;
        });
        // Normalize percentages
        const total = breakdown.reduce((sum, item) => sum + item.percentage, 0);
        breakdown = breakdown.map((item) => ({
            ...item,
            percentage: Math.round((item.percentage / total) * 100),
        }));
    }
    return breakdown.map((item) => ({
        ...item,
        estimated_value_usd: Math.round(totalValue * (item.percentage / 100)),
    }));
}
/** Generate recommended phases */
function generatePhases(totalValue, engagementType, timeline) {
    const timelineMultiplier = timeline === "accelerated" ? 0.7 : timeline === "extended" ? 1.3 : 1.0;
    const phaseTemplates = {
        assessment: [
            { phase: "Discovery", weeksPct: 0.4, valuePct: 0.5, deliverables: ["Stakeholder interviews", "Data inventory", "Process mapping"] },
            { phase: "Analysis & Recommendations", weeksPct: 0.6, valuePct: 0.5, deliverables: ["Assessment report", "Roadmap", "Business case"] },
        ],
        pilot: [
            { phase: "Design & Setup", weeksPct: 0.25, valuePct: 0.3, deliverables: ["Technical design", "Environment setup", "Data preparation"] },
            { phase: "Build & Configure", weeksPct: 0.5, valuePct: 0.5, deliverables: ["Working prototype", "Integration testing", "User acceptance"] },
            { phase: "Validate & Handoff", weeksPct: 0.25, valuePct: 0.2, deliverables: ["Validation report", "Training", "Scale recommendations"] },
        ],
        implementation: [
            { phase: "Mobilization", weeksPct: 0.15, valuePct: 0.15, deliverables: ["Project plan", "Architecture", "Environment setup"] },
            { phase: "Build", weeksPct: 0.45, valuePct: 0.5, deliverables: ["Core functionality", "Integrations", "Testing"] },
            { phase: "Deploy & Stabilize", weeksPct: 0.25, valuePct: 0.25, deliverables: ["Production deployment", "Performance tuning", "User training"] },
            { phase: "Transition", weeksPct: 0.15, valuePct: 0.1, deliverables: ["Documentation", "Knowledge transfer", "Support handoff"] },
        ],
        transformation: [
            { phase: "Foundation", weeksPct: 0.15, valuePct: 0.15, deliverables: ["Program setup", "Architecture", "Governance"] },
            { phase: "Wave 1 - Quick Wins", weeksPct: 0.25, valuePct: 0.25, deliverables: ["Initial use cases", "Early value demonstration"] },
            { phase: "Wave 2 - Scale", weeksPct: 0.35, valuePct: 0.35, deliverables: ["Enterprise rollout", "Advanced capabilities"] },
            { phase: "Optimize & Sustain", weeksPct: 0.25, valuePct: 0.25, deliverables: ["Center of Excellence", "Continuous improvement"] },
        ],
        managed_service: [
            { phase: "Onboarding", weeksPct: 0.1, valuePct: 0.15, deliverables: ["Service setup", "Baseline establishment", "SLA definition"] },
            { phase: "Steady State Operations", weeksPct: 0.7, valuePct: 0.65, deliverables: ["Ongoing operations", "Support", "Reporting"] },
            { phase: "Optimization Cycles", weeksPct: 0.2, valuePct: 0.2, deliverables: ["Performance improvements", "Feature enhancements"] },
        ],
    };
    const baseDurations = {
        assessment: 4,
        pilot: 12,
        implementation: 24,
        transformation: 52,
        managed_service: 52,
    };
    const totalWeeks = Math.round(baseDurations[engagementType] * timelineMultiplier);
    const template = phaseTemplates[engagementType] || phaseTemplates.implementation;
    return template.map((phase) => ({
        phase: phase.phase,
        duration_weeks: Math.max(1, Math.round(totalWeeks * phase.weeksPct)),
        value_usd: Math.round(totalValue * phase.valuePct),
        deliverables: phase.deliverables,
    }));
}
/** Calculate margin analysis */
function calculateMarginAnalysis(totalValue, engagementType, complexity) {
    // Base margin targets by engagement type
    const baseMargins = {
        assessment: 0.55,
        pilot: 0.45,
        implementation: 0.40,
        transformation: 0.38,
        managed_service: 0.35,
    };
    let marginPercent = baseMargins[engagementType] || 0.40;
    const opportunities = [];
    // Complexity impacts margin negatively
    if (complexity) {
        if (complexity.regulatory_requirements === "critical") {
            marginPercent -= 0.05;
            opportunities.push("Develop regulatory compliance accelerators for reuse");
        }
        if (complexity.legacy_system_integration) {
            marginPercent -= 0.03;
            opportunities.push("Build reusable integration adapters");
        }
        if (complexity.real_time_requirements) {
            marginPercent -= 0.03;
            opportunities.push("Leverage cloud-native real-time infrastructure");
        }
    }
    // Opportunities for all engagements
    opportunities.push("Utilize offshore/nearshore delivery where appropriate");
    if (engagementType !== "assessment") {
        opportunities.push("Deploy proven accelerators and templates");
    }
    const estimatedCost = Math.round(totalValue * (1 - marginPercent));
    const marginRisk = marginPercent >= 0.45 ? "low" : marginPercent >= 0.35 ? "medium" : "high";
    return {
        estimated_cost_usd: estimatedCost,
        estimated_margin_percent: Math.round(marginPercent * 100),
        margin_risk: marginRisk,
        margin_improvement_opportunities: opportunities.slice(0, 4),
    };
}
/** Calculate market rate range */
function calculateMarketRates(totalValue, industry, competitiveSituation) {
    // Market variance by industry
    const industryVariance = {
        manufacturing: 0.15,
        insurance: 0.20,
        aquaculture: 0.25,
        healthcare: 0.20,
        general: 0.20,
    };
    const variance = industryVariance[industry] || 0.20;
    const marketMid = totalValue;
    const marketLow = Math.round(marketMid * (1 - variance));
    const marketHigh = Math.round(marketMid * (1 + variance));
    // Positioning based on competitive situation
    const positioningMap = {
        sole_source: "premium",
        preferred: "premium",
        competitive: "market",
        highly_competitive: "value",
    };
    const position = positioningMap[competitiveSituation] || "market";
    const rationaleMap = {
        premium: "Strong positioning allows for value-based pricing above market rates",
        market: "Competitive environment suggests pricing at market rates",
        value: "Highly competitive situation may require aggressive pricing to win",
    };
    const differentiators = [
        "Industry-specific AI expertise and proven use cases",
        "Accelerators and templates reducing time-to-value",
        "'Leverage not lore' methodology ensuring practical outcomes",
        "End-to-end capability from assessment to managed services",
    ];
    return {
        market_rate_range_usd: { low: marketLow, mid: marketMid, high: marketHigh },
        recommended_position: position,
        positioning_rationale: rationaleMap[position],
        differentiation_points: differentiators.slice(0, 3),
    };
}
/** Calculate expansion potential */
function calculateExpansionPotential(totalValue, engagementType, employeeCount, _industry) {
    const expansionMultipliers = {
        assessment: { y1: 3.0, y2: 2.0, y3: 1.5 },
        pilot: { y1: 2.5, y2: 2.0, y3: 1.5 },
        implementation: { y1: 0.5, y2: 1.0, y3: 1.0 },
        transformation: { y1: 0.3, y2: 0.5, y3: 0.5 },
        managed_service: { y1: 0.2, y2: 0.3, y3: 0.3 },
    };
    const multipliers = expansionMultipliers[engagementType] || { y1: 1.0, y2: 1.0, y3: 1.0 };
    // Company size affects expansion potential
    const sizeMultiplier = employeeCount > 1000 ? 1.5 : employeeCount > 500 ? 1.2 : 1.0;
    const y1 = Math.round(totalValue * multipliers.y1 * sizeMultiplier);
    const y2 = Math.round(totalValue * multipliers.y2 * sizeMultiplier);
    const y3 = Math.round(totalValue * multipliers.y3 * sizeMultiplier);
    const opportunities = [];
    if (engagementType === "assessment" || engagementType === "pilot") {
        opportunities.push("Scale successful pilot to enterprise implementation");
        opportunities.push("Expand to additional departments/business units");
    }
    opportunities.push("Add advanced AI capabilities (computer vision, NLP, predictive)");
    opportunities.push("Transition to managed services for ongoing support");
    opportunities.push("Develop custom industry-specific AI solutions");
    opportunities.push("AI Center of Excellence establishment");
    return {
        year_1_expansion_usd: y1,
        year_2_expansion_usd: y2,
        year_3_expansion_usd: y3,
        total_account_potential_usd: totalValue + y1 + y2 + y3,
        expansion_opportunities: opportunities.slice(0, 4),
    };
}
/** Generate deal risks */
function generateDealRisks(input) {
    const risks = [];
    if (input.competitive_situation === "highly_competitive") {
        risks.push({
            risk: "Intense competition may force price concessions",
            impact_on_value: "high",
            mitigation: "Emphasize differentiated value and proven ROI",
        });
    }
    if (input.client_ai_maturity === "none") {
        risks.push({
            risk: "Client may undervalue AI investment without prior experience",
            impact_on_value: "medium",
            mitigation: "Provide industry case studies and ROI frameworks",
        });
    }
    if (input.complexity_factors?.legacy_system_integration) {
        risks.push({
            risk: "Scope creep from undefined legacy integration requirements",
            impact_on_value: "high",
            mitigation: "Include detailed discovery phase with fixed scope boundaries",
        });
    }
    if (input.timeline_preference === "accelerated") {
        risks.push({
            risk: "Accelerated timeline may stress resources and margin",
            impact_on_value: "medium",
            mitigation: "Ensure premium pricing reflects true acceleration costs",
        });
    }
    if (!input.existing_relationship) {
        risks.push({
            risk: "New client relationship increases delivery uncertainty",
            impact_on_value: "low",
            mitigation: "Build trust through phased engagement approach",
        });
    }
    if (input.scope_dimensions.departments_involved > 3) {
        risks.push({
            risk: "Multiple stakeholders may delay decisions and change scope",
            impact_on_value: "medium",
            mitigation: "Establish clear governance and change control process",
        });
    }
    return risks.slice(0, 5);
}
/** Generate negotiation guidance */
function generateNegotiationGuidance(totalValue, _input) {
    // Walk away at minimum viable margin
    const walkAway = Math.round(totalValue * 0.75);
    const target = totalValue;
    const anchor = Math.round(totalValue * 1.15);
    const levers = [
        "Scope flexibility - phase deliverables to match budget",
        "Timeline - extended timeline can reduce cost",
        "Payment terms - upfront payment discount",
        "Multi-year commitment for reduced rates",
        "Reference/case study rights for discount",
    ];
    const objections = [
        {
            objection: "Price is higher than other vendors",
            response: "Our pricing reflects proven delivery and reduced risk. Our methodology ensures faster time-to-value.",
        },
        {
            objection: "Budget constraints this quarter",
            response: "We can phase the engagement or adjust scope while maintaining core value delivery.",
        },
        {
            objection: "Need to see ROI evidence first",
            response: "We can structure an assessment phase to validate ROI before larger commitment.",
        },
        {
            objection: "Internal team can do this",
            response: "Our accelerators and industry expertise reduce time-to-value by 40% compared to internal builds.",
        },
    ];
    return {
        walk_away_threshold_usd: walkAway,
        target_value_usd: target,
        anchor_value_usd: anchor,
        key_value_levers: levers.slice(0, 4),
        common_objections: objections,
    };
}
/** Generate recommendations */
function generateRecommendations(input, estimate, _positioning) {
    const recommendations = [];
    // Based on competitive situation
    if (input.competitive_situation === "sole_source") {
        recommendations.push("Leverage sole-source position with premium pricing and expanded scope");
    }
    else if (input.competitive_situation === "highly_competitive") {
        recommendations.push("Lead with differentiated value propositions and industry expertise");
    }
    // Based on engagement type
    if (input.engagement_type === "assessment") {
        recommendations.push("Include clear path to implementation to maximize assessment-to-pilot conversion");
    }
    else if (input.engagement_type === "pilot") {
        recommendations.push("Define clear success criteria that justify scale-up investment");
    }
    // Based on client maturity
    if (input.client_ai_maturity === "none" || input.client_ai_maturity === "experimenting") {
        recommendations.push("Include AI education and change management in proposal");
    }
    // Based on relationship
    if (input.existing_relationship) {
        recommendations.push("Leverage relationship for multi-phase or multi-year commitment");
    }
    else {
        recommendations.push("Propose phased approach to build trust and demonstrate value");
    }
    // Value-based recommendations
    if (estimate.confidence === "low") {
        recommendations.push("Include discovery phase to refine scope and reduce estimate uncertainty");
    }
    recommendations.push("Structure deal with performance incentives aligned to client outcomes");
    return recommendations.slice(0, 5);
}
export function estimateDealSize(input) {
    const { company_name, industry, employee_count, engagement_type, scope_dimensions, complexity_factors, timeline_preference, competitive_situation, } = input;
    // Calculate base value
    const basePricing = BASE_PRICING[engagement_type];
    const industryMultiplier = INDUSTRY_MULTIPLIERS[industry] || 1.0;
    const sizeMultiplier = getCompanySizeMultiplier(employee_count);
    const baseValue = Math.round(basePricing.base * industryMultiplier * sizeMultiplier);
    // Calculate adjustments
    const { adjustment: complexityAdjustment, factors: complexityFactors } = calculateComplexityAdjustment(baseValue, complexity_factors);
    const scopeAdjustment = calculateScopeAdjustment(baseValue, scope_dimensions, engagement_type);
    const { adjustment: timelineAdjustment, factor: timelineFactor } = calculateTimelineAdjustment(baseValue + complexityAdjustment + scopeAdjustment, timeline_preference);
    // Calculate total
    const totalValue = baseValue + complexityAdjustment + scopeAdjustment + timelineAdjustment;
    // Calculate value range
    const confidenceFactors = [
        scope_dimensions.custom_development_required ? 0.8 : 1.0,
        complexity_factors?.legacy_system_integration ? 0.9 : 1.0,
        input.client_ai_maturity === "none" ? 0.9 : 1.0,
    ];
    const confidenceScore = confidenceFactors.reduce((a, b) => a * b, 1);
    const confidence = confidenceScore >= 0.9 ? "high" : confidenceScore >= 0.75 ? "medium" : "low";
    const variancePercent = confidence === "high" ? 0.1 : confidence === "medium" ? 0.2 : 0.3;
    const valueLow = Math.round(totalValue * (1 - variancePercent));
    const valueHigh = Math.round(totalValue * (1 + variancePercent));
    // Compile pricing factors
    const pricingFactors = [...complexityFactors];
    if (timelineFactor) {
        pricingFactors.push(timelineFactor);
    }
    if (sizeMultiplier !== 1.0) {
        pricingFactors.push({
            factor: "Company Size",
            impact: sizeMultiplier > 1 ? "increases" : "decreases",
            adjustment_percent: Math.round((sizeMultiplier - 1) * 100),
            rationale: `${employee_count} employees indicates ${sizeMultiplier > 1 ? "larger" : "smaller"} engagement scope`,
        });
    }
    if (industryMultiplier !== 1.0) {
        pricingFactors.push({
            factor: "Industry Premium",
            impact: "increases",
            adjustment_percent: Math.round((industryMultiplier - 1) * 100),
            rationale: `${industry} industry commands ${Math.round((industryMultiplier - 1) * 100)}% premium`,
        });
    }
    // Generate deal structure
    const servicesBreakdown = generateServicesBreakdown(totalValue, engagement_type, scope_dimensions.custom_development_required);
    const phases = generatePhases(totalValue, engagement_type, timeline_preference);
    const paymentStructure = engagement_type === "managed_service"
        ? "Monthly recurring with annual commitment"
        : engagement_type === "transformation"
            ? "Milestone-based payments aligned with phase completion"
            : "50% upfront, 25% at midpoint, 25% at completion";
    // Calculate other analyses
    const marginAnalysis = calculateMarginAnalysis(totalValue, engagement_type, complexity_factors);
    const competitivePositioning = calculateMarketRates(totalValue, industry, competitive_situation);
    const expansionPotential = calculateExpansionPotential(totalValue, engagement_type, employee_count, industry);
    const dealRisks = generateDealRisks(input);
    const negotiationGuidance = generateNegotiationGuidance(totalValue, input);
    const estimate = {
        base_value_usd: baseValue,
        complexity_adjustment_usd: complexityAdjustment,
        scope_adjustment_usd: scopeAdjustment,
        timeline_adjustment_usd: timelineAdjustment,
        total_estimated_value_usd: totalValue,
        value_range: {
            low_usd: valueLow,
            mid_usd: totalValue,
            high_usd: valueHigh,
        },
        confidence,
    };
    const recommendations = generateRecommendations(input, estimate, competitivePositioning);
    return {
        company_name,
        industry,
        engagement_type,
        estimate,
        deal_structure: {
            services_breakdown: servicesBreakdown,
            recommended_phases: phases,
            payment_structure: paymentStructure,
        },
        pricing_factors: pricingFactors,
        margin_analysis: marginAnalysis,
        competitive_positioning: competitivePositioning,
        expansion_potential: expansionPotential,
        deal_risks: dealRisks,
        negotiation_guidance: negotiationGuidance,
        recommendations,
        methodology_note: "Deal sizing follows Good AI methodology: evidence-based pricing using industry benchmarks, complexity analysis, and market positioning. Estimates include risk-adjusted ranges to account for scope uncertainty.",
    };
}
//# sourceMappingURL=estimate_deal_size.js.map