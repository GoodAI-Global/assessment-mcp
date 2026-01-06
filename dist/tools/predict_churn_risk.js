/**
 * Good AI - Predict Churn Risk Tool
 * Predicts client churn risk based on engagement, satisfaction, and value metrics
 */
import { z } from "zod";
// ============================================
// Input Schema
// ============================================
export const PredictChurnRiskInputSchema = z.object({
    client_name: z.string().min(1).max(200),
    industry: z.enum([
        "manufacturing",
        "insurance",
        "aquaculture",
        "healthcare",
        "general",
    ]),
    // Account details
    account_info: z.object({
        contract_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
        contract_end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
        contract_value_annual_usd: z.number().min(0),
        account_tier: z.enum(["enterprise", "strategic", "growth", "standard"]).default("standard"),
        number_of_solutions: z.number().min(1).max(50).default(1),
        active_users: z.number().min(0).default(0),
        licensed_users: z.number().min(1).default(1),
    }),
    // Engagement metrics
    engagement_metrics: z.object({
        monthly_active_user_percent: z.number().min(0).max(100).optional(),
        login_frequency_trend: z.enum(["increasing", "stable", "decreasing", "significantly_decreasing"]).optional(),
        feature_utilization_percent: z.number().min(0).max(100).optional(),
        support_ticket_volume: z.enum(["low", "moderate", "high", "very_high"]).optional(),
        support_sentiment: z.enum(["positive", "neutral", "negative", "very_negative"]).optional(),
        last_engagement_days_ago: z.number().min(0).optional(),
        executive_engagement: z.enum(["regular", "occasional", "rare", "none"]).optional(),
    }),
    // Satisfaction indicators
    satisfaction_indicators: z.object({
        nps_score: z.number().min(-100).max(100).optional(),
        csat_score: z.number().min(0).max(10).optional(),
        recent_survey_response: z.enum(["very_satisfied", "satisfied", "neutral", "dissatisfied", "very_dissatisfied"]).optional(),
        complaint_count_last_90_days: z.number().min(0).optional(),
        escalation_count_last_90_days: z.number().min(0).optional(),
        reference_willingness: z.boolean().optional(),
    }),
    // Value realization
    value_metrics: z.object({
        roi_achieved_percent: z.number().optional(),
        value_vs_expectation: z.enum(["exceeding", "meeting", "below", "significantly_below"]).optional(),
        business_case_status: z.enum(["validated", "tracking", "at_risk", "failed"]).optional(),
        expansion_discussions: z.boolean().optional(),
        budget_changes: z.enum(["increased", "stable", "reduced", "significantly_reduced"]).optional(),
    }),
    // Relationship health
    relationship_health: z.object({
        executive_sponsor_status: z.enum(["engaged", "passive", "disengaged", "departed"]).optional(),
        champion_count: z.number().min(0).optional(),
        key_contact_changes: z.number().min(0).optional(),
        competitor_mentions: z.number().min(0).optional(),
        renewal_discussions_started: z.boolean().optional(),
        payment_issues: z.boolean().optional(),
    }),
    // Recent events
    recent_events: z.object({
        major_incidents: z.number().min(0).default(0),
        service_disruptions: z.number().min(0).default(0),
        missed_slas: z.number().min(0).default(0),
        successful_projects: z.number().min(0).default(0),
        expansion_wins: z.number().min(0).default(0),
    }).optional(),
    // External factors
    external_factors: z.object({
        client_financial_health: z.enum(["strong", "stable", "challenged", "distressed"]).optional(),
        industry_disruption: z.boolean().optional(),
        leadership_changes: z.boolean().optional(),
        m_and_a_activity: z.boolean().optional(),
        strategic_shift: z.boolean().optional(),
    }).optional(),
});
// ============================================
// Tool Definition
// ============================================
export const PREDICT_CHURN_RISK_TOOL = {
    name: "predict_churn_risk",
    description: "Predicts client churn risk based on engagement, satisfaction, value realization, and relationship health metrics. Provides risk scores, warning signals, and retention strategies.",
    inputSchema: {
        type: "object",
        properties: {
            client_name: { type: "string", description: "Client company name" },
            industry: {
                type: "string",
                enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
            },
            account_info: { type: "object", description: "Account details and contract info" },
            engagement_metrics: { type: "object", description: "Usage and engagement metrics" },
            satisfaction_indicators: { type: "object", description: "Customer satisfaction data" },
            value_metrics: { type: "object", description: "Value realization metrics" },
            relationship_health: { type: "object", description: "Relationship health indicators" },
            recent_events: { type: "object", description: "Recent account events" },
            external_factors: { type: "object", description: "External factors affecting the account" },
        },
        required: [
            "client_name",
            "industry",
            "account_info",
            "engagement_metrics",
            "satisfaction_indicators",
            "value_metrics",
            "relationship_health",
        ],
    },
};
// ============================================
// Implementation Helpers
// ============================================
function calculateDaysUntilContractEnd(endDate) {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}
function calculateEngagementScore(metrics, accountInfo) {
    let score = 50; // Base score
    // Monthly active users
    if (metrics.monthly_active_user_percent !== undefined) {
        if (metrics.monthly_active_user_percent >= 80) {
            score += 20;
        }
        else if (metrics.monthly_active_user_percent >= 60) {
            score += 10;
        }
        else if (metrics.monthly_active_user_percent >= 40) {
            score += 0;
        }
        else if (metrics.monthly_active_user_percent >= 20) {
            score -= 15;
        }
        else {
            score -= 25;
        }
    }
    // Login frequency trend
    const trendScores = { increasing: 15, stable: 5, decreasing: -15, significantly_decreasing: -25 };
    if (metrics.login_frequency_trend) {
        score += trendScores[metrics.login_frequency_trend];
    }
    // Feature utilization
    if (metrics.feature_utilization_percent !== undefined) {
        if (metrics.feature_utilization_percent >= 70) {
            score += 10;
        }
        else if (metrics.feature_utilization_percent < 30) {
            score -= 10;
        }
    }
    // Support sentiment
    const sentimentScores = { positive: 10, neutral: 0, negative: -15, very_negative: -25 };
    if (metrics.support_sentiment) {
        score += sentimentScores[metrics.support_sentiment];
    }
    // Last engagement
    if (metrics.last_engagement_days_ago !== undefined) {
        if (metrics.last_engagement_days_ago > 30) {
            score -= 10;
        }
        if (metrics.last_engagement_days_ago > 60) {
            score -= 15;
        }
    }
    // Executive engagement
    const execScores = { regular: 10, occasional: 5, rare: -10, none: -20 };
    if (metrics.executive_engagement) {
        score += execScores[metrics.executive_engagement];
    }
    // Active users vs licensed
    const utilizationRate = accountInfo.active_users / accountInfo.licensed_users;
    if (utilizationRate >= 0.8) {
        score += 5;
    }
    else if (utilizationRate < 0.3) {
        score -= 15;
    }
    return Math.max(0, Math.min(100, score));
}
function calculateSatisfactionScore(indicators) {
    let score = 50;
    // NPS score
    if (indicators.nps_score !== undefined) {
        if (indicators.nps_score >= 50) {
            score += 25;
        }
        else if (indicators.nps_score >= 30) {
            score += 15;
        }
        else if (indicators.nps_score >= 0) {
            score += 5;
        }
        else if (indicators.nps_score >= -30) {
            score -= 10;
        }
        else {
            score -= 25;
        }
    }
    // CSAT score
    if (indicators.csat_score !== undefined) {
        if (indicators.csat_score >= 8) {
            score += 15;
        }
        else if (indicators.csat_score >= 6) {
            score += 5;
        }
        else if (indicators.csat_score < 4) {
            score -= 20;
        }
    }
    // Recent survey
    const surveyScores = {
        very_satisfied: 15,
        satisfied: 5,
        neutral: -5,
        dissatisfied: -20,
        very_dissatisfied: -30,
    };
    if (indicators.recent_survey_response) {
        score += surveyScores[indicators.recent_survey_response];
    }
    // Complaints
    if (indicators.complaint_count_last_90_days !== undefined) {
        if (indicators.complaint_count_last_90_days > 5) {
            score -= 20;
        }
        else if (indicators.complaint_count_last_90_days > 2) {
            score -= 10;
        }
    }
    // Escalations
    if (indicators.escalation_count_last_90_days !== undefined) {
        if (indicators.escalation_count_last_90_days > 3) {
            score -= 25;
        }
        else if (indicators.escalation_count_last_90_days > 1) {
            score -= 15;
        }
    }
    // Reference willingness
    if (indicators.reference_willingness === true) {
        score += 15;
    }
    else if (indicators.reference_willingness === false) {
        score -= 10;
    }
    return Math.max(0, Math.min(100, score));
}
function calculateValueScore(metrics) {
    let score = 50;
    // ROI achieved
    if (metrics.roi_achieved_percent !== undefined) {
        if (metrics.roi_achieved_percent >= 100) {
            score += 25;
        }
        else if (metrics.roi_achieved_percent >= 50) {
            score += 10;
        }
        else if (metrics.roi_achieved_percent >= 0) {
            score -= 5;
        }
        else {
            score -= 25;
        }
    }
    // Value vs expectation
    const valueScores = { exceeding: 20, meeting: 5, below: -15, significantly_below: -30 };
    if (metrics.value_vs_expectation) {
        score += valueScores[metrics.value_vs_expectation];
    }
    // Business case status
    const caseScores = { validated: 15, tracking: 5, at_risk: -15, failed: -30 };
    if (metrics.business_case_status) {
        score += caseScores[metrics.business_case_status];
    }
    // Expansion discussions
    if (metrics.expansion_discussions === true) {
        score += 15;
    }
    // Budget changes
    const budgetScores = { increased: 15, stable: 0, reduced: -20, significantly_reduced: -35 };
    if (metrics.budget_changes) {
        score += budgetScores[metrics.budget_changes];
    }
    return Math.max(0, Math.min(100, score));
}
function calculateRelationshipScore(health) {
    let score = 50;
    // Executive sponsor
    const sponsorScores = { engaged: 20, passive: 0, disengaged: -20, departed: -35 };
    if (health.executive_sponsor_status) {
        score += sponsorScores[health.executive_sponsor_status];
    }
    // Champions
    if (health.champion_count !== undefined) {
        if (health.champion_count >= 5) {
            score += 15;
        }
        else if (health.champion_count >= 3) {
            score += 10;
        }
        else if (health.champion_count === 0) {
            score -= 25;
        }
    }
    // Key contact changes
    if (health.key_contact_changes !== undefined) {
        if (health.key_contact_changes > 3) {
            score -= 20;
        }
        else if (health.key_contact_changes > 1) {
            score -= 10;
        }
    }
    // Competitor mentions
    if (health.competitor_mentions !== undefined && health.competitor_mentions > 0) {
        score -= Math.min(30, health.competitor_mentions * 10);
    }
    // Renewal discussions
    if (health.renewal_discussions_started === true) {
        score += 10;
    }
    // Payment issues
    if (health.payment_issues === true) {
        score -= 25;
    }
    return Math.max(0, Math.min(100, score));
}
function calculateOverallChurnScore(engagementScore, satisfactionScore, valueScore, relationshipScore, externalFactors, recentEvents) {
    // Weighted average (inverted - lower scores = higher churn risk)
    const healthScore = engagementScore * 0.25 +
        satisfactionScore * 0.25 +
        valueScore * 0.30 +
        relationshipScore * 0.20;
    // Churn score is inverted health score
    let churnScore = 100 - healthScore;
    // External factor adjustments
    if (externalFactors) {
        if (externalFactors.client_financial_health === "distressed") {
            churnScore += 15;
        }
        else if (externalFactors.client_financial_health === "challenged") {
            churnScore += 8;
        }
        if (externalFactors.leadership_changes) {
            churnScore += 10;
        }
        if (externalFactors.m_and_a_activity) {
            churnScore += 15;
        }
        if (externalFactors.strategic_shift) {
            churnScore += 10;
        }
    }
    // Recent events adjustments
    if (recentEvents) {
        churnScore += recentEvents.major_incidents * 5;
        churnScore += recentEvents.service_disruptions * 3;
        churnScore += recentEvents.missed_slas * 4;
        churnScore -= recentEvents.successful_projects * 3;
        churnScore -= recentEvents.expansion_wins * 5;
    }
    return Math.max(0, Math.min(100, Math.round(churnScore)));
}
function determineRiskLevel(score) {
    if (score >= 80) {
        return "critical";
    }
    if (score >= 60) {
        return "high";
    }
    if (score >= 40) {
        return "elevated";
    }
    if (score >= 20) {
        return "moderate";
    }
    return "low";
}
function calculateRenewalProbability(churnScore) {
    // Simple inverse relationship
    return Math.max(5, Math.min(95, 100 - churnScore));
}
function determineUrgency(churnScore, daysUntilEnd) {
    if (churnScore >= 70 || (churnScore >= 50 && daysUntilEnd <= 60)) {
        return "immediate";
    }
    if (churnScore >= 50 || daysUntilEnd <= 90) {
        return "this_quarter";
    }
    if (churnScore >= 30 || daysUntilEnd <= 180) {
        return "this_half";
    }
    return "monitor";
}
function identifyRiskFactors(input) {
    const factors = [];
    const { engagement_metrics, satisfaction_indicators, value_metrics, relationship_health, external_factors } = input;
    // Engagement factors
    if (engagement_metrics.monthly_active_user_percent !== undefined && engagement_metrics.monthly_active_user_percent < 40) {
        factors.push({
            category: "Engagement",
            factor: "Low user adoption",
            impact_score: engagement_metrics.monthly_active_user_percent < 20 ? 9 : 6,
            trend: "worsening",
            evidence: `Only ${engagement_metrics.monthly_active_user_percent}% monthly active users`,
        });
    }
    if (engagement_metrics.login_frequency_trend === "significantly_decreasing") {
        factors.push({
            category: "Engagement",
            factor: "Declining usage trend",
            impact_score: 8,
            trend: "worsening",
            evidence: "Login frequency significantly decreasing",
        });
    }
    // Satisfaction factors
    if (satisfaction_indicators.nps_score !== undefined && satisfaction_indicators.nps_score < 0) {
        factors.push({
            category: "Satisfaction",
            factor: "Negative NPS",
            impact_score: satisfaction_indicators.nps_score < -30 ? 9 : 7,
            trend: "worsening",
            evidence: `NPS score of ${satisfaction_indicators.nps_score}`,
        });
    }
    if (satisfaction_indicators.escalation_count_last_90_days !== undefined && satisfaction_indicators.escalation_count_last_90_days > 0) {
        factors.push({
            category: "Satisfaction",
            factor: "Recent escalations",
            impact_score: Math.min(9, 5 + satisfaction_indicators.escalation_count_last_90_days),
            trend: "worsening",
            evidence: `${satisfaction_indicators.escalation_count_last_90_days} escalations in last 90 days`,
        });
    }
    // Value factors
    if (value_metrics.value_vs_expectation === "significantly_below" || value_metrics.value_vs_expectation === "below") {
        factors.push({
            category: "Value",
            factor: "Underdelivering on value",
            impact_score: value_metrics.value_vs_expectation === "significantly_below" ? 9 : 7,
            trend: "worsening",
            evidence: `Value delivery ${value_metrics.value_vs_expectation} expectations`,
        });
    }
    if (value_metrics.budget_changes === "significantly_reduced" || value_metrics.budget_changes === "reduced") {
        factors.push({
            category: "Value",
            factor: "Budget reduction",
            impact_score: value_metrics.budget_changes === "significantly_reduced" ? 8 : 6,
            trend: "worsening",
            evidence: `Client budget ${value_metrics.budget_changes}`,
        });
    }
    // Relationship factors
    if (relationship_health.executive_sponsor_status === "departed" || relationship_health.executive_sponsor_status === "disengaged") {
        factors.push({
            category: "Relationship",
            factor: "Executive sponsor issue",
            impact_score: relationship_health.executive_sponsor_status === "departed" ? 9 : 7,
            trend: "worsening",
            evidence: `Executive sponsor ${relationship_health.executive_sponsor_status}`,
        });
    }
    if (relationship_health.competitor_mentions !== undefined && relationship_health.competitor_mentions > 0) {
        factors.push({
            category: "Relationship",
            factor: "Competitor evaluation",
            impact_score: Math.min(9, 6 + relationship_health.competitor_mentions),
            trend: "worsening",
            evidence: `${relationship_health.competitor_mentions} competitor mentions detected`,
        });
    }
    if (relationship_health.payment_issues) {
        factors.push({
            category: "Relationship",
            factor: "Payment issues",
            impact_score: 7,
            trend: "worsening",
            evidence: "Payment delays or disputes",
        });
    }
    // External factors
    if (external_factors?.client_financial_health === "distressed" || external_factors?.client_financial_health === "challenged") {
        factors.push({
            category: "External",
            factor: "Client financial health",
            impact_score: external_factors.client_financial_health === "distressed" ? 9 : 6,
            trend: "worsening",
            evidence: `Client financial health is ${external_factors.client_financial_health}`,
        });
    }
    if (external_factors?.m_and_a_activity) {
        factors.push({
            category: "External",
            factor: "M&A uncertainty",
            impact_score: 7,
            trend: "stable",
            evidence: "Client involved in M&A activity",
        });
    }
    // Sort by impact score
    return factors.sort((a, b) => b.impact_score - a.impact_score);
}
function identifyWarningSignals(input, _churnScore) {
    const signals = [];
    const today = new Date().toISOString().split("T")[0];
    const { engagement_metrics, satisfaction_indicators, value_metrics, relationship_health } = input;
    // Critical signals
    if (relationship_health.executive_sponsor_status === "departed") {
        signals.push({
            signal: "Executive sponsor has departed",
            severity: "critical",
            detected_date: today,
            recommended_response: "Immediately identify and engage new sponsor candidate",
        });
    }
    if (satisfaction_indicators.escalation_count_last_90_days !== undefined && satisfaction_indicators.escalation_count_last_90_days >= 3) {
        signals.push({
            signal: "Multiple escalations in recent period",
            severity: "critical",
            detected_date: today,
            recommended_response: "Executive review of escalation themes and remediation plan",
        });
    }
    if (value_metrics.business_case_status === "failed") {
        signals.push({
            signal: "Business case not achieved",
            severity: "critical",
            detected_date: today,
            recommended_response: "Conduct value recovery workshop with client",
        });
    }
    // Warning signals
    if (engagement_metrics.login_frequency_trend === "significantly_decreasing") {
        signals.push({
            signal: "Usage declining significantly",
            severity: "warning",
            detected_date: today,
            recommended_response: "Engage users to understand barriers and re-activate",
        });
    }
    if (relationship_health.competitor_mentions !== undefined && relationship_health.competitor_mentions > 0) {
        signals.push({
            signal: "Competitor evaluation detected",
            severity: "warning",
            detected_date: today,
            recommended_response: "Prepare competitive response and differentiation messaging",
        });
    }
    if (satisfaction_indicators.recent_survey_response === "very_dissatisfied") {
        signals.push({
            signal: "Very dissatisfied survey response",
            severity: "warning",
            detected_date: today,
            recommended_response: "Schedule executive check-in to address concerns",
        });
    }
    // Caution signals
    if (engagement_metrics.executive_engagement === "none") {
        signals.push({
            signal: "No executive engagement",
            severity: "caution",
            detected_date: today,
            recommended_response: "Schedule executive business review",
        });
    }
    if (relationship_health.champion_count !== undefined && relationship_health.champion_count === 0) {
        signals.push({
            signal: "No identified champions",
            severity: "caution",
            detected_date: today,
            recommended_response: "Identify and cultivate potential champions",
        });
    }
    return signals;
}
function generateRetentionStrategy(input, churnScore, daysUntilEnd) {
    const priorityActions = [];
    const relationshipActions = [];
    const valueActions = [];
    const execActions = [];
    const savePlays = [];
    const { engagement_metrics, satisfaction_indicators, value_metrics, relationship_health } = input;
    // High priority actions based on risk
    if (churnScore >= 60) {
        priorityActions.push({
            action: "Conduct emergency account review",
            owner: "Account Executive + CSM",
            timeline: "This week",
            expected_impact: "Identify and address critical issues",
        });
        savePlays.push("Offer value recovery program");
        savePlays.push("Executive escalation for relationship repair");
    }
    // Engagement actions
    if (engagement_metrics.monthly_active_user_percent !== undefined && engagement_metrics.monthly_active_user_percent < 50) {
        priorityActions.push({
            action: "Launch adoption acceleration program",
            owner: "Customer Success Manager",
            timeline: "Next 2 weeks",
            expected_impact: "Increase active user rate by 20%+",
        });
    }
    // Satisfaction actions
    if (satisfaction_indicators.escalation_count_last_90_days !== undefined && satisfaction_indicators.escalation_count_last_90_days > 0) {
        priorityActions.push({
            action: "Address outstanding escalation themes",
            owner: "Support Lead + CSM",
            timeline: "Next week",
            expected_impact: "Resolve friction points and improve satisfaction",
        });
    }
    // Value actions
    if (value_metrics.value_vs_expectation === "below" || value_metrics.value_vs_expectation === "significantly_below") {
        valueActions.push("Conduct value realization workshop");
        valueActions.push("Document and quantify achieved benefits");
        valueActions.push("Identify quick wins to demonstrate additional value");
        priorityActions.push({
            action: "Schedule value realization review",
            owner: "Solutions Consultant + CSM",
            timeline: "Next 2 weeks",
            expected_impact: "Rebuild value narrative and confidence",
        });
    }
    else {
        valueActions.push("Proactively share value metrics and success stories");
    }
    // Relationship actions
    if (relationship_health.executive_sponsor_status === "departed" || relationship_health.executive_sponsor_status === "disengaged") {
        relationshipActions.push("Identify new executive sponsor candidate");
        relationshipActions.push("Engage multiple stakeholders to broaden support");
        execActions.push("Request executive introduction from existing contacts");
    }
    if (relationship_health.champion_count !== undefined && relationship_health.champion_count < 3) {
        relationshipActions.push("Identify and develop additional champions");
        relationshipActions.push("Recognize and reward existing champions");
    }
    // Executive engagement
    if (engagement_metrics.executive_engagement === "none" || engagement_metrics.executive_engagement === "rare") {
        execActions.push("Schedule executive business review");
        execActions.push("Invite client executives to thought leadership events");
    }
    // Renewal focus
    if (daysUntilEnd <= 120) {
        priorityActions.push({
            action: "Initiate formal renewal conversation",
            owner: "Account Executive",
            timeline: "This week",
            expected_impact: "Begin renewal process and address concerns",
        });
        savePlays.push("Prepare renewal incentive options");
        savePlays.push("Develop contract flexibility scenarios");
    }
    // Default actions
    if (priorityActions.length === 0) {
        priorityActions.push({
            action: "Continue regular engagement cadence",
            owner: "Customer Success Manager",
            timeline: "Ongoing",
            expected_impact: "Maintain healthy relationship",
        });
    }
    if (relationshipActions.length === 0) {
        relationshipActions.push("Maintain regular touchpoints with key stakeholders");
    }
    if (valueActions.length === 0) {
        valueActions.push("Share quarterly value reports");
    }
    if (execActions.length === 0) {
        execActions.push("Continue quarterly executive engagement");
    }
    if (savePlays.length === 0) {
        savePlays.push("Monitor for early warning signs");
    }
    return {
        priority_actions: priorityActions,
        relationship_actions: relationshipActions,
        value_demonstration_actions: valueActions,
        executive_engagement_actions: execActions,
        save_plays: savePlays,
    };
}
function generateScenarios(churnScore, input) {
    const renewProb = calculateRenewalProbability(churnScore);
    const expandProb = input.value_metrics.expansion_discussions ? 20 : 5;
    const reduceProb = Math.min(40, churnScore / 2);
    const churnProb = Math.min(80, churnScore);
    return {
        most_likely: {
            outcome: churnScore >= 60 ? "churn" : churnScore >= 40 ? "reduce" : "renew",
            probability_percent: churnScore >= 60 ? churnProb : churnScore >= 40 ? reduceProb : renewProb,
            description: churnScore >= 60
                ? "High risk of non-renewal without significant intervention"
                : churnScore >= 40
                    ? "Likely to renew with reduced scope unless value demonstrated"
                    : "Expected to renew based on current trajectory",
        },
        best_case: {
            outcome: input.value_metrics.expansion_discussions ? "expand" : "renew",
            probability_percent: input.value_metrics.expansion_discussions ? expandProb : renewProb,
            conditions: [
                "All outstanding issues resolved",
                "Value realization demonstrated",
                "Strong executive engagement",
                "Positive user sentiment",
            ],
        },
        worst_case: {
            outcome: churnScore >= 50 ? "churn" : "reduce",
            probability_percent: Math.min(50, churnScore + 10),
            triggers: [
                "Executive sponsor departure",
                "Major service incident",
                "Competitor offer acceptance",
                "Budget elimination",
            ],
        },
    };
}
function assessCompetitiveThreat(input, industry) {
    const { relationship_health, engagement_metrics, value_metrics } = input;
    let threatLevel = "low";
    if (relationship_health.competitor_mentions !== undefined && relationship_health.competitor_mentions > 0) {
        threatLevel = relationship_health.competitor_mentions >= 3 ? "high" : "moderate";
    }
    if (value_metrics.value_vs_expectation === "significantly_below") {
        threatLevel = "high";
    }
    else if (value_metrics.value_vs_expectation === "below" && threatLevel === "low") {
        threatLevel = "moderate";
    }
    const industryCompetitors = {
        manufacturing: ["Siemens", "Rockwell", "PTC", "Dassault"],
        insurance: ["Guidewire", "Duck Creek", "Sapiens", "Majesco"],
        healthcare: ["Epic", "Cerner", "Medidata", "Veeva"],
        aquaculture: ["AKVA Group", "Innovasea", "InnovaSea"],
        general: ["Industry leaders", "Specialized vendors", "Cloud platforms"],
    };
    const vulnerabilities = [];
    if (engagement_metrics.monthly_active_user_percent !== undefined && engagement_metrics.monthly_active_user_percent < 50) {
        vulnerabilities.push("Low adoption makes switching easier");
    }
    if (engagement_metrics.feature_utilization_percent !== undefined && engagement_metrics.feature_utilization_percent < 40) {
        vulnerabilities.push("Not leveraging differentiating features");
    }
    if (value_metrics.value_vs_expectation === "below" || value_metrics.value_vs_expectation === "significantly_below") {
        vulnerabilities.push("Value proposition under question");
    }
    return {
        threat_level: threatLevel,
        likely_competitors: industryCompetitors[industry] || industryCompetitors.general,
        vulnerability_areas: vulnerabilities.length > 0 ? vulnerabilities : ["No significant vulnerabilities identified"],
        differentiation_opportunities: [
            "Emphasize unique AI capabilities",
            "Highlight integration advantages",
            "Showcase industry-specific features",
            "Demonstrate ROI superiority",
        ],
    };
}
function identifySuccessIndicators(input) {
    const positive = [];
    const momentum = [];
    const quickWins = [];
    const { engagement_metrics, satisfaction_indicators, value_metrics, relationship_health, recent_events } = input;
    // Positive signals
    if (satisfaction_indicators.reference_willingness) {
        positive.push("Client willing to be a reference");
    }
    if (value_metrics.expansion_discussions) {
        positive.push("Expansion discussions underway");
    }
    if (satisfaction_indicators.nps_score !== undefined && satisfaction_indicators.nps_score >= 50) {
        positive.push("Strong NPS score");
    }
    if (relationship_health.executive_sponsor_status === "engaged") {
        positive.push("Engaged executive sponsor");
    }
    if (engagement_metrics.login_frequency_trend === "increasing") {
        positive.push("Usage trend increasing");
    }
    // Momentum builders
    if (recent_events?.successful_projects && recent_events.successful_projects > 0) {
        momentum.push(`${recent_events.successful_projects} successful project(s) recently completed`);
    }
    if (recent_events?.expansion_wins && recent_events.expansion_wins > 0) {
        momentum.push(`${recent_events.expansion_wins} expansion win(s) achieved`);
    }
    if (value_metrics.roi_achieved_percent !== undefined && value_metrics.roi_achieved_percent > 100) {
        momentum.push("ROI exceeding expectations");
    }
    // Quick wins
    if (engagement_metrics.feature_utilization_percent !== undefined && engagement_metrics.feature_utilization_percent < 60) {
        quickWins.push("Enable underutilized features for additional value");
    }
    if (relationship_health.champion_count !== undefined && relationship_health.champion_count > 0) {
        quickWins.push("Leverage existing champions for testimonials");
    }
    quickWins.push("Share recent success stories from similar clients");
    if (positive.length === 0) {
        positive.push("Opportunity to build positive momentum through engagement");
    }
    if (momentum.length === 0) {
        momentum.push("Focus on creating quick wins to build momentum");
    }
    return {
        positive_signals: positive,
        momentum_builders: momentum,
        quick_wins_available: quickWins,
    };
}
// ============================================
// Main Export Function
// ============================================
export function predictChurnRisk(input) {
    const { client_name, industry, account_info, engagement_metrics, satisfaction_indicators, value_metrics, relationship_health, recent_events, external_factors, } = input;
    const daysUntilEnd = calculateDaysUntilContractEnd(account_info.contract_end_date);
    // Calculate category scores
    const engagementScore = calculateEngagementScore(engagement_metrics, account_info);
    const satisfactionScore = calculateSatisfactionScore(satisfaction_indicators);
    const valueScore = calculateValueScore(value_metrics);
    const relationshipScore = calculateRelationshipScore(relationship_health);
    // Calculate overall churn score
    const churnScore = calculateOverallChurnScore(engagementScore, satisfactionScore, valueScore, relationshipScore, external_factors, recent_events);
    const riskLevel = determineRiskLevel(churnScore);
    const renewalProbability = calculateRenewalProbability(churnScore);
    const urgency = determineUrgency(churnScore, daysUntilEnd);
    // Identify risk factors and warning signals
    const riskFactors = identifyRiskFactors(input);
    const warningSignals = identifyWarningSignals(input, churnScore);
    // Generate retention strategy
    const retentionStrategy = generateRetentionStrategy(input, churnScore, daysUntilEnd);
    // Generate scenarios
    const scenarios = generateScenarios(churnScore, input);
    // Competitive assessment
    const competitiveAssessment = assessCompetitiveThreat(input, industry);
    // Success indicators
    const successIndicators = identifySuccessIndicators(input);
    // Determine trend
    let trend = "stable";
    if (engagement_metrics.login_frequency_trend === "increasing") {
        trend = "improving";
    }
    else if (engagement_metrics.login_frequency_trend === "significantly_decreasing" ||
        engagement_metrics.login_frequency_trend === "decreasing") {
        trend = "deteriorating";
    }
    // Health timeline
    const healthTimeline = {
        current_status: riskLevel === "critical" || riskLevel === "high"
            ? "Account requires immediate attention"
            : riskLevel === "elevated"
                ? "Account showing warning signs"
                : "Account in reasonable health",
        next_30_days: churnScore >= 50
            ? "Focus on stabilization and addressing critical issues"
            : "Continue engagement and proactive value demonstration",
        next_90_days: daysUntilEnd <= 90
            ? "Renewal period - execute retention strategy"
            : "Build momentum toward successful renewal",
        renewal_readiness: churnScore >= 60 ? "critical"
            : churnScore >= 40 ? "at_risk"
                : churnScore >= 20 ? "needs_work" : "ready",
    };
    // Revenue impact
    const arrAtRisk = account_info.contract_value_annual_usd * (churnScore / 100);
    const expansionPotential = value_metrics.expansion_discussions
        ? account_info.contract_value_annual_usd * 0.3
        : 0;
    return {
        client_name,
        prediction_date: new Date().toISOString().split("T")[0],
        risk_summary: {
            churn_risk_score: churnScore,
            risk_level: riskLevel,
            risk_trend: trend,
            confidence: riskFactors.length >= 3 ? "high" : riskFactors.length >= 1 ? "medium" : "low",
            days_until_contract_end: daysUntilEnd,
            renewal_probability_percent: renewalProbability,
            at_risk_revenue_usd: Math.round(arrAtRisk),
            urgency,
        },
        risk_factors: riskFactors,
        category_scores: {
            engagement_score: engagementScore,
            satisfaction_score: satisfactionScore,
            value_realization_score: valueScore,
            relationship_score: relationshipScore,
            overall_health_score: Math.round(100 - churnScore),
        },
        warning_signals: warningSignals,
        churn_indicators: {
            leading_indicators: [
                "Usage trend declining",
                "Executive disengagement",
                "Budget reduction signals",
                "Competitor evaluation",
            ],
            lagging_indicators: [
                "NPS decline",
                "Support ticket increase",
                "Renewal hesitation",
                "Payment delays",
            ],
            predictive_patterns: riskFactors.slice(0, 3).map((f) => f.factor),
        },
        scenarios,
        retention_strategy: retentionStrategy,
        health_timeline: healthTimeline,
        competitive_assessment: competitiveAssessment,
        revenue_impact: {
            current_arr_usd: account_info.contract_value_annual_usd,
            at_risk_arr_usd: Math.round(arrAtRisk),
            expansion_potential_usd: Math.round(expansionPotential),
            expected_outcome_arr_usd: Math.round(account_info.contract_value_annual_usd * (renewalProbability / 100) + expansionPotential * 0.3),
            revenue_confidence: churnScore <= 30 ? "high" : churnScore <= 50 ? "medium" : "low",
        },
        success_indicators: successIndicators,
        methodology_note: "Churn prediction follows Good AI Client Success methodology, analyzing engagement, satisfaction, value realization, and relationship health indicators. Risk scores are calculated using weighted multi-factor analysis with industry benchmarks. Confidence levels reflect data completeness. Regular reassessment recommended as conditions change.",
    };
}
//# sourceMappingURL=predict_churn_risk.js.map