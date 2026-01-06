# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-06

### Added

- **Assessment & Planning Tools**
  - `assess_ai_readiness`: Evaluate organizational AI readiness with multi-dimensional scoring
  - `identify_bottlenecks`: Find operational inefficiencies with AI solution fit scoring
  - `generate_pilot_plan`: Create implementation plans with milestones and risk mitigation
  - `calculate_roi`: Calculate ROI with NPV, payback period, and sensitivity analysis
  - `assess_data_quality`: Evaluate data sources for AI readiness with gap analysis
  - `prioritize_use_cases`: Rank and prioritize AI use cases with portfolio analysis
  - `compare_scenarios`: Compare implementation scenarios with trade-off analysis
  - `generate_executive_summary`: Create executive-ready assessment summaries

- **Sales Tools**
  - `qualify_lead`: Score and qualify sales leads with engagement recommendations
  - `estimate_deal_size`: Calculate deal value with margin analysis and negotiation guidance
  - `generate_sow`: Generate comprehensive Statement of Work documents

- **Delivery Tools**
  - `assess_implementation_risk`: Evaluate project risks with mitigation plans
  - `recommend_team_composition`: Optimal team staffing with phased recommendations

- **Client Success Tools**
  - `measure_adoption`: Track AI solution adoption and user engagement
  - `calculate_realized_value`: Measure actual vs projected value realization
  - `predict_churn_risk`: Predict client churn with retention strategies

- **Infrastructure**
  - Audit logging with correlation IDs for all tool invocations
  - Industry-specific benchmarks for manufacturing, insurance, aquaculture, healthcare
  - Zod schema validation for all tool inputs with security-focused length limits
  - Comprehensive test suite with 745 tests
  - TypeScript ESM module support
  - MCP SDK integration for stdio transport

- **Enterprise GitHub Standards**
  - CI/CD workflow with lint, build, test
  - Dependabot configuration for dependency updates
  - Security policy (SECURITY.md)
  - Contributing guidelines (CONTRIBUTING.md)
  - Code of Conduct
  - Makefile for common tasks

### Security

- Input validation with maximum length constraints on all string and array fields
- Protection against unrealistic numeric values that could cause computational issues
- Audit trail support for compliance requirements

## [Unreleased]

### Planned

- Industry templates tool for pre-configured assessment templates
- Additional industry benchmarks
- Enhanced sensitivity analysis options
- Multi-language support for output messages
