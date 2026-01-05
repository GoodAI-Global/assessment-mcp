/**
 * Good AI - Qualify Lead Tool
 * "Leverage, not lore" — Score prospect fit based on company profile for Sales
 */
import { z } from "zod";
export declare const QualifyLeadInputSchema: z.ZodObject<{
    company_name: z.ZodString;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    employee_count: z.ZodNumber;
    annual_revenue_usd: z.ZodOptional<z.ZodNumber>;
    pain_points: z.ZodArray<z.ZodString, "many">;
    current_technology_maturity: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    decision_timeline: z.ZodOptional<z.ZodEnum<["immediate", "this_quarter", "this_year", "exploring"]>>;
    budget_indication: z.ZodOptional<z.ZodEnum<["undefined", "limited", "moderate", "significant"]>>;
    champion_identified: z.ZodOptional<z.ZodBoolean>;
    executive_sponsor: z.ZodOptional<z.ZodBoolean>;
    previous_ai_experience: z.ZodOptional<z.ZodEnum<["none", "failed", "limited", "successful"]>>;
    competitive_situation: z.ZodOptional<z.ZodEnum<["none", "evaluating", "incumbent"]>>;
    source: z.ZodOptional<z.ZodString>;
    initial_contact_notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    employee_count: number;
    pain_points: string[];
    annual_revenue_usd?: number | undefined;
    executive_sponsor?: boolean | undefined;
    current_technology_maturity?: "low" | "medium" | "high" | undefined;
    decision_timeline?: "immediate" | "this_quarter" | "this_year" | "exploring" | undefined;
    budget_indication?: "undefined" | "moderate" | "limited" | "significant" | undefined;
    champion_identified?: boolean | undefined;
    previous_ai_experience?: "none" | "limited" | "failed" | "successful" | undefined;
    competitive_situation?: "none" | "evaluating" | "incumbent" | undefined;
    source?: string | undefined;
    initial_contact_notes?: string | undefined;
}, {
    company_name: string;
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    employee_count: number;
    pain_points: string[];
    annual_revenue_usd?: number | undefined;
    executive_sponsor?: boolean | undefined;
    current_technology_maturity?: "low" | "medium" | "high" | undefined;
    decision_timeline?: "immediate" | "this_quarter" | "this_year" | "exploring" | undefined;
    budget_indication?: "undefined" | "moderate" | "limited" | "significant" | undefined;
    champion_identified?: boolean | undefined;
    previous_ai_experience?: "none" | "limited" | "failed" | "successful" | undefined;
    competitive_situation?: "none" | "evaluating" | "incumbent" | undefined;
    source?: string | undefined;
    initial_contact_notes?: string | undefined;
}>;
export type QualifyLeadInput = z.infer<typeof QualifyLeadInputSchema>;
export interface LeadQualification {
    company_name: string;
    industry: string;
    qualification_score: number;
    qualification_tier: "hot" | "warm" | "nurture" | "disqualify";
    scores: {
        fit_score: number;
        budget_score: number;
        authority_score: number;
        need_score: number;
        timing_score: number;
    };
    fit_assessment: {
        company_size_fit: "ideal" | "acceptable" | "stretch" | "poor";
        industry_fit: "core" | "adjacent" | "exploratory";
        technology_readiness: "ready" | "developing" | "not_ready";
    };
    key_strengths: string[];
    key_concerns: string[];
    recommended_actions: string[];
    qualification_rationale: string;
    deal_potential: {
        estimated_deal_size_usd: number;
        confidence: "low" | "medium" | "high";
        deal_type: "pilot" | "project" | "enterprise" | "strategic";
    };
    next_steps: {
        action: string;
        priority: "high" | "medium" | "low";
        owner: string;
    }[];
    disqualification_reasons: string[];
    methodology_note: string;
}
export declare const QUALIFY_LEAD_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            company_name: {
                type: string;
            };
            industry: {
                type: string;
                enum: string[];
            };
            employee_count: {
                type: string;
            };
            annual_revenue_usd: {
                type: string;
            };
            pain_points: {
                type: string;
                description: string;
                items: {
                    type: string;
                };
            };
            current_technology_maturity: {
                type: string;
                enum: string[];
            };
            decision_timeline: {
                type: string;
                enum: string[];
            };
            budget_indication: {
                type: string;
                enum: string[];
            };
            champion_identified: {
                type: string;
            };
            executive_sponsor: {
                type: string;
            };
            previous_ai_experience: {
                type: string;
                enum: string[];
            };
            competitive_situation: {
                type: string;
                enum: string[];
            };
            source: {
                type: string;
            };
            initial_contact_notes: {
                type: string;
            };
        };
        required: string[];
    };
};
export declare function qualifyLead(input: QualifyLeadInput): LeadQualification;
//# sourceMappingURL=qualify_lead.d.ts.map