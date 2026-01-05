/**
 * Tests for predict_churn_risk tool
 * Good AI Client Success: Churn Risk Prediction
 */

import { describe, it, expect } from "@jest/globals";
import {
  predictChurnRisk,
  PredictChurnRiskInputSchema,
  PREDICT_CHURN_RISK_TOOL,
  type PredictChurnRiskInput,
  type ChurnRiskPrediction,
} from "../src/tools/predict_churn_risk.js";

// ============================================
// Helper: Create Valid Test Input
// ============================================

function createValidInput(
  overrides: Partial<PredictChurnRiskInput> = {}
): PredictChurnRiskInput {
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 6);
  const pastDate = new Date();
  pastDate.setFullYear(pastDate.getFullYear() - 1);

  return {
    client_name: "Test Client Corp",
    industry: "manufacturing",
    account_info: {
      contract_start_date: pastDate.toISOString().split("T")[0],
      contract_end_date: futureDate.toISOString().split("T")[0],
      contract_value_annual_usd: 500000,
      account_tier: "enterprise",
      number_of_solutions: 3,
      active_users: 80,
      licensed_users: 100,
    },
    engagement_metrics: {
      monthly_active_user_percent: 75,
      login_frequency_trend: "stable",
      feature_utilization_percent: 60,
      support_ticket_volume: "moderate",
      support_sentiment: "positive",
      last_engagement_days_ago: 5,
      executive_engagement: "regular",
    },
    satisfaction_indicators: {
      nps_score: 45,
      csat_score: 8,
      recent_survey_response: "satisfied",
      complaint_count_last_90_days: 1,
      escalation_count_last_90_days: 0,
      reference_willingness: true,
    },
    value_metrics: {
      roi_achieved_percent: 85,
      value_vs_expectation: "meeting",
      business_case_status: "tracking",
      expansion_discussions: true,
      budget_changes: "stable",
    },
    relationship_health: {
      executive_sponsor_status: "engaged",
      champion_count: 5,
      key_contact_changes: 0,
      competitor_mentions: 0,
      renewal_discussions_started: true,
      payment_issues: false,
    },
    recent_events: {
      major_incidents: 0,
      service_disruptions: 0,
      missed_slas: 0,
      successful_projects: 2,
      expansion_wins: 1,
    },
    external_factors: {
      client_financial_health: "strong",
      industry_disruption: false,
      leadership_changes: false,
      m_and_a_activity: false,
      strategic_shift: false,
    },
    ...overrides,
  };
}

// ============================================
// Tool Definition Tests
// ============================================

describe("PREDICT_CHURN_RISK_TOOL", () => {
  it("should have correct name", () => {
    expect(PREDICT_CHURN_RISK_TOOL.name).toBe("predict_churn_risk");
  });

  it("should have a description", () => {
    expect(PREDICT_CHURN_RISK_TOOL.description).toBeDefined();
    expect(PREDICT_CHURN_RISK_TOOL.description.length).toBeGreaterThan(10);
  });

  it("should have required properties in input schema", () => {
    const schema = PREDICT_CHURN_RISK_TOOL.inputSchema;
    expect(schema.required).toContain("client_name");
    expect(schema.required).toContain("industry");
    expect(schema.required).toContain("account_info");
    expect(schema.required).toContain("engagement_metrics");
    expect(schema.required).toContain("satisfaction_indicators");
    expect(schema.required).toContain("value_metrics");
    expect(schema.required).toContain("relationship_health");
  });
});

// ============================================
// Input Schema Validation Tests
// ============================================

