FROM oven/bun:1.0 AS base
WORKDIR /app
COPY package.json bun.lockb ./

FROM base AS development
RUN ["bun", "install"]
COPY . .
CMD ["bun", "run", "dev"]

FROM base AS build
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.0-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/bun.lockb ./
RUN bun install --production --frozen-lockfile
EXPOSE 5173
CMD ["bun", "run", "start"]