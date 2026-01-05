/**
 * Good AI - Generate Statement of Work Tool
 * Professional SOW generation for AI consulting engagements
 */
import { z } from "zod";
export declare const GenerateSOWInputSchema: z.ZodObject<{
    client_name: z.ZodString;
    client_address: z.ZodOptional<z.ZodString>;
    client_contact_name: z.ZodOptional<z.ZodString>;
    client_contact_email: z.ZodOptional<z.ZodString>;
    engagement_title: z.ZodString;
    engagement_type: z.ZodEnum<["assessment", "pilot", "implementation", "transformation", "managed_service"]>;
    industry: z.ZodEnum<["manufacturing", "insurance", "aquaculture", "healthcare", "general"]>;
    objectives: z.ZodArray<z.ZodString, "many">;
    deliverables: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        acceptance_criteria: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        acceptance_criteria?: string[] | undefined;
    }, {
        name: string;
        description: string;
        acceptance_criteria?: string[] | undefined;
    }>, "many">;
    out_of_scope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    start_date: z.ZodOptional<z.ZodString>;
    duration_weeks: z.ZodNumber;
    milestones: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        week: z.ZodNumber;
        deliverables: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        payment_percent: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        week: number;
        deliverables?: string[] | undefined;
        payment_percent?: number | undefined;
    }, {
        name: string;
        week: number;
        deliverables?: string[] | undefined;
        payment_percent?: number | undefined;
    }>, "many">>;
    total_value_usd: z.ZodNumber;
    pricing_model: z.ZodDefault<z.ZodEnum<["fixed_fee", "time_and_materials", "milestone_based", "retainer", "hybrid"]>>;
    payment_terms: z.ZodOptional<z.ZodString>;
    team_composition: z.ZodOptional<z.ZodArray<z.ZodObject<{
        role: z.ZodString;
        allocation_percent: z.ZodNumber;
        responsibilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        role: string;
        allocation_percent: number;
        responsibilities?: string[] | undefined;
    }, {
        role: string;
        allocation_percent: number;
        responsibilities?: string[] | undefined;
    }>, "many">>;
    client_responsibilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    assumptions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    change_control_process: z.ZodOptional<z.ZodString>;
    consultant_name: z.ZodOptional<z.ZodString>;
    consultant_company: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    duration_weeks: number;
    engagement_type: "pilot" | "assessment" | "implementation" | "transformation" | "managed_service";
    client_name: string;
    engagement_title: string;
    objectives: string[];
    deliverables: {
        name: string;
        description: string;
        acceptance_criteria?: string[] | undefined;
    }[];
    total_value_usd: number;
    pricing_model: "fixed_fee" | "time_and_materials" | "milestone_based" | "retainer" | "hybrid";
    consultant_company: string;
    dependencies?: string[] | undefined;
    client_address?: string | undefined;
    client_contact_name?: string | undefined;
    client_contact_email?: string | undefined;
    out_of_scope?: string[] | undefined;
    start_date?: string | undefined;
    milestones?: {
        name: string;
        week: number;
        deliverables?: string[] | undefined;
        payment_percent?: number | undefined;
    }[] | undefined;
    payment_terms?: string | undefined;
    team_composition?: {
        role: string;
        allocation_percent: number;
        responsibilities?: string[] | undefined;
    }[] | undefined;
    client_responsibilities?: string[] | undefined;
    assumptions?: string[] | undefined;
    change_control_process?: string | undefined;
    consultant_name?: string | undefined;
}, {
    industry: "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";
    duration_weeks: number;
    engagement_type: "pilot" | "assessment" | "implementation" | "transformation" | "managed_service";
    client_name: string;
    engagement_title: string;
    objectives: string[];
    deliverables: {
        name: string;
        description: string;
        acceptance_criteria?: string[] | undefined;
    }[];
    total_value_usd: number;
    dependencies?: string[] | undefined;
    client_address?: string | undefined;
    client_contact_name?: string | undefined;
    client_contact_email?: string | undefined;
    out_of_scope?: string[] | undefined;
    start_date?: string | undefined;
    milestones?: {
        name: string;
        week: number;
        deliverables?: string[] | undefined;
        payment_percent?: number | undefined;
    }[] | undefined;
    pricing_model?: "fixed_fee" | "time_and_materials" | "milestone_based" | "retainer" | "hybrid" | undefined;
    payment_terms?: string | undefined;
    team_composition?: {
        role: string;
        allocation_percent: number;
        responsibilities?: string[] | undefined;
    }[] | undefined;
    client_responsibilities?: string[] | undefined;
    assumptions?: string[] | undefined;
    change_control_process?: string | undefined;
    consultant_name?: string | undefined;
    consultant_company?: string | undefined;
}>;
export type GenerateSOWInput = z.infer<typeof GenerateSOWInputSchema>;
export interface StatementOfWork {
    /** Document metadata */
    document_info: {
        title: string;
        version: string;
        generated_date: string;
        prepared_by: string;
        prepared_for: string;
    };
    /** Executive summary */
    executive_summary: {
        overview: string;
        key_objectives: string[];
        expected_outcomes: string[];
        investment_summary: string;
    };
    /** Scope of work */
    scope: {
        objectives: {
            id: string;
            description: string;
        }[];
        deliverables: {
            id: string;
            name: string;
            description: string;
            acceptance_criteria: string[];
        }[];
        out_of_scope: string[];
    };
    /** Project timeline */
    timeline: {
        start_date: string;
        end_date: string;
        duration_weeks: number;
        phases: {
            name: string;
            start_week: number;
            end_week: number;
            description: string;
            deliverables: string[];
        }[];
        milestones: {
            id: string;
            name: string;
            week: number;
            criteria: string;
            payment_percent?: number;
        }[];
    };
    /** Investment and payment */
    investment: {
        total_value_usd: number;
        pricing_model: string;
        pricing_model_description: string;
        payment_schedule: {
            milestone: string;
            amount_usd: number;
            due_date_description: string;
        }[];
        payment_terms: string;
        expenses: string;
    };
    /** Team and responsibilities */
    team: {
        provider_team: {
            role: string;
            allocation: string;
            responsibilities: string[];
        }[];
        client_responsibilities: string[];
        governance: {
            meeting_cadence: string;
            escalation_process: string;
            decision_authority: string;
        };
    };
    /** Assumptions and dependencies */
    assumptions_dependencies: {
        assumptions: string[];
        dependencies: string[];
        risks: {
            risk: string;
            mitigation: string;
        }[];
    };
    /** Change management */
    change_management: {
        process: string;
        scope_change_handling: string;
        timeline_change_handling: string;
    };
    /** Terms and conditions */
    terms: {
        confidentiality: string;
        intellectual_property: string;
        termination: string;
        limitation_of_liability: string;
        warranties: string;
    };
    /** Acceptance and signatures */
    acceptance: {
        acceptance_statement: string;
        validity_period_days: number;
        signature_blocks: {
            party: string;
            name_placeholder: string;
            title_placeholder: string;
            date_placeholder: string;
        }[];
    };
    /** Appendices */
    appendices: {
        title: string;
        content: string;
    }[];
    /** Methodology note */
    methodology_note: string;
}
export declare const GENERATE_SOW_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            client_name: {
                type: string;
                description: string;
            };
            engagement_title: {
                type: string;
                description: string;
            };
            engagement_type: {
                type: string;
                enum: string[];
            };
            industry: {
                type: string;
                enum: string[];
            };
            objectives: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            deliverables: {
                type: string;
                description: string;
            };
            duration_weeks: {
                type: string;
                description: string;
            };
            total_value_usd: {
                type: string;
                description: string;
            };
            pricing_model: {
                type: string;
                enum: string[];
            };
            team_composition: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function generateSOW(input: GenerateSOWInput): StatementOfWork;
//# sourceMappingURL=generate_sow.d.ts.map