describe("PredictChurnRiskInputSchema", () => {
  it("should accept valid input", () => {
    const input = createValidInput();
    const result = PredictChurnRiskInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should reject empty client_name", () => {
    const input = createValidInput({ client_name: "" });
    const result = PredictChurnRiskInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject invalid industry", () => {
    const input = { ...createValidInput(), industry: "invalid" };
    const result = PredictChurnRiskInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept all valid industries", () => {
    const industries = ["manufacturing", "insurance", "aquaculture", "healthcare", "general"];
    industries.forEach((industry) => {
      const input = createValidInput({ industry: industry as PredictChurnRiskInput["industry"] });
      const result = PredictChurnRiskInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  it("should validate date format", () => {
    const input = createValidInput();
    input.account_info.contract_end_date = "invalid-date";
    const result = PredictChurnRiskInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should allow optional fields to be omitted", () => {
    const input = createValidInput();
    delete input.recent_events;
    delete input.external_factors;
    const result = PredictChurnRiskInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should reject negative contract value", () => {
    const input = createValidInput();
    input.account_info.contract_value_annual_usd = -1000;
    const result = PredictChurnRiskInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject NPS score outside range", () => {
    const input = createValidInput();
    input.satisfaction_indicators.nps_score = 150;
    const result = PredictChurnRiskInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept NPS score at boundaries", () => {
    const inputLow = createValidInput();
    inputLow.satisfaction_indicators.nps_score = -100;
    const resultLow = PredictChurnRiskInputSchema.safeParse(inputLow);
    expect(resultLow.success).toBe(true);

    const inputHigh = createValidInput();
    inputHigh.satisfaction_indicators.nps_score = 100;
    const resultHigh = PredictChurnRiskInputSchema.safeParse(inputHigh);
    expect(resultHigh.success).toBe(true);
  });
});

// ============================================
// Core Function Tests
// ============================================

describe("predictChurnRisk", () => {
  it("should return prediction with all required fields", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.client_name).toBe(input.client_name);
    expect(result.prediction_date).toBeDefined();
    expect(result.risk_summary).toBeDefined();
    expect(result.risk_factors).toBeDefined();
    expect(result.category_scores).toBeDefined();
    expect(result.warning_signals).toBeDefined();
    expect(result.churn_indicators).toBeDefined();
    expect(result.scenarios).toBeDefined();
    expect(result.retention_strategy).toBeDefined();
    expect(result.health_timeline).toBeDefined();
    expect(result.competitive_assessment).toBeDefined();
    expect(result.revenue_impact).toBeDefined();
    expect(result.success_indicators).toBeDefined();
    expect(result.methodology_note).toBeDefined();
  });

  it("should return valid risk summary structure", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.risk_summary.churn_risk_score).toBeGreaterThanOrEqual(0);
    expect(result.risk_summary.churn_risk_score).toBeLessThanOrEqual(100);
    expect(["low", "moderate", "elevated", "high", "critical"]).toContain(result.risk_summary.risk_level);
    expect(["improving", "stable", "deteriorating"]).toContain(result.risk_summary.risk_trend);
    expect(["high", "medium", "low"]).toContain(result.risk_summary.confidence);
    expect(result.risk_summary.days_until_contract_end).toBeGreaterThanOrEqual(0);
    expect(result.risk_summary.renewal_probability_percent).toBeGreaterThanOrEqual(0);
    expect(result.risk_summary.renewal_probability_percent).toBeLessThanOrEqual(100);
    expect(["immediate", "this_quarter", "this_half", "monitor"]).toContain(result.risk_summary.urgency);
  });

  it("should calculate category scores correctly", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.category_scores.engagement_score).toBeGreaterThanOrEqual(0);
    expect(result.category_scores.engagement_score).toBeLessThanOrEqual(100);
    expect(result.category_scores.satisfaction_score).toBeGreaterThanOrEqual(0);
    expect(result.category_scores.satisfaction_score).toBeLessThanOrEqual(100);
    expect(result.category_scores.value_realization_score).toBeGreaterThanOrEqual(0);
    expect(result.category_scores.value_realization_score).toBeLessThanOrEqual(100);
    expect(result.category_scores.relationship_score).toBeGreaterThanOrEqual(0);
    expect(result.category_scores.relationship_score).toBeLessThanOrEqual(100);
    expect(result.category_scores.overall_health_score).toBeGreaterThanOrEqual(0);
    expect(result.category_scores.overall_health_score).toBeLessThanOrEqual(100);
  });
});

// ============================================
// Risk Level Tests
// ============================================

