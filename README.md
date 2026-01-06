# Good AI Assessment MCP Server

> **"Leverage, not lore"** — Tools that deliver immediate value

An MCP (Model Context Protocol) server providing enterprise AI assessment tools for Claude Desktop. Evaluates AI readiness, identifies bottlenecks, plans pilots, calculates ROI, and supports the full consulting lifecycle.

## What This Is

- **17 specialized tools** for enterprise AI consulting workflows
- **MCP server** that integrates with Claude Desktop
- **Assessment tools** for AI readiness, data quality, and implementation risk
- **Sales tools** for lead qualification, deal sizing, and SOW generation
- **Delivery tools** for team composition and project planning
- **Client Success tools** for adoption tracking, value realization, and churn prediction
- **Deterministic outputs** suitable for business documentation

## What This Is NOT

- Not a production AI/ML platform
- Not a replacement for human consultants — it augments their workflow
- Not a general-purpose chatbot or LLM
- Not suitable for real-time, high-frequency automated decisions
- Not validated for regulated industries without additional compliance review

## Quickstart (< 5 minutes)

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

## Available Tools

### Assessment & Planning
| Tool | Description |
|------|-------------|
| `assess_ai_readiness` | Evaluate organizational AI readiness (1-10 score) |
| `identify_bottlenecks` | Find operational inefficiencies with AI solution fit |
| `generate_pilot_plan` | Create implementation plans with milestones |
| `calculate_roi` | Project financial returns with sensitivity analysis |
| `assess_data_quality` | Evaluate data sources for AI readiness |
| `prioritize_use_cases` | Rank and prioritize AI use cases |
| `compare_scenarios` | Compare multiple implementation scenarios |
| `generate_executive_summary` | Create executive-ready assessment summaries |

### Sales
| Tool | Description |
|------|-------------|
| `qualify_lead` | Score and qualify sales leads |
| `estimate_deal_size` | Calculate deal value with margin analysis |
| `generate_sow` | Generate Statement of Work documents |

### Delivery
| Tool | Description |
|------|-------------|
| `assess_implementation_risk` | Evaluate project risks with mitigation plans |
| `recommend_team_composition` | Optimal team staffing recommendations |

### Client Success
| Tool | Description |
|------|-------------|
| `measure_adoption` | Track AI solution adoption and engagement |
| `calculate_realized_value` | Measure actual vs projected value |
| `predict_churn_risk` | Predict client churn with retention strategies |

---

## Development

```bash
# Clone and install
git clone https://github.com/goodai/assessment-mcp.git
cd assessment-mcp
npm install

# Build, lint, and test
make setup    # Install dependencies
make lint     # Run ESLint
make test     # Run Jest tests
make build    # Compile TypeScript
make clean    # Remove build artifacts

# Or use npm directly
npm run build
npm run lint
npm test
```

### Project Structure

```
src/
  tools/           # Individual tool implementations
  prompts/         # MCP prompt definitions
  lib/             # Shared utilities (audit, config, logging)
  server.ts        # MCP server entry point
test/              # Jest test files
dist/              # Compiled JavaScript output
```

---

## Industry Support

Specialized benchmarks and recommendations for:
- **Manufacturing** — Quality inspection, predictive maintenance
- **Insurance** — Claims processing, underwriting
- **Aquaculture** — Feed optimization, biomass estimation
- **Healthcare** — Clinical documentation, scheduling
- **General** — Applicable to any industry

---

## Good AI Methodology

| Principle | Implementation |
|-----------|----------------|
| **Leverage, not lore** | Tools deliver actionable insights, not theoretical frameworks |
| **Evidence over opinions** | Assessments based on measurable criteria with documented assumptions |
| **Augment first** | Identifies human augmentation opportunities before full automation |
| **Non-invasive by default** | Recommends solutions that bypass legacy system constraints |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## Security

See [SECURITY.md](SECURITY.md) for security policy and vulnerability reporting.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Good AI</strong><br>
  <em>Premium Enterprise AI Consultancy</em>
</p>
