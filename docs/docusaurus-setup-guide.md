# Docusaurus Setup Guide

How to install and integrate [Docusaurus](https://docusaurus.io/) into a project repo for documentation. Written for Node.js-based repos (NestJS, React, etc.) but the same steps work for any project — Docusaurus itself only needs Node.js installed, the underlying project can be in any language.

Official docs: https://docusaurus.io/docs

---

## 0. Why Docusaurus

We evaluated Docusaurus, MkDocs + Material, Sphinx, and GitBook. Decision:

- **Most of our repos are Node.js/TypeScript** (NestJS services, React frontends) — Docusaurus is built and maintained in that same ecosystem, so it shares tooling, dependency management, and CI patterns our teams already use. No extra language runtime to install or maintain just for docs.
- **MDX support** lets us embed live React components inside docs (tabbed code samples, interactive API explorers, etc.), which matters for frontend-heavy repos where a plain Markdown site (MkDocs, Sphinx) would be more limiting.
- **Versioned docs and i18n are built in**, which we anticipate needing as APIs evolve across releases and as documentation potentially serves non-English-speaking teams.
- **Free and fully open source** (MIT-licensed, https://github.com/facebook/docusaurus) — this ruled out GitBook, whose core product is now a closed, hosted SaaS rather than open source. Self-hosting requirements aside, "open source" was a stated constraint for this decision, and GitBook does not meet it.
- **Large community and plugin ecosystem** (Algolia DocSearch, OpenAPI doc generation, versioning tools), backed by Meta, actively maintained, reducing long-term maintenance risk.

Runner-up: MkDocs + Material — arguably a better fit for the Python-only projects and lighter-weight — but Docusaurus was chosen as the single standard across all repos since the majority are Node-based, and maintaining one docs tool org-wide is simpler than picking per-project.

---

## 1. Prerequisites

- Node.js **18.0+** (LTS recommended) — [Node install docs](https://nodejs.org/en/download)
- npm, yarn, or pnpm

Check your version:

```bash
node -v
```

Reference: https://docusaurus.io/docs/installation#requirements

---

## 2. Install Docusaurus

Run the official scaffolding command **inside a `docs/` folder in the target repo** (recommended) so documentation lives alongside the code it documents, in the same repo.

```bash
npx create-docusaurus@latest docs classic --typescript
```

- `docs` — the folder name Docusaurus will create for the site (choose any name; `docs` or `documentation` avoids clashing with an existing `docs/` folder used for other purposes — rename if needed, e.g. `site-docs`)
- `classic` — the official template (blog + docs + pages, theming built in) — recommended default
- `--typescript` — optional, generates a TypeScript config instead of JS. Recommended since most of our repos are already TS-based

Official reference: https://docusaurus.io/docs/installation#scaffold-project-website

This creates:

```
docs/
├── blog/                # optional blog (can delete if unused)
├── docs/                # your actual markdown documentation pages
├── src/
│   ├── components/
│   └── pages/
├── static/
├── docusaurus.config.ts
├── sidebars.ts
└── package.json
```

---

## 3. Run it locally and access the docs

```bash
cd docs
npm install
npm start
```

This starts a local dev server and **automatically opens your browser** to:

```
http://localhost:3000/
```

If it doesn't open automatically, or you're running it headless, open that URL manually. If port 3000 is already in use, Docusaurus will prompt to use the next free port (e.g. `3001`) — check the terminal output for the actual URL it lands on.

Notes:

- If you set a `baseUrl` other than `/` in `docusaurus.config.ts` (e.g. `/pdp-frontend/` for GitHub Pages, see [§5](#5-basic-configuration)), the local URL becomes `http://localhost:3000/pdp-frontend/` — the dev server always respects `baseUrl`.
- The homepage (`/`) is `src/pages/index.tsx`. Your actual documentation pages live under `/docs/...`, e.g. a file at `docs/docs/getting-started.md` is served at `http://localhost:3000/docs/getting-started`.
- The server **hot-reloads**: edits to any `.md`/`.mdx` file, `sidebars.ts`, or `docusaurus.config.ts` are reflected in the browser within a second or two, no restart needed (config changes occasionally require a manual restart — if the page doesn't update, stop with `Ctrl+C` and re-run `npm start`).
- Stop the server with `Ctrl+C` in the terminal.

Reference: https://docusaurus.io/docs/installation#running-the-development-server

---

## 4. Integrating into an existing repo

### Option A — Docs folder inside the same repo (recommended for most of our projects)

Put the generated `docs/` (or `site-docs/`) folder at the repo root, next to `src/`. Add a root-level script so it's discoverable:

```json
// root package.json
{
  "scripts": {
    "docs:dev": "npm --prefix docs start",
    "docs:build": "npm --prefix docs run build",
    "docs:serve": "npm --prefix docs run serve"
  }
}
```

Add to root `.gitignore`:

```
docs/build
docs/.docusaurus
docs/node_modules
```

### Option B — Separate docs repo

For projects where docs are versioned independently or shared across multiple services (e.g. a central API/platform docs site), scaffold Docusaurus in its own repo instead. Same install steps apply.

---

## 5. Basic configuration

Edit `docs/docusaurus.config.ts` — key fields to update per project:

```ts
const config: Config = {
  title: 'PDP Frontend Docs',
  tagline: 'Documentation for the PDP Frontend project',
  url: 'https://your-org.github.io', // or internal docs domain
  baseUrl: '/pdp-frontend/',
  organizationName: 'your-org',      // GitHub org
  projectName: 'pdp-frontend',       // repo name

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/your-org/pdp-frontend/edit/main/docs/',
        },
        blog: false, // disable if you don't need a changelog/blog
      },
    ],
  ],
};
```

Full config reference: https://docusaurus.io/docs/api/docusaurus-config

---

## 6. Writing docs — example page

Docs are just Markdown (or MDX, which allows embedding React components) inside `docs/docs/`.

**`docs/docs/getting-started.md`:**

```md
---
sidebar_position: 1
title: Getting Started
---

# Getting Started

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Environment Variables

| Variable       | Description             | Required |
|----------------|--------------------------|----------|
| `API_BASE_URL` | Backend API endpoint     | Yes      |
| `NODE_ENV`     | `development` / `production` | Yes |
```

Docs guide: https://docusaurus.io/docs/create-doc

### Example: NestJS API docs page (MDX with a live example)

**`docs/docs/api/users-endpoint.mdx`:**

```mdx
---
title: Users Endpoint
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `GET /users`

Returns a paginated list of users.

<Tabs>
  <TabItem value="curl" label="cURL" default>

\`\`\`bash
curl https://api.example.com/users?page=1
\`\`\`

  </TabItem>
  <TabItem value="response" label="Response">

\`\`\`json
{
  "data": [{ "id": 1, "name": "Jane Doe" }],
  "page": 1,
  "total": 42
}
\`\`\`

  </TabItem>
</Tabs>
```

MDX reference: https://docusaurus.io/docs/markdown-features/react
Tabs component: https://docusaurus.io/docs/markdown-features/tabs

---

## 7. Sidebar, menus, and folders — precise steps

There are two ways to control the sidebar. **Pick one approach per sidebar** (don't mix) — autogenerated is the default and the recommended starting point.

### 7.1 Autogenerated sidebar (default, zero maintenance)

Out of the box, `docs/sidebars.ts` looks like this:

```ts
const sidebars: SidebarsConfig = {
  docsSidebar: [{ type: 'autogenerated', dirName: '.' }],
};
export default sidebars;
```

With this in place, **the sidebar mirrors your folder structure under `docs/docs/` automatically** — you never edit `sidebars.ts` again. To add content:

- **New page** → add a `.md`/`.mdx` file anywhere under `docs/docs/`. It appears in the sidebar automatically using its filename (or `title` frontmatter) as the label.
- **New folder/menu section** → create a subfolder under `docs/docs/`, e.g. `docs/docs/api/`. Docusaurus turns it into a collapsible category automatically, labeled from the folder name.
- **Control ordering** — two ways:
  - Add `sidebar_position: N` to each page's frontmatter (lower number = higher in the list):
    ```md
    ---
    sidebar_position: 1
    title: Getting Started
    ---
    ```
  - Or prefix filenames/folders with numbers, e.g. `01-getting-started.md`, `02-configuration.md`, `03-api/` — Docusaurus strips the number prefix from the displayed label.
- **Set a folder's category label/description explicitly** — add a `_category_.json` file inside the folder:
  ```json
  // docs/docs/api/_category_.json
  {
    "label": "API Reference",
    "position": 2,
    "link": {
      "type": "generated-index",
      "description": "Endpoints exposed by this service."
    }
  }
  ```
- **Hide a page from the sidebar** without deleting it, in its frontmatter:
  ```md
  ---
  sidebar_class_name: hidden
  ---
  ```
  or exclude via `dirName`/glob rules — see https://docusaurus.io/docs/sidebar/autogenerated

Reference: https://docusaurus.io/docs/sidebar/autogenerated

### 7.2 Manual sidebar (explicit control over labels, order, nesting)

Switch to this only if you need custom ordering/labels the autogenerated rules can't express (e.g. cross-linking pages from different folders into one menu). Replace the contents of `docs/sidebars.ts`:

```ts
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'getting-started',              // → docs/docs/getting-started.md
    {
      type: 'category',
      label: 'API Reference',       // menu heading shown in the sidebar
      items: [
        'api/users-endpoint',       // → docs/docs/api/users-endpoint.mdx
        'api/auth-endpoint',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        {
          type: 'category',
          label: 'Deployment',      // nested sub-menu
          items: ['guides/deploy/github-pages', 'guides/deploy/vercel'],
        },
      ],
    },
  ],
};
export default sidebars;
```

Rules:
- Each string is the document's **id** — by default that's its file path relative to `docs/docs/`, without the extension (a page can override its id with `id:` in frontmatter).
- `type: 'category'` creates a collapsible menu section; nest categories inside `items` for sub-menus.
- Adding a new page to a manual sidebar requires **two steps**: (1) create the `.md` file, (2) add its id to `sidebars.ts` — unlike the autogenerated approach, it will **not** appear until you do both.

Reference: https://docusaurus.io/docs/sidebar

### 7.3 Top navbar (site-wide menu, not the docs sidebar)

To add links/dropdowns to the top navigation bar (separate from the left docs sidebar), edit `themeConfig.navbar` in `docusaurus.config.ts`:

```ts
themeConfig: {
  navbar: {
    title: 'PDP Frontend Docs',
    items: [
      { type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs' },
      { to: '/blog', label: 'Blog', position: 'left' },
      { href: 'https://github.com/your-org/pdp-frontend', label: 'GitHub', position: 'right' },
    ],
  },
},
```

Reference: https://docusaurus.io/docs/api/themes/configuration#navbar

### 7.4 Multiple independent sidebars (e.g. "Docs" vs "API Reference" as separate sections)

Define more than one key in `sidebars.ts` (e.g. `docsSidebar` and `apiSidebar`), then point each docs plugin instance or `docSidebar` navbar item at the relevant key. Needed only if a repo's docs are large enough to split into separate top-level sections — see https://docusaurus.io/docs/sidebar/multiple-sidebars

---

## 8. Auto-generating API docs (NestJS)

For NestJS projects with Swagger/OpenAPI already set up, use the community plugin to pull OpenAPI specs directly into Docusaurus instead of hand-writing endpoint docs:

```bash
npm install docusaurus-plugin-openapi-docs docusaurus-theme-openapi-docs --save
```

Plugin docs: https://docusaurus.io/community/resources (search "OpenAPI") and plugin repo: https://github.com/PaloAltoNetworks/docusaurus-openapi-docs

This is optional — start with hand-written Markdown first, add this once the docs site is established.

---

## 9. Deployment

### 9.1 URL structure: subdomain (`docs.app.com`) vs. path (`app.com/docs`)

**Recommendation: use a subdomain (`docs.app.com`).** Reasoning:

| | Subdomain — `docs.app.com` | Path — `app.com/docs` |
|---|---|---|
| Deployment | Fully independent — its own static hosting target (GitHub Pages / Vercel / Netlify project), separate CI, separate rollback | Coupled to the main app's hosting — needs the app's reverse proxy/rewrite rules to route `/docs/*` to the Docusaurus build |
| Docusaurus config | `baseUrl: '/'` — the default, best-supported case | `baseUrl: '/docs/'` — every asset path, sidebar link, and search index must respect the prefix; more edge cases |
| Setup cost | One-time DNS `CNAME` record | Proxy/rewrite config per app, redone if the app's hosting changes |
| Shared auth/session with the app | No (different origin — plan for it only if docs must be gated behind app login) | Yes, same origin |
| Fits "many separate Node repos" (our case) | Yes — each repo's docs deploy independently, no coordination with a central proxy | Only clean in a single monorepo with one shared proxy layer |

Use path-based only if a specific docs site must share session/auth with its app. Otherwise, default every repo to a subdomain — it's simpler to deploy and matches Docusaurus's best-supported configuration. Reference on `baseUrl` and URL structure: https://docusaurus.io/docs/api/docusaurus-config#baseUrl and https://docusaurus.io/docs/deployment#deploying-to-a-subdomain

For the subdomain approach, `docusaurus.config.ts` should look like:

```ts
const config: Config = {
  url: 'https://docs.your-app.com',
  baseUrl: '/',
  // ...
};
```

### 9.2 Build

Every host below deploys the same static output:

```bash
npm --prefix docs run build   # outputs to docs/build — plain static HTML/CSS/JS
npm --prefix docs run serve   # preview the production build locally before deploying
```

Full deployment guide: https://docusaurus.io/docs/deployment

### 9.3 GitHub Pages

Set in `docusaurus.config.ts` (only needed if you deploy to `<org>.github.io/<repo>` instead of a custom subdomain — with a custom subdomain, keep `baseUrl: '/'` as above):

```ts
organizationName: 'your-org',
projectName: 'pdp-frontend',
```

GitHub Actions workflow — build on push to `main`, publish to the `gh-pages` branch:

```yaml
# .github/workflows/docs.yml
name: Deploy Docs
on:
  push:
    branches: [main]
    paths: ['docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm --prefix docs ci
      - run: npm --prefix docs run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/build
```

Then in the repo's **Settings → Pages**, set the source to the `gh-pages` branch. To use a custom subdomain (`docs.app.com`) instead of `<org>.github.io/<repo>`: add a `docs/static/CNAME` file containing `docs.app.com`, and add a DNS `CNAME` record pointing `docs.app.com` → `<org>.github.io`.

Reference: https://docusaurus.io/docs/deployment#deploying-to-github-pages and https://docusaurus.io/docs/deployment#triggering-deployment-with-github-actions

### 9.4 Vercel

No YAML needed — Vercel auto-deploys on push once connected.

1. Import the repo at https://vercel.com/new
2. Set **Root Directory** to `docs` (Project Settings → General → Root Directory) since Docusaurus lives in a subfolder, not the repo root
3. Framework preset: Vercel auto-detects Docusaurus. If not, set manually:
   - Build command: `npm run build`
   - Output directory: `build`
4. Every push to `main` deploys to production; every PR gets a free preview URL automatically
5. Add the custom subdomain in **Project Settings → Domains** → add `docs.app.com`, then add the CNAME record Vercel shows you at your DNS provider

Reference: https://docusaurus.io/docs/deployment#deploying-to-vercel

### 9.5 Netlify

1. Import the repo at https://app.netlify.com/start
2. Set **Base directory** to `docs`
3. Build command: `npm run build`
4. Publish directory: `docs/build` (relative to repo root) or `build` (if base directory is already `docs`)
5. Add custom subdomain in **Site settings → Domain management** → add `docs.app.com`, then add the CNAME Netlify shows you at your DNS provider

Alternatively, a `docs/netlify.toml` checked into the repo avoids configuring the dashboard by hand:

```toml
[build]
  base = "docs"
  command = "npm run build"
  publish = "build"
```

Reference: https://docusaurus.io/docs/deployment#deploying-to-netlify

### 9.6 Self-hosted / static file server

Since the build output is plain static files, it can be served by any static file server or CDN (nginx, S3+CloudFront, internal infra) — just point it at `docs/build` after running the build step in §9.2. No Node runtime needed at serve time, only at build time.

---

## 10. Search

Two free options:

1. **Algolia DocSearch** — free for public/open-source docs sites, hosted by Algolia. Apply at https://docsearch.algolia.com/apply/, setup guide: https://docusaurus.io/docs/search#using-algolia-docsearch
2. **Local search plugin** (self-hosted, works for private/internal docs too): https://docusaurus.io/docs/search#local-search

For internal/private repos, use the local search plugin (`@easyops-cn/docusaurus-search-local`) since Algolia DocSearch requires the content to be publicly crawlable.

---

## 11. Quick checklist for onboarding a new repo

- [ ] `npx create-docusaurus@latest docs classic --typescript` at repo root
- [ ] Update `docusaurus.config.ts` (title, org, project name, editUrl)
- [ ] Add `docs:dev` / `docs:build` scripts to root `package.json`
- [ ] Add build artifacts to `.gitignore`
- [ ] Write first page: `docs/docs/getting-started.md`
- [ ] Set up sidebar (autogenerated is fine to start)
- [ ] Pick a deployment target and wire up CI
- [ ] (Optional) add local search plugin for private repos

---

## Official resource index

| Topic | Link |
|---|---|
| Docs home | https://docusaurus.io/docs |
| Installation | https://docusaurus.io/docs/installation |
| Configuration | https://docusaurus.io/docs/api/docusaurus-config |
| Markdown features | https://docusaurus.io/docs/markdown-features |
| MDX / React in docs | https://docusaurus.io/docs/markdown-features/react |
| Sidebar | https://docusaurus.io/docs/sidebar |
| Versioning | https://docusaurus.io/docs/versioning |
| i18n | https://docusaurus.io/docs/i18n/introduction |
| Deployment | https://docusaurus.io/docs/deployment |
| Search | https://docusaurus.io/docs/search |
| Plugins | https://docusaurus.io/docs/api/plugins |
| GitHub repo | https://github.com/facebook/docusaurus |
