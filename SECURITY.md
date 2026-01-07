# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email security concerns to: security@goodai.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours of your report
- **Initial Assessment**: Within 5 business days
- **Resolution Timeline**: Depends on severity
  - Critical: 24-72 hours
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle

### Security Considerations

This MCP server processes business data for AI assessments. Key security measures:

1. **Input Validation**: All inputs validated with Zod schemas with length limits
2. **No Data Persistence**: Tools are stateless; no data stored between invocations
3. **No External API Calls**: All processing is local; no data sent to external services
4. **Audit Logging**: Optional audit trail for compliance requirements

### Known Limitations

- This tool is designed for **internal business use**, not public-facing applications
- Input data should not contain PII or sensitive customer data
- Financial projections are estimates and should not replace professional advice

## Security Best Practices for Users

1. **Access Control**: Limit Claude Desktop access to authorized users
2. **Data Handling**: Do not input sensitive PII into assessment tools
3. **Review Outputs**: Validate tool outputs before sharing externally
4. **Keep Updated**: Use the latest version for security patches

## Dependency Security

- Dependencies are monitored via GitHub Dependabot
- Security updates are applied promptly
- Run `npm audit` to check for known vulnerabilities

## Known Vulnerabilities

### @modelcontextprotocol/sdk ReDoS (GHSA-8r9q-7v3j-jr4g)

- **Severity**: High
- **Type**: Regular Expression Denial of Service (ReDoS)
- **Status**: No fix available (affects all versions ≤1.25.1)
- **Impact**: Potential DoS via crafted input to SDK regex patterns
- **Mitigation**:
  - This server is designed for trusted internal use, not public-facing
  - Input validation via Zod schemas limits attack surface
  - Monitor for SDK updates and upgrade when fix is released
- **Tracking**: https://github.com/advisories/GHSA-8r9q-7v3j-jr4g

*Last reviewed: 2026-01-07*
