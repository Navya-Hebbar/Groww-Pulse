# ──────────────────────────────────────────────
# Groww Pulse — API Dockerfile (Multi-stage)
# ──────────────────────────────────────────────

# ── Base ──
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY prisma/ ./prisma/

# ── Development ──
FROM base AS development
RUN npm install
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
RUN npx prisma generate --schema=prisma/schema.prisma
EXPOSE 3001
CMD ["npx", "tsx", "watch", "apps/api/src/server.ts"]

# ── Build ──
FROM base AS build
RUN npm install
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
RUN npx prisma generate --schema=prisma/schema.prisma
RUN cd apps/api && npx tsc

# ── Production ──
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/apps/api/package.json ./apps/api/
COPY --from=build /app/packages/shared/package.json ./packages/shared/
COPY --from=build /app/prisma/ ./prisma/
RUN npm install --omit=dev
RUN npx prisma generate --schema=prisma/schema.prisma
COPY --from=build /app/apps/api/dist/ ./apps/api/dist/
COPY --from=build /app/packages/shared/dist/ ./packages/shared/dist/
EXPOSE 3001
CMD ["node", "apps/api/dist/server.js"]
