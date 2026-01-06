# Releasing

This document describes the release process for Good AI Assessment MCP Server.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes to tool APIs or behavior
- **MINOR** (0.x.0): New tools or features, backward compatible
- **PATCH** (0.0.x): Bug fixes and minor improvements

## Release Checklist

### 1. Pre-Release

- [ ] All tests pass: `make check`
- [ ] No security vulnerabilities: `npm audit`
- [ ] Documentation updated
- [ ] CHANGELOG.md updated with new version section

### 2. Version Bump

```bash
# Update version in package.json
npm version patch  # or minor, or major

# This automatically:
# - Updates package.json version
# - Creates a git commit
# - Creates a git tag
```

### 3. Update CHANGELOG

Move items from `[Unreleased]` to the new version section:

```markdown
## [0.2.0] - 2024-01-15

### Added
- New feature X

### Changed
- Updated behavior Y

### Fixed
- Bug fix Z
```

### 4. Push Release

```bash
# Push commit and tags
git push origin main --tags
```

### 5. GitHub Release

1. Go to [Releases](https://github.com/goodai/assessment-mcp/releases)
2. Click "Draft a new release"
3. Select the version tag
4. Copy relevant CHANGELOG section to description
5. Publish release

### 6. npm Publish

The CI workflow automatically publishes to npm when:
- Push to `main` branch
- Version in `package.json` differs from published version
- `NPM_TOKEN` secret is configured

Manual publish (if needed):
```bash
npm publish --access public
```

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 0.1.0 | 2024-01-XX | Initial MVEGS release |

## Hotfix Process

For critical fixes:

1. Create hotfix branch from tag: `git checkout -b hotfix/issue-123 v0.1.0`
2. Apply fix and add tests
3. Bump patch version
4. Merge to main and tag
5. Follow normal release steps

## Rollback

If a release has critical issues:

1. Deprecate the broken version: `npm deprecate @goodai/assessment-mcp@x.y.z "Critical bug, use x.y.z+1"`
2. Release a patch with the fix
3. Consider yanking only for security issues (cannot be undone)
