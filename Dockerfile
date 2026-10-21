# Official ActionGuard.ai MCP Server Dockerfile for Glama & Container Runtimes
FROM node:22-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm@9.15.4

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/core/package.json ./packages/core/
COPY packages/cli/package.json ./packages/cli/
COPY apps/worker/package.json ./apps/worker/
COPY tsconfig.base.json ./

RUN pnpm install --frozen-lockfile

COPY packages/ ./packages/
COPY apps/ ./apps/

RUN pnpm --filter "@actionguard/*" build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/core/package.json ./packages/core/package.json
COPY --from=builder /app/packages/cli/dist ./packages/cli/dist
COPY --from=builder /app/packages/cli/package.json ./packages/cli/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY server.json ./

ENTRYPOINT ["node", "/app/packages/cli/dist/index.js", "mcp"]
