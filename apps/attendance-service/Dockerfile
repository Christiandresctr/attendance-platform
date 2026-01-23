# =============================
# Etapa 1: Build
# =============================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./          
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm run build

# =============================
# Etapa 2: Producción
# =============================
FROM node:20-alpine AS production
WORKDIR /app

COPY package.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY --from=builder /app/dist ./dist

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --spider http://localhost:3001/health || exit 1

CMD ["node", "dist/main.js"]