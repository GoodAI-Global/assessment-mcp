/**
 * Good AI - Pilot Recommendation Prompt
 * Structured prompt for generating pilot implementation recommendations
 */

export const PILOT_RECOMMENDATION_PROMPT = {
  name: "pilot_recommendation",
  description:
    "Generate a detailed pilot recommendation with ROI analysis following Good AI methodology",
  arguments: [
    {
      name: "focus_area",
      description: "The specific bottleneck or opportunity to focus on",
      required: false,
    },
  ],
};
