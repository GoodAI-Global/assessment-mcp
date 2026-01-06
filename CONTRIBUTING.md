# Contributing to Good AI Assessment MCP Server

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/assessment-mcp.git
cd assessment-mcp

# Install dependencies
make setup
# or: npm install

# Verify everything works
make test
# or: npm test
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Follow existing code patterns
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all checks
make lint      # ESLint
make test      # Jest tests
make build     # TypeScript compilation

# Or run everything
npm run build && npm run lint && npm test
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description
git commit -m "feat(tools): add new assessment tool"
git commit -m "fix(calculate_roi): correct NPV calculation"
git commit -m "docs: update README with new tools"
git commit -m "test: add edge case tests for qualify_lead"
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `test`: Adding/updating tests
- `refactor`: Code change that neither fixes nor adds
- `chore`: Maintenance tasks

### 5. Submit a Pull Request

- Fill out the PR template
- Link any related issues
- Ensure CI passes

## Adding a New Tool

1. Create the tool file in `src/tools/`:
   ```typescript
   // src/tools/your_tool.ts
   import { z } from "zod";

   export const YourToolInputSchema = z.object({
     // Define input schema
   });

   export const YOUR_TOOL = {
     name: "your_tool",
     description: "What this tool does",
     inputSchema: { /* JSON Schema */ },
   };

   export function yourTool(input: YourToolInput): YourToolOutput {
     // Implementation
   }
   ```

2. Register in `src/server.ts`:
   ```typescript
   import { yourTool, YourToolInputSchema, YOUR_TOOL } from "./tools/your_tool.js";

   // Add to TOOL_REGISTRY
   // Add to tools array in ListToolsRequestSchema handler
   ```

3. Add tests in `test/your_tool.test.ts`:
   - Input validation tests
   - Output structure tests
   - Business logic tests
   - Edge cases
   - **Deterministic output test** (required)

4. Update documentation:
   - README.md tool table
   - CHANGELOG.md

## Code Standards

### TypeScript

- Use strict TypeScript
- Export types for public APIs
- Prefer `interface` over `type` for objects
- Use Zod for runtime validation

### Testing

- Aim for comprehensive coverage
- Include at least one deterministic test per tool
- Test edge cases and error conditions
- Use descriptive test names

### Documentation

- JSDoc comments for public functions
- Update README for user-facing changes
- Keep CHANGELOG current

## Review Process

1. All PRs require at least one approval
2. CI must pass (lint, build, tests)
3. Breaking changes require discussion first
4. Security-sensitive changes require security review

## Questions?

- Open a [Discussion](https://github.com/goodai/assessment-mcp/discussions)
- Check existing issues and PRs

Thank you for contributing!
