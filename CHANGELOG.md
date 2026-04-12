# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-04-12

### Added

- Add TypeScript type definitions (`index.d.ts`)
- Add integration test examples in `examples/proxy-demo/`
- Add `.node-version` file for version managers
- Add GitHub Dependabot configuration
- Add GitHub Release workflow
- Add ESLint v9 flat config (`eslint.config.mjs`)

### Changed

- Upgrade `http-proxy-middleware` from v2 to v3
- Upgrade `egg` from v2 to v3
- Upgrade `egg-bin` from v4 to v6
- Upgrade `egg-mock` from v3 to v5
- Upgrade ESLint from v7 to v9
- Update Node.js requirement to `>=14.0.0`
- Update CI to test on Node.js 18, 20, 22
- Update GitHub Actions to use pnpm
- Update README with bilingual support (Chinese/English)
- Improve middleware performance with pre-normalized config

### Fixed

- Fix double `next()` call in middleware
- Fix middleware logic for proper proxy handling with http-proxy-middleware v3

### Removed

- Remove deprecated `babel-eslint` dependency
- Remove `egg-bin pkgfiles` command (deprecated)
- Remove test fixtures `logs/` and `run/` from git tracking
- Remove `.travis.yml` (migrated to GitHub Actions)
- Remove `.eslintignore` and `.prettierignore` (using flat config)
- Remove `husky` and `lint-staged`

## [1.1.0] - 2021-09-01

### Added

- Support file upload proxy
- Support custom matching function
- ctx context passing to callback functions

### Changed

- Update dependencies

## [1.0.0] - 2020-01-01

### Added

- Initial release
- Basic HTTP proxy middleware for Egg.js
- Path rewrite support
- WebSocket proxy support
- Request/response modification hooks

[2.1.0]: https://github.com/saqqdy/egg-http-proxy-plus/compare/v2.0.0...v2.1.0
[1.1.0]: https://github.com/saqqdy/egg-http-proxy-plus/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/saqqdy/egg-http-proxy-plus/releases/tag/v1.0.0
