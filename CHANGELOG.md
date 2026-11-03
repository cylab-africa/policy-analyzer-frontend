# Changelog

All notable changes to **pdp-frontend** (formerly *policy-analyzer-frontend*) are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/versioning.md](docs/versioning.md)
for how versions are chosen and releases are cut.

> **Note on history:** Before this file existed the project shipped without version tags, and
> `package.json` stayed at `0.1.0`. Versions `0.1.0` through `0.8.0` below were assigned
> retroactively by grouping merged pull requests into milestones. The commit listed for each
> version is the proposed tag target.

## [Unreleased]

### Security
- Pinned `d3-color` to 3.1 or newer through an npm override. The map library pulled in 2.0, which has a known ReDoS weakness.

### Removed
- Safeguards pages (`/safeguards`, `/safeguards/kenya`), their components and data files.

### Changed
- Documentation page is built from components and covers the whole tool.
- Upgraded to Next.js 16 (Node.js 20.9 or newer). `next lint` no longer exists, so `npm run lint` now calls ESLint 9 directly, with the flat config from `eslint-config-next` 16.

---

## [0.8.0] - 2026-09-08

Tag target: `1e64d03`

### Added
- Kenya country dossier page (`/safeguards/kenya`) with evidence and principles analysis of
  Kenya's Data Protection Act, 2019.
- `NotFound` component with a 404 page and navigation back to the site.

### Changed
- Kenya dossier and main pages now call `notFound()` for missing data instead of rendering empty.

### Removed
- Safeguards link from the site header.

---

## [0.7.0] - 2026-08-24

Tag target: `edc3431` (PRs #31, #32)

### Added
- Safeguards framework page (`/safeguards`) and its supporting components.
- `PrincipleOrbit` visualization for safeguard principles.
- `RisksRegister` component for listing and categorising risks.

### Changed
- Restyled `CountryCoverage` and updated the country dataset.

---

## [0.6.2] - 2026-02-03

Tag target: `c6267ce`

### Security
- Upgraded `react` and `react-dom` to 19.2.3 to pick up upstream React Server Components fixes.

### Changed
- `.gitignore` now covers the `docs` directory.

## [0.6.1] - 2025-12-15

Tag target: `07bd68d`

### Fixed
- Batch job status is only queried once a `jobId` is defined.
- Widened the message display container on the chat page.

## [0.6.0] - 2025-12-11

Tag target: `22a3715` (PRs #26–#30)

### Added
- `BatchAnalysisPanel` for running analysis across multiple documents.
- `UploadPanel` for uploading documents into a chat session.
- PostHog event tracking library and wider tracking coverage across chat components.

### Changed
- **Project renamed from `policy-analyzer-frontend` to `pdp-frontend`.**
- Docker image now builds on Node.js 20.
- Dockerfile installs all dependencies during build and sets correct ownership on copied files.
- Docker-related files are forced to LF line endings via `.gitattributes`.
- Upgraded Next.js to 15.5.7.

### Removed
- Unused admin endpoints and their types from `apiSlice`.

---

## [0.5.0] - 2025-10-29

Tag target: `e2791ae` (PRs #22–#25)

### Added
- PostHog analytics integration, including page-view tracking.
- PostHog environment variables as Docker build arguments.

### Changed
- Simplified Dockerfile and `.dockerignore`; the container runs as a non-root user.
- General refactor for readability and maintainability.

### Fixed
- `PostHogPageView` is wrapped in `Suspense` to avoid loading errors.
- Mobile navigation sheet now includes a `SheetTitle` for screen readers.

---

## [0.4.0] - 2025-09-17

Tag target: `3259515` (PR #21)

### Added
- Streaming chat responses with session management.
- Feedback link in the chat interface.
- Scroll-reveal animations on the Resources page.

### Changed
- Restyled chat components and the header.
- Replaced the `FileKey` icon with `Fingerprint` in `ChatInput`.

### Fixed
- Optional chaining guards against undefined API data.

---

## [0.3.0] - 2025-09-05

Tag target: `35d569a` (PRs #9–#20)

### Added
- Data structures and hooks for Policy Law and Digital ID datasets.
- `HeroStatsSection` with data visualization on the home page.
- API key support in request headers.

### Changed
- Updated home page and chat content.
- Redesigned `TabSection` and Resources components.
- Improved map interactivity and chart components.
- Updated header logo, header styling and footer contact email.

### Fixed
- Removed the redundant `/api` prefix from API endpoint URLs.
- Chat layout padding and margins; clearer chat page header text.

---

## [0.2.0] - 2025-08-08

Tag target: `7618a3c` (PRs #2–#8)

### Added
- Responsive layouts across components.
- UI primitives: alerts, avatars, textareas.
- `.dockerignore` and Docker configuration.

### Changed
- Resources page: simplified API queries, better filtering, more country-name aliases.
- `API_BASE_URL` fallback updated.

### Fixed
- Document link handling on the Resources page.

### Removed
- Debug `console.log` calls from the Resources page.

---

## [0.1.0] - 2025-07-07

Tag target: `07769cd` (PR #1)

### Added
- Initial Policy Analyzer application: Next.js App Router, Tailwind CSS, Redux Toolkit.
- Chat interface for policy questions.
- Home page with the Africa policy map.
- Project README.

[Unreleased]: https://github.com/cylab-africa/policy-analyzer-frontend/compare/v0.8.0...HEAD
[0.8.0]: https://github.com/cylab-africa/policy-analyzer-frontend/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/cylab-africa/policy-analyzer-frontend/compare/v0.6.2...v0.7.0
[0.6.2]: https://github.com/cylab-africa/policy-analyzer-frontend/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/cylab-africa/policy-analyzer-frontend/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/cylab-africa/policy-analyzer-frontend/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/cylab-africa/policy-analyzer-frontend/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/cylab-africa/policy-analyzer-frontend/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/cylab-africa/policy-analyzer-frontend/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/cylab-africa/policy-analyzer-frontend/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/cylab-africa/policy-analyzer-frontend/releases/tag/v0.1.0
