/**
 * Good AI - Generate Statement of Work Tool
 * Professional SOW generation for AI consulting engagements
 */

import { z } from "zod";

// ============================================
// Input Schema
// ============================================

export const GenerateSOWInputSchema = z.object({
  // Client Information
  client_name: z.string().min(1).max(200),
  client_address: z.string().max(500).optional(),
  client_contact_name: z.string().max(200).optional(),
  client_contact_email: z.string().email().optional(),

  // Engagement Information
  engagement_title: z.string().min(1).max(300),
  engagement_type: z.enum([
    "assessment",
    "pilot",
    "implementation",
    "transformation",
    "managed_service",
  ]),
  industry: z.enum(["manufacturing", "insurance", "aquaculture", "healthcare", "general"]),

  // Scope Definition
  objectives: z.array(z.string().max(500)).min(1).max(10),
  deliverables: z
    .array(
      z.object({
        name: z.string().max(200),
        description: z.string().max(1000),
        acceptance_criteria: z.array(z.string().max(300)).optional(),
      })
    )
    .min(1)
    .max(20),
  out_of_scope: z.array(z.string().max(300)).max(15).optional(),

  // Timeline
  start_date: z.string().max(20).optional(),
  duration_weeks: z.number().min(1).max(260),
  milestones: z
    .array(
      z.object({
        name: z.string().max(200),
        week: z.number().min(1),
        deliverables: z.array(z.string()).max(10).optional(),
        payment_percent: z.number().min(0).max(100).optional(),
      })
    )
    .max(20)
    .optional(),

  // Pricing
  total_value_usd: z.number().min(0),
  pricing_model: z
    .enum(["fixed_fee", "time_and_materials", "milestone_based", "retainer", "hybrid"])
    .default("fixed_fee"),
  payment_terms: z.string().max(500).optional(),

  // Resources
  team_composition: z
    .array(
      z.object({
        role: z.string().max(100),
        allocation_percent: z.number().min(0).max(100),
        responsibilities: z.array(z.string()).max(10).optional(),
      })
    )
    .max(15)
    .optional(),
  client_responsibilities: z.array(z.string().max(300)).max(15).optional(),

  // Terms
  assumptions: z.array(z.string().max(300)).max(20).optional(),
  dependencies: z.array(z.string().max(300)).max(15).optional(),
  change_control_process: z.string().max(1000).optional(),

  // Prepared by
  consultant_name: z.string().max(200).optional(),
  consultant_company: z.string().max(200).default("Good AI Consulting"),
});

export type GenerateSOWInput = z.infer<typeof GenerateSOWInputSchema>;

// ============================================
// Output Types
// ============================================

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

// ============================================
// Tool Definition
// ============================================

export const GENERATE_SOW_TOOL = {
  name: "generate_sow",
  description:
    "Generates a professional Statement of Work (SOW) document for AI consulting engagements. Includes scope, deliverables, timeline, pricing, team composition, assumptions, and standard terms.",
  inputSchema: {
    type: "object",
    properties: {
      client_name: { type: "string", description: "Client company name" },
      engagement_title: { type: "string", description: "Title of the engagement" },
      engagement_type: {
        type: "string",
        enum: ["assessment", "pilot", "implementation", "transformation", "managed_service"],
      },
      industry: {
        type: "string",
        enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
      },
      objectives: {
        type: "array",
        items: { type: "string" },
        description: "Business objectives for the engagement",
      },
      deliverables: {
        type: "array",
        description: "List of deliverables with descriptions and acceptance criteria",
      },
      duration_weeks: { type: "number", description: "Engagement duration in weeks" },
      total_value_usd: { type: "number", description: "Total engagement value in USD" },
      pricing_model: {
        type: "string",
        enum: ["fixed_fee", "time_and_materials", "milestone_based", "retainer", "hybrid"],
      },
      team_composition: {
        type: "array",
        description: "Team roles and allocations",
      },
    },
    required: [
      "client_name",
      "engagement_title",
      "engagement_type",
      "industry",
      "objectives",
      "deliverables",
      "duration_weeks",
      "total_value_usd",
    ],
  },
};

