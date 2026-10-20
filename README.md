# Policy Analyzer: Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

The web app for the Policy Analyzer, a tool for exploring and comparing data protection and digital identity policy across Africa. It is built for policymakers, implementers and researchers.

- **Country maps and statistics**: data protection legislation and digital identity systems across African countries.
- **Policy Chat**: questions answered from a collection of policy documents, plus batch analysis of question sets.
- **Sources**: reference documents and research for each country.
- **Documentation** (`/docs`): the methodology behind the analysis.

| Repository | Purpose |
| --- | --- |
| [policy-analyzer-frontend](https://github.com/cylab-africa/policy-analyzer-frontend) (this repo) | Next.js web app |
| [policy-analyzer-backend](https://github.com/cylab-africa/policy-analyzer-backend) | Backend API (required) |

## Contents

- [Quick start](#quick-start)
- [Running with Docker](#running-with-docker)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [Editing the documentation page](#editing-the-documentation-page)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Quick start

The frontend needs a running backend for the maps, Sources and chat. Set up the [backend](https://github.com/cylab-africa/policy-analyzer-backend#quick-start-with-docker) first; it takes about 10 minutes with Docker. Then:

**You need:** [Node.js](https://nodejs.org/) 20 LTS or newer (18.18 is the minimum) and Git.

```bash
# 1. Clone and install
git clone https://github.com/cylab-africa/policy-analyzer-frontend.git
cd policy-analyzer-frontend
npm install

# 2. Configure
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
```

In `.env`, set `NEXT_PUBLIC_API_KEY` to the same value as `API_KEY` in the backend's `.env`. The default `NEXT_PUBLIC_API_URL` (`http://localhost:8000/api`) matches a local backend.

```bash
# 3. Start the development server
npm run dev
```

Open <http://localhost:3000>.

| Command | Description |
| --- | --- |
| `npm run dev` | Development server with hot reload (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve the production build on port 3000 |
| `npm run lint` | ESLint |

---

## Running with Docker

`NEXT_PUBLIC_*` values are compiled into the JavaScript bundle at build time, so they are passed as build arguments. Rebuild the image whenever they change.

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000/api \
  --build-arg NEXT_PUBLIC_API_KEY=your-backend-api-key \
  -t policy-analyzer-frontend .

docker run -d --name policy-analyzer-frontend -p 3000:3000 policy-analyzer-frontend
```

The API URL is called from the visitor's browser, not from the container. `http://localhost:8000/api` therefore works when the backend runs on the same machine. For a deployment, use the backend's public URL.

---

## Configuration

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL, including `/api` | `http://localhost:8000/api` |
| `NEXT_PUBLIC_API_KEY` | Yes | Must match the backend's `API_KEY` | |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog project key. Leave unset to disable analytics | `phc_...` |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog ingestion host | `https://us.i.posthog.com` |
| `NEXT_PUBLIC_APP_VERSION` | No | Version reported with analytics events | `1.0.0` |

> **All `NEXT_PUBLIC_*` values are visible to anyone who loads the site**, including `NEXT_PUBLIC_API_KEY`. Do not reuse that key for anything else. See the backend README's notes on [exposing an instance publicly](https://github.com/cylab-africa/policy-analyzer-backend#before-exposing-an-instance-publicly).

Analytics are off unless `NEXT_PUBLIC_POSTHOG_KEY` is set, so forks and local installs send no data anywhere.

---

## Deployment

The Docker image is a multi-stage build that runs as a non-root user (`nextjs`, UID 1001) and serves on port `3000`. It runs on any container platform (a VM with Docker, Kubernetes, ECS, Cloud Run and others):

1. Build the image with your production build arguments (see [Running with Docker](#running-with-docker)).
2. Push it to your container registry.
3. Run it behind HTTPS and route traffic to port 3000.
4. Make sure the backend allows requests from the frontend's domain (CORS).

Example Kubernetes container spec:

```yaml
containers:
  - name: frontend
    image: your-registry/policy-analyzer-frontend:latest
    ports:
      - containerPort: 3000
    resources:
      requests: { memory: "256Mi", cpu: "100m" }
      limits: { memory: "512Mi", cpu: "500m" }
```

Without Docker: `npm ci && npm run build && npm start`, with the `NEXT_PUBLIC_*` variables set in the environment at build time.

---

## Project structure

```
├── src/
│   ├── app/           # Pages (App Router): /, /chat, /resources, /docs
│   ├── components/    # UI components by feature (home, chat, resources, docs, layout, ui)
│   ├── content/       # Documentation page text (Markdown)
│   ├── data/          # Static map geometry and data
│   ├── lib/           # Utilities and analytics events
│   ├── redux/         # API client (RTK Query) and store
│   └── types/         # TypeScript types
├── public/            # Static assets
├── docs/              # Requirements and user stories
└── Dockerfile
```

Further reading: [functional requirements](./docs/functional-requirements.md), [non-functional requirements](./docs/nonfunctional-req.md) and [user stories](./docs/user-story.md).

---

## Editing the documentation page

The text of the `/docs` page lives in [`src/content/documentation.md`](src/content/documentation.md). Edit the Markdown; no code changes are needed. Each `##` and `###` heading appears automatically in the page's table of contents. The content is read at build time, so rebuild or restart `npm run dev` to see changes.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Maps and Sources are empty | Check the backend is running and its reference data is loaded (backend README, Quick start step 5) |
| `401`/`403` errors in the browser console | `NEXT_PUBLIC_API_KEY` doesn't match the backend's `API_KEY` |
| Changed `.env` but nothing happened | Restart `npm run dev`; for Docker, rebuild the image |
| `npm install` reports `ERESOLVE` | Make sure `.npmrc` (with `legacy-peer-deps=true`) is present; `react-simple-maps` declares peer support only up to React 18 |
| CORS errors | Allow the frontend's origin in the backend |

---

## License

Released under the [MIT License](LICENSE).

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first, and note that everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md). To report a security problem, follow [SECURITY.md](SECURITY.md) instead of opening a public issue. If you use this software in your work, see [CITATION.cff](CITATION.cff).
