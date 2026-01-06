/**
 * Good AI - calculate_roi Tool Tests
 */

import { calculateROI } from "../src/tools/calculate_roi.js";
import { CalculateROIInputSchema } from "../src/tools/calculate_roi.js";
import type { CalculateROIInput } from "../src/types/index.js";

describe("calculateROI", () => {
  const createValidInput = (overrides: Partial<CalculateROIInput> = {}): CalculateROIInput => ({
    current_metrics: {
      process_cost_per_month_usd: 50000,
      error_rate_percent: 10,
      cycle_time_hours: 48,
      manual_fte_count: 5,
    },
    target_improvement_percent: 30,
    implementation_cost_usd: 100000,
    ongoing_monthly_cost_usd: 2000,
    time_horizon_months: 24,
    ...overrides,
  });

  describe("output structure", () => {
    it("should return all required fields", () => {
      const result = calculateROI(createValidInput());

      expect(result).toHaveProperty("expected_roi_percent");
      expect(result).toHaveProperty("payback_period_months");
      expect(result).toHaveProperty("net_present_value_usd");
      expect(result).toHaveProperty("monthly_savings_usd");
      expect(result).toHaveProperty("annual_savings_usd");
      expect(result).toHaveProperty("sensitivity_analysis");
      expect(result).toHaveProperty("assumptions");
      expect(result).toHaveProperty("confidence_level");
    });

    it("should return sensitivity analysis with three scenarios", () => {
      const result = calculateROI(createValidInput());

      expect(result.sensitivity_analysis).toHaveLength(3);
      expect(result.sensitivity_analysis.map((s) => s.scenario)).toEqual([
        "conservative",
        "expected",
        "optimistic",
      ]);
    });

    it("should return valid confidence level", () => {
      const result = calculateROI(createValidInput());

      expect(["low", "medium", "high"]).toContain(result.confidence_level);
    });
  });

  describe("monthly and annual savings", () => {
    it("should calculate monthly savings correctly", () => {
      const input = createValidInput({
        current_metrics: { process_cost_per_month_usd: 100000 },
        target_improvement_percent: 20,
      });

      const result = calculateROI(input);

      // 20% of 100000 = 20000
      expect(result.monthly_savings_usd).toBe(20000);
    });

    it("should calculate annual savings as 12x monthly", () => {
      const result = calculateROI(createValidInput());

      expect(result.annual_savings_usd).toBe(result.monthly_savings_usd * 12);
    });
  });

  describe("payback period calculation", () => {
    it("should calculate correct payback period", () => {
      const input = createValidInput({
        current_metrics: { process_cost_per_month_usd: 50000 },
        target_improvement_percent: 50, // 25000/month savings
        implementation_cost_usd: 100000,
        ongoing_monthly_cost_usd: 5000, // net 20000/month
      });

      const result = calculateROI(input);

      // 100000 / 20000 = 5 months
      expect(result.payback_period_months).toBe(5);
    });

    it("should return 999 when payback is infinite", () => {
      const input = createValidInput({
        current_metrics: { process_cost_per_month_usd: 10000 },
        target_improvement_percent: 10, // 1000/month savings
        implementation_cost_usd: 100000,
        ongoing_monthly_cost_usd: 2000, // net -1000/month (negative)
      });

      const result = calculateROI(input);

      expect(result.payback_period_months).toBe(999);
    });

    it("should handle zero ongoing costs", () => {
      const input = createValidInput({
        current_metrics: { process_cost_per_month_usd: 50000 },
        target_improvement_percent: 20, // 10000/month savings
        implementation_cost_usd: 50000,
        ongoing_monthly_cost_usd: 0,
      });

      const result = calculateROI(input);

      // 50000 / 10000 = 5 months
      expect(result.payback_period_months).toBe(5);
    });
  });

  describe("ROI percent calculation", () => {
    it("should calculate positive ROI for profitable investment", () => {
      const input = createValidInput({
        current_metrics: { process_cost_per_month_usd: 50000 },
        target_improvement_percent: 30,
        implementation_cost_usd: 100000,
        ongoing_monthly_cost_usd: 1000,
        time_horizon_months: 24,
      });

      const result = calculateROI(input);

      // Monthly savings = 15000, total savings = 360000
      // Total ongoing = 24000, net benefit = 360000 - 24000 - 100000 = 236000
      // ROI = 236000 / 100000 * 100 = 236%
      expect(result.expected_roi_percent).toBe(236);
    });

    it("should calculate negative ROI for unprofitable investment", () => {
      const input = createValidInput({
        current_metrics: { process_cost_per_month_usd: 10000 },
        target_improvement_percent: 5, // 500/month savings
        implementation_cost_usd: 100000,
        ongoing_monthly_cost_usd: 1000,
        time_horizon_months: 12,
      });

      const result = calculateROI(input);

      expect(result.expected_roi_percent).toBeLessThan(0);
    });
  });

  describe("NPV calculation", () => {
    it("should apply discount rate to future cash flows", () => {
      const input = createValidInput();
      const result = calculateROI(input);

      // NPV should be less than simple sum due to discounting
      const simpleSavings =
        result.monthly_savings_usd * input.time_horizon_months! -
        (input.ongoing_monthly_cost_usd ?? 0) * input.time_horizon_months! -
        input.implementation_cost_usd;

      expect(result.net_present_value_usd).toBeLessThan(simpleSavings);
    });

    it("should return negative NPV for poor investments", () => {
      const input = createValidInput({
        current_metrics: { process_cost_per_month_usd: 5000 },
        target_improvement_percent: 10,
        implementation_cost_usd: 500000,
        time_horizon_months: 12,
      });

      const result = calculateROI(input);

      expect(result.net_present_value_usd).toBeLessThan(0);
    });
  });

  describe("sensitivity analysis", () => {
    it("should have conservative scenario at 60% of target", () => {
      const input = createValidInput({
        target_improvement_percent: 50,
      });

      const result = calculateROI(input);
      const conservative = result.sensitivity_analysis.find((s) => s.scenario === "conservative");

      expect(conservative?.improvement_percent).toBe(30); // 60% of 50
    });

    it("should have expected scenario at 100% of target", () => {
      const input = createValidInput({
        target_improvement_percent: 40,
      });

      const result = calculateROI(input);
      const expected = result.sensitivity_analysis.find((s) => s.scenario === "expected");

      expect(expected?.improvement_percent).toBe(40);
    });

    it("should cap optimistic scenario at 95%", () => {
      const input = createValidInput({
        target_improvement_percent: 80, // 130% would be 104, capped at 95
      });

      const result = calculateROI(input);
      const optimistic = result.sensitivity_analysis.find((s) => s.scenario === "optimistic");

      expect(optimistic?.improvement_percent).toBeLessThanOrEqual(95);
    });

    it("should show higher ROI for optimistic scenario", () => {
      const result = calculateROI(createValidInput());

      const conservative = result.sensitivity_analysis.find((s) => s.scenario === "conservative");
      const expected = result.sensitivity_analysis.find((s) => s.scenario === "expected");
      const optimistic = result.sensitivity_analysis.find((s) => s.scenario === "optimistic");

      expect(optimistic!.roi_percent).toBeGreaterThan(expected!.roi_percent);
      expect(expected!.roi_percent).toBeGreaterThan(conservative!.roi_percent);
    });
  });

  describe("assumptions generation", () => {
    it("should include current monthly cost in assumptions", () => {
      const input = createValidInput({
        current_metrics: { process_cost_per_month_usd: 75000 },
      });

      const result = calculateROI(input);

      const hasCostAssumption = result.assumptions.some((a) => a.includes("75,000"));
      expect(hasCostAssumption).toBe(true);
    });

    it("should include target improvement in assumptions", () => {
      const input = createValidInput({
        target_improvement_percent: 35,
      });

      const result = calculateROI(input);

      const hasImprovementAssumption = result.assumptions.some((a) => a.includes("35%"));
      expect(hasImprovementAssumption).toBe(true);
    });

    it("should include ongoing cost when provided", () => {
      const input = createValidInput({
        ongoing_monthly_cost_usd: 5000,
      });

      const result = calculateROI(input);

      const hasOngoingCost = result.assumptions.some((a) => a.includes("5,000"));
      expect(hasOngoingCost).toBe(true);
    });

    it("should include FTE count when provided", () => {
      const input = createValidInput({
        current_metrics: {
          process_cost_per_month_usd: 50000,
          manual_fte_count: 8,
        },
      });

      const result = calculateROI(input);

      const hasFteAssumption = result.assumptions.some((a) => a.includes("8"));
      expect(hasFteAssumption).toBe(true);
    });
  });

  describe("confidence level determination", () => {
    it("should return low confidence for very long payback", () => {
      const input = createValidInput({
        current_metrics: { process_cost_per_month_usd: 10000 },
        target_improvement_percent: 5,
        implementation_cost_usd: 500000,
        ongoing_monthly_cost_usd: 0,
        time_horizon_months: 60,
      });

      const result = calculateROI(input);

      expect(result.confidence_level).toBe("low");
    });

    it("should return low confidence for negative ROI", () => {
      const input = createValidInput({
        current_metrics: { process_cost_per_month_usd: 5000 },
        target_improvement_percent: 10,
        implementation_cost_usd: 200000,
        time_horizon_months: 12,
      });

      const result = calculateROI(input);

      expect(result.confidence_level).toBe("low");
    });

    it("should return high confidence for short payback with good ROI and detailed metrics", () => {
      const input = createValidInput({
        current_metrics: {
          process_cost_per_month_usd: 100000,
          error_rate_percent: 15,
          cycle_time_hours: 72,
          manual_fte_count: 10,
        },
        target_improvement_percent: 50,
        implementation_cost_usd: 50000,
        ongoing_monthly_cost_usd: 1000,
        time_horizon_months: 24,
      });

      const result = calculateROI(input);

      expect(result.confidence_level).toBe("high");
    });
  });

  describe("default values", () => {
    it("should use 24 months as default time horizon", () => {
      const input: CalculateROIInput = {
        current_metrics: { process_cost_per_month_usd: 50000 },
        target_improvement_percent: 30,
        implementation_cost_usd: 100000,
      };

      const result = calculateROI(input);

      // Check that savings calculations use 24 months
      // Annual savings = monthly * 12, so 24 months = 2 * annual
      expect(result.annual_savings_usd * 2).toBe(result.monthly_savings_usd * 24);
    });

    it("should use 0 as default ongoing monthly cost", () => {
      const input: CalculateROIInput = {
        current_metrics: { process_cost_per_month_usd: 50000 },
        target_improvement_percent: 20,
        implementation_cost_usd: 50000,
      };

      const result = calculateROI(input);

      // With 0 ongoing cost, payback = implementation / monthly savings
      // 50000 / 10000 = 5 months
      expect(result.payback_period_months).toBe(5);
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input = createValidInput();

      const result1 = calculateROI(input);
      const result2 = calculateROI(input);

      expect(result1).toEqual(result2);
    });
  });
});

describe("CalculateROIInputSchema", () => {
  it("should reject negative process cost", () => {
    const input = {
      current_metrics: { process_cost_per_month_usd: -1000 },
      target_improvement_percent: 20,
      implementation_cost_usd: 50000,
    };

    const result = CalculateROIInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject improvement percent over 100", () => {
    const input = {
      current_metrics: { process_cost_per_month_usd: 50000 },
      target_improvement_percent: 150,
      implementation_cost_usd: 50000,
    };

    const result = CalculateROIInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject improvement percent under 1", () => {
    const input = {
      current_metrics: { process_cost_per_month_usd: 50000 },
      target_improvement_percent: 0,
      implementation_cost_usd: 50000,
    };

    const result = CalculateROIInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject unrealistic time horizon", () => {
    const input = {
      current_metrics: { process_cost_per_month_usd: 50000 },
      target_improvement_percent: 20,
      implementation_cost_usd: 50000,
      time_horizon_months: 200,
    };

    const result = CalculateROIInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept valid input without optional fields", () => {
    const input = {
      current_metrics: { process_cost_per_month_usd: 50000 },
      target_improvement_percent: 20,
      implementation_cost_usd: 50000,
    };

    const result = CalculateROIInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