// ============================================
// Implementation
// ============================================

/** Generate unique IDs */
function generateId(prefix: string, index: number): string {
  return `${prefix}-${String(index + 1).padStart(3, "0")}`;
}

/** Calculate end date from start date and duration */
function calculateEndDate(startDate: string, durationWeeks: number): string {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + durationWeeks * 7);
  return end.toISOString().split("T")[0];
}

/** Generate default phases based on engagement type */
function generatePhases(
  engagementType: string,
  durationWeeks: number,
  deliverables: GenerateSOWInput["deliverables"]
): StatementOfWork["timeline"]["phases"] {
  const phaseTemplates: Record<string, { name: string; pct: number; description: string }[]> = {
    assessment: [
      {
        name: "Discovery & Data Collection",
        pct: 0.4,
        description: "Stakeholder interviews, data inventory, and process mapping",
      },
      {
        name: "Analysis & Findings",
        pct: 0.35,
        description: "Deep analysis of current state and opportunity identification",
      },
      {
        name: "Recommendations & Roadmap",
        pct: 0.25,
        description: "Final report preparation and presentation",
      },
    ],
    pilot: [
      {
        name: "Setup & Configuration",
        pct: 0.2,
        description: "Environment setup, data preparation, and initial configuration",
      },
      {
        name: "Development & Integration",
        pct: 0.5,
        description: "Core solution development and integration work",
      },
      {
        name: "Testing & Validation",
        pct: 0.2,
        description: "User acceptance testing and performance validation",
      },
      {
        name: "Handoff & Documentation",
        pct: 0.1,
        description: "Knowledge transfer and documentation",
      },
    ],
    implementation: [
      {
        name: "Mobilization",
        pct: 0.1,
        description: "Project kickoff, detailed planning, and resource allocation",
      },
      {
        name: "Design & Architecture",
        pct: 0.15,
        description: "Solution design, technical architecture, and specifications",
      },
      {
        name: "Build & Configure",
        pct: 0.4,
        description: "Development, configuration, and integration",
      },
      {
        name: "Test & Validate",
        pct: 0.2,
        description: "Testing, user acceptance, and performance optimization",
      },
      {
        name: "Deploy & Transition",
        pct: 0.15,
        description: "Production deployment, training, and handover",
      },
    ],
    transformation: [
      { name: "Foundation", pct: 0.1, description: "Program setup, governance, and architecture" },
      {
        name: "Wave 1 - Quick Wins",
        pct: 0.25,
        description: "Initial use cases delivering early value",
      },
      {
        name: "Wave 2 - Core Capabilities",
        pct: 0.35,
        description: "Enterprise capabilities and scaling",
      },
      {
        name: "Wave 3 - Advanced Features",
        pct: 0.2,
        description: "Advanced capabilities and optimization",
      },
      {
        name: "Sustain & Optimize",
        pct: 0.1,
        description: "Center of Excellence and continuous improvement",
      },
    ],
    managed_service: [
      {
        name: "Onboarding",
        pct: 0.1,
        description: "Service setup, baseline establishment, and SLA definition",
      },
      {
        name: "Steady State Operations",
        pct: 0.7,
        description: "Ongoing operations, support, and reporting",
      },
      {
        name: "Optimization",
        pct: 0.2,
        description: "Continuous improvement and feature enhancements",
      },
    ],
  };

  const templates = phaseTemplates[engagementType] || phaseTemplates.implementation;
  let currentWeek = 1;

  return templates.map((template, index) => {
    const phaseDuration = Math.max(1, Math.round(durationWeeks * template.pct));
    const startWeek = currentWeek;
    const endWeek = Math.min(startWeek + phaseDuration - 1, durationWeeks);
    currentWeek = endWeek + 1;

    // Assign deliverables to phases proportionally
    const deliverableCount = deliverables.length;
    const startIdx = Math.floor((index / templates.length) * deliverableCount);
    const endIdx = Math.floor(((index + 1) / templates.length) * deliverableCount);
    const phaseDeliverables = deliverables.slice(startIdx, endIdx).map((d) => d.name);

    return {
      name: template.name,
      start_week: startWeek,
      end_week: endWeek,
      description: template.description,
      deliverables: phaseDeliverables,
    };
  });
}