describe("Risk Level Calculation", () => {
  it("should return low risk for healthy account", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    // With good metrics, risk should be low or moderate
    expect(["low", "moderate"]).toContain(result.risk_summary.risk_level);
    expect(result.risk_summary.churn_risk_score).toBeLessThan(40);
  });

  it("should return high risk for unhealthy account", () => {
    const input = createValidInput({
      engagement_metrics: {
        monthly_active_user_percent: 15,
        login_frequency_trend: "significantly_decreasing",
        feature_utilization_percent: 20,
        support_sentiment: "very_negative",
        executive_engagement: "none",
      },
      satisfaction_indicators: {
        nps_score: -40,
        csat_score: 3,
        recent_survey_response: "very_dissatisfied",
        complaint_count_last_90_days: 10,
        escalation_count_last_90_days: 5,
        reference_willingness: false,
      },
      value_metrics: {
        roi_achieved_percent: -10,
        value_vs_expectation: "significantly_below",
        business_case_status: "failed",
        expansion_discussions: false,
        budget_changes: "significantly_reduced",
      },
      relationship_health: {
        executive_sponsor_status: "departed",
        champion_count: 0,
        key_contact_changes: 5,
        competitor_mentions: 3,
        renewal_discussions_started: false,
        payment_issues: true,
      },
    });
    const result = predictChurnRisk(input);

    expect(["high", "critical"]).toContain(result.risk_summary.risk_level);
    expect(result.risk_summary.churn_risk_score).toBeGreaterThan(60);
  });

  it("should return elevated risk for mixed signals", () => {
    const input = createValidInput({
      engagement_metrics: {
        monthly_active_user_percent: 50,
        login_frequency_trend: "decreasing",
        feature_utilization_percent: 40,
        support_sentiment: "neutral",
        executive_engagement: "occasional",
      },
      satisfaction_indicators: {
        nps_score: 10,
        csat_score: 5,
        recent_survey_response: "neutral",
        complaint_count_last_90_days: 3,
        escalation_count_last_90_days: 1,
        reference_willingness: false,
      },
      value_metrics: {
        value_vs_expectation: "below",
        business_case_status: "at_risk",
        expansion_discussions: false,
        budget_changes: "reduced",
      },
    });
    const result = predictChurnRisk(input);

    expect(["moderate", "elevated", "high"]).toContain(result.risk_summary.risk_level);
  });
});

// ============================================
// Warning Signals Tests
// ============================================

describe("Warning Signals", () => {
  it("should detect critical signal for departed sponsor", () => {
    const input = createValidInput({
      relationship_health: {
        ...createValidInput().relationship_health,
        executive_sponsor_status: "departed",
      },
    });
    const result = predictChurnRisk(input);

    const criticalSignals = result.warning_signals.filter((s) => s.severity === "critical");
    expect(criticalSignals.length).toBeGreaterThan(0);
    const sponsorSignal = criticalSignals.find((s) => s.signal.toLowerCase().includes("sponsor"));
    expect(sponsorSignal).toBeDefined();
  });

  it("should detect warning for competitor mentions", () => {
    const input = createValidInput({
      relationship_health: {
        ...createValidInput().relationship_health,
        competitor_mentions: 2,
      },
    });
    const result = predictChurnRisk(input);

    const competitorSignal = result.warning_signals.find(
      (s) => s.signal.toLowerCase().includes("competitor")
    );
    expect(competitorSignal).toBeDefined();
    expect(competitorSignal?.severity).toBe("warning");
  });

  it("should detect caution for no executive engagement", () => {
    const input = createValidInput({
      engagement_metrics: {
        ...createValidInput().engagement_metrics,
        executive_engagement: "none",
      },
    });
    const result = predictChurnRisk(input);

    const engagementSignal = result.warning_signals.find(
      (s) => s.signal.toLowerCase().includes("executive")
    );
    expect(engagementSignal).toBeDefined();
  });

  it("should detect critical signal for multiple escalations", () => {
    const input = createValidInput({
      satisfaction_indicators: {
        ...createValidInput().satisfaction_indicators,
        escalation_count_last_90_days: 5,
      },
    });
    const result = predictChurnRisk(input);

    const escalationSignal = result.warning_signals.find(
      (s) => s.signal.toLowerCase().includes("escalation")
    );
    expect(escalationSignal).toBeDefined();
    expect(escalationSignal?.severity).toBe("critical");
  });

  it("should have no critical signals for healthy account", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    const criticalSignals = result.warning_signals.filter((s) => s.severity === "critical");
    expect(criticalSignals.length).toBe(0);
  });
});

// ============================================
// Risk Factor Tests
// ============================================

