/**
 * Good AI - identify_bottlenecks Tool Tests
 */

import { identifyBottlenecks } from "../src/tools/identify_bottlenecks.js";
import { IdentifyBottlenecksInputSchema } from "../src/tools/identify_bottlenecks.js";
import type { IdentifyBottlenecksInput } from "../src/types/index.js";

describe("identifyBottlenecks", () => {
  describe("output structure", () => {
    const validInput: IdentifyBottlenecksInput = {
      process_description: "Manual quality inspection of manufactured parts",
      metrics: {
        cycle_time_hours: 48,
        error_rate_percent: 8,
        manual_steps_count: 12,
      },
      pain_points: ["Inconsistent inspection quality", "High training costs"],
      industry: "manufacturing",
    };

    it("should return all required fields", () => {
      const result = identifyBottlenecks(validInput);

      expect(result).toHaveProperty("bottlenecks");
      expect(result).toHaveProperty("total_estimated_waste_usd");
      expect(result).toHaveProperty("highest_impact_opportunity");
      expect(result).toHaveProperty("quick_wins");
    });

    it("should return bottlenecks as an array", () => {
      const result = identifyBottlenecks(validInput);

      expect(Array.isArray(result.bottlenecks)).toBe(true);
    });

    it("should have valid bottleneck structure", () => {
      const result = identifyBottlenecks(validInput);

      if (result.bottlenecks.length > 0) {
        const bottleneck = result.bottlenecks[0];
        expect(bottleneck).toHaveProperty("name");
        expect(bottleneck).toHaveProperty("description");
        expect(bottleneck).toHaveProperty("estimated_annual_cost_usd");
        expect(bottleneck).toHaveProperty("ai_solution_fit_score");
        expect(bottleneck).toHaveProperty("recommended_ai_approach");
        expect(bottleneck).toHaveProperty("complexity");
      }
    });
  });

  describe("bottleneck detection logic", () => {
    it("should detect quality control gaps for high error rate", () => {
      const input: IdentifyBottlenecksInput = {
        process_description: "Manufacturing process with defects",
        metrics: {
          error_rate_percent: 15,
        },
        pain_points: ["Too many defects"],
        industry: "manufacturing",
      };

      const result = identifyBottlenecks(input);

      const hasQualityGap = result.bottlenecks.some((b) => b.name === "Quality Control Gaps");
      expect(hasQualityGap).toBe(true);
    });

    it("should detect manual process overhead for many manual steps", () => {
      const input: IdentifyBottlenecksInput = {
        process_description: "Process with many manual steps",
        metrics: {
          manual_steps_count: 15,
        },
        pain_points: ["Too much manual work"],
        industry: "general",
      };

      const result = identifyBottlenecks(input);

      const hasManualOverhead = result.bottlenecks.some(
        (b) => b.name === "Manual Process Overhead"
      );
      expect(hasManualOverhead).toBe(true);
    });

    it("should detect data entry bottleneck from pain points", () => {
      const input: IdentifyBottlenecksInput = {
        process_description: "Order processing workflow",
        metrics: {},
        pain_points: ["Manual data entry takes too long"],
        industry: "general",
      };

      const result = identifyBottlenecks(input);

      const hasDataEntry = result.bottlenecks.some((b) => b.name === "Data Entry Bottleneck");
      expect(hasDataEntry).toBe(true);
    });

    it("should detect visual inspection delays from pain points", () => {
      const input: IdentifyBottlenecksInput = {
        process_description: "Quality assurance process",
        metrics: {},
        pain_points: ["Visual inspection is slow"],
        industry: "manufacturing",
      };

      const result = identifyBottlenecks(input);

      const hasVisualInspection = result.bottlenecks.some(
        (b) => b.name === "Visual Inspection Delays"
      );
      expect(hasVisualInspection).toBe(true);
    });
  });

  describe("industry-specific detection", () => {
    it("should detect feed optimization for aquaculture", () => {
      const input: IdentifyBottlenecksInput = {
        process_description: "Fish feeding process optimization",
        metrics: {},
        pain_points: ["Feed waste is high"],
        industry: "aquaculture",
      };

      const result = identifyBottlenecks(input);

      const hasFeedOptimization = result.bottlenecks.some((b) => b.name === "Feed Optimization");
      expect(hasFeedOptimization).toBe(true);
    });

    it("should detect claims processing for insurance", () => {
      const input: IdentifyBottlenecksInput = {
        process_description: "Insurance claim handling process",
        metrics: {},
        pain_points: ["Claims take too long"],
        industry: "insurance",
      };

      const result = identifyBottlenecks(input);

      const hasClaimsProcessing = result.bottlenecks.some(
        (b) => b.name === "Claims Processing Delays"
      );
      expect(hasClaimsProcessing).toBe(true);
    });
  });

  describe("quick wins identification", () => {
    it("should identify low complexity, high fit score items as quick wins", () => {
      const input: IdentifyBottlenecksInput = {
        process_description: "Document processing workflow",
        metrics: {},
        pain_points: ["Manual data entry is tedious"],
        industry: "general",
      };

      const result = identifyBottlenecks(input);

      // Data Entry Bottleneck should be a quick win (low complexity, score 9)
      expect(result.quick_wins.length).toBeGreaterThan(0);
      expect(result.quick_wins[0]).not.toBe("No immediate quick wins identified");
    });
  });

  describe("sorting and deduplication", () => {
    it("should sort bottlenecks by AI solution fit score descending", () => {
      const input: IdentifyBottlenecksInput = {
        process_description: "Complex process with multiple issues",
        metrics: {
          error_rate_percent: 10,
          manual_steps_count: 8,
          cycle_time_hours: 48,
        },
        pain_points: ["Manual data entry", "Visual inspection delays"],
        industry: "manufacturing",
      };

      const result = identifyBottlenecks(input);

      for (let i = 1; i < result.bottlenecks.length; i++) {
        expect(result.bottlenecks[i - 1].ai_solution_fit_score).toBeGreaterThanOrEqual(
          result.bottlenecks[i].ai_solution_fit_score
        );
      }
    });

    it("should not have duplicate bottleneck names", () => {
      const input: IdentifyBottlenecksInput = {
        process_description: "Visual inspection of parts for quality",
        metrics: {
          error_rate_percent: 10,
        },
        pain_points: ["Inspection is slow", "Visual checks are inconsistent"],
        industry: "manufacturing",
      };

      const result = identifyBottlenecks(input);
      const names = result.bottlenecks.map((b) => b.name);
      const uniqueNames = [...new Set(names)];

      expect(names.length).toBe(uniqueNames.length);
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input: IdentifyBottlenecksInput = {
        process_description: "Standard manufacturing process",
        metrics: {
          cycle_time_hours: 24,
          error_rate_percent: 5,
        },
        pain_points: ["Delays in processing"],
        industry: "manufacturing",
      };

      const result1 = identifyBottlenecks(input);
      const result2 = identifyBottlenecks(input);

      expect(result1).toEqual(result2);
    });
  });
});

describe("IdentifyBottlenecksInputSchema", () => {
  it("should reject process description that is too long", () => {
    const input = {
      process_description: "a".repeat(6000),
      metrics: {},
      pain_points: ["Test"],
      industry: "general",
    };

    const result = IdentifyBottlenecksInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject too many pain points", () => {
    const input = {
      process_description: "Valid process description",
      metrics: {},
      pain_points: Array(51).fill("Pain point"),
      industry: "general",
    };

    const result = IdentifyBottlenecksInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