/** Generate milestones if not provided */
function generateDefaultMilestones(
  engagementType: string,
  durationWeeks: number
): { name: string; week: number; payment_percent: number }[] {
  const templates: Record<string, { name: string; weekPct: number; paymentPct: number }[]> = {
    assessment: [
      { name: "Discovery Complete", weekPct: 0.4, paymentPct: 50 },
      { name: "Final Report Delivered", weekPct: 1.0, paymentPct: 50 },
    ],
    pilot: [
      { name: "Setup Complete", weekPct: 0.25, paymentPct: 25 },
      { name: "Solution Deployed", weekPct: 0.75, paymentPct: 50 },
      { name: "Pilot Completed", weekPct: 1.0, paymentPct: 25 },
    ],
    implementation: [
      { name: "Design Approved", weekPct: 0.2, paymentPct: 20 },
      { name: "Development Complete", weekPct: 0.6, paymentPct: 40 },
      { name: "UAT Signed Off", weekPct: 0.85, paymentPct: 25 },
      { name: "Go-Live Complete", weekPct: 1.0, paymentPct: 15 },
    ],
    transformation: [
      { name: "Foundation Complete", weekPct: 0.1, paymentPct: 15 },
      { name: "Wave 1 Complete", weekPct: 0.35, paymentPct: 25 },
      { name: "Wave 2 Complete", weekPct: 0.7, paymentPct: 35 },
      { name: "Program Complete", weekPct: 1.0, paymentPct: 25 },
    ],
    managed_service: [
      { name: "Onboarding Complete", weekPct: 0.1, paymentPct: 10 },
      { name: "Quarter 1 Review", weekPct: 0.25, paymentPct: 22.5 },
      { name: "Quarter 2 Review", weekPct: 0.5, paymentPct: 22.5 },
      { name: "Quarter 3 Review", weekPct: 0.75, paymentPct: 22.5 },
      { name: "Annual Review", weekPct: 1.0, paymentPct: 22.5 },
    ],
  };

  const milestoneTemplates = templates[engagementType] || templates.implementation;

  return milestoneTemplates.map((m) => ({
    name: m.name,
    week: Math.max(1, Math.round(durationWeeks * m.weekPct)),
    payment_percent: m.paymentPct,
  }));
}

