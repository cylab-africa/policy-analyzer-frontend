# Policy Analyzer: Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

The web app for the Policy Analyzer, a tool for exploring and comparing data protection and digital identity policy across Africa. It is built for policymakers, implementers and researchers.

- **Country maps and statistics**: data protection legislation and digital identity systems across African countries.
- **Chat**: questions answered from a collection of policy documents, plus batch analysis of question sets.
- **Sources**: reference documents and research for each country.
- **Documentation** (`/docs`): what the tool does, how it was built and produces results, and how to run or extend your own instance.

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

**You need:** [Node.js](https://nodejs.org/) 22 or newer (22 LTS is fine) and Git.

```bash
# 1. Clone and install
git clone https://github.com/cylab-africa/policy-analyzer-frontend.git
cd policy-analyzer-frontend
npm install

# 2. Configure
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
```

In `.env`, set `BACKEND_API_KEY` to the same value as `API_KEY` in the backend's `.env`. The default `BACKEND_API_URL` (`http://localhost:8000/api`) matches a local backend.

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

The backend URL and API key are read when the container starts, so nothing secret is built into the image.

```bash
docker build -t policy-analyzer-frontend .

docker run -d --name policy-analyzer-frontend -p 3000:3000 \
  -e BACKEND_API_URL=http://host.docker.internal:8000/api \
  -e BACKEND_API_KEY=your-backend-api-key \
  policy-analyzer-frontend
```

The backend is called by the website's server (the container), not by the visitor's browser. Inside a container, `localhost` is the container itself, so use `host.docker.internal` for a backend on the same machine, a container name on a shared Docker network, or the backend's URL for a deployment.

---

## Configuration

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `BACKEND_API_URL` | No | Backend API base URL, including `/api`. Defaults to `http://localhost:8000/api` | `http://localhost:8000/api` |
| `BACKEND_API_KEY` | Yes | Must match the backend's `API_KEY` | |

Both are server-side variables, read when the app starts. The browser never sees them: it calls the website's own `/api/backend/...` route, and that route forwards the request to the backend with the key attached. Do not give these variables a `NEXT_PUBLIC_` prefix, because that would send them to every visitor.

The proxy only forwards the backend routes the website uses, but it does not identify visitors: anyone who can load the site can use it. See the backend README's notes on [exposing an instance publicly](https://github.com/cylab-africa/policy-analyzer-backend#before-exposing-an-instance-publicly).

**Rate limits per visitor.** The proxy passes each visitor's address to the backend in an `X-Client-IP` header (taken from the last `X-Forwarded-For` entry, so run the site behind a reverse proxy that sets it). The backend believes that header only for requests from an address listed in its `TRUSTED_PROXY_IPS` setting, so set that to this server's address as the backend sees it. Until you do, every visitor shares one rate limit.

The app includes no analytics or tracking, and sends no data anywhere except to your backend.

---

## Deployment

The Docker image is a multi-stage build that runs as a non-root user (`nextjs`, UID 1001) and serves on port `3000`. It runs on any container platform (a VM with Docker, Kubernetes, ECS, Cloud Run and others):

1. Build the image (see [Running with Docker](#running-with-docker)). No secrets are needed at build time.
2. Push it to your container registry.
3. Run it with `BACKEND_API_URL` and `BACKEND_API_KEY` set, behind HTTPS, and route traffic to port 3000.
4. Make sure the backend accepts requests from the frontend's server. CORS no longer matters, because the browser only talks to the website itself.

Example Kubernetes container spec:

```yaml
containers:
  - name: frontend
    image: your-registry/policy-analyzer-frontend:latest
    ports:
      - containerPort: 3000
    env:
      - name: BACKEND_API_URL
        value: https://your-backend.example.org/api
      - name: BACKEND_API_KEY
        valueFrom:
          secretKeyRef: { name: policy-analyzer, key: backend-api-key }
    resources:
      requests: { memory: "256Mi", cpu: "100m" }
      limits: { memory: "512Mi", cpu: "500m" }
```

Without Docker: `npm ci && npm run build && npm start`, with `BACKEND_API_URL` and `BACKEND_API_KEY` set in the environment when you start the app.

### Updating a deployed frontend

- **Configuration is read at start-up.** Docker ignores `.env` files (see `.dockerignore`), so pass `BACKEND_API_URL` and `BACKEND_API_KEY` with `-e` (or `--env-file` pointing at a file outside the repository) when you start the container. Changing them does not need a rebuild.

- **Building an image does not change a running container.** Remove the old container and start a new one from the new image.
- **Behind a reverse proxy in Docker?** If the proxy reaches the frontend by name, start the new container with the same `--name` and on the same Docker network (`--network <proxy network>`), then restart the proxy. A container started without the network flag works on its own but the proxy cannot reach it, and the site shows `502`.
- **Keep the previous image** (note its ID with `docker ps`) until the new one is confirmed working, so you can roll back. Do not run `docker image prune` before then.
- **Changing the API key?** Follow [Rotating the API key](https://github.com/cylab-africa/policy-analyzer-backend#rotating-the-api-key) in the backend README, because both sides must change together.
- **`permission denied` on the Docker socket?** Run the Docker commands with `sudo`, or add your user to the `docker` group.

---

## Project structure

```
├── src/
│   ├── app/           # Pages (App Router): /, /chat, /resources, /docs
│   ├── components/    # UI components by feature (home, chat, resources, docs, layout, ui)
│   ├── data/          # Static map geometry and data
│   ├── lib/           # Utilities
│   ├── redux/         # API client (RTK Query) and store
│   └── types/         # TypeScript types
├── public/            # Static assets
├── docs/              # Requirements and user stories
└── Dockerfile
```

Further reading: [functional requirements](./docs/functional-requirements.md), [non-functional requirements](./docs/nonfunctional-req.md) and [user stories](./docs/user-story.md).

---

## Editing the documentation page

The `/docs` page is built from components in [`src/components/docs/`](src/components/docs/), with one file per section in `sections/`. Section and sub-section titles are defined once in [`meta.ts`](src/components/docs/meta.ts), and the table of contents and in-page links are built from them. To add a section, add its titles to `meta.ts`, create the component, and list it in `sections/index.ts`. Shared building blocks (`DocSection`, `DocSubsection`, `P`, `UL`, `DocTable` and others) are in `primitives.tsx`.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Maps and Sources are empty | Check the backend is running and its reference data is loaded (backend README, Quick start step 5) |
| `401`/`403` errors in the browser console | `BACKEND_API_KEY` doesn't match the backend's `API_KEY` |
| Changed `.env` but nothing happened | Restart `npm run dev`. For Docker, `.env` is ignored: pass the values with `-e` when you start the container ([Updating a deployed frontend](#updating-a-deployed-frontend)) |
| `502 Bad Gateway` after replacing the container | The new container is not on the proxy's Docker network or has a different name. Start it with the same `--name` and `--network` as before, then restart the proxy |
| `npm install` reports `ERESOLVE` | Make sure `.npmrc` (with `legacy-peer-deps=true`) is present; `react-simple-maps` declares peer support only up to React 18 |
| `500` or `502` from `/api/backend/...` | `BACKEND_API_KEY` is not set (500), or the website's server cannot reach `BACKEND_API_URL` (502). In Docker, `localhost` is the container itself |

---

## License

Released under the [MIT License](LICENSE).

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first, and note that everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md). To report a security problem, follow [SECURITY.md](SECURITY.md) instead of opening a public issue. If you use this software in your work, see [CITATION.cff](CITATION.cff).
