/**
 * Good AI - Assess Implementation Risk Tool
 * Comprehensive risk assessment for AI project implementations
 */
import { z } from "zod";
// ============================================
// Input Schema
// ============================================
export const AssessImplementationRiskInputSchema = z.object({
    project_name: z.string().min(1).max(200),
    company_name: z.string().min(1).max(200),
    industry: z.enum([
        "manufacturing",
        "insurance",
        "aquaculture",
        "healthcare",
        "general",
    ]),
    // Project characteristics
    project_type: z.enum([
        "assessment",
        "pilot",
        "implementation",
        "transformation",
        "managed_service",
    ]),
    estimated_duration_weeks: z.number().min(1).max(260),
    estimated_budget_usd: z.number().min(0),
    // Technical factors
    technical_factors: z.object({
        technology_maturity: z.enum(["proven", "emerging", "experimental"]).default("proven"),
        integration_complexity: z.enum(["low", "medium", "high"]).default("medium"),
        data_quality_rating: z.number().min(0).max(10).default(5),
        legacy_system_involvement: z.boolean().default(false),
        custom_development_required: z.boolean().default(false),
        ai_model_type: z.enum([
            "off_the_shelf",
            "fine_tuned",
            "custom_trained",
            "novel_research",
        ]).default("off_the_shelf"),
    }),
    // Organizational factors
    organizational_factors: z.object({
        executive_sponsorship: z.enum(["strong", "moderate", "weak", "none"]).default("moderate"),
        change_readiness: z.enum(["high", "medium", "low"]).default("medium"),
        prior_ai_experience: z.enum(["extensive", "some", "limited", "none"]).default("limited"),
        dedicated_resources: z.boolean().default(false),
        cross_functional_alignment: z.enum(["strong", "moderate", "weak"]).default("moderate"),
    }),
    // External factors
    external_factors: z.object({
        regulatory_requirements: z.enum(["none", "standard", "strict", "critical"]).default("none"),
        vendor_dependencies: z.number().min(0).max(20).default(0),
        market_pressure: z.enum(["low", "medium", "high"]).default("medium"),
        economic_uncertainty: z.enum(["low", "medium", "high"]).default("medium"),
    }).optional(),
    // Team factors
    team_factors: z.object({
        team_experience_level: z.enum(["expert", "experienced", "mixed", "junior"]).default("experienced"),
        team_stability: z.enum(["stable", "moderate_turnover", "high_turnover"]).default("stable"),
        skill_gaps_identified: z.array(z.string()).max(10).default([]),
        remote_team_percentage: z.number().min(0).max(100).default(0),
    }).optional(),
    // Known issues
    known_issues: z.array(z.object({
        issue: z.string().max(500),
        severity: z.enum(["low", "medium", "high", "critical"]),
        status: z.enum(["open", "in_progress", "mitigated"]),
    })).max(20).optional(),
});
// ============================================
// Tool Definition
// ============================================
export const ASSESS_IMPLEMENTATION_RISK_TOOL = {
    name: "assess_implementation_risk",
    description: "Assesses implementation risks for AI projects across technical, organizational, external, and execution dimensions. Provides risk scores, mitigation strategies, and governance recommendations.",
    inputSchema: {
        type: "object",
        properties: {
            project_name: { type: "string", description: "Name of the project" },
            company_name: { type: "string", description: "Client company name" },
            industry: {
                type: "string",
                enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
            },
            project_type: {
                type: "string",
                enum: ["assessment", "pilot", "implementation", "transformation", "managed_service"],
            },
            estimated_duration_weeks: { type: "number" },
            estimated_budget_usd: { type: "number" },
            technical_factors: { type: "object", description: "Technical risk factors" },
            organizational_factors: { type: "object", description: "Organizational risk factors" },
            external_factors: { type: "object", description: "External risk factors" },
            team_factors: { type: "object", description: "Team-related risk factors" },
            known_issues: { type: "array", description: "Known issues to consider" },
        },
        required: [
            "project_name",
            "company_name",
            "industry",
            "project_type",
            "estimated_duration_weeks",
            "estimated_budget_usd",
            "technical_factors",
            "organizational_factors",
        ],
    },
};
// ============================================
// Implementation
// ============================================
function getRiskLevel(score) {
    if (score >= 8) {
        return "critical";
    }
    if (score >= 6) {
        return "high";
    }
    if (score >= 4) {
        return "medium";
    }
    return "low";
}
function calculateTechnicalRisk(factors, projectType, durationWeeks) {
    const riskFactors = [];
    let totalScore = 0;
    // Technology maturity
    const maturityScores = { proven: 1, emerging: 3, experimental: 5 };
    const maturityScore = maturityScores[factors.technology_maturity];
    if (maturityScore > 1) {
        riskFactors.push({
            factor: "Technology Maturity",
            impact: maturityScore,
            description: `${factors.technology_maturity} technology may have limited support and documentation`,
        });
    }
    totalScore += maturityScore;
    // Integration complexity
    const integrationScores = { low: 1, medium: 2, high: 4 };
    const integrationScore = integrationScores[factors.integration_complexity];
    if (integrationScore > 1) {
        riskFactors.push({
            factor: "Integration Complexity",
            impact: integrationScore,
            description: `${factors.integration_complexity} integration complexity increases implementation risk`,
        });
    }
    totalScore += integrationScore;
    // Data quality
    const dataQualityRisk = Math.max(0, (10 - factors.data_quality_rating) / 2);
    if (dataQualityRisk > 1) {
        riskFactors.push({
            factor: "Data Quality",
            impact: dataQualityRisk,
            description: `Data quality rating of ${factors.data_quality_rating}/10 may impact AI model performance`,
        });
    }
    totalScore += dataQualityRisk;
    // Legacy systems
    if (factors.legacy_system_involvement) {
        riskFactors.push({
            factor: "Legacy Systems",
            impact: 2,
            description: "Legacy system integration adds complexity and potential compatibility issues",
        });
        totalScore += 2;
    }
    // Custom development
    if (factors.custom_development_required) {
        riskFactors.push({
            factor: "Custom Development",
            impact: 2,
            description: "Custom development increases timeline uncertainty and technical risk",
        });
        totalScore += 2;
    }
    // AI model type
    const modelScores = { off_the_shelf: 0, fine_tuned: 1, custom_trained: 2, novel_research: 4 };
    const modelScore = modelScores[factors.ai_model_type];
    if (modelScore > 0) {
        riskFactors.push({
            factor: "AI Model Complexity",
            impact: modelScore,
            description: `${factors.ai_model_type.replace(/_/g, " ")} models require specialized expertise`,
        });
    }
    totalScore += modelScore;
    // Project duration risk (longer = more risk)
    if (durationWeeks > 24) {
        const durationRisk = Math.min(2, (durationWeeks - 24) / 12);
        riskFactors.push({
            factor: "Long Duration",
            impact: durationRisk,
            description: `${durationWeeks}-week duration increases exposure to scope creep and changes`,
        });
        totalScore += durationRisk;
    }
    // Normalize to 1-10 scale
    const normalizedScore = Math.min(10, Math.max(1, totalScore / 2));
    return {
        score: Math.round(normalizedScore * 10) / 10,
        level: getRiskLevel(normalizedScore),
        factors: riskFactors,
    };
}
function calculateOrganizationalRisk(factors, projectType) {
    const riskFactors = [];
    let totalScore = 0;
    // Executive sponsorship
    const sponsorshipScores = { strong: 0, moderate: 1, weak: 3, none: 5 };
    const sponsorshipScore = sponsorshipScores[factors.executive_sponsorship];
    if (sponsorshipScore > 0) {
        riskFactors.push({
            factor: "Executive Sponsorship",
            impact: sponsorshipScore,
            description: `${factors.executive_sponsorship} sponsorship may limit organizational support`,
        });
    }
    totalScore += sponsorshipScore;
    // Change readiness
    const readinessScores = { high: 0, medium: 2, low: 4 };
    const readinessScore = readinessScores[factors.change_readiness];
    if (readinessScore > 0) {
        riskFactors.push({
            factor: "Change Readiness",
            impact: readinessScore,
            description: `${factors.change_readiness} change readiness may slow adoption`,
        });
    }
    totalScore += readinessScore;
    // Prior AI experience
    const experienceScores = { extensive: 0, some: 1, limited: 2, none: 4 };
    const experienceScore = experienceScores[factors.prior_ai_experience];
    if (experienceScore > 0) {
        riskFactors.push({
            factor: "AI Experience",
            impact: experienceScore,
            description: `${factors.prior_ai_experience} AI experience may require additional education`,
        });
    }
    totalScore += experienceScore;
    // Dedicated resources
    if (!factors.dedicated_resources) {
        riskFactors.push({
            factor: "Resource Allocation",
            impact: 2,
            description: "Lack of dedicated resources may cause delays and attention splitting",
        });
        totalScore += 2;
    }
    // Cross-functional alignment
    const alignmentScores = { strong: 0, moderate: 1, weak: 3 };
    const alignmentScore = alignmentScores[factors.cross_functional_alignment];
    if (alignmentScore > 0) {
        riskFactors.push({
            factor: "Cross-functional Alignment",
            impact: alignmentScore,
            description: `${factors.cross_functional_alignment} alignment may cause coordination challenges`,
        });
    }
    totalScore += alignmentScore;
    // Transformation projects have higher org risk
    if (projectType === "transformation") {
        totalScore += 1;
        riskFactors.push({
            factor: "Transformation Scope",
            impact: 1,
            description: "Enterprise transformation requires sustained organizational commitment",
        });
    }
    const normalizedScore = Math.min(10, Math.max(1, totalScore / 1.5));
    return {
        score: Math.round(normalizedScore * 10) / 10,
        level: getRiskLevel(normalizedScore),
        factors: riskFactors,
    };
}
function calculateExternalRisk(factors, industry) {
    const riskFactors = [];
    let totalScore = 0;
    const externalFactors = factors || {
        regulatory_requirements: "none",
        vendor_dependencies: 0,
        market_pressure: "medium",
        economic_uncertainty: "medium",
    };
    // Regulatory requirements
    const regulatoryScores = { none: 0, standard: 1, strict: 3, critical: 5 };
    const regulatoryScore = regulatoryScores[externalFactors.regulatory_requirements];
    if (regulatoryScore > 0) {
        riskFactors.push({
            factor: "Regulatory Requirements",
            impact: regulatoryScore,
            description: `${externalFactors.regulatory_requirements} regulatory requirements add compliance burden`,
        });
    }
    totalScore += regulatoryScore;
    // Vendor dependencies
    if (externalFactors.vendor_dependencies > 2) {
        const vendorRisk = Math.min(3, externalFactors.vendor_dependencies / 3);
        riskFactors.push({
            factor: "Vendor Dependencies",
            impact: vendorRisk,
            description: `${externalFactors.vendor_dependencies} vendor dependencies increase coordination complexity`,
        });
        totalScore += vendorRisk;
    }
    // Market pressure
    const pressureScores = { low: 0, medium: 1, high: 2 };
    const pressureScore = pressureScores[externalFactors.market_pressure];
    if (pressureScore > 0) {
        riskFactors.push({
            factor: "Market Pressure",
            impact: pressureScore,
            description: `${externalFactors.market_pressure} market pressure may force timeline compromises`,
        });
    }
    totalScore += pressureScore;
    // Economic uncertainty
    const economicScores = { low: 0, medium: 1, high: 3 };
    const economicScore = economicScores[externalFactors.economic_uncertainty];
    if (economicScore > 0) {
        riskFactors.push({
            factor: "Economic Uncertainty",
            impact: economicScore,
            description: `${externalFactors.economic_uncertainty} economic uncertainty may impact funding/priorities`,
        });
    }
    totalScore += economicScore;
    // Industry-specific risks
    const industryRisks = {
        healthcare: { factor: "Healthcare Compliance", impact: 2, description: "HIPAA and patient data requirements add complexity" },
        insurance: { factor: "Insurance Regulations", impact: 2, description: "Regulatory oversight requires careful compliance" },
        manufacturing: { factor: "Operational Continuity", impact: 1, description: "Production impacts require careful scheduling" },
        aquaculture: { factor: "Environmental Factors", impact: 1, description: "Environmental conditions may affect implementation" },
        general: { factor: "General Market", impact: 0, description: "" },
    };
    const industryRisk = industryRisks[industry];
    if (industryRisk && industryRisk.impact > 0) {
        riskFactors.push(industryRisk);
        totalScore += industryRisk.impact;
    }
    const normalizedScore = Math.min(10, Math.max(1, totalScore / 1.2));
    return {
        score: Math.round(normalizedScore * 10) / 10,
        level: getRiskLevel(normalizedScore),
        factors: riskFactors,
    };
}
function calculateExecutionRisk(teamFactors, budgetUsd, durationWeeks, knownIssues) {
    const riskFactors = [];
    let totalScore = 0;
    const team = teamFactors || {
        team_experience_level: "experienced",
        team_stability: "stable",
        skill_gaps_identified: [],
        remote_team_percentage: 0,
    };
    // Team experience
    const experienceScores = { expert: 0, experienced: 1, mixed: 2, junior: 4 };
    const experienceScore = experienceScores[team.team_experience_level];
    if (experienceScore > 0) {
        riskFactors.push({
            factor: "Team Experience",
            impact: experienceScore,
            description: `${team.team_experience_level} team may require additional oversight`,
        });
    }
    totalScore += experienceScore;
    // Team stability
    const stabilityScores = { stable: 0, moderate_turnover: 2, high_turnover: 4 };
    const stabilityScore = stabilityScores[team.team_stability];
    if (stabilityScore > 0) {
        riskFactors.push({
            factor: "Team Stability",
            impact: stabilityScore,
            description: `${team.team_stability.replace(/_/g, " ")} impacts knowledge retention`,
        });
    }
    totalScore += stabilityScore;
    // Skill gaps
    if (team.skill_gaps_identified.length > 0) {
        const skillGapRisk = Math.min(3, team.skill_gaps_identified.length);
        riskFactors.push({
            factor: "Skill Gaps",
            impact: skillGapRisk,
            description: `${team.skill_gaps_identified.length} identified skill gaps: ${team.skill_gaps_identified.slice(0, 2).join(", ")}`,
        });
        totalScore += skillGapRisk;
    }
    // Remote team
    if (team.remote_team_percentage > 50) {
        const remoteRisk = Math.min(2, (team.remote_team_percentage - 50) / 25);
        riskFactors.push({
            factor: "Remote Team",
            impact: remoteRisk,
            description: `${team.remote_team_percentage}% remote team adds coordination complexity`,
        });
        totalScore += remoteRisk;
    }
    // Budget risk (very large or very small budgets)
    if (budgetUsd > 1000000) {
        const budgetRisk = Math.min(2, budgetUsd / 2000000);
        riskFactors.push({
            factor: "Large Budget",
            impact: budgetRisk,
            description: "Large budget projects have more exposure and scrutiny",
        });
        totalScore += budgetRisk;
    }
    else if (budgetUsd < 50000 && durationWeeks > 8) {
        riskFactors.push({
            factor: "Constrained Budget",
            impact: 2,
            description: "Limited budget relative to duration may cause resource constraints",
        });
        totalScore += 2;
    }
    // Known issues
    const issues = knownIssues || [];
    const criticalIssues = issues.filter((i) => i.severity === "critical" && i.status !== "mitigated").length;
    const highIssues = issues.filter((i) => i.severity === "high" && i.status !== "mitigated").length;
    if (criticalIssues > 0) {
        riskFactors.push({
            factor: "Critical Issues",
            impact: criticalIssues * 2,
            description: `${criticalIssues} unresolved critical issue(s) require immediate attention`,
        });
        totalScore += criticalIssues * 2;
    }
    if (highIssues > 0) {
        riskFactors.push({
            factor: "High Severity Issues",
            impact: highIssues,
            description: `${highIssues} high severity issue(s) need to be addressed`,
        });
        totalScore += highIssues;
    }
    const normalizedScore = Math.min(10, Math.max(1, totalScore / 1.5));
    return {
        score: Math.round(normalizedScore * 10) / 10,
        level: getRiskLevel(normalizedScore),
        factors: riskFactors,
    };
}
function generateIdentifiedRisks(categories, _input) {
    const risks = [];
    let riskId = 1;
    // Add risks from each category
    const categoryMappings = [
        { category: "technical", data: categories.technical_risk },
        { category: "organizational", data: categories.organizational_risk },
        { category: "external", data: categories.external_risk },
        { category: "execution", data: categories.execution_risk },
    ];
    for (const { category, data } of categoryMappings) {
        for (const factor of data.factors) {
            const probability = factor.impact >= 3 ? "high" : factor.impact >= 2 ? "medium" : "low";
            const impact = factor.impact >= 4 ? "critical" : factor.impact >= 3 ? "high" : factor.impact >= 2 ? "medium" : "low";
            risks.push({
                id: `RISK-${String(riskId).padStart(3, "0")}`,
                category,
                title: factor.factor,
                description: factor.description,
                probability,
                impact,
                risk_score: factor.impact,
                mitigation_strategy: generateMitigation(factor.factor, category),
                contingency_plan: generateContingency(factor.factor, category),
                owner_recommendation: getOwnerRecommendation(category),
                early_warning_indicators: getEarlyWarnings(factor.factor),
            });
            riskId++;
        }
    }
    // Sort by risk score descending
    return risks.sort((a, b) => b.risk_score - a.risk_score);
}
function generateMitigation(factor, category) {
    const mitigations = {
        "Technology Maturity": "Conduct thorough proof-of-concept, engage vendor support, maintain fallback options",
        "Integration Complexity": "Plan detailed integration testing, allocate buffer time, create rollback procedures",
        "Data Quality": "Implement data quality checks, clean data before training, establish data governance",
        "Legacy Systems": "Document legacy interfaces, plan incremental integration, maintain parallel operations",
        "Custom Development": "Use agile methodology, implement continuous testing, plan for iterations",
        "AI Model Complexity": "Engage ML specialists, plan for model monitoring, document model decisions",
        "Long Duration": "Implement phase gates, regular scope reviews, maintain change control",
        "Executive Sponsorship": "Strengthen executive engagement, regular steering meetings, visible quick wins",
        "Change Readiness": "Increase change management, conduct training early, identify champions",
        "AI Experience": "Provide AI education, pair with experienced consultants, build internal capability",
        "Resource Allocation": "Secure dedicated resources, establish clear priorities, protect project time",
        "Cross-functional Alignment": "Regular cross-team meetings, shared objectives, escalation process",
        "Regulatory Requirements": "Early compliance review, engage regulatory experts, build compliance into design",
        "Vendor Dependencies": "Regular vendor coordination, SLA agreements, maintain alternatives",
        "Market Pressure": "Prioritize critical features, communicate trade-offs, manage expectations",
        "Economic Uncertainty": "Flexible scoping, value-based prioritization, demonstrate ROI early",
        "Team Experience": "Additional oversight, knowledge sharing sessions, documentation focus",
        "Team Stability": "Knowledge documentation, cross-training, retention incentives",
        "Skill Gaps": "Training programs, external expertise, hiring plan",
        "Remote Team": "Enhanced communication tools, clear processes, regular check-ins",
        "Large Budget": "Rigorous governance, regular budget reviews, phased funding",
        "Constrained Budget": "Strict prioritization, scope management, efficiency focus",
        "Critical Issues": "Immediate escalation, dedicated resolution team, daily progress tracking",
        "High Severity Issues": "Priority resolution, escalation path, impact monitoring",
    };
    return mitigations[factor] || `Develop specific mitigation plan for ${factor} in ${category} category`;
}
function generateContingency(factor, _category) {
    const contingencies = {
        "Technology Maturity": "Prepare alternative technology options, maintain vendor flexibility",
        "Integration Complexity": "Have rollback plan ready, maintain parallel systems during transition",
        "Data Quality": "Prepare data remediation path, consider synthetic data for training",
        "Legacy Systems": "Plan for extended parallel operation, prepare manual workarounds",
        "Custom Development": "Define minimum viable scope, prepare to pivot approach",
        "AI Model Complexity": "Have simpler model alternatives, prepare rule-based fallbacks",
        "Long Duration": "Define phase exit criteria, prepare for scope reduction",
        "Executive Sponsorship": "Identify backup sponsors, prepare compelling business case",
        "Change Readiness": "Plan extended adoption timeline, prepare phased rollout",
        "AI Experience": "Engage external expertise, extend training timeline",
        "Resource Allocation": "Identify backup resources, prepare scope reduction options",
        "Cross-functional Alignment": "Escalation to steering committee, prepare independent execution path",
        "Regulatory Requirements": "Prepare compliance remediation plan, consider phased compliance",
        "Vendor Dependencies": "Identify alternative vendors, prepare in-house alternatives",
        "Market Pressure": "Define minimum viable product, prepare accelerated timeline option",
        "Economic Uncertainty": "Prepare reduced scope option, identify funding alternatives",
        "Team Experience": "Engage additional senior resources, extend timeline",
        "Team Stability": "Accelerate documentation, cross-train immediately",
        "Skill Gaps": "Fast-track hiring, engage contractors",
        "Remote Team": "Plan on-site sessions for critical phases",
        "Large Budget": "Define value preservation options, prepare phased funding approach",
        "Constrained Budget": "Define scope reduction options, identify additional funding sources",
        "Critical Issues": "Prepare project pause criteria, define recovery process",
        "High Severity Issues": "Prepare impact limitation steps, define escalation criteria",
    };
    return contingencies[factor] || `Define contingency response for ${factor} if mitigation fails`;
}
function getOwnerRecommendation(category) {
    const owners = {
        technical: "Technical Lead / Solution Architect",
        organizational: "Project Sponsor / Change Manager",
        external: "Program Manager / Legal/Compliance",
        execution: "Project Manager / Delivery Lead",
    };
    return owners[category] || "Project Manager";
}
function getEarlyWarnings(factor) {
    const warnings = {
        "Technology Maturity": ["Unexpected technical blockers", "Vendor support delays", "Documentation gaps"],
        "Integration Complexity": ["Integration testing failures", "Unexpected data format issues", "Performance degradation"],
        "Data Quality": ["Model accuracy below targets", "Missing data fields", "Inconsistent data formats"],
        "Executive Sponsorship": ["Delayed approvals", "Reduced meeting attendance", "Budget questions"],
        "Change Readiness": ["User resistance signals", "Training attendance drops", "Negative feedback themes"],
        "Team Experience": ["Quality issues in deliverables", "Missed deadlines", "Excessive questions"],
        "Team Stability": ["Departure announcements", "Reduced engagement", "Knowledge gaps emerging"],
    };
    return warnings[factor] || ["Deviation from plan", "Stakeholder concerns raised", "KPI targets missed"];
}
function generateRiskHeatmap(risks) {
    return {
        high_probability_high_impact: risks
            .filter((r) => r.probability === "high" && (r.impact === "high" || r.impact === "critical"))
            .map((r) => r.title),
        high_probability_low_impact: risks
            .filter((r) => r.probability === "high" && (r.impact === "low" || r.impact === "medium"))
            .map((r) => r.title),
        low_probability_high_impact: risks
            .filter((r) => (r.probability === "low" || r.probability === "medium") && (r.impact === "high" || r.impact === "critical"))
            .map((r) => r.title),
        low_probability_low_impact: risks
            .filter((r) => (r.probability === "low" || r.probability === "medium") && (r.impact === "low" || r.impact === "medium"))
            .map((r) => r.title),
    };
}
function generateMitigationPlan(risks) {
    const highRisks = risks.filter((r) => r.risk_score >= 3);
    const mediumRisks = risks.filter((r) => r.risk_score >= 2 && r.risk_score < 3);
    return {
        immediate_actions: highRisks.slice(0, 3).map((r) => ({
            action: r.mitigation_strategy,
            priority: "high",
            effort: r.risk_score >= 4 ? "High effort - dedicated resources needed" : "Medium effort",
        })),
        short_term_actions: [
            ...highRisks.slice(3).map((r) => ({
                action: r.mitigation_strategy,
                priority: "high",
                timeline: "Weeks 1-2",
            })),
            ...mediumRisks.slice(0, 3).map((r) => ({
                action: r.mitigation_strategy,
                priority: "medium",
                timeline: "Weeks 2-4",
            })),
        ],
        ongoing_monitoring: [
            { item: "Risk register review", frequency: "Weekly", owner: "Project Manager" },
            { item: "Technical health check", frequency: "Bi-weekly", owner: "Technical Lead" },
            { item: "Stakeholder sentiment", frequency: "Weekly", owner: "Change Manager" },
            { item: "Budget and timeline tracking", frequency: "Weekly", owner: "Project Manager" },
        ],
    };
}
function generateScenarios(overallScore, risks) {
    const highRiskCount = risks.filter((r) => r.risk_score >= 3).length;
    const bestCaseProb = overallScore <= 3 ? 35 : overallScore <= 5 ? 25 : overallScore <= 7 ? 15 : 10;
    const worstCaseProb = overallScore <= 3 ? 10 : overallScore <= 5 ? 20 : overallScore <= 7 ? 30 : 40;
    const expectedProb = 100 - bestCaseProb - worstCaseProb;
    return {
        best_case: {
            probability: bestCaseProb,
            description: "Project completes ahead of schedule with full scope delivered and high stakeholder satisfaction",
            conditions: [
                "All high risks are effectively mitigated",
                "Strong executive support maintained throughout",
                "No major external disruptions",
                "Team performs above expectations",
            ],
        },
        expected_case: {
            probability: expectedProb,
            description: "Project completes on schedule with core scope delivered, some risks materialize but are managed",
            conditions: [
                "Some risks materialize but are handled through contingency",
                "Minor scope adjustments needed",
                "Normal project challenges encountered",
                "Steady stakeholder support",
            ],
        },
        worst_case: {
            probability: worstCaseProb,
            description: "Project faces significant delays or scope reduction due to multiple risks materializing",
            conditions: [
                `Multiple high-impact risks materialize (${highRiskCount} identified)`,
                "External factors create additional pressure",
                "Stakeholder support diminishes",
                "Technical challenges exceed estimates",
            ],
            recovery_options: [
                "Scope reduction to minimum viable deliverables",
                "Timeline extension with revised milestones",
                "Additional resource injection",
                "Executive intervention and reprioritization",
            ],
        },
    };
}
function generateRecommendations(overallScore, overallLevel, categories, risks) {
    let proceedRec;
    let rationale;
    if (overallScore <= 3) {
        proceedRec = "proceed";
        rationale = "Risk profile is manageable with standard project governance. No significant blockers identified.";
    }
    else if (overallScore <= 5) {
        proceedRec = "proceed_with_caution";
        rationale = "Moderate risks require active management. Proceed with enhanced monitoring and mitigation plans in place.";
    }
    else if (overallScore <= 7) {
        proceedRec = "reassess";
        rationale = "Significant risks identified that may impact project success. Recommend addressing key risks before proceeding.";
    }
    else {
        proceedRec = "do_not_proceed";
        rationale = "Critical risk level indicates high probability of project failure. Recommend fundamental reassessment.";
    }
    const highRisks = risks.filter((r) => r.risk_score >= 3);
    const criticalCategory = Object.entries(categories)
        .sort(([, a], [, b]) => b.score - a.score)[0];
    return {
        proceed_recommendation: proceedRec,
        rationale,
        key_success_factors: [
            "Sustained executive sponsorship and visibility",
            "Proactive risk monitoring and escalation",
            "Clear scope boundaries and change control",
            "Regular stakeholder communication",
            `Focus on ${criticalCategory[0].replace("_risk", "")} risk mitigation`,
        ],
        critical_dependencies: highRisks.slice(0, 3).map((r) => `Resolution of ${r.title} risk`),
        risk_acceptance_areas: risks
            .filter((r) => r.risk_score < 2)
            .slice(0, 3)
            .map((r) => r.title),
    };
}
function generateGovernance(overallLevel, projectType) {
    const frequencyMap = {
        critical: "Weekly steering committee, daily standups",
        high: "Bi-weekly steering committee, weekly status",
        medium: "Monthly steering committee, weekly status",
        low: "Monthly steering committee, bi-weekly status",
    };
    return {
        review_frequency: frequencyMap[overallLevel] || frequencyMap.medium,
        escalation_triggers: [
            "Any risk probability or impact increases",
            "Budget variance exceeds 10%",
            "Timeline slippage exceeds 1 week",
            "Stakeholder satisfaction drops below threshold",
            "Critical path task at risk",
        ],
        stakeholder_communication: projectType === "transformation"
            ? "Weekly updates to executive team, monthly all-hands"
            : "Weekly status reports, bi-weekly stakeholder meetings",
        risk_reporting_cadence: overallLevel === "critical" || overallLevel === "high"
            ? "Weekly risk report to steering committee"
            : "Bi-weekly risk report to project sponsor",
    };
}
export function assessImplementationRisk(input) {
    const { project_name, company_name, industry, project_type, estimated_duration_weeks, estimated_budget_usd, technical_factors, organizational_factors, external_factors, team_factors, known_issues, } = input;
    // Calculate risk categories
    const technicalRisk = calculateTechnicalRisk(technical_factors, project_type, estimated_duration_weeks);
    const organizationalRisk = calculateOrganizationalRisk(organizational_factors, project_type);
    const externalRisk = calculateExternalRisk(external_factors, industry);
    const executionRisk = calculateExecutionRisk(team_factors, estimated_budget_usd, estimated_duration_weeks, known_issues);
    const riskCategories = {
        technical_risk: technicalRisk,
        organizational_risk: organizationalRisk,
        external_risk: externalRisk,
        execution_risk: executionRisk,
    };
    // Calculate overall risk
    const categoryScores = [
        technicalRisk.score * 0.3,
        organizationalRisk.score * 0.25,
        externalRisk.score * 0.2,
        executionRisk.score * 0.25,
    ];
    const overallScore = Math.round(categoryScores.reduce((a, b) => a + b, 0) * 10) / 10;
    const overallLevel = getRiskLevel(overallScore);
    // Determine key risk drivers
    const keyDrivers = Object.entries(riskCategories)
        .filter(([, cat]) => cat.score >= 4)
        .map(([name]) => name.replace("_risk", "").replace("_", " "));
    // Generate identified risks
    const identifiedRisks = generateIdentifiedRisks(riskCategories, input);
    // Generate other outputs
    const riskHeatmap = generateRiskHeatmap(identifiedRisks);
    const mitigationPlan = generateMitigationPlan(identifiedRisks);
    const scenarios = generateScenarios(overallScore, identifiedRisks);
    const recommendations = generateRecommendations(overallScore, overallLevel, riskCategories, identifiedRisks);
    const governance = generateGovernance(overallLevel, project_type);
    return {
        project_name,
        company_name,
        assessment_date: new Date().toISOString().split("T")[0],
        risk_summary: {
            overall_risk_score: overallScore,
            overall_risk_level: overallLevel,
            risk_trend: "stable", // Would need historical data for actual trend
            confidence_in_success: overallScore <= 4 ? "high" : overallScore <= 6 ? "medium" : "low",
            key_risk_drivers: keyDrivers.length > 0 ? keyDrivers : ["No critical risk drivers identified"],
        },
        risk_categories: riskCategories,
        identified_risks: identifiedRisks,
        risk_heatmap: riskHeatmap,
        mitigation_plan: mitigationPlan,
        scenarios,
        recommendations,
        governance_recommendations: governance,
        methodology_note: "Risk assessment follows Good AI methodology with structured evaluation across technical, organizational, external, and execution dimensions. Scores are calculated using weighted factors and industry benchmarks. Regular reassessment is recommended as project conditions change.",
    };
}
//# sourceMappingURL=assess_implementation_risk.js.map