/** Generate default team composition */
function generateDefaultTeam(engagementType: string): GenerateSOWInput["team_composition"] {
  const templates: Record<
    string,
    { role: string; allocation_percent: number; responsibilities: string[] }[]
  > = {
    assessment: [
      {
        role: "Engagement Lead",
        allocation_percent: 50,
        responsibilities: [
          "Overall delivery",
          "Executive stakeholder management",
          "Final presentation",
        ],
      },
      {
        role: "AI Consultant",
        allocation_percent: 100,
        responsibilities: ["Data analysis", "Interviews", "Recommendation development"],
      },
    ],
    pilot: [
      {
        role: "Project Manager",
        allocation_percent: 50,
        responsibilities: ["Project coordination", "Status reporting", "Risk management"],
      },
      {
        role: "Solution Architect",
        allocation_percent: 75,
        responsibilities: ["Technical design", "Architecture decisions", "Code review"],
      },
      {
        role: "AI Engineer",
        allocation_percent: 100,
        responsibilities: ["Development", "Integration", "Testing"],
      },
    ],
    implementation: [
      {
        role: "Program Manager",
        allocation_percent: 75,
        responsibilities: ["Program coordination", "Governance", "Executive reporting"],
      },
      {
        role: "Solution Architect",
        allocation_percent: 50,
        responsibilities: ["Architecture oversight", "Technical decisions", "Quality assurance"],
      },
      {
        role: "Technical Lead",
        allocation_percent: 100,
        responsibilities: ["Development leadership", "Technical design", "Team mentorship"],
      },
      {
        role: "AI Engineers (2-3)",
        allocation_percent: 100,
        responsibilities: ["Development", "Integration", "Testing"],
      },
      {
        role: "QA Engineer",
        allocation_percent: 50,
        responsibilities: ["Test planning", "Test execution", "Defect management"],
      },
    ],
    transformation: [
      {
        role: "Program Director",
        allocation_percent: 75,
        responsibilities: ["Strategic direction", "Executive management", "Program governance"],
      },
      {
        role: "Program Manager",
        allocation_percent: 100,
        responsibilities: ["Day-to-day coordination", "Risk management", "Reporting"],
      },
      {
        role: "Enterprise Architect",
        allocation_percent: 50,
        responsibilities: ["Architecture governance", "Standards", "Roadmap"],
      },
      {
        role: "Delivery Leads",
        allocation_percent: 100,
        responsibilities: ["Workstream delivery", "Team management", "Quality"],
      },
      {
        role: "AI Engineering Team",
        allocation_percent: 100,
        responsibilities: ["Development", "Integration", "Operations"],
      },
      {
        role: "Change Management Lead",
        allocation_percent: 50,
        responsibilities: ["Training", "Communications", "Adoption"],
      },
    ],
    managed_service: [
      {
        role: "Service Delivery Manager",
        allocation_percent: 50,
        responsibilities: ["SLA management", "Client relationship", "Service reviews"],
      },
      {
        role: "Operations Lead",
        allocation_percent: 100,
        responsibilities: ["Day-to-day operations", "Incident management", "Process improvement"],
      },
      {
        role: "Support Engineers",
        allocation_percent: 100,
        responsibilities: ["Technical support", "Issue resolution", "Monitoring"],
      },
    ],
  };

  return templates[engagementType] || templates.implementation;
}

/** Generate default client responsibilities */
function generateDefaultClientResponsibilities(engagementType: string): string[] {
  const base = [
    "Designate a project sponsor with decision-making authority",
    "Provide timely access to subject matter experts and stakeholders",
    "Grant access to relevant systems, data, and documentation",
    "Review and approve deliverables within 5 business days",
    "Participate in scheduled project meetings and reviews",
    "Communicate any changes in scope, timeline, or priorities promptly",
  ];

  const additional: Record<string, string[]> = {
    assessment: [
      "Complete data collection questionnaires",
      "Schedule and facilitate stakeholder interviews",
    ],
    pilot: [
      "Provide test environment and sample data",
      "Assign pilot users for testing and feedback",
    ],
    implementation: [
      "Provide production environment access and credentials",
      "Complete integration requirements documentation",
      "Allocate internal resources for training",
    ],
    transformation: [
      "Establish program governance board",
      "Commit executive sponsorship throughout program",
      "Provide change management resources",
    ],
    managed_service: [
      "Maintain current contact information for escalations",
      "Provide advance notice of planned system changes",
    ],
  };

  return [...base, ...(additional[engagementType] || [])];
}

