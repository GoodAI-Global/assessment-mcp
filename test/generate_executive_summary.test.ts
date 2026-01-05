/**
 * Good AI - generate_executive_summary Tool Tests
 */

import {
  generateExecutiveSummary,
  GenerateExecutiveSummaryInputSchema,
  type GenerateExecutiveSummaryInput,
} from "../src/tools/generate_executive_summary.js";

describe("generateExecutiveSummary", () => {
  const createValidInput = (
    overrides: Partial<GenerateExecutiveSummaryInput> = {}
  ): GenerateExecutiveSummaryInput => ({
    company_name: "Acme Manufacturing",
    industry: "manufacturing",
    readiness_assessment: {
      overall_score: 5.5,
      dimensions: {
        data_readiness: { score: 4, findings: ["Some data gaps"] },
        technical_capability: { score: 6, findings: ["Good ERP system"] },
        process_maturity: { score: 5, findings: [] },
        organizational_readiness: { score: 7, findings: ["Strong leadership buy-in"] },
      },
      strengths: ["Strong leadership", "Existing ERP", "Clear goals"],
      gaps: ["Data silos", "Manual processes", "Limited AI experience"],
      recommended_starting_point: "Deploy predictive maintenance on critical equipment",
      estimated_time_to_value_weeks: 8,
      red_flags: [],
    },
    top_bottlenecks: [
      {
        name: "Manual Quality Inspection",
        estimated_annual_cost_usd: 250000,
        ai_solution_fit_score: 8.5,
        recommended_ai_approach: "Computer Vision for defect detection",
        complexity: "medium",
      },
      {
        name: "Inventory Forecasting",
        estimated_annual_cost_usd: 150000,
        ai_solution_fit_score: 7.0,
        recommended_ai_approach: "ML-based demand forecasting",
        complexity: "low",
      },
    ],
    ...overrides,
  });

  describe("output structure", () => {
    it("should return all required sections", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result).toHaveProperty("header");
      expect(result).toHaveProperty("snapshot");
      expect(result).toHaveProperty("key_findings");
      expect(result).toHaveProperty("recommendation");
      expect(result).toHaveProperty("financial_summary");
      expect(result).toHaveProperty("implementation_timeline");
      expect(result).toHaveProperty("success_criteria");
      expect(result).toHaveProperty("risk_summary");
      expect(result).toHaveProperty("next_steps");
      expect(result).toHaveProperty("methodology_note");
    });

    it("should include company name in header", () => {
      const result = generateExecutiveSummary(
        createValidInput({ company_name: "TestCorp Inc." })
      );

      expect(result.header.company).toBe("TestCorp Inc.");
    });

    it("should include executive sponsor when provided", () => {
      const result = generateExecutiveSummary(
        createValidInput({ executive_sponsor: "John Smith, CEO" })
      );

      expect(result.header.executive_sponsor).toBe("John Smith, CEO");
    });

    it("should use provided assessment date", () => {
      const result = generateExecutiveSummary(
        createValidInput({ assessment_date: "2024-01-15" })
      );

      expect(result.header.date).toBe("2024-01-15");
    });
  });

  describe("snapshot generation", () => {
    it("should include readiness score from assessment", () => {
      const input = createValidInput();
      const result = generateExecutiveSummary(input);

      expect(result.snapshot.readiness_score).toBe(5.5);
    });

    it("should label score as 'AI Ready' for score >= 8", () => {
      const input = createValidInput({
        readiness_assessment: {
          ...createValidInput().readiness_assessment,
          overall_score: 8.5,
        },
      });
      const result = generateExecutiveSummary(input);

      expect(result.snapshot.readiness_label).toBe("AI Ready");
    });

    it("should label score as 'Developing' for score 4-6", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.snapshot.readiness_label).toBe("Developing");
    });

    it("should label score as 'Early Stage' for score < 4", () => {
      const input = createValidInput({
        readiness_assessment: {
          ...createValidInput().readiness_assessment,
          overall_score: 2.5,
        },
      });
      const result = generateExecutiveSummary(input);

      expect(result.snapshot.readiness_label).toBe("Early Stage");
    });

    it("should identify primary opportunity from top bottleneck", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.snapshot.primary_opportunity).toBe("Manual Quality Inspection");
    });

    it("should calculate estimated annual value from bottlenecks", () => {
      const result = generateExecutiveSummary(createValidInput());

      // (250000 * 0.85) + (150000 * 0.70) = 212500 + 105000 = 317500
      expect(result.snapshot.estimated_annual_value_usd).toBe(317500);
    });
  });

  describe("risk level calculation", () => {
    it("should return low risk for high readiness, low complexity, no red flags", () => {
      const input = createValidInput({
        readiness_assessment: {
          ...createValidInput().readiness_assessment,
          overall_score: 8,
          red_flags: [],
        },
        top_bottlenecks: [
          {
            ...createValidInput().top_bottlenecks[0],
            complexity: "low",
          },
        ],
      });
      const result = generateExecutiveSummary(input);

      expect(result.snapshot.risk_level).toBe("low");
    });

    it("should return high risk for low readiness, high complexity, red flags", () => {
      const input = createValidInput({
        readiness_assessment: {
          ...createValidInput().readiness_assessment,
          overall_score: 2,
          red_flags: ["Critical gap 1", "Critical gap 2", "Critical gap 3"],
        },
        top_bottlenecks: [
          {
            ...createValidInput().top_bottlenecks[0],
            complexity: "high",
          },
        ],
      });
      const result = generateExecutiveSummary(input);

      expect(result.snapshot.risk_level).toBe("high");
    });
  });

  describe("key findings", () => {
    it("should include strengths from readiness assessment", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.key_findings.strengths).toContain("Strong leadership");
      expect(result.key_findings.strengths.length).toBeLessThanOrEqual(3);
    });

    it("should include challenges from gaps", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.key_findings.challenges).toContain("Data silos");
      expect(result.key_findings.challenges.length).toBeLessThanOrEqual(3);
    });

    it("should generate opportunities from bottlenecks", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.key_findings.opportunities.length).toBeGreaterThan(0);
      expect(result.key_findings.opportunities.length).toBeLessThanOrEqual(4);
    });
  });

  describe("recommendation section", () => {
    it("should use primary bottleneck as recommendation title", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.recommendation.title).toBe("Manual Quality Inspection");
    });

    it("should include recommended starting point", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.recommendation.description).toContain("predictive maintenance");
    });

    it("should include AI approach from bottleneck", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.recommendation.approach).toContain("Computer Vision");
    });

    it("should generate why_now rationale", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.recommendation.why_now).toContain("5.5/10");
      expect(result.recommendation.why_now).toContain("2 identified opportunities");
    });
  });

  describe("financial summary", () => {
    it("should use pilot plan costs when provided", () => {
      const input = createValidInput({
        pilot_plan: {
          pilot_name: "Quality AI Pilot",
          duration_weeks: 10,
          estimated_cost_usd: 120000,
          success_metrics: ["Reduce defects by 30%"],
        },
      });
      const result = generateExecutiveSummary(input);

      expect(result.financial_summary.investment_required_usd).toBe(120000);
    });

    it("should use ROI projection when provided", () => {
      const input = createValidInput({
        roi_projection: {
          expected_roi_percent: 180,
          payback_period_months: 6,
          net_present_value_usd: 350000,
          annual_savings_usd: 200000,
          confidence_level: "high",
        },
      });
      const result = generateExecutiveSummary(input);

      expect(result.financial_summary.roi_percent).toBe(180);
      expect(result.financial_summary.payback_period_months).toBe(6);
      expect(result.financial_summary.annual_savings_usd).toBe(200000);
      expect(result.financial_summary.confidence).toBe("high");
    });

    it("should calculate three-year value", () => {
      const input = createValidInput({
        roi_projection: {
          expected_roi_percent: 200,
          payback_period_months: 4,
          net_present_value_usd: 400000,
          annual_savings_usd: 150000,
          confidence_level: "medium",
        },
        pilot_plan: {
          pilot_name: "Test",
          duration_weeks: 8,
          estimated_cost_usd: 50000,
          success_metrics: [],
        },
      });
      const result = generateExecutiveSummary(input);

      // 150000 * 3 - 50000 = 400000
      expect(result.financial_summary.three_year_value_usd).toBe(400000);
    });
  });

  describe("implementation timeline", () => {
    it("should generate three phases", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.implementation_timeline.phase_1).toBeDefined();
      expect(result.implementation_timeline.phase_2).toBeDefined();
      expect(result.implementation_timeline.phase_3).toBeDefined();
    });

    it("should include phase names and durations", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.implementation_timeline.phase_1.name).toBe("Discovery & Setup");
      expect(result.implementation_timeline.phase_1.duration).toMatch(/Weeks \d+-\d+/);
    });

    it("should include phase outcomes", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.implementation_timeline.phase_3.outcome).toContain("validated");
    });
  });

  describe("success criteria", () => {
    it("should use pilot plan success metrics when provided", () => {
      const input = createValidInput({
        pilot_plan: {
          pilot_name: "Test Pilot",
          duration_weeks: 8,
          estimated_cost_usd: 80000,
          success_metrics: ["Metric A", "Metric B", "Metric C"],
        },
      });
      const result = generateExecutiveSummary(input);

      expect(result.success_criteria).toContain("Metric A");
    });

    it("should provide default success criteria when no pilot plan", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.success_criteria.length).toBeGreaterThan(0);
      expect(result.success_criteria.some((c) => c.includes("adoption"))).toBe(true);
    });
  });

  describe("risk summary", () => {
    it("should include data risk for low data readiness", () => {
      const input = createValidInput({
        readiness_assessment: {
          ...createValidInput().readiness_assessment,
          dimensions: {
            ...createValidInput().readiness_assessment.dimensions,
            data_readiness: { score: 3, findings: [] },
          },
        },
      });
      const result = generateExecutiveSummary(input);

      const hasDataRisk = result.risk_summary.some((r) =>
        r.risk.toLowerCase().includes("data")
      );
      expect(hasDataRisk).toBe(true);
    });

    it("should include mitigation strategies", () => {
      const result = generateExecutiveSummary(createValidInput());

      result.risk_summary.forEach((risk) => {
        expect(risk.mitigation).toBeDefined();
        expect(risk.mitigation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("next steps", () => {
    it("should prompt for executive sponsor when not provided", () => {
      const result = generateExecutiveSummary(createValidInput());

      const hasSponsorship = result.next_steps.some((step) =>
        step.toLowerCase().includes("sponsor")
      );
      expect(hasSponsorship).toBe(true);
    });

    it("should not prompt for sponsor when already provided", () => {
      const input = createValidInput({
        executive_sponsor: "Jane Doe, CTO",
      });
      const result = generateExecutiveSummary(input);

      expect(result.next_steps[0]).not.toContain("sponsor");
    });

    it("should include actionable next steps", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.next_steps.length).toBeLessThanOrEqual(5);
      expect(result.next_steps.some((s) => s.includes("approve"))).toBe(true);
    });
  });

  describe("methodology note", () => {
    it("should include Good AI principles", () => {
      const result = generateExecutiveSummary(createValidInput());

      expect(result.methodology_note).toContain("Leverage, not lore");
      expect(result.methodology_note).toContain("Evidence over opinions");
      expect(result.methodology_note).toContain("Augment first");
      expect(result.methodology_note).toContain("Non-invasive by default");
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input = createValidInput();

      const result1 = generateExecutiveSummary(input);
      const result2 = generateExecutiveSummary(input);

      expect(result1).toEqual(result2);
    });
  });
});

describe("GenerateExecutiveSummaryInputSchema", () => {
  it("should reject empty company name", () => {
    const input = {
      company_name: "",
      industry: "manufacturing",
      readiness_assessment: {
        overall_score: 5,
        dimensions: {
          data_readiness: { score: 5, findings: [] },
          technical_capability: { score: 5, findings: [] },
          process_maturity: { score: 5, findings: [] },
          organizational_readiness: { score: 5, findings: [] },
        },
        strengths: [],
        gaps: [],
        recommended_starting_point: "Start here",
        estimated_time_to_value_weeks: 8,
        red_flags: [],
      },
      top_bottlenecks: [],
    };

    const result = GenerateExecutiveSummaryInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject invalid industry", () => {
    const input = {
      company_name: "Test",
      industry: "invalid_industry",
      readiness_assessment: {
        overall_score: 5,
        dimensions: {
          data_readiness: { score: 5, findings: [] },
          technical_capability: { score: 5, findings: [] },
          process_maturity: { score: 5, findings: [] },
          organizational_readiness: { score: 5, findings: [] },
        },
        strengths: [],
        gaps: [],
        recommended_starting_point: "Start here",
        estimated_time_to_value_weeks: 8,
        red_flags: [],
      },
      top_bottlenecks: [],
    };

    const result = GenerateExecutiveSummaryInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept valid minimal input", () => {
    const input = {
      company_name: "Test Corp",
      industry: "general",
      readiness_assessment: {
        overall_score: 5,
        dimensions: {
          data_readiness: { score: 5, findings: [] },
          technical_capability: { score: 5, findings: [] },
          process_maturity: { score: 5, findings: [] },
          organizational_readiness: { score: 5, findings: [] },
        },
        strengths: [],
        gaps: [],
        recommended_starting_point: "Start here",
        estimated_time_to_value_weeks: 8,
        red_flags: [],
      },
      top_bottlenecks: [],
    };

    const result = GenerateExecutiveSummaryInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
