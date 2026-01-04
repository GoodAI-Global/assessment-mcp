/**
 * Good AI - Enterprise Assessment Prompt
 * Structured prompt for comprehensive AI readiness assessment
 */

export const ENTERPRISE_ASSESSMENT_PROMPT = {
  name: "enterprise_assessment",
  description:
    "Conduct a comprehensive AI readiness assessment for an enterprise client using Good AI methodology",
  arguments: [
    {
      name: "company_name",
      description: "Name of the company to assess",
      required: true,
    },
    {
      name: "industry",
      description: "Industry sector (manufacturing, insurance, aquaculture, healthcare, general)",
      required: true,
    },
  ],
};