describe("Risk Factors", () => {
  it("should identify low adoption as risk factor", () => {
    const input = createValidInput({
      engagement_metrics: {
        ...createValidInput().engagement_metrics,
        monthly_active_user_percent: 20,
      },
    });
    const result = predictChurnRisk(input);

    const adoptionFactor = result.risk_factors.find(
      (f) => f.factor.toLowerCase().includes("adoption")
    );
    expect(adoptionFactor).toBeDefined();
    expect(adoptionFactor?.category).toBe("Engagement");
  });

  it("should identify negative NPS as risk factor", () => {
    const input = createValidInput({
      satisfaction_indicators: {
        ...createValidInput().satisfaction_indicators,
        nps_score: -30,
      },
    });
    const result = predictChurnRisk(input);

    const npsFactor = result.risk_factors.find(
      (f) => f.factor.toLowerCase().includes("nps")
    );
    expect(npsFactor).toBeDefined();
    expect(npsFactor?.category).toBe("Satisfaction");
  });

  it("should identify budget reduction as risk factor", () => {
    const input = createValidInput({
      value_metrics: {
        ...createValidInput().value_metrics,
        budget_changes: "significantly_reduced",
      },
    });
    const result = predictChurnRisk(input);

    const budgetFactor = result.risk_factors.find(
      (f) => f.factor.toLowerCase().includes("budget")
    );
    expect(budgetFactor).toBeDefined();
    expect(budgetFactor?.category).toBe("Value");
  });

  it("should identify M&A activity as external risk", () => {
    const input = createValidInput({
      external_factors: {
        ...createValidInput().external_factors,
        m_and_a_activity: true,
      },
    });
    const result = predictChurnRisk(input);

    const maFactor = result.risk_factors.find(
      (f) => f.factor.toLowerCase().includes("m&a")
    );
    expect(maFactor).toBeDefined();
    expect(maFactor?.category).toBe("External");
  });

  it("should sort risk factors by impact score", () => {
    const input = createValidInput({
      engagement_metrics: {
        monthly_active_user_percent: 10,
        login_frequency_trend: "significantly_decreasing",
        executive_engagement: "none",
      },
      satisfaction_indicators: {
        nps_score: -50,
        escalation_count_last_90_days: 4,
      },
      value_metrics: {
        value_vs_expectation: "significantly_below",
        budget_changes: "significantly_reduced",
      },
      relationship_health: {
        executive_sponsor_status: "departed",
        competitor_mentions: 2,
        payment_issues: true,
      },
    });
    const result = predictChurnRisk(input);

    for (let i = 1; i < result.risk_factors.length; i++) {
      expect(result.risk_factors[i - 1].impact_score).toBeGreaterThanOrEqual(
        result.risk_factors[i].impact_score
      );
    }
  });
});

// ============================================
// Retention Strategy Tests
// ============================================

describe("Retention Strategy", () => {
  it("should always have priority actions", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.retention_strategy.priority_actions.length).toBeGreaterThan(0);
  });

  it("should include emergency actions for high risk", () => {
    const input = createValidInput({
      engagement_metrics: {
        monthly_active_user_percent: 10,
        login_frequency_trend: "significantly_decreasing",
        support_sentiment: "very_negative",
        executive_engagement: "none",
      },
      satisfaction_indicators: {
        nps_score: -50,
        escalation_count_last_90_days: 5,
      },
      value_metrics: {
        value_vs_expectation: "significantly_below",
        business_case_status: "failed",
      },
      relationship_health: {
        executive_sponsor_status: "departed",
        champion_count: 0,
        competitor_mentions: 3,
      },
    });
    const result = predictChurnRisk(input);

    const emergencyAction = result.retention_strategy.priority_actions.find(
      (a) => a.action.toLowerCase().includes("emergency") || a.timeline.toLowerCase().includes("week")
    );
    expect(emergencyAction).toBeDefined();
  });

  it("should include adoption actions for low usage", () => {
    const input = createValidInput({
      engagement_metrics: {
        ...createValidInput().engagement_metrics,
        monthly_active_user_percent: 30,
      },
    });
    const result = predictChurnRisk(input);

    const adoptionAction = result.retention_strategy.priority_actions.find(
      (a) => a.action.toLowerCase().includes("adoption")
    );
    expect(adoptionAction).toBeDefined();
  });

  it("should have save plays", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.retention_strategy.save_plays.length).toBeGreaterThan(0);
  });

  it("should have relationship actions", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.retention_strategy.relationship_actions.length).toBeGreaterThan(0);
  });
});

// ============================================
// Scenario Tests
// ============================================

