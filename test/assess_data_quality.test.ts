/**
 * Good AI - assess_data_quality Tool Tests
 */

import {
  assessDataQuality,
  AssessDataQualityInputSchema,
  type AssessDataQualityInput,
} from "../src/tools/assess_data_quality.js";

describe("assessDataQuality", () => {
  const createValidInput = (
    overrides: Partial<AssessDataQualityInput> = {}
  ): AssessDataQualityInput => ({
    company_name: "Test Manufacturing Co",
    industry: "manufacturing",
    data_sources: [
      {
        name: "Production Database",
        type: "database",
        volume_records: 1000000,
        update_frequency: "real_time",
        estimated_completeness_percent: 95,
        has_documentation: true,
        owner_identified: true,
        historical_depth_months: 36,
      },
      {
        name: "Quality Spreadsheets",
        type: "spreadsheet",
        volume_records: 5000,
        update_frequency: "weekly",
        estimated_completeness_percent: 70,
        has_documentation: false,
        owner_identified: false,
        historical_depth_months: 12,
      },
    ],
    ...overrides,
  });

  describe("output structure", () => {
    it("should return all required fields", () => {
      const result = assessDataQuality(createValidInput());

      expect(result).toHaveProperty("overall_data_quality_score");
      expect(result).toHaveProperty("ai_readiness_rating");
      expect(result).toHaveProperty("data_sources_assessed");
      expect(result).toHaveProperty("aggregate_metrics");
      expect(result).toHaveProperty("data_gaps");
      expect(result).toHaveProperty("governance_assessment");
      expect(result).toHaveProperty("integration_assessment");
      expect(result).toHaveProperty("quick_wins");
      expect(result).toHaveProperty("critical_actions");
      expect(result).toHaveProperty("estimated_data_prep_weeks");
    });

    it("should assess all data sources", () => {
      const result = assessDataQuality(createValidInput());

      expect(result.data_sources_assessed).toHaveLength(2);
      expect(result.data_sources_assessed[0].name).toBe("Production Database");
      expect(result.data_sources_assessed[1].name).toBe("Quality Spreadsheets");
    });

    it("should include quality dimensions for each source", () => {
      const result = assessDataQuality(createValidInput());

      result.data_sources_assessed.forEach((source) => {
        expect(source.quality_dimensions).toHaveProperty("completeness");
        expect(source.quality_dimensions).toHaveProperty("freshness");
        expect(source.quality_dimensions).toHaveProperty("accessibility");
        expect(source.quality_dimensions).toHaveProperty("consistency");
      });
    });
  });

  describe("data source assessment", () => {
    it("should score high-quality database source highly", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Premium DB",
            type: "database",
            update_frequency: "real_time",
            estimated_completeness_percent: 98,
            has_documentation: true,
            owner_identified: true,
            historical_depth_months: 48,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.data_sources_assessed[0].ai_readiness_score).toBeGreaterThanOrEqual(8);
    });

    it("should score manual entry source lower", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Manual Logs",
            type: "manual_entry",
            update_frequency: "ad_hoc",
            estimated_completeness_percent: 50,
            has_documentation: false,
            owner_identified: false,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.data_sources_assessed[0].ai_readiness_score).toBeLessThan(5);
    });

    it("should identify risks for low-quality sources", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Poor Data",
            type: "spreadsheet",
            update_frequency: "monthly",
            estimated_completeness_percent: 40,
            has_documentation: false,
            owner_identified: false,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.data_sources_assessed[0].risks.length).toBeGreaterThan(0);
    });

    it("should provide recommendations for improvement", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Needs Improvement",
            type: "files",
            update_frequency: "weekly",
            estimated_completeness_percent: 60,
            has_documentation: false,
            owner_identified: false,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.data_sources_assessed[0].recommendations.length).toBeGreaterThan(0);
    });
  });

  describe("completeness assessment", () => {
    it("should give high score for 95%+ completeness", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Complete DB",
            type: "database",
            estimated_completeness_percent: 98,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.data_sources_assessed[0].quality_dimensions.completeness.score).toBe(10);
    });

    it("should give low score for < 50% completeness", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Incomplete Data",
            type: "database",
            estimated_completeness_percent: 30,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.data_sources_assessed[0].quality_dimensions.completeness.score).toBe(2);
    });

    it("should handle unknown completeness", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Unknown Completeness",
            type: "database",
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.data_sources_assessed[0].quality_dimensions.completeness.score).toBe(5);
      expect(result.data_sources_assessed[0].quality_dimensions.completeness.finding).toContain(
        "unknown"
      );
    });
  });

  describe("freshness assessment", () => {
    it("should give highest score for real-time data", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Real-time",
            type: "sensors",
            update_frequency: "real_time",
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.data_sources_assessed[0].quality_dimensions.freshness.score).toBe(10);
    });

    it("should give low score for monthly updates", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Monthly",
            type: "database",
            update_frequency: "monthly",
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.data_sources_assessed[0].quality_dimensions.freshness.score).toBe(3);
    });
  });

  describe("aggregate metrics", () => {
    it("should correctly count AI-ready sources", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Ready",
            type: "database",
            update_frequency: "real_time",
            estimated_completeness_percent: 95,
            has_documentation: true,
            owner_identified: true,
          },
          {
            name: "Not Ready",
            type: "manual_entry",
            update_frequency: "ad_hoc",
            estimated_completeness_percent: 30,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.aggregate_metrics.sources_ai_ready).toBe(1);
      expect(result.aggregate_metrics.sources_not_ready).toBe(1);
    });

    it("should detect real-time data availability", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "RT Source",
            type: "sensors",
            update_frequency: "real_time",
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.aggregate_metrics.has_real_time_data).toBe(true);
    });

    it("should detect historical depth", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Historical",
            type: "database",
            historical_depth_months: 24,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.aggregate_metrics.has_historical_depth).toBe(true);
    });
  });

  describe("ai_readiness_rating", () => {
    it("should return 'excellent' for high scores", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Excellent",
            type: "api",
            update_frequency: "real_time",
            estimated_completeness_percent: 99,
            has_documentation: true,
            owner_identified: true,
            historical_depth_months: 60,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.ai_readiness_rating).toBe("excellent");
    });

    it("should return 'not_ready' for poor scores", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Poor",
            type: "manual_entry",
            update_frequency: "ad_hoc",
            estimated_completeness_percent: 20,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.ai_readiness_rating).toBe("not_ready");
    });
  });

  describe("data gaps identification", () => {
    it("should identify completeness gaps", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Incomplete 1",
            type: "database",
            estimated_completeness_percent: 40,
          },
          {
            name: "Incomplete 2",
            type: "database",
            estimated_completeness_percent: 50,
          },
        ],
      });

      const result = assessDataQuality(input);
      const completenessGap = result.data_gaps.find((g) =>
        g.gap.toLowerCase().includes("completeness")
      );
      expect(completenessGap).toBeDefined();
    });

    it("should identify governance gap when not present", () => {
      const input = createValidInput({
        data_governance_exists: false,
      });

      const result = assessDataQuality(input);
      const govGap = result.data_gaps.find((g) =>
        g.gap.toLowerCase().includes("governance")
      );
      expect(govGap).toBeDefined();
      expect(govGap?.impact).toBe("high");
    });

    it("should include remediation and effort for gaps", () => {
      const result = assessDataQuality(createValidInput());

      result.data_gaps.forEach((gap) => {
        expect(gap.remediation).toBeDefined();
        expect(gap.effort_weeks).toBeGreaterThan(0);
      });
    });
  });

  describe("governance assessment", () => {
    it("should score higher with governance in place", () => {
      const withGov = assessDataQuality(
        createValidInput({
          data_governance_exists: true,
          data_catalog_exists: true,
          data_quality_monitoring: true,
        })
      );

      const withoutGov = assessDataQuality(
        createValidInput({
          data_governance_exists: false,
          data_catalog_exists: false,
          data_quality_monitoring: false,
        })
      );

      expect(withGov.governance_assessment.score).toBeGreaterThan(
        withoutGov.governance_assessment.score
      );
    });

    it("should provide recommendations when governance is missing", () => {
      const result = assessDataQuality(
        createValidInput({
          data_governance_exists: false,
          data_catalog_exists: false,
        })
      );

      expect(result.governance_assessment.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe("integration assessment", () => {
    it("should estimate effort based on source count and type", () => {
      const simple = assessDataQuality(
        createValidInput({
          data_sources: [
            { name: "Simple", type: "api", update_frequency: "daily" },
          ],
          integration_complexity: "low",
        })
      );

      const complex = assessDataQuality(
        createValidInput({
          data_sources: [
            { name: "Source1", type: "spreadsheet" },
            { name: "Source2", type: "manual_entry" },
            { name: "Source3", type: "third_party" },
            { name: "Source4", type: "files" },
          ],
          integration_complexity: "high",
        })
      );

      expect(complex.integration_assessment.estimated_effort_weeks).toBeGreaterThan(
        simple.integration_assessment.estimated_effort_weeks
      );
    });

    it("should identify integration challenges", () => {
      const result = assessDataQuality(
        createValidInput({
          data_sources: [
            { name: "Manual", type: "manual_entry" },
            { name: "Third Party", type: "third_party" },
          ],
        })
      );

      expect(result.integration_assessment.key_challenges.length).toBeGreaterThan(0);
    });
  });

  describe("quick wins and critical actions", () => {
    it("should identify quick wins from high-quality sources", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "High Quality API",
            type: "api",
            update_frequency: "real_time",
            estimated_completeness_percent: 95,
            has_documentation: true,
            owner_identified: true,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.quick_wins.length).toBeGreaterThan(0);
      expect(result.quick_wins.some((w) => w.includes("High Quality API"))).toBe(true);
    });

    it("should identify critical actions for poor-quality sources", () => {
      const input = createValidInput({
        data_sources: [
          {
            name: "Critical Source",
            type: "manual_entry",
            update_frequency: "ad_hoc",
            estimated_completeness_percent: 20,
          },
        ],
      });

      const result = assessDataQuality(input);
      expect(result.critical_actions.length).toBeGreaterThan(0);
    });
  });

  describe("estimated data prep weeks", () => {
    it("should be at least 2 weeks", () => {
      const result = assessDataQuality(
        createValidInput({
          data_sources: [
            {
              name: "Perfect",
              type: "api",
              update_frequency: "real_time",
              estimated_completeness_percent: 100,
              has_documentation: true,
              owner_identified: true,
            },
          ],
          data_governance_exists: true,
          data_catalog_exists: true,
          data_quality_monitoring: true,
        })
      );

      expect(result.estimated_data_prep_weeks).toBeGreaterThanOrEqual(2);
    });

    it("should increase with more gaps and complexity", () => {
      const simple = assessDataQuality(
        createValidInput({
          data_sources: [
            {
              name: "Good",
              type: "database",
              estimated_completeness_percent: 90,
            },
          ],
          integration_complexity: "low",
        })
      );

      const complex = assessDataQuality(
        createValidInput({
          data_sources: [
            { name: "Poor1", type: "manual_entry", estimated_completeness_percent: 30 },
            { name: "Poor2", type: "spreadsheet", estimated_completeness_percent: 40 },
            { name: "Poor3", type: "files", estimated_completeness_percent: 50 },
          ],
          integration_complexity: "high",
          data_governance_exists: false,
        })
      );

      expect(complex.estimated_data_prep_weeks).toBeGreaterThan(
        simple.estimated_data_prep_weeks
      );
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input = createValidInput();

      const result1 = assessDataQuality(input);
      const result2 = assessDataQuality(input);

      expect(result1).toEqual(result2);
    });
  });
});

describe("AssessDataQualityInputSchema", () => {
  it("should reject empty data sources array", () => {
    const input = {
      company_name: "Test",
      industry: "manufacturing",
      data_sources: [],
    };

    const result = AssessDataQualityInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject invalid data source type", () => {
    const input = {
      company_name: "Test",
      industry: "manufacturing",
      data_sources: [
        { name: "Test", type: "invalid_type" },
      ],
    };

    const result = AssessDataQualityInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject completeness > 100", () => {
    const input = {
      company_name: "Test",
      industry: "manufacturing",
      data_sources: [
        { name: "Test", type: "database", estimated_completeness_percent: 150 },
      ],
    };

    const result = AssessDataQualityInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept valid minimal input", () => {
    const input = {
      company_name: "Test Corp",
      industry: "general",
      data_sources: [
        { name: "Main DB", type: "database" },
      ],
    };

    const result = AssessDataQualityInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
