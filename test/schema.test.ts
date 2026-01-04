/**
 * Good AI - Schema Validation Tests
 */

import { AssessAIReadinessInputSchema } from "../src/tools/assess_ai_readiness.js";
import { IdentifyBottlenecksInputSchema } from "../src/tools/identify_bottlenecks.js";
import { GeneratePilotPlanInputSchema } from "../src/tools/generate_pilot_plan.js";
import { CalculateROIInputSchema } from "../src/tools/calculate_roi.js";

describe("Input Schema Validation", () => {
  describe("AssessAIReadinessInputSchema", () => {
    it("should accept valid input", () => {
      const validInput = {
        company_name: "Test Co",
        industry: "manufacturing",
        employee_count: 100,
        data_infrastructure: {
          centralized_data: true,
          manual_data_entry_percent: 30,
        },
        current_systems: {
          erp: "SAP",
          crm: null,
          legacy_systems_count: 2,
        },
      };

      const result = AssessAIReadinessInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject empty company name", () => {
      const invalidInput = {
        company_name: "",
        industry: "general",
        employee_count: 100,
        data_infrastructure: {
          centralized_data: true,
          manual_data_entry_percent: 30,
        },
        current_systems: {
          erp: null,
          crm: null,
          legacy_systems_count: 0,
        },
      };

      const result = AssessAIReadinessInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject invalid industry", () => {
      const invalidInput = {
        company_name: "Test Co",
        industry: "invalid_industry",
        employee_count: 100,
        data_infrastructure: {
          centralized_data: true,
          manual_data_entry_percent: 30,
        },
        current_systems: {
          erp: null,
          crm: null,
          legacy_systems_count: 0,
        },
      };

      const result = AssessAIReadinessInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject negative employee count", () => {
      const invalidInput = {
        company_name: "Test Co",
        industry: "general",
        employee_count: -10,
        data_infrastructure: {
          centralized_data: true,
          manual_data_entry_percent: 30,
        },
        current_systems: {
          erp: null,
          crm: null,
          legacy_systems_count: 0,
        },
      };

      const result = AssessAIReadinessInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject manual entry percent > 100", () => {
      const invalidInput = {
        company_name: "Test Co",
        industry: "general",
        employee_count: 100,
        data_infrastructure: {
          centralized_data: true,
          manual_data_entry_percent: 150,
        },
        current_systems: {
          erp: null,
          crm: null,
          legacy_systems_count: 0,
        },
      };

      const result = AssessAIReadinessInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should accept all valid industries", () => {
      const industries = [
        "manufacturing",
        "insurance",
        "aquaculture",
        "healthcare",
        "general",
      ];

      for (const industry of industries) {
        const input = {
          company_name: "Test Co",
          industry,
          employee_count: 100,
          data_infrastructure: {
            centralized_data: true,
            manual_data_entry_percent: 30,
          },
          current_systems: {
            erp: null,
            crm: null,
            legacy_systems_count: 0,
          },
        };

        const result = AssessAIReadinessInputSchema.safeParse(input);
        expect(result.success).toBe(true);
      }
    });
  });

  describe("IdentifyBottlenecksInputSchema", () => {
    it("should accept valid input", () => {
      const validInput = {
        process_description: "This is a detailed process description for testing",
        metrics: {
          cycle_time_hours: 24,
          error_rate_percent: 5,
        },
        pain_points: ["Manual data entry", "Slow processing"],
        industry: "manufacturing",
      };

      const result = IdentifyBottlenecksInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject empty pain points", () => {
      const invalidInput = {
        process_description: "This is a detailed process description",
        metrics: {},
        pain_points: [],
        industry: "general",
      };

      const result = IdentifyBottlenecksInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject short process description", () => {
      const invalidInput = {
        process_description: "Short",
        metrics: {},
        pain_points: ["Pain point"],
        industry: "general",
      };

      const result = IdentifyBottlenecksInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe("GeneratePilotPlanInputSchema", () => {
    it("should accept valid input", () => {
      const validInput = {
        selected_bottleneck: {
          name: "Quality Control",
          description: "Manual inspection delays",
          estimated_annual_cost_usd: 50000,
          ai_solution_fit_score: 8,
          recommended_ai_approach: "Computer Vision",
          complexity: "medium",
        },
        constraints: {
          max_budget_usd: 100000,
          max_duration_weeks: 12,
        },
        company_context: {
          company_name: "Test Co",
          industry: "manufacturing",
          employee_count: 200,
        },
      };

      const result = GeneratePilotPlanInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject invalid complexity", () => {
      const invalidInput = {
        selected_bottleneck: {
          name: "Test",
          description: "Test description",
          estimated_annual_cost_usd: 50000,
          ai_solution_fit_score: 8,
          recommended_ai_approach: "Test approach",
          complexity: "invalid",
        },
        constraints: {},
        company_context: {
          company_name: "Test Co",
          industry: "general",
          employee_count: 100,
        },
      };

      const result = GeneratePilotPlanInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe("CalculateROIInputSchema", () => {
    it("should accept valid input", () => {
      const validInput = {
        current_metrics: {
          process_cost_per_month_usd: 10000,
          error_rate_percent: 5,
        },
        target_improvement_percent: 30,
        implementation_cost_usd: 50000,
      };

      const result = CalculateROIInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject improvement > 100%", () => {
      const invalidInput = {
        current_metrics: {
          process_cost_per_month_usd: 10000,
        },
        target_improvement_percent: 150,
        implementation_cost_usd: 50000,
      };

      const result = CalculateROIInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject negative implementation cost", () => {
      const invalidInput = {
        current_metrics: {
          process_cost_per_month_usd: 10000,
        },
        target_improvement_percent: 30,
        implementation_cost_usd: -50000,
      };

      const result = CalculateROIInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
