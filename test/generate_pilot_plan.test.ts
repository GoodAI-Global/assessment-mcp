/**
 * Good AI - generate_pilot_plan Tool Tests
 */

import { generatePilotPlan } from "../src/tools/generate_pilot_plan.js";
import { GeneratePilotPlanInputSchema } from "../src/tools/generate_pilot_plan.js";
import type { GeneratePilotPlanInput, Bottleneck } from "../src/types/index.js";

describe("generatePilotPlan", () => {
  const createBottleneck = (overrides: Partial<Bottleneck> = {}): Bottleneck => ({
    name: "Quality Control Gaps",
    description: "Manual inspection delays",
    estimated_annual_cost_usd: 75000,
    ai_solution_fit_score: 9,
    recommended_ai_approach: "Computer Vision for quality inspection",
    complexity: "medium",
    ...overrides,
  });

  const createValidInput = (
    overrides: Partial<GeneratePilotPlanInput> = {}
  ): GeneratePilotPlanInput => ({
    selected_bottleneck: createBottleneck(),
    constraints: {
      max_budget_usd: 50000,
      max_duration_weeks: 8,
    },
    company_context: {
      company_name: "Acme Manufacturing",
      industry: "manufacturing",
      employee_count: 250,
    },
    ...overrides,
  });

  describe("output structure", () => {
    it("should return all required fields", () => {
      const result = generatePilotPlan(createValidInput());

      expect(result).toHaveProperty("pilot_name");
      expect(result).toHaveProperty("objective");
      expect(result).toHaveProperty("approach");
      expect(result).toHaveProperty("duration_weeks");
      expect(result).toHaveProperty("estimated_cost_usd");
      expect(result).toHaveProperty("milestones");
      expect(result).toHaveProperty("success_metrics");
      expect(result).toHaveProperty("risk_mitigation");
      expect(result).toHaveProperty("next_steps");
      expect(result).toHaveProperty("good_ai_methodology_notes");
    });

    it("should include company name in pilot name", () => {
      const input = createValidInput();
      const result = generatePilotPlan(input);

      expect(result.pilot_name).toContain("Acme Manufacturing");
    });

    it("should return milestones as an array", () => {
      const result = generatePilotPlan(createValidInput());

      expect(Array.isArray(result.milestones)).toBe(true);
      expect(result.milestones.length).toBeGreaterThan(0);
    });

    it("should have valid milestone structure", () => {
      const result = generatePilotPlan(createValidInput());

      result.milestones.forEach((milestone) => {
        expect(milestone).toHaveProperty("week");
        expect(milestone).toHaveProperty("deliverable");
        expect(milestone).toHaveProperty("success_criteria");
        expect(typeof milestone.week).toBe("number");
      });
    });
  });

  describe("complexity-based duration", () => {
    it("should use 4 weeks for low complexity", () => {
      const input = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "low" }),
        constraints: {},
      });

      const result = generatePilotPlan(input);

      expect(result.duration_weeks).toBe(4);
    });

    it("should use 8 weeks for medium complexity", () => {
      const input = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "medium" }),
        constraints: {},
      });

      const result = generatePilotPlan(input);

      expect(result.duration_weeks).toBe(8);
    });

    it("should use 12 weeks for high complexity", () => {
      const input = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "high" }),
        constraints: {},
      });

      const result = generatePilotPlan(input);

      expect(result.duration_weeks).toBe(12);
    });

    it("should respect max_duration_weeks constraint", () => {
      const input = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "high" }),
        constraints: { max_duration_weeks: 6 },
      });

      const result = generatePilotPlan(input);

      expect(result.duration_weeks).toBe(6);
    });
  });

  describe("cost estimation", () => {
    it("should estimate higher cost for higher complexity", () => {
      const lowInput = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "low" }),
        constraints: {},
      });
      const highInput = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "high" }),
        constraints: {},
      });

      const lowResult = generatePilotPlan(lowInput);
      const highResult = generatePilotPlan(highInput);

      expect(highResult.estimated_cost_usd).toBeGreaterThan(lowResult.estimated_cost_usd);
    });

    it("should respect max_budget_usd constraint", () => {
      const input = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "high" }),
        constraints: { max_budget_usd: 30000 },
      });

      const result = generatePilotPlan(input);

      expect(result.estimated_cost_usd).toBeLessThanOrEqual(30000);
    });
  });

  describe("milestones generation", () => {
    it("should always include Discovery & Requirements as first milestone", () => {
      const result = generatePilotPlan(createValidInput());

      expect(result.milestones[0].week).toBe(1);
      expect(result.milestones[0].deliverable).toContain("Discovery");
    });

    it("should filter milestones that exceed duration", () => {
      const input = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "high" }),
        constraints: { max_duration_weeks: 4 },
      });

      const result = generatePilotPlan(input);

      result.milestones.forEach((m) => {
        expect(m.week).toBeLessThanOrEqual(4);
      });
    });

    it("should generate more milestones for higher complexity", () => {
      const lowInput = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "low" }),
        constraints: {},
      });
      const highInput = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "high" }),
        constraints: {},
      });

      const lowResult = generatePilotPlan(lowInput);
      const highResult = generatePilotPlan(highInput);

      expect(highResult.milestones.length).toBeGreaterThan(lowResult.milestones.length);
    });
  });

  describe("success metrics generation", () => {
    it("should include universal metrics", () => {
      const result = generatePilotPlan(createValidInput());

      const hasAdoption = result.success_metrics.some((m) => m.toLowerCase().includes("adoption"));
      expect(hasAdoption).toBe(true);
    });

    it("should include quality metrics for quality-related bottlenecks", () => {
      const input = createValidInput({
        selected_bottleneck: createBottleneck({
          name: "Quality Control Gaps",
          recommended_ai_approach: "Computer Vision inspection",
        }),
      });

      const result = generatePilotPlan(input);

      const hasDefectMetric = result.success_metrics.some((m) =>
        m.toLowerCase().includes("defect")
      );
      expect(hasDefectMetric).toBe(true);
    });

    it("should limit success metrics to 5", () => {
      const result = generatePilotPlan(createValidInput());

      expect(result.success_metrics.length).toBeLessThanOrEqual(5);
    });
  });

  describe("risk mitigation", () => {
    it("should always include weekly progress reviews", () => {
      const result = generatePilotPlan(createValidInput());

      const hasWeeklyReview = result.risk_mitigation.some((r) =>
        r.toLowerCase().includes("weekly")
      );
      expect(hasWeeklyReview).toBe(true);
    });

    it("should include more risk mitigation for high complexity", () => {
      const lowInput = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "low" }),
      });
      const highInput = createValidInput({
        selected_bottleneck: createBottleneck({ complexity: "high" }),
      });

      const lowResult = generatePilotPlan(lowInput);
      const highResult = generatePilotPlan(highInput);

      expect(highResult.risk_mitigation.length).toBeGreaterThan(lowResult.risk_mitigation.length);
    });
  });

  describe("Good AI methodology", () => {
    it("should include methodology notes mentioning core principles", () => {
      const result = generatePilotPlan(createValidInput());

      expect(result.good_ai_methodology_notes).toContain("Leverage, not lore");
      expect(result.good_ai_methodology_notes).toContain("Evidence over opinions");
      expect(result.good_ai_methodology_notes).toContain("Augment first");
      expect(result.good_ai_methodology_notes).toContain("Non-invasive");
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input = createValidInput();

      const result1 = generatePilotPlan(input);
      const result2 = generatePilotPlan(input);

      expect(result1).toEqual(result2);
    });
  });
});

describe("GeneratePilotPlanInputSchema", () => {
  it("should reject bottleneck name that is too long", () => {
    const input = {
      selected_bottleneck: {
        name: "a".repeat(300),
        description: "Valid description",
        estimated_annual_cost_usd: 50000,
        ai_solution_fit_score: 8,
        recommended_ai_approach: "AI approach",
        complexity: "medium",
      },
      constraints: {},
      company_context: {
        company_name: "Test Co",
        industry: "general",
        employee_count: 100,
      },
    };

    const result = GeneratePilotPlanInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject invalid complexity value", () => {
    const input = {
      selected_bottleneck: {
        name: "Test",
        description: "Valid description",
        estimated_annual_cost_usd: 50000,
        ai_solution_fit_score: 8,
        recommended_ai_approach: "AI approach",
        complexity: "extreme",
      },
      constraints: {},
      company_context: {
        company_name: "Test Co",
        industry: "general",
        employee_count: 100,
      },
    };

    const result = GeneratePilotPlanInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
