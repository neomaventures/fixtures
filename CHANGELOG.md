# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Fix `setupFilesAfterSetup` typo in README — correct name is `setupFilesAfterEnv`
- Fix `caseInsensitiveSearch` dropping falsy header values (e.g. empty strings) due to `||` operator
- Fix `request()` header normalization — `arguments[0]` spread no longer re-adds un-normalized header keys
- Replace full `lodash` dependency with `lodash.isequal` to reduce bundle size

### Changed

- `toThrowMatching` now rejects non-function subjects with a descriptive error message
- `toMatchError` now rejects function subjects with a descriptive error message
- `MockLoggerService` now includes `verbose` and `setLogLevels` methods

### Added

- `express.request()` — mock Express Request with randomized defaults and case-insensitive header access
- `express.response()` — mock Express Response with `status()`, `json()`, `send()`, `header()`, `getHeader()`, `setHeader()`, `removeHeader()`, `cookie()`, `clearCookie()`, `redirect()`, `render()`, `end()` as Jest mocks
- `express.cookie()` — HMAC-SHA256 signed cookie string matching cookie-parser format
- `executionContext()` — partial NestJS ExecutionContext supporting both bare handler functions and typed route objects
- `MockLoggerService` — implements `LoggerService` with all methods as `jest.fn()`
- `toThrowMatching` / `toMatchError` — custom Jest matchers for error class and property assertions

[Unreleased]: https://github.com/shipdventures/neoma-fixtures/compare/v0.1.0...HEAD
