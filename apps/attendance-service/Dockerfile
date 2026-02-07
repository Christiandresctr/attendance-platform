# =============================
# Etapa 1: Build
# =============================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/auth-lib/package.json packages/auth-lib/package.json
COPY apps/attendance-service/package.json apps/attendance-service/package.json

RUN npm install -g pnpm
RUN pnpm install

COPY packages/auth-lib packages/auth-lib
COPY apps/attendance-service apps/attendance-service

RUN pnpm --filter @attendance-platform/auth-lib build
RUN pnpm --filter attendance-service build

# =============================
# Etapa 2: Producción
# =============================
FROM node:20-alpine AS production
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/attendance-service/package.json apps/attendance-service/package.json
COPY --from=builder /app/packages/auth-lib /app/packages/auth-lib

RUN npm install -g pnpm
RUN pnpm install --prod --filter attendance-service...

COPY --from=builder /app/apps/attendance-service/dist /app/apps/attendance-service/dist

WORKDIR /app/apps/attendance-service

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --spider http://localhost:3001/health || exit 1

CMD ["node", "dist/main.js"]
