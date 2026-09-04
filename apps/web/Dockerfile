# ──────────────────────────────────────────────
# Groww Pulse — Web Dockerfile (Multi-stage)
# ──────────────────────────────────────────────

# ── Base ──
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# ── Development ──
FROM base AS development
RUN npm install
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
EXPOSE 5173
CMD ["npm", "run", "dev", "--workspace=apps/web", "--", "--host", "0.0.0.0"]

# ── Build ──
FROM base AS build
RUN npm install
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=${VITE_API_URL}
RUN cd apps/web && npm run build

# ── Production (serve with nginx) ──
FROM nginx:alpine AS production
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
