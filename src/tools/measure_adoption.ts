/**
 * Good AI - Measure Adoption Tool
 * Tracks and measures AI solution adoption rates and user engagement
 */

import { z } from "zod";

// ============================================
// Input Schema
// ============================================

export const MeasureAdoptionInputSchema = z.object({
  project_name: z.string().min(1).max(200),
  client_name: z.string().min(1).max(200),
  solution_name: z.string().min(1).max(200),
  industry: z.enum([
    "manufacturing",
    "insurance",
    "aquaculture",
    "healthcare",
    "general",
  ]),

  // Deployment details
  deployment_info: z.object({
    go_live_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
    total_target_users: z.number().min(1).max(100000),
    deployment_type: z.enum(["pilot", "phased_rollout", "big_bang", "department_specific"]).default("phased_rollout"),
    current_phase: z.string().optional(),
  }),

  // Usage metrics
  usage_metrics: z.object({
    active_users_count: z.number().min(0),
    daily_sessions_avg: z.number().min(0),
    weekly_active_users: z.number().min(0),
    monthly_active_users: z.number().min(0),
    avg_session_duration_minutes: z.number().min(0).optional(),
    features_used_count: z.number().min(0).optional(),
    total_features_available: z.number().min(1).optional(),
  }),

  // Engagement indicators
  engagement_indicators: z.object({
    user_satisfaction_score: z.number().min(0).max(10).optional(),
    nps_score: z.number().min(-100).max(100).optional(),
    support_tickets_per_week: z.number().min(0).optional(),
    training_completion_percent: z.number().min(0).max(100).optional(),
    voluntary_usage_percent: z.number().min(0).max(100).optional(),
    power_users_count: z.number().min(0).optional(),
    feedback_submissions: z.number().min(0).optional(),
  }).optional(),

  // Behavioral metrics
  behavioral_metrics: z.object({
    tasks_completed_per_user: z.number().min(0).optional(),
    error_rate_percent: z.number().min(0).max(100).optional(),
    time_to_proficiency_days: z.number().min(0).optional(),
    process_adherence_percent: z.number().min(0).max(100).optional(),
    workflow_completion_rate: z.number().min(0).max(100).optional(),
    ai_recommendation_acceptance_rate: z.number().min(0).max(100).optional(),
  }).optional(),

  // Change management context
  change_context: z.object({
    change_champions_count: z.number().min(0).optional(),
    resistance_incidents: z.number().min(0).optional(),
    training_sessions_conducted: z.number().min(0).optional(),
    communication_touchpoints: z.number().min(0).optional(),
    executive_engagement_level: z.enum(["high", "medium", "low"]).optional(),
  }).optional(),

  // Comparison data
  benchmarks: z.object({
    industry_avg_adoption_rate: z.number().min(0).max(100).optional(),
    previous_period_active_users: z.number().min(0).optional(),
    target_adoption_rate: z.number().min(0).max(100).optional(),
    target_satisfaction_score: z.number().min(0).max(10).optional(),
  }).optional(),

  // Assessment period
  assessment_period: z.object({
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  }),
});

export type MeasureAdoptionInput = z.infer<typeof MeasureAdoptionInputSchema>;

// ============================================
// Output Types
// ============================================

export interface AdoptionMeasurement {
  project_name: string;
  client_name: string;
  solution_name: string;
  assessment_date: string;
  assessment_period: {
    start_date: string;
    end_date: string;
    days_since_go_live: number;
  };

  /** Overall adoption summary */
  adoption_summary: {
    overall_adoption_score: number; // 0-100
    adoption_stage: "initial" | "growing" | "mainstream" | "mature" | "declining";
    adoption_velocity: "accelerating" | "steady" | "slowing" | "stalled";
    adoption_health: "healthy" | "at_risk" | "critical";
    key_metrics_snapshot: {
      adoption_rate_percent: number;
      active_user_rate_percent: number;
      engagement_score: number;
      satisfaction_indicator: "positive" | "neutral" | "negative" | "unknown";
    };
  };

  /** Detailed adoption metrics */
  adoption_metrics: {
    user_adoption: {
      adoption_rate_percent: number;
      weekly_active_rate_percent: number;
      monthly_active_rate_percent: number;
      user_growth_trend: "growing" | "stable" | "declining";
      new_users_this_period: number;
      churned_users_estimate: number;
    };
    feature_adoption: {
      feature_utilization_percent: number;
      core_features_adoption: "high" | "medium" | "low";
      advanced_features_adoption: "high" | "medium" | "low";
      underutilized_features: string[];
    };
    depth_of_use: {
      avg_session_duration_minutes: number;
      sessions_per_user_per_week: number;
      tasks_per_session: number;
      depth_score: number; // 0-100
    };
  };

  /** Engagement analysis */
  engagement_analysis: {
    engagement_score: number; // 0-100
    engagement_level: "highly_engaged" | "engaged" | "passive" | "disengaged";
    user_segments: {
      power_users_percent: number;
      regular_users_percent: number;
      occasional_users_percent: number;
      inactive_users_percent: number;
    };
    engagement_drivers: string[];
    engagement_barriers: string[];
  };