/** Generate default assumptions */
function generateDefaultAssumptions(engagementType: string, industry: string): string[] {
  const base = [
    "Client will provide timely access to required resources and stakeholders",
    "All necessary approvals will be obtained within agreed timeframes",
    "Existing systems and data are reasonably documented",
    "Client infrastructure meets minimum technical requirements",
    "No major organizational changes will occur during the engagement",
  ];

  const additional: Record<string, string[]> = {
    assessment: ["Data for analysis is available in a readable format"],
    pilot: [
      "Development environment will be available from project start",
      "Sample data representative of production is available",
    ],
    implementation: [
      "Production deployment window will be provided as scheduled",
      "API documentation for integrated systems is current and accurate",
    ],
    transformation: [
      "Dedicated change management resources are available",
      "Executive steering committee meets monthly",
    ],
    managed_service: [
      "Baseline performance metrics are established",
      "Escalation contacts are available during business hours",
    ],
  };

  const industrySpecific: Record<string, string[]> = {
    healthcare: ["HIPAA compliance requirements are clearly defined"],
    insurance: ["Regulatory compliance requirements are documented"],
    manufacturing: ["Production schedules are available for planning"],
    aquaculture: ["Sensor data infrastructure is operational"],
    general: [],
  };

  return [...base, ...(additional[engagementType] || []), ...(industrySpecific[industry] || [])];
}

/** Generate default dependencies */
function generateDefaultDependencies(): string[] {
  return [
    "Timely availability of client stakeholders for scheduled meetings",
    "Access to required systems and data as specified",
    "Client approval of deliverables at each milestone",
    "Resolution of identified blockers within agreed timeframes",
  ];
}

/** Get pricing model description */
function getPricingModelDescription(model: string): string {
  const descriptions: Record<string, string> = {
    fixed_fee:
      "Fixed fee engagement with defined scope and deliverables. Any scope changes will be addressed through the change control process.",
    time_and_materials:
      "Time and materials billing at agreed rates. Monthly invoicing based on actual hours worked plus approved expenses.",
    milestone_based:
      "Payments tied to achievement of defined milestones. Each milestone has specific acceptance criteria that must be met.",
    retainer:
      "Monthly retainer fee for ongoing services. Hours and services as defined in the service level agreement.",
    hybrid:
      "Combination of fixed fee components for defined deliverables and time and materials for variable scope items.",
  };
  return descriptions[model] || descriptions.fixed_fee;
}

/** Generate payment schedule */
function generatePaymentSchedule(
  totalValue: number,
  milestones: { name: string; payment_percent?: number }[]
): StatementOfWork["investment"]["payment_schedule"] {
  return milestones
    .filter((m) => m.payment_percent && m.payment_percent > 0)
    .map((m) => ({
      milestone: m.name,
      amount_usd: Math.round(totalValue * (m.payment_percent! / 100)),
      due_date_description: `Upon completion and acceptance of ${m.name}`,
    }));
}

/** Generate executive summary */
function generateExecutiveSummary(input: GenerateSOWInput): StatementOfWork["executive_summary"] {
  const typeDescriptions: Record<string, string> = {
    assessment: "comprehensive AI readiness assessment",
    pilot: "focused AI pilot project",
    implementation: "full-scale AI implementation",
    transformation: "enterprise-wide AI transformation program",
    managed_service: "ongoing AI managed services engagement",
  };

  const overview = `This Statement of Work defines the ${typeDescriptions[input.engagement_type]} for ${input.client_name}. The engagement will be delivered over ${input.duration_weeks} weeks, focusing on achieving measurable business outcomes through the application of AI technologies and Good AI methodology.`;

  const expectedOutcomes = [
    `Successful delivery of ${input.deliverables.length} defined deliverables`,
    "Measurable progress toward stated business objectives",
    "Knowledge transfer and documentation for sustainability",
    "Clear roadmap for future AI initiatives",
  ];

  const investmentSummary = `Total investment of $${input.total_value_usd.toLocaleString()} USD over ${input.duration_weeks} weeks, structured as a ${input.pricing_model.replace(/_/g, " ")} arrangement.`;

  return {
    overview,
    key_objectives: input.objectives,
    expected_outcomes: expectedOutcomes,
    investment_summary: investmentSummary,
  };
}

