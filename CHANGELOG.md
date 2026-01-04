# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-04

### Added

- Initial release of Good AI Assessment MCP Server
- Four enterprise AI assessment tools:
  - `assess_ai_readiness`: Evaluate organizational readiness for AI implementation with multi-dimensional scoring
  - `identify_bottlenecks`: Analyze processes to find operational bottlenecks with AI solution fit scoring
  - `generate_pilot_plan`: Create detailed pilot implementation plans with milestones and risk mitigation
  - `calculate_roi`: Calculate ROI with NPV, payback period, and sensitivity analysis
- Industry-specific benchmarks for manufacturing, insurance, aquaculture, healthcare, and general sectors
- Zod schema validation for all tool inputs with security-focused length limits
- Comprehensive test suite with 94 tests
- TypeScript ESM module support
- MCP SDK integration for stdio transport

### Security

- Input validation with maximum length constraints on all string and array fields
- Protection against unrealistic numeric values that could cause computational issues

## [Unreleased]

### Planned

- Additional industry benchmarks
- Enhanced sensitivity analysis options
- Multi-language support for output messages
