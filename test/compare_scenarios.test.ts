/**
 * Good AI - compare_scenarios Tool Tests
 */

import {
  compareScenarios,
  CompareScenariosInputSchema,
  type CompareScenariosInput,
} from "../src/tools/compare_scenarios.js";

describe("compareScenarios", () => {
  const createValidInput = (
    overrides: Partial<CompareScenariosInput> = {}
  ): CompareScenariosInput => ({
    company_name: "Test Corp",
    comparison_purpose: "Determine best AI investment for Q1",
    scenarios: [
      {
        name: "Quick Win Automation",
        description: "Automate routine data entry tasks with RPA and basic ML",
        investment_usd: 50000,
        expected_annual_value_usd: 150000,
        implementation_weeks: 6,
        risk_level: "low",
        complexity: "low",
        strategic_alignment: "medium",
        confidence_level: "high",
      },
      {
        name: "Predictive Analytics Platform",
        description: "Build predictive analytics for demand forecasting",
        investment_usd: 200000,
        expected_annual_value_usd: 500000,
        implementation_weeks: 24,
        risk_level: "medium",
        complexity: "high",
        strategic_alignment: "high",
        confidence_level: "medium",
      },
    ],
    ...overrides,
  });

  describe("output structure", () => {
    it("should return all required fields", () => {
      const result = compareScenarios(createValidInput());

      expect(result).toHaveProperty("company_name");
      expect(result).toHaveProperty("comparison_purpose");
      expect(result).toHaveProperty("scenarios_compared");
      expect(result).toHaveProperty("scored_scenarios");
      expect(result).toHaveProperty("recommendation");
      expect(result).toHaveProperty("comparison_matrix");
      expect(result).toHaveProperty("risk_analysis");
      expect(result).toHaveProperty("sensitivity_insights");
      expect(result).toHaveProperty("trade_offs");
      expect(result).toHaveProperty("decision_factors");
      expect(result).toHaveProperty("methodology_note");
    });

    it("should score all scenarios", () => {
      const result = compareScenarios(createValidInput());

      expect(result.scored_scenarios).toHaveLength(2);
      expect(result.scenarios_compared).toBe(2);
    });

    it("should include scoring dimensions for each scenario", () => {
      const result = compareScenarios(createValidInput());

      result.scored_scenarios.forEach((s) => {
        expect(s.scores).toHaveProperty("roi_score");
        expect(s.scores).toHaveProperty("time_to_value_score");
        expect(s.scores).toHaveProperty("risk_score");
        expect(s.scores).toHaveProperty("strategic_score");
        expect(s.scores).toHaveProperty("overall_score");
      });
    });
  });

  describe("ranking and recommendation", () => {
    it("should rank scenarios by overall score", () => {
      const result = compareScenarios(createValidInput());

      for (let i = 1; i < result.scored_scenarios.length; i++) {
        expect(result.scored_scenarios[i - 1].scores.overall_score).toBeGreaterThanOrEqual(
          result.scored_scenarios[i].scores.overall_score
        );
      }
    });

    it("should assign sequential ranks", () => {
      const result = compareScenarios(createValidInput());

      const ranks = result.scored_scenarios.map((s) => s.rank);
      expect(ranks).toEqual([1, 2]);
    });

    it("should recommend top-ranked scenario", () => {
      const result = compareScenarios(createValidInput());

      expect(result.recommendation.recommended_scenario).toBe(result.scored_scenarios[0].name);
    });

    it("should provide rationale for recommendation", () => {
      const result = compareScenarios(createValidInput());

      expect(result.recommendation.rationale.length).toBeGreaterThan(0);
      expect(result.recommendation.rationale).toContain(result.recommendation.recommended_scenario);
    });

    it("should identify key differentiators", () => {
      const result = compareScenarios(createValidInput());

      expect(result.recommendation.key_differentiators.length).toBeGreaterThan(0);
    });
  });

  describe("scoring logic", () => {
    it("should favor high ROI scenarios", () => {
      const input = createValidInput({
        scenarios: [
          {
            name: "Low ROI",
            description: "Scenario with low return on investment",
            investment_usd: 100000,
            expected_annual_value_usd: 50000,
            implementation_weeks: 8,
            risk_level: "low",
            complexity: "low",
          },
          {
            name: "High ROI",
            description: "Scenario with high return on investment",
            investment_usd: 50000,
            expected_annual_value_usd: 300000,
            implementation_weeks: 8,
            risk_level: "low",
            complexity: "low",
          },
        ],
      });

      const result = compareScenarios(input);

      expect(result.scored_scenarios[0].name).toBe("High ROI");
    });

    it("should favor lower risk for conservative tolerance", () => {
      const input = createValidInput({
        scenarios: [
          {
            name: "High Risk",
            description: "A high risk scenario",
            investment_usd: 100000,
            expected_annual_value_usd: 300000,
            implementation_weeks: 12,
            risk_level: "high",
            complexity: "high",
          },
          {
            name: "Low Risk",
            description: "A low risk scenario",
            investment_usd: 100000,
            expected_annual_value_usd: 200000,
            implementation_weeks: 12,
            risk_level: "low",
            complexity: "low",
          },
        ],
        risk_tolerance: "conservative",
      });

      const result = compareScenarios(input);
      const lowRisk = result.scored_scenarios.find((s) => s.name === "Low Risk");
      const highRisk = result.scored_scenarios.find((s) => s.name === "High Risk");

      expect(lowRisk!.scores.risk_score).toBeGreaterThan(highRisk!.scores.risk_score);
    });
  });

  describe("metrics calculation", () => {
    it("should calculate ROI percent correctly", () => {
      const result = compareScenarios(createValidInput());
      const quickWin = result.scored_scenarios.find((s) => s.name === "Quick Win Automation");

      // (150000 - 50000) / 50000 * 100 = 200%
      expect(quickWin!.metrics.roi_percent).toBe(200);
    });

    it("should calculate payback period", () => {
      const result = compareScenarios(createValidInput());

      result.scored_scenarios.forEach((s) => {
        expect(s.metrics.payback_months).toBeGreaterThan(0);
      });
    });

    it("should calculate 3-year net value", () => {
      const result = compareScenarios(createValidInput());
      const quickWin = result.scored_scenarios.find((s) => s.name === "Quick Win Automation");

      // (150000 * 3) - 50000 = 400000
      expect(quickWin!.metrics.net_value_3yr_usd).toBe(400000);
    });

    it("should calculate risk-adjusted value lower than expected for non-low risk", () => {
      const result = compareScenarios(createValidInput());

      // Find the medium risk scenario (Predictive Analytics)
      const mediumRisk = result.scored_scenarios.find(
        (s) => s.name === "Predictive Analytics Platform"
      );

      // Risk-adjusted value should be less than expected annual value for medium/high risk
      // since we apply risk discount factors
      expect(mediumRisk!.metrics.risk_adjusted_value_usd).toBeLessThan(500000);
    });
  });

  describe("pros and cons", () => {
    it("should generate pros for each scenario", () => {
      const result = compareScenarios(createValidInput());

      result.scored_scenarios.forEach((s) => {
        expect(s.pros.length).toBeGreaterThan(0);
      });
    });

    it("should generate cons for weaker areas", () => {
      const input = createValidInput({
        scenarios: [
          {
            name: "Problematic",
            description: "A scenario with multiple issues",
            investment_usd: 500000,
            expected_annual_value_usd: 200000,
            implementation_weeks: 52,
            risk_level: "high",
            complexity: "high",
            strategic_alignment: "low",
            confidence_level: "low",
          },
          {
            name: "Good",
            description: "A good scenario",
            investment_usd: 50000,
            expected_annual_value_usd: 150000,
            implementation_weeks: 8,
            risk_level: "low",
            complexity: "low",
          },
        ],
      });

      const result = compareScenarios(input);
      const problematic = result.scored_scenarios.find((s) => s.name === "Problematic");

      expect(problematic!.cons.length).toBeGreaterThan(0);
    });
  });

  describe("comparison matrix", () => {
    it("should compare across all criteria", () => {
      const result = compareScenarios(createValidInput());

      expect(result.comparison_matrix.length).toBe(4); // ROI, Time, Risk, Strategic
    });

    it("should identify winner for each criterion", () => {
      const result = compareScenarios(createValidInput());

      result.comparison_matrix.forEach((row) => {
        expect(row.winner).toBeDefined();
        expect(row.winner.length).toBeGreaterThan(0);
      });
    });

    it("should include values for all scenarios", () => {
      const result = compareScenarios(createValidInput());

      result.comparison_matrix.forEach((row) => {
        expect(Object.keys(row.scenario_values)).toHaveLength(2);
      });
    });
  });

  describe("risk analysis", () => {
    it("should analyze risks for each scenario", () => {
      const result = compareScenarios(createValidInput());

      expect(result.risk_analysis).toHaveLength(2);
    });

    it("should provide mitigation suggestions", () => {
      const input = createValidInput({
        scenarios: [
          {
            name: "High Risk",
            description: "A high risk scenario",
            investment_usd: 100000,
            expected_annual_value_usd: 300000,
            implementation_weeks: 12,
            risk_level: "high",
            complexity: "high",
            confidence_level: "low",
          },
          {
            name: "Low Risk",
            description: "A low risk scenario",
            investment_usd: 100000,
            expected_annual_value_usd: 200000,
            implementation_weeks: 12,
            risk_level: "low",
            complexity: "low",
          },
        ],
      });

      const result = compareScenarios(input);
      const highRiskAnalysis = result.risk_analysis.find((r) => r.scenario === "High Risk");

      expect(highRiskAnalysis!.key_risks.length).toBeGreaterThan(0);
      expect(highRiskAnalysis!.mitigation_suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("constraints handling", () => {
    it("should flag scenarios exceeding budget", () => {
      const input = createValidInput({
        budget_limit_usd: 75000,
      });

      const result = compareScenarios(input);
      const overBudget = result.scored_scenarios.find(
        (s) => s.name === "Predictive Analytics Platform"
      );

      expect(overBudget!.meets_constraints).toBe(false);
    });

    it("should flag scenarios exceeding timeline", () => {
      const input = createValidInput({
        timeline_limit_weeks: 12,
      });

      const result = compareScenarios(input);
      const overTime = result.scored_scenarios.find(
        (s) => s.name === "Predictive Analytics Platform"
      );

      expect(overTime!.meets_constraints).toBe(false);
    });

    it("should mark fit as poor when constraints not met", () => {
      const input = createValidInput({
        budget_limit_usd: 25000, // Very tight
      });

      const result = compareScenarios(input);

      result.scored_scenarios.forEach((s) => {
        if (!s.meets_constraints) {
          expect(s.fit_assessment).toBe("poor");
        }
      });
    });
  });

  describe("custom weights", () => {
    it("should apply custom evaluation criteria", () => {
      const baseInput = createValidInput();

      const defaultResult = compareScenarios(baseInput);
      const timeWeightedResult = compareScenarios({
        ...baseInput,
        evaluation_criteria: {
          time_to_value_weight: 0.7,
          roi_weight: 0.1,
          risk_weight: 0.1,
          strategic_weight: 0.1,
        },
      });

      // Quick Win should rank higher with time-to-value weighted heavily
      const quickWinDefaultRank = defaultResult.scored_scenarios.find(
        (s) => s.name === "Quick Win Automation"
      )!.rank;
      const quickWinTimeRank = timeWeightedResult.scored_scenarios.find(
        (s) => s.name === "Quick Win Automation"
      )!.rank;

      expect(quickWinTimeRank).toBeLessThanOrEqual(quickWinDefaultRank);
    });
  });

  describe("trade-offs and insights", () => {
    it("should identify trade-offs between scenarios", () => {
      const result = compareScenarios(createValidInput());

      // May or may not have trade-offs depending on scenarios
      expect(result.trade_offs).toBeDefined();
    });

    it("should provide sensitivity insights", () => {
      const result = compareScenarios(createValidInput());

      expect(result.sensitivity_insights.length).toBeGreaterThan(0);
    });

    it("should provide decision factors", () => {
      const result = compareScenarios(createValidInput());

      expect(result.decision_factors.length).toBeGreaterThan(0);
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input = createValidInput();

      const result1 = compareScenarios(input);
      const result2 = compareScenarios(input);

      expect(result1).toEqual(result2);
    });
  });
});

describe("CompareScenariosInputSchema", () => {
  it("should require at least 2 scenarios", () => {
    const input = {
      company_name: "Test",
      comparison_purpose: "Testing scenario comparison",
      scenarios: [
        {
          name: "Single",
          description: "Only one scenario",
          investment_usd: 100000,
          expected_annual_value_usd: 200000,
          implementation_weeks: 12,
          risk_level: "low",
          complexity: "low",
        },
      ],
    };

    const result = CompareScenariosInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject invalid risk level", () => {
    const input = {
      company_name: "Test",
      comparison_purpose: "Testing scenario comparison",
      scenarios: [
        {
          name: "A",
          description: "Scenario A description",
          investment_usd: 100000,
          expected_annual_value_usd: 200000,
          implementation_weeks: 12,
          risk_level: "invalid",
          complexity: "low",
        },
        {
          name: "B",
          description: "Scenario B description",
          investment_usd: 100000,
          expected_annual_value_usd: 200000,
          implementation_weeks: 12,
          risk_level: "low",
          complexity: "low",
        },
      ],
    };

    const result = CompareScenariosInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept valid input", () => {
    const input = {
      company_name: "Test Corp",
      comparison_purpose: "Determine best investment option",
      scenarios: [
        {
          name: "Option A",
          description: "First option for consideration",
          investment_usd: 100000,
          expected_annual_value_usd: 200000,
          implementation_weeks: 12,
          risk_level: "low",
          complexity: "medium",
        },
        {
          name: "Option B",
          description: "Second option for consideration",
          investment_usd: 150000,
          expected_annual_value_usd: 300000,
          implementation_weeks: 16,
          risk_level: "medium",
          complexity: "high",
        },
      ],
    };

    const result = CompareScenariosInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