/** Generate risk items */
function generateRisks(engagementType: string): { risk: string; mitigation: string }[] {
  const common = [
    {
      risk: "Resource availability constraints",
      mitigation: "Early identification of key resources with backup planning",
    },
    { risk: "Scope creep", mitigation: "Strict change control process with impact assessment" },
    { risk: "Data quality issues", mitigation: "Data assessment phase with remediation planning" },
  ];

  const typeSpecific: Record<string, { risk: string; mitigation: string }[]> = {
    assessment: [
      {
        risk: "Stakeholder availability",
        mitigation: "Flexible scheduling with advance notice requirements",
      },
    ],
    pilot: [
      {
        risk: "Technical integration challenges",
        mitigation: "Early technical spike and POC validation",
      },
    ],
    implementation: [
      {
        risk: "Production deployment issues",
        mitigation: "Comprehensive testing and rollback procedures",
      },
      { risk: "User adoption resistance", mitigation: "Change management program and training" },
    ],
    transformation: [
      {
        risk: "Organizational change fatigue",
        mitigation: "Phased rollout with celebration of wins",
      },
      { risk: "Executive sponsor changes", mitigation: "Multi-level sponsorship and governance" },
    ],
    managed_service: [
      {
        risk: "SLA compliance challenges",
        mitigation: "Proactive monitoring and capacity planning",
      },
    ],
  };

  return [...common, ...(typeSpecific[engagementType] || [])];
}

