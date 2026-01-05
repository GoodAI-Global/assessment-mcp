/**
 * Good AI - prioritize_use_cases Tool Tests
 */

import {
  prioritizeUseCases,
  PrioritizeUseCasesInputSchema,
  type PrioritizeUseCasesInput,
} from "../src/tools/prioritize_use_cases.js";

describe("prioritizeUseCases", () => {
  const createValidInput = (
    overrides: Partial<PrioritizeUseCasesInput> = {}
  ): PrioritizeUseCasesInput => ({
    company_name: "Test Manufacturing",
    industry: "manufacturing",
    use_cases: [
      {
        name: "Predictive Maintenance",
        description: "Predict equipment failures before they occur using sensor data",
        category: "prediction",
        estimated_annual_value_usd: 500000,
        estimated_implementation_cost_usd: 100000,
        data_availability: "available",
        stakeholder_support: "high",
        technical_complexity: "medium",
        time_to_implement_weeks: 12,
        strategic_alignment: "high",
      },
      {
        name: "Quality Inspection Automation",
        description: "Automate visual quality inspection using computer vision",
        category: "automation",
        estimated_annual_value_usd: 300000,
        estimated_implementation_cost_usd: 150000,
        data_availability: "partial",
        stakeholder_support: "medium",
        technical_complexity: "high",
        time_to_implement_weeks: 20,
        strategic_alignment: "medium",
      },
      {
        name: "Inventory Optimization",
        description: "Optimize inventory levels based on demand forecasting",
        category: "optimization",
        estimated_annual_value_usd: 200000,
        estimated_implementation_cost_usd: 50000,
        data_availability: "excellent",
        stakeholder_support: "high",
        technical_complexity: "low",
        time_to_implement_weeks: 6,
        strategic_alignment: "high",
      },
    ],
    ...overrides,
  });

  describe("output structure", () => {
    it("should return all required fields", () => {
      const result = prioritizeUseCases(createValidInput());

      expect(result).toHaveProperty("company_name");
      expect(result).toHaveProperty("industry");
      expect(result).toHaveProperty("total_use_cases_analyzed");
      expect(result).toHaveProperty("prioritized_use_cases");
      expect(result).toHaveProperty("recommended_roadmap");
      expect(result).toHaveProperty("portfolio_summary");
      expect(result).toHaveProperty("constraints_analysis");
      expect(result).toHaveProperty("key_recommendations");
      expect(result).toHaveProperty("methodology_note");
    });

    it("should prioritize all use cases", () => {
      const result = prioritizeUseCases(createValidInput());

      expect(result.prioritized_use_cases).toHaveLength(3);
      expect(result.total_use_cases_analyzed).toBe(3);
    });

    it("should include all scoring dimensions", () => {
      const result = prioritizeUseCases(createValidInput());

      result.prioritized_use_cases.forEach((uc) => {
        expect(uc.scores).toHaveProperty("business_value");
        expect(uc.scores).toHaveProperty("feasibility");
        expect(uc.scores).toHaveProperty("strategic_fit");
        expect(uc.scores).toHaveProperty("quick_win_potential");
        expect(uc.scores).toHaveProperty("overall");
      });
    });
  });

  describe("prioritization logic", () => {
    it("should rank use cases by overall score descending", () => {
      const result = prioritizeUseCases(createValidInput());

      for (let i = 1; i < result.prioritized_use_cases.length; i++) {
        expect(result.prioritized_use_cases[i - 1].scores.overall).toBeGreaterThanOrEqual(
          result.prioritized_use_cases[i].scores.overall
        );
      }
    });

    it("should assign sequential ranks", () => {
      const result = prioritizeUseCases(createValidInput());

      const ranks = result.prioritized_use_cases.map((uc) => uc.priority_rank);
      expect(ranks).toEqual([1, 2, 3]);
    });

    it("should favor high ROI use cases", () => {
      const input = createValidInput({
        use_cases: [
          {
            name: "Low ROI",
            description: "A use case with low return on investment",
            category: "automation",
            estimated_annual_value_usd: 50000,
            estimated_implementation_cost_usd: 100000,
          },
          {
            name: "High ROI",
            description: "A use case with high return on investment",
            category: "automation",
            estimated_annual_value_usd: 500000,
            estimated_implementation_cost_usd: 50000,
          },
        ],
      });

      const result = prioritizeUseCases(input);

      expect(result.prioritized_use_cases[0].name).toBe("High ROI");
    });

    it("should favor feasible use cases", () => {
      const input = createValidInput({
        use_cases: [
          {
            name: "Hard to Implement",
            description: "A difficult implementation with no data",
            category: "automation",
            estimated_annual_value_usd: 200000,
            estimated_implementation_cost_usd: 50000,
            data_availability: "none",
            technical_complexity: "high",
          },
          {
            name: "Easy to Implement",
            description: "A straightforward implementation with excellent data",
            category: "automation",
            estimated_annual_value_usd: 200000,
            estimated_implementation_cost_usd: 50000,
            data_availability: "excellent",
            technical_complexity: "low",
          },
        ],
      });

      const result = prioritizeUseCases(input);

      expect(result.prioritized_use_cases[0].name).toBe("Easy to Implement");
    });
  });

  describe("priority tiers", () => {
    it("should assign critical tier to high scorers", () => {
      const input = createValidInput({
        use_cases: [
          {
            name: "Perfect Use Case",
            description: "Ideal scenario with all positive factors",
            category: "automation",
            estimated_annual_value_usd: 1000000,
            estimated_implementation_cost_usd: 50000,
            data_availability: "excellent",
            stakeholder_support: "high",
            technical_complexity: "low",
            time_to_implement_weeks: 4,
            strategic_alignment: "high",
          },
        ],
      });

      const result = prioritizeUseCases(input);

      expect(result.prioritized_use_cases[0].priority_tier).toBe("critical");
    });

    it("should assign low tier to poor scorers", () => {
      const input = createValidInput({
        use_cases: [
          {
            name: "Problematic Use Case",
            description: "Scenario with all negative factors",
            category: "generation",
            estimated_annual_value_usd: 10000,
            estimated_implementation_cost_usd: 200000,
            data_availability: "none",
            stakeholder_support: "low",
            technical_complexity: "high",
            time_to_implement_weeks: 52,
            strategic_alignment: "low",
          },
        ],
      });

      const result = prioritizeUseCases(input);

      expect(result.prioritized_use_cases[0].priority_tier).toBe("low");
    });
  });

  describe("phase assignment", () => {
    it("should assign quick wins to phase 1", () => {
      const result = prioritizeUseCases(createValidInput());

      const quickWins = result.prioritized_use_cases.filter(
        (uc) => uc.scores.quick_win_potential >= 7 && uc.scores.feasibility >= 6
      );

      quickWins.forEach((uc) => {
        expect(uc.recommended_phase).toBe(1);
      });
    });

    it("should populate roadmap phases", () => {
      const result = prioritizeUseCases(createValidInput());

      expect(result.recommended_roadmap.phase_1).toHaveProperty("name");
      expect(result.recommended_roadmap.phase_1).toHaveProperty("use_cases");
      expect(result.recommended_roadmap.phase_1).toHaveProperty("total_investment_usd");
      expect(result.recommended_roadmap.phase_1).toHaveProperty("expected_value_usd");
    });
  });

  describe("ROI calculation", () => {
    it("should calculate estimated ROI percent", () => {
      const result = prioritizeUseCases(createValidInput());

      result.prioritized_use_cases.forEach((uc) => {
        expect(typeof uc.estimated_roi_percent).toBe("number");
      });
    });

    it("should calculate portfolio ROI", () => {
      const result = prioritizeUseCases(createValidInput());

      expect(result.portfolio_summary.portfolio_roi_percent).toBeGreaterThan(0);
    });
  });

  describe("constraints analysis", () => {
    it("should check budget constraints", () => {
      const input = createValidInput({
        budget_constraint_usd: 50000, // Very tight budget
      });

      const result = prioritizeUseCases(input);

      expect(result.constraints_analysis.fits_budget).toBe(false);
      expect(result.constraints_analysis.recommended_adjustments.length).toBeGreaterThan(0);
    });

    it("should check timeline constraints", () => {
      const input = createValidInput({
        timeline_constraint_weeks: 4, // Very tight timeline
      });

      const result = prioritizeUseCases(input);

      expect(result.constraints_analysis.fits_timeline).toBe(false);
    });

    it("should pass when no constraints", () => {
      const result = prioritizeUseCases(createValidInput());

      expect(result.constraints_analysis.fits_budget).toBe(true);
      expect(result.constraints_analysis.fits_timeline).toBe(true);
    });
  });

  describe("risks and prerequisites", () => {
    it("should identify data risks", () => {
      const input = createValidInput({
        use_cases: [
          {
            name: "No Data Case",
            description: "A use case with no available data",
            category: "prediction",
            data_availability: "none",
          },
        ],
      });

      const result = prioritizeUseCases(input);

      expect(result.prioritized_use_cases[0].risks.some((r) => r.includes("Data"))).toBe(true);
    });

    it("should identify stakeholder risks", () => {
      const input = createValidInput({
        use_cases: [
          {
            name: "Low Support Case",
            description: "A use case with low stakeholder support",
            category: "automation",
            stakeholder_support: "low",
          },
        ],
      });

      const result = prioritizeUseCases(input);

      expect(result.prioritized_use_cases[0].risks.some((r) => r.includes("stakeholder"))).toBe(
        true
      );
    });

    it("should generate prerequisites", () => {
      const result = prioritizeUseCases(createValidInput());

      result.prioritized_use_cases.forEach((uc) => {
        expect(uc.prerequisites.length).toBeGreaterThan(0);
      });
    });

    it("should generate success factors", () => {
      const result = prioritizeUseCases(createValidInput());

      result.prioritized_use_cases.forEach((uc) => {
        expect(uc.success_factors.length).toBeGreaterThan(0);
      });
    });
  });

  describe("portfolio summary", () => {
    it("should calculate total potential value", () => {
      const result = prioritizeUseCases(createValidInput());

      expect(result.portfolio_summary.total_potential_value_usd).toBe(1000000); // 500k + 300k + 200k
    });

    it("should calculate total investment required", () => {
      const result = prioritizeUseCases(createValidInput());

      expect(result.portfolio_summary.total_investment_required_usd).toBe(300000); // 100k + 150k + 50k
    });

    it("should count quick wins", () => {
      const result = prioritizeUseCases(createValidInput());

      expect(typeof result.portfolio_summary.quick_wins_count).toBe("number");
    });
  });

  describe("custom weights", () => {
    it("should apply custom prioritization weights", () => {
      const baseInput = createValidInput();

      const resultDefaultWeights = prioritizeUseCases(baseInput);
      const resultQuickWinFocus = prioritizeUseCases({
        ...baseInput,
        prioritization_weights: {
          quick_wins: 0.7,
          business_value: 0.1,
          feasibility: 0.1,
          strategic_fit: 0.1,
        },
      });

      // The quick win focused version should rank differently
      // Inventory Optimization should be higher with quick_wins weighted heavily
      const quickWinUc = resultQuickWinFocus.prioritized_use_cases.find(
        (uc) => uc.name === "Inventory Optimization"
      );
      expect(quickWinUc?.priority_rank).toBeLessThanOrEqual(2);
    });
  });

  describe("organizational readiness", () => {
    it("should adjust feasibility based on org readiness", () => {
      const baseInput = createValidInput();

      const lowReadiness = prioritizeUseCases({
        ...baseInput,
        organizational_readiness_score: 2,
      });

      const highReadiness = prioritizeUseCases({
        ...baseInput,
        organizational_readiness_score: 9,
      });

      // Higher readiness should improve feasibility scores
      const lowReadinessAvg =
        lowReadiness.prioritized_use_cases.reduce((sum, uc) => sum + uc.scores.feasibility, 0) / 3;
      const highReadinessAvg =
        highReadiness.prioritized_use_cases.reduce((sum, uc) => sum + uc.scores.feasibility, 0) / 3;

      expect(highReadinessAvg).toBeGreaterThan(lowReadinessAvg);
    });
  });

  describe("key recommendations", () => {
    it("should provide actionable recommendations", () => {
      const result = prioritizeUseCases(createValidInput());

      expect(result.key_recommendations.length).toBeGreaterThan(0);
      expect(result.key_recommendations.length).toBeLessThanOrEqual(4);
    });

    it("should reference top priority use case", () => {
      const result = prioritizeUseCases(createValidInput());

      const topName = result.prioritized_use_cases[0].name;
      const hasTopReference = result.key_recommendations.some((r) => r.includes(topName));
      expect(hasTopReference).toBe(true);
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input = createValidInput();

      const result1 = prioritizeUseCases(input);
      const result2 = prioritizeUseCases(input);

      expect(result1).toEqual(result2);
    });
  });
});

describe("PrioritizeUseCasesInputSchema", () => {
  it("should reject empty use cases array", () => {
    const input = {
      company_name: "Test",
      industry: "manufacturing",
      use_cases: [],
    };

    const result = PrioritizeUseCasesInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject invalid category", () => {
    const input = {
      company_name: "Test",
      industry: "manufacturing",
      use_cases: [
        {
          name: "Test",
          description: "A test description",
          category: "invalid_category",
        },
      ],
    };

    const result = PrioritizeUseCasesInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept valid minimal input", () => {
    const input = {
      company_name: "Test Corp",
      industry: "general",
      use_cases: [
        {
          name: "Test Use Case",
          description: "A valid test use case description",
          category: "automation",
        },
      ],
    };

    const result = PrioritizeUseCasesInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