describe("Scenarios", () => {
  it("should have most likely scenario", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.scenarios.most_likely).toBeDefined();
    expect(["renew", "reduce", "churn"]).toContain(result.scenarios.most_likely.outcome);
    expect(result.scenarios.most_likely.probability_percent).toBeGreaterThanOrEqual(0);
    expect(result.scenarios.most_likely.probability_percent).toBeLessThanOrEqual(100);
  });

  it("should have best case scenario", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.scenarios.best_case).toBeDefined();
    expect(["expand", "renew"]).toContain(result.scenarios.best_case.outcome);
    expect(result.scenarios.best_case.conditions.length).toBeGreaterThan(0);
  });

  it("should have worst case scenario", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.scenarios.worst_case).toBeDefined();
    expect(["churn", "reduce"]).toContain(result.scenarios.worst_case.outcome);
    expect(result.scenarios.worst_case.triggers.length).toBeGreaterThan(0);
  });

  it("should predict renewal for healthy account", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.scenarios.most_likely.outcome).toBe("renew");
  });

  it("should predict churn for unhealthy account", () => {
    const input = createValidInput({
      engagement_metrics: {
        monthly_active_user_percent: 10,
        login_frequency_trend: "significantly_decreasing",
        support_sentiment: "very_negative",
        executive_engagement: "none",
      },
      satisfaction_indicators: {
        nps_score: -60,
        csat_score: 2,
        recent_survey_response: "very_dissatisfied",
        escalation_count_last_90_days: 5,
      },
      value_metrics: {
        value_vs_expectation: "significantly_below",
        business_case_status: "failed",
        budget_changes: "significantly_reduced",
      },
      relationship_health: {
        executive_sponsor_status: "departed",
        champion_count: 0,
        competitor_mentions: 4,
        payment_issues: true,
      },
    });
    const result = predictChurnRisk(input);

    expect(["churn", "reduce"]).toContain(result.scenarios.most_likely.outcome);
  });
});

// ============================================
// Competitive Assessment Tests
// ============================================

describe("Competitive Assessment", () => {
  it("should have competitive threat level", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(["low", "moderate", "high"]).toContain(result.competitive_assessment.threat_level);
  });

  it("should identify high threat for competitor mentions", () => {
    const input = createValidInput({
      relationship_health: {
        ...createValidInput().relationship_health,
        competitor_mentions: 4,
      },
    });
    const result = predictChurnRisk(input);

    expect(result.competitive_assessment.threat_level).toBe("high");
  });

  it("should include industry-specific competitors", () => {
    const input = createValidInput({ industry: "manufacturing" });
    const result = predictChurnRisk(input);

    expect(result.competitive_assessment.likely_competitors.length).toBeGreaterThan(0);
  });

  it("should identify vulnerabilities for low adoption", () => {
    const input = createValidInput({
      engagement_metrics: {
        ...createValidInput().engagement_metrics,
        monthly_active_user_percent: 30,
      },
    });
    const result = predictChurnRisk(input);

    const switchingVulnerability = result.competitive_assessment.vulnerability_areas.find(
      (v) => v.toLowerCase().includes("switching")
    );
    expect(switchingVulnerability).toBeDefined();
  });
});

// ============================================
// Revenue Impact Tests
// ============================================

describe("Revenue Impact", () => {
  it("should calculate current ARR correctly", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.revenue_impact.current_arr_usd).toBe(input.account_info.contract_value_annual_usd);
  });

  it("should calculate at-risk ARR based on churn score", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.revenue_impact.at_risk_arr_usd).toBeGreaterThanOrEqual(0);
    expect(result.revenue_impact.at_risk_arr_usd).toBeLessThanOrEqual(
      input.account_info.contract_value_annual_usd
    );
  });

  it("should show expansion potential when discussions active", () => {
    const input = createValidInput({
      value_metrics: {
        ...createValidInput().value_metrics,
        expansion_discussions: true,
      },
    });
    const result = predictChurnRisk(input);

    expect(result.revenue_impact.expansion_potential_usd).toBeGreaterThan(0);
  });

  it("should have no expansion potential without discussions", () => {
    const input = createValidInput({
      value_metrics: {
        ...createValidInput().value_metrics,
        expansion_discussions: false,
      },
    });
    const result = predictChurnRisk(input);

    expect(result.revenue_impact.expansion_potential_usd).toBe(0);
  });

  it("should have high confidence for low risk account", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    // Low churn score should mean high confidence
    if (result.risk_summary.churn_risk_score <= 30) {
      expect(result.revenue_impact.revenue_confidence).toBe("high");
    }
  });
});

// ============================================
// Health Timeline Tests
// ============================================

