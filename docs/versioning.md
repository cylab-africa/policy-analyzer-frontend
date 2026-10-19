# Versioning and Release Process

This document describes how **pdp-frontend** is versioned, how changes are recorded in
[CHANGELOG.md](../CHANGELOG.md), and how a release is cut.

## 1. Version scheme

We use [Semantic Versioning 2.0.0](https://semver.org/): `MAJOR.MINOR.PATCH`.

The project is pre-1.0 (`0.y.z`). While it stays there:

| Bump | When | Example |
| --- | --- | --- |
| **MINOR** (`0.7.0 → 0.8.0`) | New page, feature or visible UI change; any breaking change, such as a renamed env var, a changed backend API contract or a removed route | Safeguards page, batch analysis |
| **PATCH** (`0.8.0 → 0.8.1`) | Bug fixes, copy and styling tweaks, dependency or security updates with no behaviour change | `jobId` guard, React security bump |

**1.0.0** is released when the platform is declared production-stable for external users.
From then on, breaking changes bump **MAJOR**.

For the frontend, a breaking change is anything that requires action from whoever deploys it:

- a new **required** environment variable or Docker build argument, or one renamed or removed
- a dependency on a backend API version that older backends do not provide
- a removed or renamed public route (URLs people may have bookmarked or linked)
- a change to the Node.js runtime version

## 2. Source of truth

| Where | What it holds |
| --- | --- |
| `package.json` → `version` | The current version. **Bump this in every release.** |
| Git tag `vX.Y.Z` | The exact commit on `main` that was released |
| `CHANGELOG.md` | What changed, for humans |
| `NEXT_PUBLIC_APP_VERSION` | Version shown in the UI; set it from `package.json` at build time |
| Docker image tag | `pdp-frontend:X.Y.Z` (plus `latest` for the newest release) |

All of these must agree for any given release.

## 3. Branches

| Branch | Purpose |
| --- | --- |
| `main` | Released, deployable code. Every release tag sits on `main`. |
| `develop` | Integration branch for upcoming features. |
| `hotfix` | Urgent fixes against `main`, released as a PATCH. |
| `feature/*` | Optional short-lived branches merged into `develop`. |

All changes reach `main` through a pull request. Avoid pushing directly to `main`; release
0.8.0 was pushed straight to `main`, which left no PR record of what shipped.

## 4. Commit messages

Keep using [Conventional Commits](https://www.conventionalcommits.org/), which most of the
history already follows. The type maps onto the changelog and the version bump:

| Commit type | Changelog section | Version bump |
| --- | --- | --- |
| `feat:` | Added / Changed | MINOR |
| `fix:` | Fixed | PATCH |
| `perf:`, `refactor:` | Changed (only if user-visible) | PATCH |
| `chore:`, `docs:`, `build:`, `ci:` | Usually omitted | none / PATCH |
| `feat!:` or a `BREAKING CHANGE:` footer | Changed / Removed, called out in bold | MINOR while pre-1.0, MAJOR after |
| security dependency bumps | Security | PATCH |

Write messages that make sense to a reader of the changelog. Avoid messages like
"made changes", "correction" and "update changes locally".

## 5. Keeping the changelog

- Every PR that changes behaviour adds a line under **`## [Unreleased]`** in `CHANGELOG.md`.
- Use the Keep a Changelog sections: **Added, Changed, Deprecated, Removed, Fixed, Security**.
- Write for people deploying or using the app, not for the code: "Kenya dossier page" is
  better than "add KenyaDossierPage component".
- Mark breaking changes with **bold** text and say what the deployer must do.

## 6. Cutting a release

1. Merge `develop` into `main` through a PR, after lint and build pass.
2. On `main`, choose the next version using section 1.
3. Update the version in `package.json` and `package-lock.json`:
   ```bash
   npm version 0.9.0 --no-git-tag-version
   ```
4. In `CHANGELOG.md`, rename `## [Unreleased]` to `## [0.9.0] - YYYY-MM-DD`, add a fresh empty
   `## [Unreleased]` above it, and update the compare links at the bottom.
5. Commit and tag:
   ```bash
   git commit -am "chore(release): v0.9.0"
   git tag -a v0.9.0 -m "v0.9.0"
   git push origin main --follow-tags
   ```
6. Create a GitHub Release from the tag and paste in that version's changelog section.
7. Build and push the Docker image with the version tag:
   ```bash
   docker build --build-arg NEXT_PUBLIC_APP_VERSION=0.9.0 ... -t pdp-frontend:0.9.0 -t pdp-frontend:latest .
   ```
8. Merge `main` back into `develop` so the version bump is not lost.

### Hotfixes

Branch from `main` into `hotfix`, fix the problem, open a PR to `main`, and release as a PATCH
(steps 2–8). Merge back into `develop` afterwards.

## 7. Backfilling historical tags (one-time)

The changelog assigns retroactive versions to past milestones. To create the matching tags:

```bash
git tag -a v0.1.0 07769cd -m "v0.1.0"
git tag -a v0.2.0 7618a3c -m "v0.2.0"
git tag -a v0.3.0 35d569a -m "v0.3.0"
git tag -a v0.4.0 3259515 -m "v0.4.0"
git tag -a v0.5.0 e2791ae -m "v0.5.0"
git tag -a v0.6.0 22a3715 -m "v0.6.0"
git tag -a v0.6.1 07bd68d -m "v0.6.1"
git tag -a v0.6.2 c6267ce -m "v0.6.2"
git tag -a v0.7.0 edc3431 -m "v0.7.0"
git tag -a v0.8.0 1e64d03 -m "v0.8.0"
git push origin --tags
```

Then set `package.json` to `0.8.0` in a release commit so the code matches the latest tag.
