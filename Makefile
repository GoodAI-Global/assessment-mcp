# Good AI Assessment MCP Server
# Makefile for common development tasks

.PHONY: setup build lint test clean all check ci

# Default target
all: setup build lint test

# Install dependencies
setup:
	npm ci

# Install dependencies (alias)
install: setup

# Build TypeScript
build:
	npm run build

# Run linter
lint:
	npm run lint

# Run linter with auto-fix
lint-fix:
	npx eslint --fix src/**/*.ts

# Run tests
test:
	npm test

# Run tests with coverage
test-coverage:
	npm test -- --coverage

# Run tests in watch mode
test-watch:
	npm test -- --watch

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf coverage
	rm -rf node_modules/.cache

# Deep clean (including node_modules)
clean-all: clean
	rm -rf node_modules

# Run all checks (for CI)
check: lint build test

# CI target (same as check)
ci: check

# Run the MCP server test
test-server:
	node test_server.js

# Development mode (watch)
dev:
	npm run dev

# Check for security vulnerabilities
audit:
	npm audit

# Update dependencies
update:
	npm update

# Show outdated dependencies
outdated:
	npm outdated

# Help
help:
	@echo "Available targets:"
	@echo "  setup        - Install dependencies (npm ci)"
	@echo "  build        - Build TypeScript"
	@echo "  lint         - Run ESLint"
	@echo "  lint-fix     - Run ESLint with auto-fix"
	@echo "  test         - Run Jest tests"
	@echo "  test-coverage- Run tests with coverage"
	@echo "  test-watch   - Run tests in watch mode"
	@echo "  clean        - Remove build artifacts"
	@echo "  clean-all    - Remove build artifacts and node_modules"
	@echo "  check        - Run lint, build, and test"
	@echo "  ci           - Same as check (for CI pipelines)"
	@echo "  test-server  - Run MCP server test"
	@echo "  dev          - Run in development mode"
	@echo "  audit        - Check for security vulnerabilities"
	@echo "  update       - Update dependencies"
	@echo "  outdated     - Show outdated dependencies"
	@echo "  help         - Show this help message"