export function generateSOW(input: GenerateSOWInput): StatementOfWork {
  const {
    client_name,
    engagement_title,
    engagement_type,
    industry,
    objectives,
    deliverables,
    out_of_scope,
    start_date,
    duration_weeks,
    total_value_usd,
    pricing_model,
    payment_terms,
    team_composition,
    client_responsibilities,
    assumptions,
    dependencies,
    change_control_process,
    consultant_name,
    consultant_company,
  } = input;

  const effectiveStartDate = start_date || new Date().toISOString().split("T")[0];
  const endDate = calculateEndDate(effectiveStartDate, duration_weeks);

  // Process milestones
  const inputMilestones =
    input.milestones || generateDefaultMilestones(engagement_type, duration_weeks);
  const milestonesWithIds = inputMilestones.map((m, idx) => ({
    id: generateId("MS", idx),
    name: m.name,
    week: m.week,
    criteria: `Successful completion of ${m.name} deliverables as defined in scope`,
    payment_percent: m.payment_percent,
  }));

  // Process team
  const effectiveTeam = team_composition ?? generateDefaultTeam(engagement_type) ?? [];
  const teamFormatted = effectiveTeam.map((t) => ({
    role: t.role,
    allocation: `${t.allocation_percent}%`,
    responsibilities: t.responsibilities || [],
  }));

  return {
    document_info: {
      title: `Statement of Work: ${engagement_title}`,
      version: "1.0",
      generated_date: new Date().toISOString().split("T")[0],
      prepared_by: consultant_name || consultant_company || "Good AI Consulting",
      prepared_for: client_name,
    },

    executive_summary: generateExecutiveSummary(input),

    scope: {
      objectives: objectives.map((obj, idx) => ({
        id: generateId("OBJ", idx),
        description: obj,
      })),
      deliverables: deliverables.map((d, idx) => ({
        id: generateId("DEL", idx),
        name: d.name,
        description: d.description,
        acceptance_criteria: d.acceptance_criteria || [
          "Deliverable meets documented requirements",
          "Client review and sign-off obtained",
        ],
      })),
      out_of_scope: out_of_scope || [
        "Items not explicitly listed in the deliverables section",
        "Ongoing maintenance beyond the engagement period",
        "Third-party software licensing costs",
        "Client-side infrastructure changes unless specified",
      ],
    },

    timeline: {
      start_date: effectiveStartDate,
      end_date: endDate,
      duration_weeks,
      phases: generatePhases(engagement_type, duration_weeks, deliverables),
      milestones: milestonesWithIds,
    },

    investment: {
      total_value_usd,
      pricing_model: pricing_model.replace(/_/g, " "),
      pricing_model_description: getPricingModelDescription(pricing_model),
      payment_schedule: generatePaymentSchedule(total_value_usd, milestonesWithIds),
      payment_terms: payment_terms || "Net 30 days from invoice date",
      expenses:
        "Reasonable travel and expenses, if required, will be billed at cost with prior approval.",
    },

    team: {
      provider_team: teamFormatted,
      client_responsibilities:
        client_responsibilities || generateDefaultClientResponsibilities(engagement_type),
      governance: {
        meeting_cadence:
          engagement_type === "assessment"
            ? "Weekly status calls"
            : engagement_type === "transformation"
              ? "Weekly working sessions, bi-weekly steering committee, monthly executive reviews"
              : "Weekly status calls, bi-weekly steering committee meetings",
        escalation_process:
          "Issues unresolved within 5 business days will be escalated to the executive sponsors for resolution.",
        decision_authority:
          "Day-to-day decisions by project leads; scope/budget decisions require executive sponsor approval.",
      },
    },

    assumptions_dependencies: {
      assumptions: assumptions || generateDefaultAssumptions(engagement_type, industry),
      dependencies: dependencies || generateDefaultDependencies(),
      risks: generateRisks(engagement_type),
    },

    change_management: {
      process:
        change_control_process ||
        "All change requests must be submitted in writing and will be assessed for impact on scope, timeline, and cost. Changes will be documented and require written approval from both parties before implementation.",
      scope_change_handling:
        "Scope changes will be evaluated for impact and documented via a Change Request Form. Additional costs, if any, will be agreed upon before work commences.",
      timeline_change_handling:
        "Timeline adjustments require mutual agreement and may impact costs. Critical path changes will be communicated immediately.",
    },

    terms: {
      confidentiality:
        "Both parties agree to maintain confidentiality of proprietary information shared during this engagement. Information disclosed shall be used solely for the purposes of this engagement.",
      intellectual_property:
        "Client retains ownership of their existing intellectual property and data. Deliverables created specifically for Client become Client property upon full payment. Provider retains rights to methodologies, frameworks, and general knowledge.",
      termination:
        "Either party may terminate this agreement with 30 days written notice. Upon termination, Client shall pay for work completed to date. Provider shall deliver all work product completed as of termination date.",
      limitation_of_liability:
        "Provider's liability is limited to the total fees paid under this agreement. Neither party shall be liable for indirect, consequential, or punitive damages.",
      warranties:
        "Provider warrants that services will be performed in a professional manner consistent with industry standards. Deliverables will materially conform to specifications. Warranty period is 30 days from delivery.",
    },

    acceptance: {
      acceptance_statement:
        "By signing below, both parties agree to the terms and conditions set forth in this Statement of Work.",
      validity_period_days: 30,
      signature_blocks: [
        {
          party: consultant_company || "Good AI Consulting",
          name_placeholder: "_________________________",
          title_placeholder: "_________________________",
          date_placeholder: "_________________________",
        },
        {
          party: client_name,
          name_placeholder: "_________________________",
          title_placeholder: "_________________________",
          date_placeholder: "_________________________",
        },
      ],
    },

    appendices: [
      {
        title: "Appendix A: Detailed Deliverable Specifications",
        content:
          "Detailed specifications for each deliverable will be documented during the Discovery phase and appended to this SOW upon mutual agreement.",
      },
      {
        title: "Appendix B: Rate Card (if applicable)",
        content:
          pricing_model === "time_and_materials" || pricing_model === "hybrid"
            ? "Hourly rates by role will be documented and attached to this SOW."
            : "Not applicable for this engagement type.",
      },
      {
        title: "Appendix C: Technical Requirements",
        content:
          "Detailed technical requirements and specifications will be documented during the Design phase.",
      },
    ],

    methodology_note:
      "This engagement follows Good AI methodology: 'Leverage, not lore' (practical solutions over theoretical frameworks), 'Evidence over opinions' (data-driven decisions), 'Augment first' (enhance existing capabilities), and 'Non-invasive by default' (minimize disruption).",
  };
}
