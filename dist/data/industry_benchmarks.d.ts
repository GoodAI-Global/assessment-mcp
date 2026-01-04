/**
 * Good AI Industry Benchmarks
 * Evidence-based data for enterprise AI assessments
 */
import type { Industry, IndustryBenchmark } from "../types/index.js";
export declare const INDUSTRY_BENCHMARKS: Record<Industry, IndustryBenchmark>;
/**
 * Get industry-specific recommendations based on company characteristics
 */
export declare function getIndustryRecommendation(industry: Industry, hasCentralizedData: boolean, manualDataEntryPercent: number): string;
/**
 * Calculate estimated time to value based on company characteristics
 */
export declare function calculateTimeToValue(industry: Industry, hasCentralizedData: boolean, legacySystemsCount: number, manualDataEntryPercent: number): number;
//# sourceMappingURL=industry_benchmarks.d.ts.map