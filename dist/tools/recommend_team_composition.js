/**
 * Good AI - Recommend Team Composition Tool
 * Optimal team staffing recommendations for AI consulting engagements
 */
import { z } from "zod";
// ============================================
// Input Schema
// ============================================
export const RecommendTeamCompositionInputSchema = z.object({
    project_name: z.string().min(1).max(200),
    client_name: z.string().min(1).max(200),
    industry: z.enum([
        "manufacturing",
        "insurance",
        "aquaculture",
        "healthcare",
        "general",
    ]),
    // Engagement details
    engagement_type: z.enum([
        "assessment",
        "pilot",
        "implementation",
        "transformation",
        "managed_service",
    ]),
    duration_weeks: z.number().min(1).max(260),
    budget_usd: z.number().min(0).optional(),
    // Project complexity
    complexity: z.object({
        technical_complexity: z.enum(["low", "medium", "high"]).default("medium"),
        integration_scope: z.enum(["single_system", "multiple_systems", "enterprise_wide"]).default("single_system"),
        ai_components: z.array(z.enum([
            "ml_models",
            "nlp",
            "computer_vision",
            "predictive_analytics",
            "generative_ai",
            "robotic_process_automation",
            "data_engineering",
            "business_intelligence",
        ])).default([]),
        custom_development_required: z.boolean().default(false),
        data_complexity: z.enum(["low", "medium", "high"]).default("medium"),
    }),
    // Client context
    client_context: z.object({
        client_technical_capability: z.enum(["strong", "moderate", "limited"]).default("moderate"),
        client_ai_maturity: z.enum(["advanced", "developing", "nascent"]).default("nascent"),
        change_management_needs: z.enum(["minimal", "moderate", "significant"]).default("moderate"),
        executive_visibility: z.enum(["low", "medium", "high"]).default("medium"),
        regulatory_requirements: z.enum(["none", "standard", "strict"]).default("none"),
    }),
    // Resource preferences
    preferences: z.object({
        prefer_onsite: z.boolean().default(false),
        client_timezone: z.string().optional(),
        language_requirements: z.array(z.string()).max(5).default([]),
        specific_certifications: z.array(z.string()).max(10).default([]),
        prefer_senior_heavy: z.boolean().default(false),
    }).optional(),
    // Existing constraints
    constraints: z.object({
        max_team_size: z.number().min(1).max(50).optional(),
        must_include_roles: z.array(z.string()).max(10).default([]),
        exclude_roles: z.array(z.string()).max(10).default([]),
        blended_rate_target_usd: z.number().min(0).optional(),
    }).optional(),
});
// ============================================
// Tool Definition
// ============================================
export const RECOMMEND_TEAM_COMPOSITION_TOOL = {
    name: "recommend_team_composition",
    description: "Recommends optimal team composition for AI consulting engagements based on project complexity, duration, industry, and client context. Provides detailed staffing plans with roles, skills, and phased allocation.",
    inputSchema: {
        type: "object",
        properties: {
            project_name: { type: "string", description: "Name of the project" },
            client_name: { type: "string", description: "Client company name" },
            industry: {
                type: "string",
                enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
            },
            engagement_type: {
                type: "string",
                enum: ["assessment", "pilot", "implementation", "transformation", "managed_service"],
            },
            duration_weeks: { type: "number", description: "Project duration in weeks" },
            budget_usd: { type: "number", description: "Optional budget constraint" },
            complexity: { type: "object", description: "Project complexity factors" },
            client_context: { type: "object", description: "Client environment and needs" },
            preferences: { type: "object", description: "Team preferences" },
            constraints: { type: "object", description: "Staffing constraints" },
        },
        required: [
            "project_name",
            "client_name",
            "industry",
            "engagement_type",
            "duration_weeks",
            "complexity",
            "client_context",
        ],
    },
};
const ROLE_CATALOG = [
    // Leadership roles
    {
        role: "Engagement Partner",
        seniority: "principal",
        hourlyRate: 450,
        skills: ["Strategic leadership", "Client management", "AI strategy", "Executive communication"],
        optionalSkills: ["Industry expertise", "Board presentations"],
        responsibilities: ["Executive sponsorship", "Strategic direction", "Escalation management", "Quality assurance"],
    },
    {
        role: "Program Director",
        seniority: "principal",
        hourlyRate: 400,
        skills: ["Program management", "Stakeholder management", "Risk management", "Portfolio management"],
        optionalSkills: ["PMP certification", "Transformation experience"],
        responsibilities: ["Overall program delivery", "Cross-workstream coordination", "Executive reporting", "Resource allocation"],
    },
    {
        role: "Solution Architect",
        seniority: "senior",
        hourlyRate: 350,
        skills: ["Enterprise architecture", "System design", "Cloud platforms", "Integration patterns"],
        optionalSkills: ["TOGAF", "AWS/Azure/GCP certification"],
        responsibilities: ["Technical architecture", "Solution design", "Technical standards", "Integration strategy"],
    },
    {
        role: "AI/ML Lead",
        seniority: "senior",
        hourlyRate: 375,
        skills: ["Machine learning", "MLOps", "Model development", "Data science leadership"],
        optionalSkills: ["Deep learning", "NLP", "Computer vision"],
        responsibilities: ["AI strategy", "Model selection", "ML pipeline design", "Model governance"],
    },
    // Delivery roles
    {
        role: "Project Manager",
        seniority: "senior",
        hourlyRate: 275,
        skills: ["Project management", "Agile/Scrum", "Stakeholder communication", "Risk management"],
        optionalSkills: ["PMP", "CSM", "Industry experience"],
        responsibilities: ["Day-to-day project delivery", "Status reporting", "Issue management", "Timeline management"],
    },
    {
        role: "Data Engineer",
        seniority: "senior",
        hourlyRate: 300,
        skills: ["Data pipelines", "ETL/ELT", "Data warehousing", "SQL", "Python"],
        optionalSkills: ["Spark", "Airflow", "dbt", "Cloud data services"],
        responsibilities: ["Data pipeline development", "Data quality", "Data integration", "Performance optimization"],
    },
    {
        role: "Data Scientist",
        seniority: "senior",
        hourlyRate: 325,
        skills: ["Statistical modeling", "Machine learning", "Python/R", "Feature engineering"],
        optionalSkills: ["Deep learning", "NLP", "Computer vision", "MLOps"],
        responsibilities: ["Model development", "Feature engineering", "Model validation", "Experimentation"],
    },
    {
        role: "ML Engineer",
        seniority: "senior",
        hourlyRate: 325,
        skills: ["ML deployment", "MLOps", "Python", "Cloud ML services", "Docker/Kubernetes"],
        optionalSkills: ["Model optimization", "Edge deployment", "Model monitoring"],
        responsibilities: ["Model deployment", "ML infrastructure", "Model serving", "Performance monitoring"],
    },
    {
        role: "Full Stack Developer",
        seniority: "mid",
        hourlyRate: 225,
        skills: ["Frontend development", "Backend development", "API design", "Database management"],
        optionalSkills: ["React", "Node.js", "Python", "Cloud services"],
        responsibilities: ["Application development", "API integration", "UI/UX implementation", "Testing"],
    },
    {
        role: "DevOps Engineer",
        seniority: "senior",
        hourlyRate: 275,
        skills: ["CI/CD", "Infrastructure as Code", "Cloud platforms", "Container orchestration"],
        optionalSkills: ["Kubernetes", "Terraform", "Security", "Monitoring"],
        responsibilities: ["Pipeline automation", "Infrastructure management", "Deployment automation", "Monitoring setup"],
    },
    // Specialized roles
    {
        role: "Change Manager",
        seniority: "senior",
        hourlyRate: 250,
        skills: ["Change management", "Stakeholder engagement", "Training design", "Communication"],
        optionalSkills: ["Prosci certification", "Organizational development"],
        responsibilities: ["Change strategy", "Stakeholder analysis", "Training programs", "Adoption tracking"],
    },
    {
        role: "Business Analyst",
        seniority: "mid",
        hourlyRate: 200,
        skills: ["Requirements analysis", "Process mapping", "Documentation", "User story development"],
        optionalSkills: ["Domain expertise", "Data analysis", "Agile BA"],
        responsibilities: ["Requirements gathering", "Process documentation", "User acceptance criteria", "Stakeholder liaison"],
    },
    {
        role: "QA Engineer",
        seniority: "mid",
        hourlyRate: 200,
        skills: ["Test automation", "Test planning", "Quality assurance", "Bug tracking"],
        optionalSkills: ["ML testing", "Performance testing", "Security testing"],
        responsibilities: ["Test strategy", "Test execution", "Quality metrics", "Defect management"],
    },
    {
        role: "Data Analyst",
        seniority: "mid",
        hourlyRate: 185,
        skills: ["Data analysis", "SQL", "Visualization", "Reporting"],
        optionalSkills: ["Python", "Tableau/PowerBI", "Statistics"],
        responsibilities: ["Data exploration", "Report development", "Insight generation", "Dashboard creation"],
    },
    // Junior roles
    {
        role: "Junior Data Scientist",
        seniority: "junior",
        hourlyRate: 175,
        skills: ["Python", "Basic ML", "Data analysis", "Statistics"],
        optionalSkills: ["SQL", "Visualization", "ML frameworks"],
        responsibilities: ["Data preparation", "Model support", "Documentation", "Testing"],
    },
    {
        role: "Junior Developer",
        seniority: "junior",
        hourlyRate: 150,
        skills: ["Programming fundamentals", "Version control", "Testing", "Documentation"],
        optionalSkills: ["Frontend", "Backend", "Cloud basics"],
        responsibilities: ["Feature development", "Bug fixes", "Documentation", "Code reviews"],
    },
    // Advisory roles
    {
        role: "Industry SME",
        seniority: "principal",
        hourlyRate: 400,
        skills: ["Industry expertise", "Domain knowledge", "Regulatory knowledge", "Best practices"],
        optionalSkills: ["Executive relationships", "Thought leadership"],
        responsibilities: ["Industry guidance", "Regulatory compliance", "Best practice application", "Stakeholder credibility"],
    },
    {
        role: "Data Privacy Specialist",
        seniority: "senior",
        hourlyRate: 300,
        skills: ["Data privacy regulations", "GDPR/CCPA", "Privacy by design", "Risk assessment"],
        optionalSkills: ["CIPP certification", "Security expertise"],
        responsibilities: ["Privacy compliance", "Data governance", "Risk assessment", "Policy development"],
    },
];
// ============================================
// Implementation Helpers
// ============================================
function getBaseTeamForEngagement(engagementType, complexity, durationWeeks) {
    const team = [];
    const isComplex = complexity.technical_complexity === "high" || complexity.integration_scope === "enterprise_wide";
    const hasML = complexity.ai_components.some((c) => ["ml_models", "nlp", "computer_vision", "predictive_analytics", "generative_ai"].includes(c));
    const hasData = complexity.ai_components.some((c) => ["data_engineering", "business_intelligence"].includes(c));
    switch (engagementType) {
        case "assessment":
            team.push({ role: "Engagement Partner", fteAllocation: 0.1, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Solution Architect", fteAllocation: 0.5, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Business Analyst", fteAllocation: 0.75, startWeek: 1, endWeek: durationWeeks });
            if (hasML) {
                team.push({ role: "AI/ML Lead", fteAllocation: 0.25, startWeek: 1, endWeek: durationWeeks });
            }
            if (isComplex) {
                team.push({ role: "Data Analyst", fteAllocation: 0.5, startWeek: 1, endWeek: durationWeeks });
            }
            break;
        case "pilot":
            team.push({ role: "Engagement Partner", fteAllocation: 0.1, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Project Manager", fteAllocation: 0.5, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Solution Architect", fteAllocation: 0.5, startWeek: 1, endWeek: Math.ceil(durationWeeks * 0.6) });
            if (hasML) {
                team.push({ role: "AI/ML Lead", fteAllocation: 0.5, startWeek: 1, endWeek: durationWeeks });
                team.push({ role: "Data Scientist", fteAllocation: 1.0, startWeek: 1, endWeek: durationWeeks });
            }
            if (hasData) {
                team.push({ role: "Data Engineer", fteAllocation: 0.75, startWeek: 1, endWeek: durationWeeks });
            }
            team.push({ role: "Full Stack Developer", fteAllocation: 0.5, startWeek: Math.ceil(durationWeeks * 0.3), endWeek: durationWeeks });
            break;
        case "implementation":
            team.push({ role: "Engagement Partner", fteAllocation: 0.15, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Project Manager", fteAllocation: 1.0, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Solution Architect", fteAllocation: 0.75, startWeek: 1, endWeek: Math.ceil(durationWeeks * 0.7) });
            if (hasML) {
                team.push({ role: "AI/ML Lead", fteAllocation: 0.75, startWeek: 1, endWeek: durationWeeks });
                team.push({ role: "Data Scientist", fteAllocation: 1.5, startWeek: 1, endWeek: durationWeeks });
                team.push({ role: "ML Engineer", fteAllocation: 1.0, startWeek: Math.ceil(durationWeeks * 0.3), endWeek: durationWeeks });
            }
            if (hasData || hasML) {
                team.push({ role: "Data Engineer", fteAllocation: 1.5, startWeek: 1, endWeek: durationWeeks });
            }
            team.push({ role: "Full Stack Developer", fteAllocation: 1.5, startWeek: Math.ceil(durationWeeks * 0.2), endWeek: durationWeeks });
            team.push({ role: "DevOps Engineer", fteAllocation: 0.5, startWeek: Math.ceil(durationWeeks * 0.4), endWeek: durationWeeks });
            team.push({ role: "QA Engineer", fteAllocation: 0.75, startWeek: Math.ceil(durationWeeks * 0.3), endWeek: durationWeeks });
            team.push({ role: "Business Analyst", fteAllocation: 0.75, startWeek: 1, endWeek: Math.ceil(durationWeeks * 0.6) });
            break;
        case "transformation":
            team.push({ role: "Engagement Partner", fteAllocation: 0.25, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Program Director", fteAllocation: 1.0, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Project Manager", fteAllocation: 2.0, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Solution Architect", fteAllocation: 1.5, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "AI/ML Lead", fteAllocation: 1.0, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Data Scientist", fteAllocation: 3.0, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "ML Engineer", fteAllocation: 2.0, startWeek: Math.ceil(durationWeeks * 0.2), endWeek: durationWeeks });
            team.push({ role: "Data Engineer", fteAllocation: 3.0, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Full Stack Developer", fteAllocation: 3.0, startWeek: Math.ceil(durationWeeks * 0.15), endWeek: durationWeeks });
            team.push({ role: "DevOps Engineer", fteAllocation: 1.5, startWeek: Math.ceil(durationWeeks * 0.2), endWeek: durationWeeks });
            team.push({ role: "QA Engineer", fteAllocation: 1.5, startWeek: Math.ceil(durationWeeks * 0.2), endWeek: durationWeeks });
            team.push({ role: "Change Manager", fteAllocation: 1.0, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Business Analyst", fteAllocation: 2.0, startWeek: 1, endWeek: Math.ceil(durationWeeks * 0.5) });
            break;
        case "managed_service":
            team.push({ role: "Engagement Partner", fteAllocation: 0.1, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Project Manager", fteAllocation: 0.5, startWeek: 1, endWeek: durationWeeks });
            if (hasML) {
                team.push({ role: "ML Engineer", fteAllocation: 1.0, startWeek: 1, endWeek: durationWeeks });
                team.push({ role: "Data Scientist", fteAllocation: 0.5, startWeek: 1, endWeek: durationWeeks });
            }
            team.push({ role: "DevOps Engineer", fteAllocation: 0.75, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Data Engineer", fteAllocation: 0.75, startWeek: 1, endWeek: durationWeeks });
            team.push({ role: "Full Stack Developer", fteAllocation: 0.5, startWeek: 1, endWeek: durationWeeks });
            break;
    }
    return team;
}
function addSpecializedRoles(team, input) {
    const { complexity, client_context, industry } = input;
    const durationWeeks = input.duration_weeks;
    // Add change management for significant needs
    if (client_context.change_management_needs === "significant" && !team.some((t) => t.role === "Change Manager")) {
        team.push({ role: "Change Manager", fteAllocation: 0.75, startWeek: 1, endWeek: durationWeeks });
    }
    // Add privacy specialist for regulated industries
    if (client_context.regulatory_requirements === "strict" || industry === "healthcare" || industry === "insurance") {
        team.push({ role: "Data Privacy Specialist", fteAllocation: 0.25, startWeek: 1, endWeek: Math.ceil(durationWeeks * 0.5) });
    }
    // Add industry SME for specialized industries
    if (["healthcare", "insurance", "aquaculture"].includes(industry)) {
        team.push({ role: "Industry SME", fteAllocation: 0.15, startWeek: 1, endWeek: durationWeeks });
    }
    // Add extra data resources for high data complexity
    if (complexity.data_complexity === "high") {
        const existingDataEng = team.find((t) => t.role === "Data Engineer");
        if (existingDataEng) {
            existingDataEng.fteAllocation += 0.5;
        }
        else {
            team.push({ role: "Data Engineer", fteAllocation: 0.75, startWeek: 1, endWeek: durationWeeks });
        }
    }
    // Add NLP specialist for NLP/generative AI
    if (complexity.ai_components.includes("nlp") || complexity.ai_components.includes("generative_ai")) {
        const existingDS = team.find((t) => t.role === "Data Scientist");
        if (existingDS) {
            existingDS.fteAllocation += 0.5;
        }
    }
    // Add computer vision specialist
    if (complexity.ai_components.includes("computer_vision")) {
        const existingDS = team.find((t) => t.role === "Data Scientist");
        if (existingDS) {
            existingDS.fteAllocation += 0.5;
        }
    }
    // Custom development increases dev resources
    if (complexity.custom_development_required) {
        const existingDev = team.find((t) => t.role === "Full Stack Developer");
        if (existingDev) {
            existingDev.fteAllocation += 0.5;
        }
        const existingQA = team.find((t) => t.role === "QA Engineer");
        if (existingQA) {
            existingQA.fteAllocation += 0.25;
        }
    }
}
function applyConstraints(team, constraints) {
    if (!constraints) {
        return;
    }
    // Exclude specific roles
    if (constraints.exclude_roles.length > 0) {
        const excludeSet = new Set(constraints.exclude_roles.map((r) => r.toLowerCase()));
        for (let i = team.length - 1; i >= 0; i--) {
            if (excludeSet.has(team[i].role.toLowerCase())) {
                team.splice(i, 1);
            }
        }
    }
    // Limit team size if needed
    if (constraints.max_team_size && team.length > constraints.max_team_size) {
        // Sort by importance (principal > senior > mid > junior) and trim
        const seniorityOrder = { principal: 1, senior: 2, mid: 3, junior: 4 };
        const roleData = team.map((t) => {
            const def = ROLE_CATALOG.find((r) => r.role === t.role);
            return { ...t, seniority: def?.seniority || "mid" };
        });
        roleData.sort((a, b) => seniorityOrder[a.seniority] - seniorityOrder[b.seniority]);
        team.length = 0;
        team.push(...roleData.slice(0, constraints.max_team_size));
    }
}
function getRoleDefinition(roleName) {
    return ROLE_CATALOG.find((r) => r.role === roleName);
}
function buildRecommendedTeam(baseTeam, preferences, durationWeeks) {
    const hoursPerWeek = 40;
    const weeksPerMonth = 4.33;
    return baseTeam.map((member) => {
        const roleDef = getRoleDefinition(member.role);
        const seniority = roleDef?.seniority || "mid";
        let hourlyRate = roleDef?.hourlyRate || 200;
        // Adjust rate for senior-heavy preference
        if (preferences?.prefer_senior_heavy && seniority === "mid") {
            hourlyRate *= 1.15;
        }
        const monthlyHours = member.fteAllocation * hoursPerWeek * weeksPerMonth;
        const monthlyRate = hourlyRate * monthlyHours;
        return {
            role: member.role,
            seniority_level: seniority,
            fte_allocation: member.fteAllocation,
            billable_rate_usd_per_hour: hourlyRate,
            monthly_cost_usd: Math.round(monthlyRate),
            responsibilities: roleDef?.responsibilities || ["Delivery support"],
            required_skills: roleDef?.skills || [],
            optional_skills: roleDef?.optionalSkills || [],
            start_week: member.startWeek,
            end_week: Math.min(member.endWeek, durationWeeks),
            critical_role: seniority === "principal" || seniority === "senior",
            substitution_options: getSubstitutionOptions(member.role),
        };
    });
}
function getSubstitutionOptions(role) {
    const substitutions = {
        "Engagement Partner": ["Program Director (with executive access)", "Senior Solution Architect"],
        "Program Director": ["Senior Project Manager (with expanded scope)", "Engagement Partner (reduced allocation)"],
        "Solution Architect": ["Senior ML Engineer + Senior Data Engineer", "Technical Lead"],
        "AI/ML Lead": ["Senior Data Scientist (with architecture experience)", "Solution Architect (with ML background)"],
        "Project Manager": ["Engagement Manager", "Delivery Lead", "Scrum Master (for agile projects)"],
        "Data Scientist": ["ML Engineer (with modeling skills)", "2x Junior Data Scientists"],
        "ML Engineer": ["Data Scientist (with engineering skills)", "Senior DevOps + Data Scientist"],
        "Data Engineer": ["Backend Developer (with data experience)", "Database Administrator + ETL Specialist"],
        "Full Stack Developer": ["Frontend + Backend Developer split", "2x Junior Developers"],
        "DevOps Engineer": ["Cloud Engineer", "Infrastructure Engineer", "Site Reliability Engineer"],
        "Change Manager": ["Business Analyst (with change experience)", "Training Lead + Communications Specialist"],
        "Business Analyst": ["Product Owner", "Requirements Analyst", "Process Consultant"],
        "QA Engineer": ["Test Automation Engineer", "Quality Analyst", "2x Manual Testers"],
        "Data Analyst": ["Junior Data Scientist", "BI Developer", "Reporting Analyst"],
    };
    return substitutions[role] || ["Role requires direct match"];
}
function calculatePhasedStaffing(team, durationWeeks, engagementType) {
    // Define phases based on engagement type
    let phases;
    switch (engagementType) {
        case "assessment":
            phases = [
                { name: "Discovery", startPercent: 0, endPercent: 40, objectives: ["Stakeholder interviews", "Data collection", "Current state analysis"] },
                { name: "Analysis", startPercent: 40, endPercent: 80, objectives: ["Gap analysis", "Opportunity identification", "Roadmap development"] },
                { name: "Recommendations", startPercent: 80, endPercent: 100, objectives: ["Report finalization", "Presentation", "Q&A sessions"] },
            ];
            break;
        case "pilot":
            phases = [
                { name: "Setup", startPercent: 0, endPercent: 20, objectives: ["Environment setup", "Data preparation", "Requirements refinement"] },
                { name: "Development", startPercent: 20, endPercent: 70, objectives: ["Model development", "Integration build", "Testing"] },
                { name: "Validation", startPercent: 70, endPercent: 100, objectives: ["User testing", "Performance validation", "Go/no-go decision"] },
            ];
            break;
        case "implementation":
            phases = [
                { name: "Foundation", startPercent: 0, endPercent: 15, objectives: ["Architecture finalization", "Environment setup", "Team onboarding"] },
                { name: "Build", startPercent: 15, endPercent: 60, objectives: ["Core development", "Integration", "Unit testing"] },
                { name: "Stabilize", startPercent: 60, endPercent: 85, objectives: ["System testing", "Performance tuning", "Bug fixing"] },
                { name: "Deploy", startPercent: 85, endPercent: 100, objectives: ["Production deployment", "Training", "Handover"] },
            ];
            break;
        case "transformation":
            phases = [
                { name: "Mobilize", startPercent: 0, endPercent: 10, objectives: ["Governance setup", "Team formation", "Detailed planning"] },
                { name: "Foundation", startPercent: 10, endPercent: 25, objectives: ["Platform setup", "Data infrastructure", "Core frameworks"] },
                { name: "Build Waves", startPercent: 25, endPercent: 70, objectives: ["Feature development", "Integration", "Continuous delivery"] },
                { name: "Operate", startPercent: 70, endPercent: 90, objectives: ["Transition to operations", "Knowledge transfer", "Support model"] },
                { name: "Optimize", startPercent: 90, endPercent: 100, objectives: ["Performance optimization", "Continuous improvement", "Value realization"] },
            ];
            break;
        case "managed_service":
            phases = [
                { name: "Transition", startPercent: 0, endPercent: 15, objectives: ["Service setup", "Knowledge transfer", "SLA establishment"] },
                { name: "Steady State", startPercent: 15, endPercent: 85, objectives: ["Service delivery", "Monitoring", "Incident management"] },
                { name: "Continuous Improvement", startPercent: 85, endPercent: 100, objectives: ["Optimization", "Automation", "Service evolution"] },
            ];
            break;
        default:
            phases = [
                { name: "Initiation", startPercent: 0, endPercent: 20, objectives: ["Project setup", "Planning"] },
                { name: "Execution", startPercent: 20, endPercent: 80, objectives: ["Core delivery"] },
                { name: "Closure", startPercent: 80, endPercent: 100, objectives: ["Finalization", "Handover"] },
            ];
    }
    return phases.map((phase) => {
        const startWeek = Math.max(1, Math.ceil((phase.startPercent / 100) * durationWeeks));
        const endWeek = Math.ceil((phase.endPercent / 100) * durationWeeks);
        // Find team members active during this phase
        const activeMembers = team.filter((m) => m.start_week <= endWeek && m.end_week >= startWeek);
        const roles = activeMembers.map((m) => ({
            role: m.role,
            fte: m.fte_allocation,
        }));
        return {
            phase_name: phase.name,
            start_week: startWeek,
            end_week: endWeek,
            team_size: activeMembers.length,
            total_fte: Math.round(activeMembers.reduce((sum, m) => sum + m.fte_allocation, 0) * 10) / 10,
            roles,
            phase_objectives: phase.objectives,
        };
    });
}
function analyzeSkillCoverage(team, complexity) {
    // Determine required skills based on complexity
    const requiredSkillsMap = {
        ml_models: ["Machine learning", "Model development", "Python"],
        nlp: ["NLP", "Text processing", "Deep learning"],
        computer_vision: ["Computer vision", "Image processing", "Deep learning"],
        predictive_analytics: ["Statistical modeling", "Feature engineering", "Data analysis"],
        generative_ai: ["Generative AI", "LLM deployment", "Prompt engineering"],
        robotic_process_automation: ["RPA development", "Process automation", "Workflow design"],
        data_engineering: ["Data pipelines", "ETL/ELT", "Data warehousing"],
        business_intelligence: ["Data visualization", "Reporting", "Dashboard development"],
    };
    const neededSkills = new Set();
    complexity.ai_components.forEach((comp) => {
        requiredSkillsMap[comp]?.forEach((skill) => neededSkills.add(skill));
    });
    // Always need project management and architecture for complex projects
    if (complexity.technical_complexity === "high" || complexity.integration_scope !== "single_system") {
        neededSkills.add("Project management");
        neededSkills.add("Enterprise architecture");
        neededSkills.add("Integration patterns");
    }
    // Check coverage
    const requiredSkills = [];
    const skillGaps = [];
    neededSkills.forEach((skill) => {
        const coveredBy = team
            .filter((m) => m.required_skills.includes(skill) || m.optional_skills.includes(skill))
            .map((m) => m.role);
        if (coveredBy.length === 0) {
            skillGaps.push({
                skill,
                gap_severity: ["Machine learning", "Enterprise architecture", "Data pipelines"].includes(skill) ? "critical" : "moderate",
                mitigation: `Consider adding specialist or upskilling existing team in ${skill}`,
            });
            requiredSkills.push({ skill, covered_by: [], coverage_strength: "gap" });
        }
        else {
            requiredSkills.push({
                skill,
                covered_by: coveredBy,
                coverage_strength: coveredBy.length >= 2 ? "strong" : "adequate",
            });
        }
    });
    // Identify skill overlaps
    const skillOwners = {};
    team.forEach((m) => {
        [...m.required_skills, ...m.optional_skills].forEach((skill) => {
            if (!skillOwners[skill]) {
                skillOwners[skill] = [];
            }
            skillOwners[skill].push(m.role);
        });
    });
    const skillOverlaps = Object.entries(skillOwners)
        .filter(([, owners]) => owners.length >= 2)
        .slice(0, 5)
        .map(([skill, owners]) => ({
        skill,
        covered_by: owners,
        benefit: "Provides redundancy and knowledge sharing",
    }));
    return { required_skills: requiredSkills, skill_gaps: skillGaps, skill_overlaps: skillOverlaps };
}
function buildTeamDynamics(team, engagementType) {
    // Determine leadership
    const hasPartner = team.some((t) => t.role === "Engagement Partner");
    const hasDirector = team.some((t) => t.role === "Program Director");
    const hasPM = team.some((t) => t.role === "Project Manager");
    let leadershipStructure;
    if (hasDirector) {
        leadershipStructure = "Program Director leads overall delivery with Project Manager(s) managing day-to-day execution";
    }
    else if (hasPartner && hasPM) {
        leadershipStructure = "Engagement Partner provides strategic oversight, Project Manager handles operational delivery";
    }
    else if (hasPM) {
        leadershipStructure = "Project Manager leads delivery with technical leads for specialized areas";
    }
    else {
        leadershipStructure = "Technical lead-driven model with shared leadership responsibilities";
    }
    // Build reporting hierarchy
    const hierarchy = [];
    const principalRole = team.find((t) => t.seniority_level === "principal");
    const seniorRoles = team.filter((t) => t.seniority_level === "senior");
    const otherRoles = team.filter((t) => t.seniority_level === "mid" || t.seniority_level === "junior");
    if (principalRole) {
        hierarchy.push({ role: principalRole.role, reports_to: "Client Executive Sponsor" });
        seniorRoles.forEach((r) => {
            hierarchy.push({ role: r.role, reports_to: principalRole.role });
        });
    }
    otherRoles.forEach((r) => {
        const reportTo = seniorRoles.find((sr) => sr.role.includes("Manager") || sr.role.includes("Lead") || sr.role.includes("Architect"));
        hierarchy.push({ role: r.role, reports_to: reportTo?.role || principalRole?.role || "Project Manager" });
    });
    // Decision authority
    const decisionAuthority = [
        { area: "Strategic direction", authority: principalRole?.role || "Engagement Partner" },
        { area: "Technical decisions", authority: team.find((t) => t.role.includes("Architect") || t.role.includes("Lead"))?.role || "Technical Lead" },
        { area: "Day-to-day operations", authority: team.find((t) => t.role.includes("Manager"))?.role || "Project Manager" },
        { area: "Resource allocation", authority: hasDirector ? "Program Director" : "Project Manager" },
    ];
    return {
        leadership_structure: leadershipStructure,
        reporting_hierarchy: hierarchy.slice(0, 10),
        collaboration_model: engagementType === "transformation" ? "Workstream-based with cross-functional squads" : "Integrated team with daily standups",
        communication_cadence: engagementType === "transformation"
            ? "Daily standups, weekly status, bi-weekly steering, monthly executive review"
            : "Daily standups, weekly status updates, bi-weekly client check-ins",
        decision_authority: decisionAuthority,
    };
}
function identifyStaffingRisks(team, skillCoverage, input) {
    const risks = [];
    // Single point of failure - critical roles with one person
    const criticalSinglePoints = team.filter((t) => t.critical_role && t.fte_allocation <= 1.0);
    if (criticalSinglePoints.length > 0) {
        risks.push({
            risk: `Single point of failure: ${criticalSinglePoints.map((t) => t.role).join(", ")}`,
            severity: "high",
            mitigation: "Consider backup resources or cross-training for critical roles",
        });
    }
    // Skill gaps
    if (skillCoverage.skill_gaps.length > 0) {
        const criticalGaps = skillCoverage.skill_gaps.filter((g) => g.gap_severity === "critical");
        if (criticalGaps.length > 0) {
            risks.push({
                risk: `Critical skill gaps: ${criticalGaps.map((g) => g.skill).join(", ")}`,
                severity: "high",
                mitigation: "Hire specialists or engage external experts immediately",
            });
        }
    }
    // High reliance on junior resources
    const juniorFTE = team.filter((t) => t.seniority_level === "junior").reduce((sum, t) => sum + t.fte_allocation, 0);
    const totalFTE = team.reduce((sum, t) => sum + t.fte_allocation, 0);
    if (juniorFTE / totalFTE > 0.3) {
        risks.push({
            risk: "High proportion of junior resources may impact quality and velocity",
            severity: "medium",
            mitigation: "Increase senior oversight, implement code reviews, and provide mentoring",
        });
    }
    // Limited client capability
    if (input.client_context.client_technical_capability === "limited") {
        risks.push({
            risk: "Limited client technical capability may slow integration and adoption",
            severity: "medium",
            mitigation: "Allocate additional time for knowledge transfer and training",
        });
    }
    // Remote team coordination
    if (input.preferences?.prefer_onsite === false && team.length > 5) {
        risks.push({
            risk: "Large distributed team requires strong coordination",
            severity: "low",
            mitigation: "Implement robust communication tools and regular sync meetings",
        });
    }
    return risks;
}
function generateAlternatives(_team, _input) {
    return [
        {
            name: "Lean Team",
            description: "Reduced team size with higher utilization per resource",
            trade_offs: "Longer timeline, reduced parallel execution, higher individual workload",
            cost_difference_percent: -25,
            recommended_when: "Budget constraints, extended timeline acceptable, experienced client team",
        },
        {
            name: "Accelerated Team",
            description: "Larger team for faster delivery",
            trade_offs: "Higher cost, more coordination overhead, faster delivery",
            cost_difference_percent: 30,
            recommended_when: "Aggressive timeline, budget flexibility, strong project management",
        },
        {
            name: "Junior-Heavy Mix",
            description: "More junior resources with senior oversight",
            trade_offs: "Lower cost, requires more oversight, may impact quality without proper guidance",
            cost_difference_percent: -20,
            recommended_when: "Cost-sensitive engagement, strong internal standards, adequate senior oversight",
        },
        {
            name: "Specialist Focus",
            description: "Smaller team of highly specialized experts",
            trade_offs: "Higher rates, deeper expertise, may lack breadth",
            cost_difference_percent: 15,
            recommended_when: "Highly technical challenges, need for deep domain expertise",
        },
    ];
}
function generateRecommendations(skillCoverage, input) {
    const hiring = [];
    const training = [];
    const external = [];
    const client = [];
    // Based on skill gaps
    skillCoverage.skill_gaps.forEach((gap) => {
        if (gap.gap_severity === "critical") {
            hiring.push(`Hire ${gap.skill} specialist to address critical gap`);
        }
        else {
            training.push(`Consider training existing team in ${gap.skill}`);
        }
    });
    // Client recommendations
    if (input.client_context.client_technical_capability === "limited") {
        client.push("Assign dedicated client liaison to facilitate knowledge transfer");
        client.push("Provide technical upskilling sessions for client team");
    }
    if (input.client_context.change_management_needs === "significant") {
        client.push("Engage client change champions in each department");
        client.push("Establish clear communication channels with all stakeholders");
    }
    // External recommendations
    if (input.client_context.regulatory_requirements === "strict") {
        external.push("Engage regulatory compliance advisor for review cycles");
    }
    if (["healthcare", "insurance"].includes(input.industry)) {
        external.push("Consider engaging industry-specific consultant for domain validation");
    }
    // Default recommendations if lists are empty
    if (hiring.length === 0) {
        hiring.push("Current team composition adequate; monitor for emerging skill needs");
    }
    if (training.length === 0) {
        training.push("Encourage cross-training to build team resilience");
    }
    if (external.length === 0) {
        external.push("No external specialists required; leverage internal expertise");
    }
    if (client.length === 0) {
        client.push("Identify client subject matter experts for domain input");
    }
    return {
        hiring_recommendations: hiring,
        training_recommendations: training,
        external_resource_recommendations: external,
        client_resource_recommendations: client,
    };
}
// ============================================
// Main Export Function
// ============================================
export function recommendTeamComposition(input) {
    const { project_name, client_name, engagement_type, duration_weeks, complexity, preferences, constraints, } = input;
    // Build base team
    const baseTeam = getBaseTeamForEngagement(engagement_type, complexity, duration_weeks);
    // Add specialized roles
    addSpecializedRoles(baseTeam, input);
    // Apply constraints
    applyConstraints(baseTeam, constraints);
    // Build full team details
    const recommendedTeam = buildRecommendedTeam(baseTeam, preferences, duration_weeks);
    // Calculate summary metrics
    const totalFTE = recommendedTeam.reduce((sum, m) => sum + m.fte_allocation, 0);
    const totalMonthlyCost = recommendedTeam.reduce((sum, m) => sum + m.monthly_cost_usd, 0);
    const avgHourlyRate = Math.round(recommendedTeam.reduce((sum, m) => sum + m.billable_rate_usd_per_hour * m.fte_allocation, 0) / totalFTE);
    const seniorFTE = recommendedTeam
        .filter((m) => m.seniority_level === "principal" || m.seniority_level === "senior")
        .reduce((sum, m) => sum + m.fte_allocation, 0);
    let teamLevel;
    if (seniorFTE / totalFTE > 0.6) {
        teamLevel = "senior_heavy";
    }
    else if (seniorFTE / totalFTE < 0.3) {
        teamLevel = "junior_heavy";
    }
    else {
        teamLevel = "balanced";
    }
    // Build other sections
    const phasedStaffing = calculatePhasedStaffing(recommendedTeam, duration_weeks, engagement_type);
    const skillCoverage = analyzeSkillCoverage(recommendedTeam, complexity);
    const teamDynamics = buildTeamDynamics(recommendedTeam, engagement_type);
    const staffingRisks = identifyStaffingRisks(recommendedTeam, skillCoverage, input);
    const alternatives = generateAlternatives(recommendedTeam, input);
    const recommendations = generateRecommendations(skillCoverage, input);
    return {
        project_name,
        client_name,
        recommendation_date: new Date().toISOString().split("T")[0],
        summary: {
            total_team_size: recommendedTeam.length,
            total_fte: Math.round(totalFTE * 10) / 10,
            estimated_monthly_cost_usd: totalMonthlyCost,
            blended_rate_usd_per_hour: avgHourlyRate,
            team_experience_level: teamLevel,
            key_staffing_rationale: `Team composed for ${engagement_type} engagement with ${complexity.technical_complexity} technical complexity. ` +
                `${complexity.ai_components.length > 0 ? `Includes specialists for ${complexity.ai_components.slice(0, 2).join(", ")}. ` : ""}` +
                `Structured for ${duration_weeks}-week delivery with ${teamLevel} experience distribution.`,
        },
        recommended_team: recommendedTeam,
        phased_staffing: phasedStaffing,
        skill_coverage: skillCoverage,
        team_dynamics: teamDynamics,
        staffing_risks: staffingRisks,
        alternative_configurations: alternatives,
        recommendations,
        methodology_note: "Team composition follows Good AI staffing methodology based on engagement type, complexity, and client context. Roles and allocations are calibrated against industry benchmarks and delivery best practices. Regular team composition reviews are recommended as project needs evolve.",
    };
}
//# sourceMappingURL=recommend_team_composition.js.map