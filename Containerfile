FROM docker.io/oven/bun:1.4.2-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM docker.io/nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY scripts/configure-oauth.sh /docker-entrypoint.d/40-configure-oauth.sh
RUN chmod +x /docker-entrypoint.d/40-configure-oauth.sh
EXPOSE 80
