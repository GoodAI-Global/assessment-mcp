# Acceptance Tests

This document describes the acceptance criteria for the Good AI Assessment MCP Server.

## Commands

Run these commands in order to verify the server is working correctly:

```bash
# 1. Install dependencies
npm install

# 2. Build the TypeScript code
npm run build

# 3. Run the test server script
node test_server.js

# 4. Run unit tests
npm test
```

## Expected Results

### 1. npm install

- All dependencies install without errors
- No security vulnerabilities in direct dependencies

### 2. npm run build

- TypeScript compilation completes without errors
- `dist/` directory is created with JavaScript files
- Type declarations (`.d.ts`) are generated

### 3. node test_server.js

**Expected output structure:**

```json
{
  "overall_score": 3.5,
  "dimensions": {
    "data_readiness": {
      "score": 2,
      "findings": ["High manual entry indicates Computer Vision opportunity", "No centralized data repository"]
    },
    "technical_capability": {
      "score": 4,
      "findings": ["Low legacy complexity enables faster implementation"]
    },
    "process_maturity": {
      "score": 4,
      "findings": []
    },
    "organizational_readiness": {
      "score": 4,
      "findings": []
    }
  },
  "strengths": ["Low legacy complexity", "Clear digitization opportunity"],
  "gaps": ["No centralized data", "High manual processes"],
  "recommended_starting_point": "Deploy non-invasive Computer Vision to digitize manual logs and establish data foundation.",
  "estimated_time_to_value_weeks": 8,
  "red_flags": []
}
```

**Key validations:**
- ✅ Output structure validation passes
- ✅ Business logic validation passes
- ✅ Exit code is 0

### 4. npm test

**Expected results:**
- All tests pass (minimum 3 tests)
- Tests cover:
  - Schema validation (output has all required fields)
  - Logic test (high manual entry produces CV recommendation)
  - Red flag test (score < 3 produces red flag message)
  - Deterministic output (same input = same output)

## Reference Test Input

```json
{
  "company_name": "OceanShrimp Co.",
  "industry": "aquaculture",
  "employee_count": 120,
  "data_infrastructure": {
    "centralized_data": false,
    "manual_data_entry_percent": 85
  },
  "current_systems": {
    "erp": null,
    "crm": null,
    "legacy_systems_count": 2
  }
}
```

## Definition of Done Checklist

- [ ] `npm run build` succeeds without errors
- [ ] `node test_server.js` prints valid JSON matching reference output structure
- [ ] `npm test` passes with minimum 3 tests
- [ ] README.md has "Quickstart in 60 Seconds" section
- [ ] ACCEPTANCE_TESTS.md exists (this file)
- [ ] LICENSE file exists with MIT license

## Troubleshooting

### Build fails with TypeScript errors

```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

### Tests fail to run

```bash
# Ensure Jest is configured for ESM
node --experimental-vm-modules node_modules/jest/bin/jest.js
```

### Server doesn't start

Check that the MCP SDK is properly installed:

```bash
npm ls @modelcontextprotocol/sdk
```

## Manual Testing with Claude Desktop

1. Configure Claude Desktop with the server (see README.md)
2. Restart Claude Desktop
3. Ask: "Assess AI readiness for a 100-person manufacturing company with SAP ERP and 40% manual data entry"
4. Verify Claude uses the `assess_ai_readiness` tool and returns structured results
