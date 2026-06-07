FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod

ENV CI=true

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml /app/
RUN pnpm fetch

COPY . /app
RUN pnpm install -r --offline
RUN pnpm run build
RUN pnpm prune --prod

FROM base

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=prod --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=prod --chown=hono:nodejs /app/dist /app/dist

ENV PORT=8000

EXPOSE $PORT
CMD [ "node", "/app/dist/index.js" ]