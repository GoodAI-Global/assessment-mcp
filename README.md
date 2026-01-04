# Good AI Assessment MCP Server

> **"Leverage, not lore"** — Tools that deliver immediate value

Enterprise AI assessment tools following Good AI's proven methodology. This MCP server provides Claude with specialized tools for evaluating AI readiness, identifying bottlenecks, planning pilots, and calculating ROI.

## Quickstart in 60 Seconds

### 1. Install

```bash
npm install @goodai/assessment-mcp
```

### 2. Configure Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "goodai-assessment": {
      "command": "npx",
      "args": ["@goodai/assessment-mcp"]
    }
  }
}
```

**Config file locations:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### 3. Restart Claude Desktop

That's it! Ask Claude to assess AI readiness for any company.

---

## Tools

### `assess_ai_readiness`

Evaluate an organization's readiness for AI implementation across four dimensions.

**Example:**
```json
{
  "company_name": "Acme Manufacturing",
  "industry": "manufacturing",
  "employee_count": 250,
  "data_infrastructure": {
    "centralized_data": true,
    "data_quality_score": 7,
    "manual_data_entry_percent": 40
  },
  "current_systems": {
    "erp": "SAP",
    "crm": "Salesforce",
    "legacy_systems_count": 3
  }
}
```

**Output includes:**
- Overall readiness score (1-10)
- Dimension scores (data, technical, process, organizational)
- Strengths and gaps analysis
- Recommended starting point
- Estimated time to value
- Red flags (if any)

---

### `identify_bottlenecks`

Analyze processes to find operational inefficiencies with cost estimation.

**Example:**
```json
{
  "process_description": "Manual quality inspection of manufactured parts using visual checks",
  "metrics": {
    "cycle_time_hours": 48,
    "error_rate_percent": 8,
    "manual_steps_count": 12,
    "cost_per_unit_usd": 15
  },
  "pain_points": [
    "Inconsistent inspection quality",
    "Bottleneck during peak production",
    "High training cost for inspectors"
  ],
  "industry": "manufacturing"
}
```

**Output includes:**
- Ranked list of bottlenecks
- Cost estimation per bottleneck
- AI solution fit score (1-10)
- Quick wins identification

---

### `generate_pilot_plan`

Create detailed pilot implementation plans following Good AI methodology.

**Example:**
```json
{
  "selected_bottleneck": {
    "name": "Quality Control Gaps",
    "description": "Manual inspection delays",
    "estimated_annual_cost_usd": 75000,
    "ai_solution_fit_score": 9,
    "recommended_ai_approach": "Computer Vision for quality inspection",
    "complexity": "medium"
  },
  "constraints": {
    "max_budget_usd": 50000,
    "max_duration_weeks": 8
  },
  "company_context": {
    "company_name": "Acme Manufacturing",
    "industry": "manufacturing",
    "employee_count": 250
  }
}
```

**Output includes:**
- Pilot objectives and approach
- Week-by-week milestones
- Success metrics
- Risk mitigation strategies
- Next steps

---

### `calculate_roi`

Project financial returns with sensitivity analysis.

**Example:**
```json
{
  "current_metrics": {
    "process_cost_per_month_usd": 25000,
    "error_rate_percent": 8,
    "manual_fte_count": 3
  },
  "target_improvement_percent": 40,
  "implementation_cost_usd": 50000,
  "ongoing_monthly_cost_usd": 2000,
  "time_horizon_months": 24
}
```

**Output includes:**
- Expected ROI percentage
- Payback period
- Net present value
- Sensitivity analysis (conservative/expected/optimistic)
- Documented assumptions

---

## Good AI Methodology

This server implements Good AI's core principles:

| Principle | Implementation |
|-----------|----------------|
| **Leverage, not lore** | Tools deliver actionable insights, not theoretical frameworks |
| **Evidence over opinions** | Assessments based on measurable criteria with documented assumptions |
| **Augment first** | Identifies human augmentation opportunities before full automation |
| **Non-invasive by default** | Recommends solutions that bypass legacy system constraints |

---

## Industry Support

Specialized benchmarks and recommendations for:
- **Manufacturing** — Quality inspection, predictive maintenance
- **Insurance** — Claims processing, underwriting
- **Aquaculture** — Feed optimization, biomass estimation
- **Healthcare** — Clinical documentation, scheduling
- **General** — Applicable to any industry

---

## Development

```bash
# Clone and install
git clone https://github.com/goodai/assessment-mcp.git
cd assessment-mcp
npm install

# Build
npm run build

# Test
npm test

# Run test script
node test_server.js

# Development mode
npm run dev
```

---

## API Usage

You can also use the tools programmatically:

```typescript
import { assessAIReadiness, identifyBottlenecks } from '@goodai/assessment-mcp';

const result = assessAIReadiness({
  company_name: "My Company",
  industry: "manufacturing",
  employee_count: 100,
  data_infrastructure: {
    centralized_data: true,
    manual_data_entry_percent: 30
  },
  current_systems: {
    erp: "SAP",
    crm: null,
    legacy_systems_count: 2
  }
});

console.log(result.overall_score);
console.log(result.recommended_starting_point);
```

---

## Prompts

The server also provides structured prompts:

- **enterprise_assessment** — Conduct comprehensive AI readiness assessment
- **pilot_recommendation** — Generate detailed pilot recommendations with ROI

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Good AI</strong><br>
  <em>Premium Enterprise AI Consultancy</em>
</p>