describe("Health Timeline", () => {
  it("should have current status", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.health_timeline.current_status).toBeDefined();
    expect(result.health_timeline.current_status.length).toBeGreaterThan(0);
  });

  it("should have 30-day outlook", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.health_timeline.next_30_days).toBeDefined();
    expect(result.health_timeline.next_30_days.length).toBeGreaterThan(0);
  });

  it("should have renewal readiness assessment", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(["ready", "needs_work", "at_risk", "critical"]).toContain(
      result.health_timeline.renewal_readiness
    );
  });

  it("should show critical renewal readiness for high risk", () => {
    const input = createValidInput({
      engagement_metrics: {
        monthly_active_user_percent: 10,
        login_frequency_trend: "significantly_decreasing",
        support_sentiment: "very_negative",
        executive_engagement: "none",
      },
      satisfaction_indicators: {
        nps_score: -50,
        escalation_count_last_90_days: 5,
      },
      value_metrics: {
        value_vs_expectation: "significantly_below",
        business_case_status: "failed",
      },
      relationship_health: {
        executive_sponsor_status: "departed",
        champion_count: 0,
      },
    });
    const result = predictChurnRisk(input);

    expect(["at_risk", "critical"]).toContain(result.health_timeline.renewal_readiness);
  });
});

// ============================================
// Success Indicators Tests
// ============================================

describe("Success Indicators", () => {
  it("should identify positive signals for healthy account", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.success_indicators.positive_signals.length).toBeGreaterThan(0);
  });

  it("should identify reference willingness as positive", () => {
    const input = createValidInput({
      satisfaction_indicators: {
        ...createValidInput().satisfaction_indicators,
        reference_willingness: true,
      },
    });
    const result = predictChurnRisk(input);

    const referenceSignal = result.success_indicators.positive_signals.find(
      (s) => s.toLowerCase().includes("reference")
    );
    expect(referenceSignal).toBeDefined();
  });

  it("should identify expansion discussions as positive", () => {
    const input = createValidInput({
      value_metrics: {
        ...createValidInput().value_metrics,
        expansion_discussions: true,
      },
    });
    const result = predictChurnRisk(input);

    const expansionSignal = result.success_indicators.positive_signals.find(
      (s) => s.toLowerCase().includes("expansion")
    );
    expect(expansionSignal).toBeDefined();
  });

  it("should have quick wins available", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.success_indicators.quick_wins_available.length).toBeGreaterThan(0);
  });

  it("should identify successful projects as momentum builder", () => {
    const input = createValidInput({
      recent_events: {
        major_incidents: 0,
        service_disruptions: 0,
        missed_slas: 0,
        successful_projects: 3,
        expansion_wins: 0,
      },
    });
    const result = predictChurnRisk(input);

    const projectMomentum = result.success_indicators.momentum_builders.find(
      (s) => s.toLowerCase().includes("project")
    );
    expect(projectMomentum).toBeDefined();
  });
});

// ============================================
// External Factors Tests
// ============================================

describe("External Factors Impact", () => {
  it("should increase risk for distressed client", () => {
    const healthyInput = createValidInput();
    const healthyResult = predictChurnRisk(healthyInput);

    const distressedInput = createValidInput({
      external_factors: {
        ...createValidInput().external_factors,
        client_financial_health: "distressed",
      },
    });
    const distressedResult = predictChurnRisk(distressedInput);

    expect(distressedResult.risk_summary.churn_risk_score).toBeGreaterThan(
      healthyResult.risk_summary.churn_risk_score
    );
  });

  it("should increase risk for leadership changes", () => {
    const stableInput = createValidInput();
    const stableResult = predictChurnRisk(stableInput);

    const changesInput = createValidInput({
      external_factors: {
        ...createValidInput().external_factors,
        leadership_changes: true,
      },
    });
    const changesResult = predictChurnRisk(changesInput);

    expect(changesResult.risk_summary.churn_risk_score).toBeGreaterThan(
      stableResult.risk_summary.churn_risk_score
    );
  });

  it("should increase risk for M&A activity", () => {
    const stableInput = createValidInput();
    const stableResult = predictChurnRisk(stableInput);

    const maInput = createValidInput({
      external_factors: {
        ...createValidInput().external_factors,
        m_and_a_activity: true,
      },
    });
    const maResult = predictChurnRisk(maInput);

    expect(maResult.risk_summary.churn_risk_score).toBeGreaterThan(
      stableResult.risk_summary.churn_risk_score
    );
  });
});

// ============================================
// Recent Events Impact Tests
// ============================================

