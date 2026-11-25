# --- Dependencies ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Install ALL dependencies (including devDependencies like TypeScript)
# Next.js reads next.config.ts at runtime, so TypeScript must be installed
RUN npm ci --legacy-peer-deps && npm cache clean --force

# --- Builder ---
FROM node:22-alpine AS builder
WORKDIR /app

# No backend URL or API key is needed at build time. The server-side proxy reads
# BACKEND_API_URL and BACKEND_API_KEY when the container starts, so the key is never baked
# into the image or the browser bundle.

# Copy package files and install ALL dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# --- Runner ---
FROM node:22-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Set at run time (docker run -e ...): BACKEND_API_URL, BACKEND_API_KEY

# The running app needs only Node. Remove the package managers that come with the base image: they
# are never used here, and the packages bundled inside npm are what image scans report.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
    /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
    /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn-*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy all dependencies with correct ownership
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy built application with correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Copy config files with correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/next.config.* ./

USER nextjs

EXPOSE 3000

# What "npm start" runs, without needing npm
CMD ["node", "node_modules/next/dist/bin/next", "start"]
