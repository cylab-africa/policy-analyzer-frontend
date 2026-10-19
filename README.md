# 🌍 Policy Analyzer Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Project Overview

A modern, interactive web application for analyzing and comparing data protection and digital identity policies across Africa. Built with cutting-edge web technologies to provide policymakers, implementers, and researchers with comprehensive policy insights.

### Current Status
 
| Aspect           | Status             |
| ---------------- | ------------------ |
| **Version**      | 0.1.0              |
| **Stage**        | Active Development |
| **Last Updated** | January 2026       |

### Key Features

- **Interactive Maps**: Visualize data protection legislation and digital ID systems across African countries
- **Policy Chat**: AI-powered chatbot for law/policy inquiries and real-time analysis
- **Resource Center**: Comprehensive law/policy documentation and educational materials
- **Modern UI/UX**: Responsive design with glass morphism effects and smooth animations

---

## 🚀 Build and Run Locally

### Prerequisites

| Requirement | Version |
| ----------- | ------- |
| **Node.js** | 18+     |
| **npm**     | 8+      |

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/cylab-africa/pdp-frontend.git
cd pdp-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration (see Environment Variables section)

# 4. Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start development server with Turbopack |
| `npm run build` | Build production bundle                 |
| `npm start`     | Start production server                 |
| `npm run lint`  | Run ESLint for code quality checks      |

---

## 🐳 Deployment

### Docker Deployment

The project includes a multi-stage Dockerfile optimized for production.

```bash
# Build the Docker image
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://your-api-url.com/api \
  --build-arg NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key \
  --build-arg NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com \
  --build-arg NEXT_PUBLIC_API_KEY=your-api-key \
  -t policy-analyzer-frontend:latest .

# Run the container
docker run -p 3000:3000 policy-analyzer-frontend:latest
```

### Build Arguments for Docker

| Argument                   | Required | Description                   |
| -------------------------- | -------- | ----------------------------- |
| `NEXT_PUBLIC_API_URL`      | Yes      | Backend API endpoint URL      |
| `NEXT_PUBLIC_API_KEY`      | Yes      | API authentication key        |
| `NEXT_PUBLIC_POSTHOG_KEY`  | No       | PostHog analytics project key |
| `NEXT_PUBLIC_POSTHOG_HOST` | No       | PostHog ingestion host URL    |

### Kubernetes / Container Orchestration

The Docker image exposes port `3000` and runs as a non-root user (`nextjs:1001`) for security. It can be deployed to any container orchestration platform:

```yaml
# Example Kubernetes deployment snippet
apiVersion: apps/v1
kind: Deployment
metadata:
    name: policy-analyzer-frontend
spec:
    replicas: 2
    template:
        spec:
            containers:
                - name: frontend
                  image: policy-analyzer-frontend:latest
                  ports:
                      - containerPort: 3000
                  resources:
                      requests:
                          memory: "256Mi"
                          cpu: "100m"
                      limits:
                          memory: "512Mi"
                          cpu: "500m"

### CI/CD Integration

This project is designed to be easily integrated into any CI/CD pipeline (GitHub Actions, GitLab CI, Jenkins, etc.).

**Typical Pipeline Stages:**
1.  **Lint & Test**: Run `npm run lint` and unit tests.
2.  **Build**: Build the Docker image using the provided `Dockerfile`.
3.  **Push**: Push the image to a container registry (Docker Hub, ECR, GCR).
4.  **Deploy**: Update the orchestration platform (Kubernetes, ECS, etc.) with the new image tag.
```

---

## ⚙️ Configuration and Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable                   | Required | Description                                      | Example                     |
| -------------------------- | -------- | ------------------------------------------------ | --------------------------- |
| `NEXT_PUBLIC_API_URL`      | Yes      | Backend API base URL                             | `http://localhost:8000/api` |
| `NEXT_PUBLIC_API_KEY`      | Yes      | API key for backend authentication               | `your-api-key-here`         |
| `NEXT_PUBLIC_POSTHOG_KEY`  | No       | PostHog project API key for analytics            | `phc_xxxxx`                 |
| `NEXT_PUBLIC_POSTHOG_HOST` | No       | PostHog ingestion endpoint                       | `https://us.i.posthog.com`  |
| `NEXT_PUBLIC_APP_VERSION`  | No       | Application version displayed in UI              | `1.0.0`                     |
| `NODE_ENV`                 | No       | Environment mode (`development` or `production`) | `production`                |

> **Note**: All `NEXT_PUBLIC_*` variables are exposed to the browser. Never put sensitive secrets in these variables.

---

## 📦 Dependencies and External Integrations

### Core Technologies

| Technology    | Version | Purpose                         |
| ------------- | ------- | ------------------------------- |
| Next.js       | 15.5.7  | React framework with App Router |
| React         | 19.2.3  | UI library                      |
| TypeScript    | 5.x     | Type-safe development           |
| Tailwind CSS  | 4.x     | Utility-first CSS framework     |
| Redux Toolkit | 2.8.2   | State management                |

### External Integrations

| Service         | Purpose                                      | Required |
| --------------- | -------------------------------------------- | -------- |
| **Backend API** | Policy data, chat functionality, user auth   | Yes      |
| **PostHog**     | Product analytics and user behavior tracking | No       |

### Key Dependencies

- **UI Components**: Radix UI primitives (Dialog, Tabs, Select, etc.)
- **Mapping**: `react-simple-maps` for interactive Africa map visualization
- **Notifications**: `sonner` for toast notifications
- **Markdown**: `react-markdown` with `remark-gfm` for content rendering

---

## 📁 Project Structure

```
policy-analyzer-frontend/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable UI components
│   ├── data/          # Static data and configurations
│   ├── lib/           # Utility functions
│   ├── redux/         # Redux store and slices
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
├── docs/              # Project documentation
├── Dockerfile         # Production Docker configuration
└── package.json       # Project dependencies and scripts
```

---

## ⚠️ Known Limitations and Operational Considerations

### Current Limitations

1. **Backend Dependency**: The application requires the Policy Analyzer backend API to be running for full functionality
2. **Browser Compatibility**: Optimized for modern browsers (Chrome, Firefox, Safari, Edge). IE11 is not supported
3. **Map Data**: Africa country boundary data is bundled statically; updates require a new deployment

### Operational Considerations

- **Memory**: The application may consume significant memory when rendering large map datasets
- **API Rate Limiting**: Consider implementing request throttling if the backend has rate limits
- **Analytics**: PostHog integration is optional but recommended for production monitoring
- **CORS**: Ensure the backend API allows requests from the frontend domain

### Health Checks

The application is considered healthy when:

- The Next.js server responds on port 3000
- The backend API is reachable at the configured `NEXT_PUBLIC_API_URL`

---

## 📚 Additional Documentation

- [Functional Requirements](./docs/functional-requirements.md)
- [Non-Functional Requirements](./docs/nonfunctional-req.md)
- [User Stories](./docs/user-story.md)
- [Feature Recommendations](./docs/feature-recommendations.md)

---

## 🛠️ Troubleshooting

### Common Issues

| Issue                     | Solution                                              |
| ------------------------- | ----------------------------------------------------- |
| `npm install` fails       | Try `npm ci --legacy-peer-deps`                       |
| API connection errors     | Verify `NEXT_PUBLIC_API_URL` is correct and reachable |
| Build fails on TypeScript | Run `npm run lint` to identify type errors            |
| Docker build fails        | Ensure all build args are provided                    |

---

## 👥 Team and Support

For questions or issues:

- Create an issue in the repository
- Contact the development team

---

_Last updated: January 2026_