describe("Recent Events Impact", () => {
  it("should decrease risk for successful projects", () => {
    const noEventsInput = createValidInput({
      recent_events: {
        major_incidents: 0,
        service_disruptions: 0,
        missed_slas: 0,
        successful_projects: 0,
        expansion_wins: 0,
      },
    });
    const noEventsResult = predictChurnRisk(noEventsInput);

    const successInput = createValidInput({
      recent_events: {
        major_incidents: 0,
        service_disruptions: 0,
        missed_slas: 0,
        successful_projects: 3,
        expansion_wins: 2,
      },
    });
    const successResult = predictChurnRisk(successInput);

    expect(successResult.risk_summary.churn_risk_score).toBeLessThan(
      noEventsResult.risk_summary.churn_risk_score
    );
  });

  it("should increase risk for major incidents", () => {
    const noEventsInput = createValidInput({
      recent_events: {
        major_incidents: 0,
        service_disruptions: 0,
        missed_slas: 0,
        successful_projects: 0,
        expansion_wins: 0,
      },
    });
    const noEventsResult = predictChurnRisk(noEventsInput);

    const incidentsInput = createValidInput({
      recent_events: {
        major_incidents: 3,
        service_disruptions: 2,
        missed_slas: 4,
        successful_projects: 0,
        expansion_wins: 0,
      },
    });
    const incidentsResult = predictChurnRisk(incidentsInput);

    expect(incidentsResult.risk_summary.churn_risk_score).toBeGreaterThan(
      noEventsResult.risk_summary.churn_risk_score
    );
  });
});

// ============================================
// Trend Determination Tests
// ============================================

describe("Risk Trend", () => {
  it("should show improving trend for increasing login frequency", () => {
    const input = createValidInput({
      engagement_metrics: {
        ...createValidInput().engagement_metrics,
        login_frequency_trend: "increasing",
      },
    });
    const result = predictChurnRisk(input);

    expect(result.risk_summary.risk_trend).toBe("improving");
  });

  it("should show deteriorating trend for decreasing login frequency", () => {
    const input = createValidInput({
      engagement_metrics: {
        ...createValidInput().engagement_metrics,
        login_frequency_trend: "significantly_decreasing",
      },
    });
    const result = predictChurnRisk(input);

    expect(result.risk_summary.risk_trend).toBe("deteriorating");
  });

  it("should show stable trend for stable login frequency", () => {
    const input = createValidInput({
      engagement_metrics: {
        ...createValidInput().engagement_metrics,
        login_frequency_trend: "stable",
      },
    });
    const result = predictChurnRisk(input);

    expect(result.risk_summary.risk_trend).toBe("stable");
  });
});

// ============================================
// Urgency Determination Tests
// ============================================

describe("Urgency Determination", () => {
  it("should show immediate urgency for high risk", () => {
    const input = createValidInput({
      engagement_metrics: {
        monthly_active_user_percent: 10,
        login_frequency_trend: "significantly_decreasing",
        support_sentiment: "very_negative",
        executive_engagement: "none",
      },
      satisfaction_indicators: {
        nps_score: -60,
        escalation_count_last_90_days: 5,
      },
      value_metrics: {
        value_vs_expectation: "significantly_below",
        business_case_status: "failed",
      },
      relationship_health: {
        executive_sponsor_status: "departed",
        champion_count: 0,
      },
    });
    const result = predictChurnRisk(input);

    expect(result.risk_summary.urgency).toBe("immediate");
  });

  it("should show monitor for low risk healthy account", () => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 12); // 12 months out

    const input = createValidInput({
      account_info: {
        ...createValidInput().account_info,
        contract_end_date: futureDate.toISOString().split("T")[0],
      },
    });
    const result = predictChurnRisk(input);

    // Low risk + long time to renewal = monitor
    if (result.risk_summary.churn_risk_score < 30) {
      expect(result.risk_summary.urgency).toBe("monitor");
    }
  });
});

// ============================================
// Churn Indicators Tests
// ============================================

describe("Churn Indicators", () => {
  it("should have leading indicators", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.churn_indicators.leading_indicators.length).toBeGreaterThan(0);
  });

  it("should have lagging indicators", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.churn_indicators.lagging_indicators.length).toBeGreaterThan(0);
  });

  it("should have predictive patterns from top risk factors", () => {
    const input = createValidInput({
      engagement_metrics: {
        monthly_active_user_percent: 20,
        login_frequency_trend: "decreasing",
        executive_engagement: "none",
      },
      satisfaction_indicators: {
        nps_score: -20,
      },
      value_metrics: {
        value_vs_expectation: "below",
      },
    });
    const result = predictChurnRisk(input);

    expect(result.churn_indicators.predictive_patterns.length).toBeGreaterThan(0);
  });
});

// ============================================
// Methodology Note Tests
// ============================================

describe("Methodology Note", () => {
  it("should include methodology note", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    expect(result.methodology_note).toBeDefined();
    expect(result.methodology_note.length).toBeGreaterThan(50);
    expect(result.methodology_note.toLowerCase()).toContain("good ai");
  });
});

