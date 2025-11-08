# Multi-stage build for Douglas Mo Digital Twin
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY public ./public
COPY next.config.js ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Build Next.js application
RUN npm run build

# Stage 2: MCP Server Build
FROM node:18-alpine AS mcp-builder

WORKDIR /mcp

# Copy MCP server files
COPY claude-mcp-server/package*.json ./
COPY claude-mcp-server/tsconfig.json ./
RUN npm ci

COPY claude-mcp-server/index.ts ./
COPY lib ../lib/
COPY digitaltwin.json ../

# Build MCP server
RUN npx tsc

# Stage 3: Production Runtime
FROM node:18-alpine AS runner

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --production

# Copy built Next.js app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Copy MCP server
COPY --from=mcp-builder /mcp/dist /app/mcp-server/
COPY --from=mcp-builder /mcp/node_modules /app/mcp-server/node_modules
COPY digitaltwin.json ./

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose ports
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start application
CMD ["npm", "start"]