  /** Satisfaction metrics */
  satisfaction_metrics: {
    satisfaction_score: number | null;
    nps_score: number | null;
    nps_category: "promoter" | "passive" | "detractor" | "unknown";
    support_burden: "low" | "moderate" | "high";
    sentiment_trend: "improving" | "stable" | "declining" | "unknown";
    top_satisfaction_drivers: string[];
    top_dissatisfaction_drivers: string[];
  };

  /** Behavioral insights */
  behavioral_insights: {
    proficiency_level: "expert" | "proficient" | "learning" | "novice";
    workflow_efficiency: "optimized" | "adequate" | "needs_improvement";
    ai_trust_indicator: "high" | "medium" | "low" | "unknown";
    usage_patterns: {
      peak_usage_times: string[];
      common_workflows: string[];
      abandonment_points: string[];
    };
  };

  /** Benchmark comparison */
  benchmark_comparison: {
    vs_target: {
      adoption_rate_vs_target: number; // percentage of target achieved
      satisfaction_vs_target: number | null;
      on_track: boolean;
    };
    vs_industry: {
      adoption_vs_industry_avg: "above" | "at" | "below" | "unknown";
      percentile_estimate: number | null;
    };
    vs_previous_period: {
      adoption_change_percent: number | null;
      engagement_change: "improved" | "stable" | "declined" | "unknown";
    };
  };

  /** Risk indicators */
  adoption_risks: {
    risk_level: "low" | "medium" | "high" | "critical";
    risk_factors: {
      factor: string;
      severity: "low" | "medium" | "high";
      trend: "improving" | "stable" | "worsening";
      mitigation: string;
    }[];
    churn_risk_indicator: "low" | "moderate" | "elevated" | "high";
    intervention_urgency: "none" | "monitor" | "action_needed" | "urgent";
  };

  /** Recommendations */
  recommendations: {
    immediate_actions: {
      action: string;
      priority: "high" | "medium";
      expected_impact: string;
      owner_suggestion: string;
    }[];
    engagement_strategies: {
      strategy: string;
      target_segment: string;
      expected_outcome: string;
    }[];
    training_recommendations: string[];
    communication_recommendations: string[];
  };

  /** Success indicators */
  success_indicators: {
    adoption_milestones_achieved: string[];
    upcoming_milestones: { milestone: string; target_date: string; likelihood: "on_track" | "at_risk" | "unlikely" }[];
    value_realization_indicators: string[];
  };

  /** Trend analysis */
  trend_analysis: {
    adoption_trajectory: "positive" | "neutral" | "negative";
    forecast_30_day: {
      projected_adoption_rate: number;
      confidence: "high" | "medium" | "low";
    };
    inflection_points: string[];
    seasonality_notes: string;
  };

  methodology_note: string;
}

// ============================================
// Tool Definition
// ============================================

export const MEASURE_ADOPTION_TOOL = {
  name: "measure_adoption",
  description:
    "Measures and analyzes AI solution adoption rates, user engagement, and behavioral patterns. Provides adoption health scores, risk indicators, and recommendations for improving adoption.",
  inputSchema: {
    type: "object",
    properties: {
      project_name: { type: "string", description: "Name of the project" },
      client_name: { type: "string", description: "Client company name" },
      solution_name: { type: "string", description: "Name of the AI solution" },
      industry: {
        type: "string",
        enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
      },
      deployment_info: { type: "object", description: "Deployment details including go-live date and target users" },
      usage_metrics: { type: "object", description: "Current usage metrics" },
      engagement_indicators: { type: "object", description: "User engagement indicators" },
      behavioral_metrics: { type: "object", description: "Behavioral usage metrics" },
      change_context: { type: "object", description: "Change management context" },
      benchmarks: { type: "object", description: "Comparison benchmarks" },
      assessment_period: { type: "object", description: "Assessment date range" },
    },
    required: [
      "project_name",
      "client_name",
      "solution_name",
      "industry",
      "deployment_info",
      "usage_metrics",
      "assessment_period",
    ],
  },
};

// ============================================
// Implementation Helpers
// ============================================