// ============================================
// Edge Cases Tests
// ============================================

describe("Edge Cases", () => {
  it("should handle minimal input with defaults", () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);

    const minimalInput: PredictChurnRiskInput = {
      client_name: "Minimal Corp",
      industry: "general",
      account_info: {
        contract_start_date: pastDate.toISOString().split("T")[0],
        contract_end_date: futureDate.toISOString().split("T")[0],
        contract_value_annual_usd: 100000,
        account_tier: "standard",
        number_of_solutions: 1,
        active_users: 10,
        licensed_users: 20,
      },
      engagement_metrics: {},
      satisfaction_indicators: {},
      value_metrics: {},
      relationship_health: {},
    };

    const result = predictChurnRisk(minimalInput);

    expect(result.client_name).toBe("Minimal Corp");
    expect(result.risk_summary).toBeDefined();
    expect(result.category_scores).toBeDefined();
  });

  it("should handle very high contract values", () => {
    const input = createValidInput({
      account_info: {
        ...createValidInput().account_info,
        contract_value_annual_usd: 50000000,
      },
    });
    const result = predictChurnRisk(input);

    expect(result.revenue_impact.current_arr_usd).toBe(50000000);
    expect(result.revenue_impact.at_risk_arr_usd).toBeGreaterThanOrEqual(0);
  });

  it("should handle contract ending soon", () => {
    const nearFuture = new Date();
    nearFuture.setDate(nearFuture.getDate() + 30);

    const input = createValidInput({
      account_info: {
        ...createValidInput().account_info,
        contract_end_date: nearFuture.toISOString().split("T")[0],
      },
    });
    const result = predictChurnRisk(input);

    expect(result.risk_summary.days_until_contract_end).toBeLessThanOrEqual(31);
    expect(["immediate", "this_quarter"]).toContain(result.risk_summary.urgency);
  });

  it("should handle all industries", () => {
    const industries: PredictChurnRiskInput["industry"][] = [
      "manufacturing",
      "insurance",
      "aquaculture",
      "healthcare",
      "general",
    ];

    industries.forEach((industry) => {
      const input = createValidInput({ industry });
      const result = predictChurnRisk(input);

      expect(result.competitive_assessment.likely_competitors.length).toBeGreaterThan(0);
    });
  });

  it("should handle zero active users", () => {
    const input = createValidInput({
      account_info: {
        ...createValidInput().account_info,
        active_users: 0,
      },
      engagement_metrics: {
        monthly_active_user_percent: 0,
        login_frequency_trend: "significantly_decreasing",
        feature_utilization_percent: 0,
        executive_engagement: "none",
      },
    });
    const result = predictChurnRisk(input);

    // With zero active users and poor engagement, engagement score should be very low
    expect(result.category_scores.engagement_score).toBeLessThan(30);
    // Churn risk depends on all factors - with good satisfaction/value/relationship,
    // overall churn risk may still be moderate
    expect(result.risk_summary.churn_risk_score).toBeGreaterThan(10);
  });
});

// ============================================
// Integration with Calculation Tests
// ============================================

describe("Score Calculation Integration", () => {
  it("should have consistent health vs churn score relationship", () => {
    const input = createValidInput();
    const result = predictChurnRisk(input);

    // Health score + churn score should be close to 100
    const sum = result.category_scores.overall_health_score + result.risk_summary.churn_risk_score;
    expect(sum).toBeGreaterThanOrEqual(95);
    expect(sum).toBeLessThanOrEqual(105);
  });

  it("should have renewal probability inversely related to churn score", () => {
    const lowRiskInput = createValidInput();
    const lowRiskResult = predictChurnRisk(lowRiskInput);

    const highRiskInput = createValidInput({
      engagement_metrics: {
        monthly_active_user_percent: 10,
        login_frequency_trend: "significantly_decreasing",
        support_sentiment: "very_negative",
        executive_engagement: "none",
      },
      satisfaction_indicators: {
        nps_score: -50,
        escalation_count_last_90_days: 5,
      },
      value_metrics: {
        value_vs_expectation: "significantly_below",
        business_case_status: "failed",
      },
      relationship_health: {
        executive_sponsor_status: "departed",
        champion_count: 0,
      },
    });
    const highRiskResult = predictChurnRisk(highRiskInput);

    expect(lowRiskResult.risk_summary.renewal_probability_percent).toBeGreaterThan(
      highRiskResult.risk_summary.renewal_probability_percent
    );
  });
});