function calculateDaysSinceGoLive(goLiveDate: string, endDate: string): number {
  const goLive = new Date(goLiveDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - goLive.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

function calculateAdoptionRate(activeUsers: number, targetUsers: number): number {
  if (targetUsers === 0) {return 0;}
  return Math.round((activeUsers / targetUsers) * 100 * 10) / 10;
}

function determineAdoptionStage(
  adoptionRate: number,
  daysSinceGoLive: number,
  velocity: string
): "initial" | "growing" | "mainstream" | "mature" | "declining" {
  if (velocity === "stalled" && adoptionRate < 30) {return "declining";}
  if (daysSinceGoLive < 30) {return "initial";}
  if (adoptionRate < 30) {return "initial";}
  if (adoptionRate < 60) {return "growing";}
  if (adoptionRate < 85) {return "mainstream";}
  return "mature";
}

function determineAdoptionVelocity(
  currentRate: number,
  previousRate: number | undefined,
  daysSinceGoLive: number
): "accelerating" | "steady" | "slowing" | "stalled" {
  if (previousRate === undefined) {
    // Estimate based on days since go-live and current rate
    const expectedRate = Math.min(100, daysSinceGoLive * 2);
    if (currentRate > expectedRate * 1.2) {return "accelerating";}
    if (currentRate < expectedRate * 0.5) {return "stalled";}
    return "steady";
  }

  const change = currentRate - previousRate;
  if (change > 10) {return "accelerating";}
  if (change > 0) {return "steady";}
  if (change > -5) {return "slowing";}
  return "stalled";
}

function determineAdoptionHealth(
  adoptionRate: number,
  satisfactionScore: number | undefined,
  supportTickets: number | undefined,
  targetUsers: number
): "healthy" | "at_risk" | "critical" {
  let healthScore = 0;

  // Adoption rate contribution
  if (adoptionRate >= 70) {healthScore += 3;}
  else if (adoptionRate >= 40) {healthScore += 2;}
  else if (adoptionRate >= 20) {healthScore += 1;}

  // Satisfaction contribution
  if (satisfactionScore !== undefined) {
    if (satisfactionScore >= 7) {healthScore += 2;}
    else if (satisfactionScore >= 5) {healthScore += 1;}
    else {healthScore -= 1;}
  }

  // Support burden contribution
  if (supportTickets !== undefined) {
    const ticketsPerUser = supportTickets / Math.max(1, targetUsers * (adoptionRate / 100));
    if (ticketsPerUser < 0.1) {healthScore += 1;}
    else if (ticketsPerUser > 0.5) {healthScore -= 1;}
  }

  if (healthScore >= 4) {return "healthy";}
  if (healthScore >= 2) {return "at_risk";}
  return "critical";
}

function calculateEngagementScore(input: MeasureAdoptionInput): number {
  let score = 0;
  let factors = 0;

  const { usage_metrics, engagement_indicators, behavioral_metrics } = input;

  // Daily to monthly active ratio (stickiness)
  if (usage_metrics.monthly_active_users > 0) {
    const stickiness = (usage_metrics.daily_sessions_avg * 30) / usage_metrics.monthly_active_users;
    score += Math.min(25, stickiness * 10);
    factors++;
  }

  // Session duration
  if (usage_metrics.avg_session_duration_minutes !== undefined) {
    if (usage_metrics.avg_session_duration_minutes >= 15) {score += 20;}
    else if (usage_metrics.avg_session_duration_minutes >= 5) {score += 10;}
    else {score += 5;}
    factors++;
  }

  // Feature utilization
  if (usage_metrics.features_used_count !== undefined && usage_metrics.total_features_available !== undefined) {
    const utilization = usage_metrics.features_used_count / usage_metrics.total_features_available;
    score += utilization * 20;
    factors++;
  }

  // Satisfaction
  if (engagement_indicators?.user_satisfaction_score !== undefined) {
    score += engagement_indicators.user_satisfaction_score * 2;
    factors++;
  }

  // Voluntary usage
  if (engagement_indicators?.voluntary_usage_percent !== undefined) {
    score += engagement_indicators.voluntary_usage_percent * 0.15;
    factors++;
  }

  // Workflow completion
  if (behavioral_metrics?.workflow_completion_rate !== undefined) {
    score += behavioral_metrics.workflow_completion_rate * 0.15;
    factors++;
  }

  // Normalize to 0-100
  return factors > 0 ? Math.min(100, Math.round(score / factors * 2)) : 50;
}

function determineEngagementLevel(
  score: number
): "highly_engaged" | "engaged" | "passive" | "disengaged" {
  if (score >= 75) {return "highly_engaged";}
  if (score >= 50) {return "engaged";}
  if (score >= 25) {return "passive";}
  return "disengaged";
}

function calculateUserSegments(
  input: MeasureAdoptionInput
): AdoptionMeasurement["engagement_analysis"]["user_segments"] {
  const { usage_metrics, engagement_indicators } = input;
  const totalTarget = input.deployment_info.total_target_users;

  const powerUsers = engagement_indicators?.power_users_count || Math.round(usage_metrics.active_users_count * 0.1);
  const activeUsers = usage_metrics.active_users_count;
  const weeklyActive = usage_metrics.weekly_active_users;

  const powerPercent = Math.round((powerUsers / totalTarget) * 100);
  const regularPercent = Math.round(((weeklyActive - powerUsers) / totalTarget) * 100);
  const occasionalPercent = Math.round(((activeUsers - weeklyActive) / totalTarget) * 100);
  const inactivePercent = Math.max(0, 100 - powerPercent - regularPercent - occasionalPercent);

  return {
    power_users_percent: Math.max(0, powerPercent),
    regular_users_percent: Math.max(0, regularPercent),
    occasional_users_percent: Math.max(0, occasionalPercent),
    inactive_users_percent: inactivePercent,
  };
}

function determineNPSCategory(nps: number | undefined): "promoter" | "passive" | "detractor" | "unknown" {
  if (nps === undefined) {return "unknown";}
  if (nps >= 50) {return "promoter";}
  if (nps >= 0) {return "passive";}
  return "detractor";
}

function determineSupportBurden(
  ticketsPerWeek: number | undefined,
  activeUsers: number
): "low" | "moderate" | "high" {
  if (ticketsPerWeek === undefined) {return "moderate";}
  const ticketsPerUser = ticketsPerWeek / Math.max(1, activeUsers);
  if (ticketsPerUser < 0.05) {return "low";}
  if (ticketsPerUser < 0.2) {return "moderate";}
  return "high";
}

function determineProficiencyLevel(
  input: MeasureAdoptionInput
): "expert" | "proficient" | "learning" | "novice" {
  const { behavioral_metrics, engagement_indicators } = input;

  let proficiencyScore = 0;

  if (behavioral_metrics?.error_rate_percent !== undefined) {
    if (behavioral_metrics.error_rate_percent < 5) {proficiencyScore += 3;}
    else if (behavioral_metrics.error_rate_percent < 15) {proficiencyScore += 2;}
    else {proficiencyScore += 1;}
  }

  if (behavioral_metrics?.workflow_completion_rate !== undefined) {
    if (behavioral_metrics.workflow_completion_rate >= 90) {proficiencyScore += 3;}
    else if (behavioral_metrics.workflow_completion_rate >= 70) {proficiencyScore += 2;}
    else {proficiencyScore += 1;}
  }

  if (engagement_indicators?.training_completion_percent !== undefined) {
    if (engagement_indicators.training_completion_percent >= 90) {proficiencyScore += 2;}
    else if (engagement_indicators.training_completion_percent >= 60) {proficiencyScore += 1;}
  }

  if (proficiencyScore >= 7) {return "expert";}
  if (proficiencyScore >= 5) {return "proficient";}
  if (proficiencyScore >= 3) {return "learning";}
  return "novice";
}

function determineWorkflowEfficiency(
  input: MeasureAdoptionInput
): "optimized" | "adequate" | "needs_improvement" {
  const { behavioral_metrics } = input;

  if (!behavioral_metrics) {return "adequate";}

  let efficiencyScore = 0;

  if (behavioral_metrics.workflow_completion_rate !== undefined) {
    if (behavioral_metrics.workflow_completion_rate >= 85) {efficiencyScore += 2;}
    else if (behavioral_metrics.workflow_completion_rate >= 60) {efficiencyScore += 1;}
  }

  if (behavioral_metrics.process_adherence_percent !== undefined) {
    if (behavioral_metrics.process_adherence_percent >= 90) {efficiencyScore += 2;}
    else if (behavioral_metrics.process_adherence_percent >= 70) {efficiencyScore += 1;}
  }

  if (efficiencyScore >= 3) {return "optimized";}
  if (efficiencyScore >= 1) {return "adequate";}
  return "needs_improvement";
}

function determineAITrustIndicator(
  input: MeasureAdoptionInput
): "high" | "medium" | "low" | "unknown" {
  const { behavioral_metrics } = input;

  if (!behavioral_metrics?.ai_recommendation_acceptance_rate) {return "unknown";}

  const acceptanceRate = behavioral_metrics.ai_recommendation_acceptance_rate;
  if (acceptanceRate >= 70) {return "high";}
  if (acceptanceRate >= 40) {return "medium";}
  return "low";
}

function identifyAdoptionRisks(
  input: MeasureAdoptionInput,
  adoptionRate: number,
  engagementScore: number
): AdoptionMeasurement["adoption_risks"] {
  const risks: AdoptionMeasurement["adoption_risks"]["risk_factors"] = [];

  const { deployment_info, usage_metrics, engagement_indicators, change_context } = input;
  const daysSinceGoLive = calculateDaysSinceGoLive(
    deployment_info.go_live_date,
    input.assessment_period.end_date
  );

  // Low adoption rate
  if (adoptionRate < 30 && daysSinceGoLive > 30) {
    risks.push({
      factor: "Low adoption rate despite time since launch",
      severity: "high",
      trend: "stable",
      mitigation: "Conduct user interviews to understand barriers; intensify change management",
    });
  }

  // Declining active users
  if (usage_metrics.weekly_active_users < usage_metrics.monthly_active_users * 0.3) {
    risks.push({
      factor: "Low weekly engagement relative to monthly users",
      severity: "medium",
      trend: "worsening",
      mitigation: "Implement engagement triggers and usage reminders; review value proposition",
    });
  }

  // High support burden
  if (engagement_indicators?.support_tickets_per_week !== undefined) {
    const ticketsPerUser = engagement_indicators.support_tickets_per_week / Math.max(1, usage_metrics.active_users_count);
    if (ticketsPerUser > 0.3) {
      risks.push({
        factor: "High support ticket volume per user",
        severity: "high",
        trend: "stable",
        mitigation: "Analyze ticket categories; enhance training and documentation",
      });
    }
  }

  // Low satisfaction
  if (engagement_indicators?.user_satisfaction_score !== undefined && engagement_indicators.user_satisfaction_score < 5) {
    risks.push({
      factor: "User satisfaction below acceptable threshold",
      severity: "high",
      trend: "worsening",
      mitigation: "Conduct satisfaction survey deep-dive; prioritize top pain points",
    });
  }

  // Low training completion
  if (engagement_indicators?.training_completion_percent !== undefined && engagement_indicators.training_completion_percent < 50) {
    risks.push({
      factor: "Low training completion rate",
      severity: "medium",
      trend: "stable",
      mitigation: "Make training more accessible; consider mandatory training gates",
    });
  }

  // Resistance incidents
  if (change_context?.resistance_incidents !== undefined && change_context.resistance_incidents > 5) {
    risks.push({
      factor: "Elevated change resistance incidents",
      severity: "medium",
      trend: "stable",
      mitigation: "Engage change champions; address concerns directly; executive communication",
    });
  }

  // Low engagement score
  if (engagementScore < 30) {
    risks.push({
      factor: "Overall engagement score critically low",
      severity: "high",
      trend: "worsening",
      mitigation: "Comprehensive engagement recovery plan; consider gamification or incentives",
    });
  }

  // Determine overall risk level
  const highRisks = risks.filter((r) => r.severity === "high").length;
  const mediumRisks = risks.filter((r) => r.severity === "medium").length;

  let riskLevel: "low" | "medium" | "high" | "critical";
  if (highRisks >= 2) {riskLevel = "critical";}
  else if (highRisks >= 1) {riskLevel = "high";}
  else if (mediumRisks >= 2) {riskLevel = "medium";}
  else {riskLevel = "low";}

  // Churn risk
  let churnRisk: "low" | "moderate" | "elevated" | "high";
  if (riskLevel === "critical") {churnRisk = "high";}
  else if (riskLevel === "high") {churnRisk = "elevated";}
  else if (riskLevel === "medium") {churnRisk = "moderate";}
  else {churnRisk = "low";}

  // Intervention urgency
  let interventionUrgency: "none" | "monitor" | "action_needed" | "urgent";
  if (riskLevel === "critical") {interventionUrgency = "urgent";}
  else if (riskLevel === "high") {interventionUrgency = "action_needed";}
  else if (riskLevel === "medium") {interventionUrgency = "monitor";}
  else {interventionUrgency = "none";}

  return {
    risk_level: riskLevel,
    risk_factors: risks,
    churn_risk_indicator: churnRisk,
    intervention_urgency: interventionUrgency,
  };
}

function generateRecommendations(
  input: MeasureAdoptionInput,
  adoptionRate: number,
  engagementScore: number,
  _risks: AdoptionMeasurement["adoption_risks"]
): AdoptionMeasurement["recommendations"] {
  const immediateActions: AdoptionMeasurement["recommendations"]["immediate_actions"] = [];
  const engagementStrategies: AdoptionMeasurement["recommendations"]["engagement_strategies"] = [];
  const trainingRecs: string[] = [];
  const communicationRecs: string[] = [];

  const { engagement_indicators, change_context } = input;

  // Based on adoption rate
  if (adoptionRate < 30) {
    immediateActions.push({
      action: "Launch targeted onboarding campaign for non-users",
      priority: "high",
      expected_impact: "15-25% increase in adoption rate",
      owner_suggestion: "Change Management Lead",
    });
    engagementStrategies.push({
      strategy: "Peer-to-peer advocacy program",
      target_segment: "Non-users in departments with high adoption",
      expected_outcome: "Organic growth through trusted colleagues",
    });
  }

  // Based on engagement
  if (engagementScore < 50) {
    immediateActions.push({
      action: "Implement quick-win features based on user feedback",
      priority: "high",
      expected_impact: "Improved daily usage and satisfaction",
      owner_suggestion: "Product Owner",
    });
    engagementStrategies.push({
      strategy: "Gamification and achievement badges",
      target_segment: "Occasional users",
      expected_outcome: "Convert occasional users to regular users",
    });
  }

  // Based on satisfaction
  if (engagement_indicators?.user_satisfaction_score !== undefined && engagement_indicators.user_satisfaction_score < 6) {
    immediateActions.push({
      action: "Conduct user experience review and quick fixes",
      priority: "high",
      expected_impact: "1-2 point satisfaction improvement",
      owner_suggestion: "UX Lead",
    });
  }

  // Based on training
  if (engagement_indicators?.training_completion_percent !== undefined && engagement_indicators.training_completion_percent < 60) {
    trainingRecs.push("Launch micro-learning modules for just-in-time training");
    trainingRecs.push("Create role-specific training paths");
    trainingRecs.push("Implement training completion incentives");
  } else {
    trainingRecs.push("Offer advanced training for power users");
    trainingRecs.push("Create best practice sharing sessions");
  }

  // Based on change context
  if (change_context?.change_champions_count !== undefined && change_context.change_champions_count < 5) {
    immediateActions.push({
      action: "Recruit and enable additional change champions",
      priority: "medium",
      expected_impact: "Improved grassroots support and adoption",
      owner_suggestion: "Change Management Lead",
    });
  }

  if (change_context?.executive_engagement_level === "low") {
    communicationRecs.push("Schedule executive town hall to reinforce strategic importance");
    communicationRecs.push("Create executive dashboard for visibility into adoption progress");
  }

  // Communication recommendations
  communicationRecs.push("Share success stories and ROI achievements");
  communicationRecs.push("Regular adoption progress updates to stakeholders");

  // Default recommendations if lists are empty
  if (immediateActions.length === 0) {
    immediateActions.push({
      action: "Continue monitoring adoption trends",
      priority: "medium",
      expected_impact: "Maintain healthy adoption trajectory",
      owner_suggestion: "Client Success Manager",
    });
  }

  if (engagementStrategies.length === 0) {
    engagementStrategies.push({
      strategy: "User appreciation and recognition program",
      target_segment: "Power users",
      expected_outcome: "Sustained engagement and advocacy",
    });
  }

  if (trainingRecs.length === 0) {
    trainingRecs.push("Maintain current training programs with regular updates");
  }

  return {
    immediate_actions: immediateActions,
    engagement_strategies: engagementStrategies,
    training_recommendations: trainingRecs,
    communication_recommendations: communicationRecs,
  };
}

function generateSuccessIndicators(
  adoptionRate: number,
  engagementScore: number,
  daysSinceGoLive: number
): AdoptionMeasurement["success_indicators"] {
  const achieved: string[] = [];
  const upcoming: AdoptionMeasurement["success_indicators"]["upcoming_milestones"] = [];
  const valueIndicators: string[] = [];

  // Achieved milestones
  if (adoptionRate >= 10) {achieved.push("Initial adoption threshold (10%) achieved");}
  if (adoptionRate >= 25) {achieved.push("Early majority adoption (25%) achieved");}
  if (adoptionRate >= 50) {achieved.push("Majority adoption (50%) achieved");}
  if (adoptionRate >= 75) {achieved.push("Broad adoption (75%) achieved");}
  if (engagementScore >= 50) {achieved.push("Healthy engagement level established");}
  if (daysSinceGoLive >= 30) {achieved.push("First month post go-live completed");}
  if (daysSinceGoLive >= 90) {achieved.push("First quarter post go-live completed");}

  // Upcoming milestones
  if (adoptionRate < 50) {
    upcoming.push({
      milestone: "50% adoption rate",
      target_date: `${Math.ceil((50 - adoptionRate) / 5)} weeks`,
      likelihood: adoptionRate > 30 ? "on_track" : adoptionRate > 15 ? "at_risk" : "unlikely",
    });
  }
  if (adoptionRate < 75 && adoptionRate >= 50) {
    upcoming.push({
      milestone: "75% adoption rate",
      target_date: `${Math.ceil((75 - adoptionRate) / 3)} weeks`,
      likelihood: adoptionRate > 60 ? "on_track" : "at_risk",
    });
  }
  upcoming.push({
    milestone: "Steady-state operations",
    target_date: daysSinceGoLive < 90 ? `${90 - daysSinceGoLive} days` : "Achieved",
    likelihood: daysSinceGoLive >= 60 ? "on_track" : "at_risk",
  });

  // Value realization indicators
  if (adoptionRate >= 30) {valueIndicators.push("Sufficient user base for measurable impact");}
  if (engagementScore >= 50) {valueIndicators.push("Users actively engaging with solution capabilities");}
  if (adoptionRate >= 50 && engagementScore >= 50) {
    valueIndicators.push("Strong foundation for ROI measurement");
    valueIndicators.push("Ready for expanded use case deployment");
  }

  if (valueIndicators.length === 0) {
    valueIndicators.push("Building foundation for value realization");
  }

  return {
    adoption_milestones_achieved: achieved,
    upcoming_milestones: upcoming,
    value_realization_indicators: valueIndicators,
  };
}

function generateTrendAnalysis(
  input: MeasureAdoptionInput,
  adoptionRate: number,
  velocity: string
): AdoptionMeasurement["trend_analysis"] {
  const { benchmarks } = input;

  // Determine trajectory
  let trajectory: "positive" | "neutral" | "negative";
  if (velocity === "accelerating") {trajectory = "positive";}
  else if (velocity === "steady") {trajectory = "neutral";}
  else {trajectory = "negative";}

  // Calculate 30-day projection
  let projectedRate: number;
  let confidence: "high" | "medium" | "low";

  if (benchmarks?.previous_period_active_users !== undefined) {
    const previousRate = calculateAdoptionRate(
      benchmarks.previous_period_active_users,
      input.deployment_info.total_target_users
    );
    const growthRate = (adoptionRate - previousRate) / Math.max(1, previousRate);
    projectedRate = Math.min(100, adoptionRate * (1 + growthRate));
    confidence = "medium";
  } else {
    // Estimate based on velocity
    const velocityMultipliers = { accelerating: 1.3, steady: 1.1, slowing: 1.0, stalled: 0.95 };
    projectedRate = Math.min(100, adoptionRate * (velocityMultipliers[velocity as keyof typeof velocityMultipliers] || 1));
    confidence = "low";
  }

  // Inflection points
  const inflectionPoints: string[] = [];
  if (adoptionRate > 20 && adoptionRate < 30) {
    inflectionPoints.push("Approaching early majority threshold (25-30%)");
  }
  if (adoptionRate > 45 && adoptionRate < 55) {
    inflectionPoints.push("At critical mass inflection point (50%)");
  }
  if (velocity === "slowing" || velocity === "stalled") {
    inflectionPoints.push("Adoption velocity declining - intervention may be needed");
  }

  return {
    adoption_trajectory: trajectory,
    forecast_30_day: {
      projected_adoption_rate: Math.round(projectedRate),
      confidence,
    },
    inflection_points: inflectionPoints.length > 0 ? inflectionPoints : ["No significant inflection points identified"],
    seasonality_notes: "Consider business cycles, holidays, and industry-specific patterns when interpreting trends",
  };
}

// ============================================
// Main Export Function
// ============================================

export function measureAdoption(input: MeasureAdoptionInput): AdoptionMeasurement {
  const {
    project_name,
    client_name,
    solution_name,
    deployment_info,
    usage_metrics,
    engagement_indicators,
    benchmarks,
    assessment_period,
  } = input;

  const daysSinceGoLive = calculateDaysSinceGoLive(deployment_info.go_live_date, assessment_period.end_date);

  // Calculate core metrics
  const adoptionRate = calculateAdoptionRate(usage_metrics.active_users_count, deployment_info.total_target_users);
  const weeklyActiveRate = calculateAdoptionRate(usage_metrics.weekly_active_users, deployment_info.total_target_users);
  const monthlyActiveRate = calculateAdoptionRate(usage_metrics.monthly_active_users, deployment_info.total_target_users);

  // Determine adoption velocity
  const velocity = determineAdoptionVelocity(
    adoptionRate,
    benchmarks?.previous_period_active_users
      ? calculateAdoptionRate(benchmarks.previous_period_active_users, deployment_info.total_target_users)
      : undefined,
    daysSinceGoLive
  );

  // Determine adoption stage and health
  const adoptionStage = determineAdoptionStage(adoptionRate, daysSinceGoLive, velocity);
  const adoptionHealth = determineAdoptionHealth(
    adoptionRate,
    engagement_indicators?.user_satisfaction_score,
    engagement_indicators?.support_tickets_per_week,
    deployment_info.total_target_users
  );

  // Calculate engagement score
  const engagementScore = calculateEngagementScore(input);
  const engagementLevel = determineEngagementLevel(engagementScore);

  // Calculate user segments
  const userSegments = calculateUserSegments(input);

  // Satisfaction metrics
  const npsCategory = determineNPSCategory(engagement_indicators?.nps_score);
  const supportBurden = determineSupportBurden(
    engagement_indicators?.support_tickets_per_week,
    usage_metrics.active_users_count
  );

  // Behavioral insights
  const proficiencyLevel = determineProficiencyLevel(input);
  const workflowEfficiency = determineWorkflowEfficiency(input);
  const aiTrustIndicator = determineAITrustIndicator(input);

  // Feature adoption
  const featureUtilization = usage_metrics.features_used_count && usage_metrics.total_features_available
    ? Math.round((usage_metrics.features_used_count / usage_metrics.total_features_available) * 100)
    : 50;

  // Benchmark comparisons
  const vsTarget = benchmarks?.target_adoption_rate
    ? Math.round((adoptionRate / benchmarks.target_adoption_rate) * 100)
    : 100;
  const onTrack = vsTarget >= 80;

  let vsIndustry: "above" | "at" | "below" | "unknown" = "unknown";
  if (benchmarks?.industry_avg_adoption_rate !== undefined) {
    if (adoptionRate > benchmarks.industry_avg_adoption_rate * 1.1) {vsIndustry = "above";}
    else if (adoptionRate >= benchmarks.industry_avg_adoption_rate * 0.9) {vsIndustry = "at";}
    else {vsIndustry = "below";}
  }

  // Adoption change vs previous
  let adoptionChange: number | null = null;
  let engagementChange: "improved" | "stable" | "declined" | "unknown" = "unknown";
  if (benchmarks?.previous_period_active_users !== undefined) {
    const previousRate = calculateAdoptionRate(benchmarks.previous_period_active_users, deployment_info.total_target_users);
    adoptionChange = Math.round((adoptionRate - previousRate) * 10) / 10;
    if (adoptionChange > 5) {engagementChange = "improved";}
    else if (adoptionChange >= -2) {engagementChange = "stable";}
    else {engagementChange = "declined";}
  }

  // Identify risks
  const adoptionRisks = identifyAdoptionRisks(input, adoptionRate, engagementScore);

  // Generate recommendations
  const recommendations = generateRecommendations(input, adoptionRate, engagementScore, adoptionRisks);

  // Success indicators
  const successIndicators = generateSuccessIndicators(adoptionRate, engagementScore, daysSinceGoLive);

  // Trend analysis
  const trendAnalysis = generateTrendAnalysis(input, adoptionRate, velocity);

  // Estimate new and churned users
  const previousActive = benchmarks?.previous_period_active_users || Math.round(usage_metrics.active_users_count * 0.9);
  const newUsers = Math.max(0, usage_metrics.active_users_count - previousActive);
  const churnedEstimate = Math.max(0, Math.round(previousActive * 0.05));

  // Satisfaction indicator
  let satisfactionIndicator: "positive" | "neutral" | "negative" | "unknown" = "unknown";
  if (engagement_indicators?.user_satisfaction_score !== undefined) {
    if (engagement_indicators.user_satisfaction_score >= 7) {satisfactionIndicator = "positive";}
    else if (engagement_indicators.user_satisfaction_score >= 5) {satisfactionIndicator = "neutral";}
    else {satisfactionIndicator = "negative";}
  }

  return {
    project_name,
    client_name,
    solution_name,
    assessment_date: new Date().toISOString().split("T")[0],
    assessment_period: {
      start_date: assessment_period.start_date,
      end_date: assessment_period.end_date,
      days_since_go_live: daysSinceGoLive,
    },

    adoption_summary: {
      overall_adoption_score: Math.round(adoptionRate),
      adoption_stage: adoptionStage,
      adoption_velocity: velocity,
      adoption_health: adoptionHealth,
      key_metrics_snapshot: {
        adoption_rate_percent: adoptionRate,
        active_user_rate_percent: monthlyActiveRate,
        engagement_score: engagementScore,
        satisfaction_indicator: satisfactionIndicator,
      },
    },

    adoption_metrics: {
      user_adoption: {
        adoption_rate_percent: adoptionRate,
        weekly_active_rate_percent: weeklyActiveRate,
        monthly_active_rate_percent: monthlyActiveRate,
        user_growth_trend: velocity === "accelerating" ? "growing" : velocity === "stalled" ? "declining" : "stable",
        new_users_this_period: newUsers,
        churned_users_estimate: churnedEstimate,
      },
      feature_adoption: {
        feature_utilization_percent: featureUtilization,
        core_features_adoption: featureUtilization >= 70 ? "high" : featureUtilization >= 40 ? "medium" : "low",
        advanced_features_adoption: featureUtilization >= 50 ? "medium" : "low",
        underutilized_features: featureUtilization < 70
          ? ["Advanced analytics", "Custom reporting", "Integration features"]
          : [],
      },
      depth_of_use: {
        avg_session_duration_minutes: usage_metrics.avg_session_duration_minutes || 10,
        sessions_per_user_per_week: usage_metrics.weekly_active_users > 0
          ? Math.round((usage_metrics.daily_sessions_avg * 7) / usage_metrics.weekly_active_users * 10) / 10
          : 0,
        tasks_per_session: input.behavioral_metrics?.tasks_completed_per_user || 5,
        depth_score: Math.round(engagementScore * 0.8),
      },
    },

    engagement_analysis: {
      engagement_score: engagementScore,
      engagement_level: engagementLevel,
      user_segments: userSegments,
      engagement_drivers: [
        "Core workflow automation value",
        "Time savings on repetitive tasks",
        engagementScore >= 50 ? "Positive user experience" : "Adequate functionality",
      ],
      engagement_barriers: engagementScore < 50
        ? ["Learning curve", "Feature discoverability", "Integration friction"]
        : ["Advanced feature complexity"],
    },

    satisfaction_metrics: {
      satisfaction_score: engagement_indicators?.user_satisfaction_score ?? null,
      nps_score: engagement_indicators?.nps_score ?? null,
      nps_category: npsCategory,
      support_burden: supportBurden,
      sentiment_trend: engagementChange === "improved" ? "improving" : engagementChange === "declined" ? "declining" : "stable",
      top_satisfaction_drivers: ["Ease of use", "Time savings", "Reliability"],
      top_dissatisfaction_drivers: supportBurden === "high"
        ? ["Response time", "Bug frequency", "Missing features"]
        : ["Minor UX improvements needed"],
    },

    behavioral_insights: {
      proficiency_level: proficiencyLevel,
      workflow_efficiency: workflowEfficiency,
      ai_trust_indicator: aiTrustIndicator,
      usage_patterns: {
        peak_usage_times: ["9-11 AM", "2-4 PM"],
        common_workflows: ["Data entry automation", "Report generation", "Process monitoring"],
        abandonment_points: engagementScore < 50 ? ["Complex configurations", "Multi-step workflows"] : [],
      },
    },

    benchmark_comparison: {
      vs_target: {
        adoption_rate_vs_target: vsTarget,
        satisfaction_vs_target: benchmarks?.target_satisfaction_score && engagement_indicators?.user_satisfaction_score
          ? Math.round((engagement_indicators.user_satisfaction_score / benchmarks.target_satisfaction_score) * 100)
          : null,
        on_track: onTrack,
      },
      vs_industry: {
        adoption_vs_industry_avg: vsIndustry,
        percentile_estimate: vsIndustry === "above" ? 75 : vsIndustry === "at" ? 50 : vsIndustry === "below" ? 25 : null,
      },
      vs_previous_period: {
        adoption_change_percent: adoptionChange,
        engagement_change: engagementChange,
      },
    },

    adoption_risks: adoptionRisks,

    recommendations,

    success_indicators: successIndicators,

    trend_analysis: trendAnalysis,

    methodology_note:
      "Adoption measurement follows Good AI Client Success methodology, incorporating user engagement analytics, behavioral patterns, and industry benchmarks. Metrics are calculated based on active usage data and contextual factors. Regular measurement cadence (weekly/monthly) is recommended for trend accuracy.",
  };
}
