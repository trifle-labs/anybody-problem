# # use the official Bun image
# # see all versions at https://hub.docker.com/r/oven/bun/tags
# FROM oven/bun:1.1.9-alpine as base
# RUN apk --no-cache add python3 postgresql
# WORKDIR /usr/src/app

# # install dependencies into temp directory
# # this will cache them and speed up future builds
# FROM base AS install
# RUN mkdir -p /temp/dev
# COPY package.json bun.lockb src /temp/dev/
# RUN cd /temp/dev && bun install --frozen-lockfile

# # install with --production (exclude devDependencies)
# RUN mkdir -p /temp/prod
# COPY package.json bun.lockb /temp/prod/
# RUN cd /temp/prod && bun install --frozen-lockfile --production

# # copy node_modules from temp directory
# # then copy all (non-ignored) project files into the image
# FROM base AS prerelease
# COPY --from=install /temp/dev/node_modules node_modules
# COPY . .

# # [optional] tests & build
# ENV NODE_ENV=production
# # RUN bun test
# # RUN bun run build

# # copy production dependencies and source code into final image
# FROM base AS release
# COPY --from=install /temp/prod/node_modules node_modules
# COPY --from=prerelease /usr/src/app/src .
# COPY --from=prerelease /usr/src/app/package.json .
# RUN curl -LO --silent https://indexsupply.net/bin/1.6/linux/arm64/shovel
# RUN chmod +x shovel

# # run the app
# USER bun
# EXPOSE 8712/tcp
# ENTRYPOINT [ "bun", "run", "src/index.ts" ]


FROM --platform=$BUILDPLATFORM node:lts-slim AS base
WORKDIR /usr/src/app

COPY server .
COPY contractData ../contractData
COPY ../contractData .
RUN npm i -g bun
RUN apt update && apt install -y ca-certificates curl

FROM base AS all-deps
RUN bun install

FROM base AS prod-deps
RUN bun install --production
RUN curl -LO --silent https://indexsupply.net/bin/1.6/linux/amd64/shovel
RUN chmod +x shovel
RUN OUTPUT=1 bun run shovel-config.ts > config.json

FROM all-deps AS build
ENV NODE_ENV=production

FROM oven/bun:alpine AS runtime
COPY --from=prod-deps /usr/src/app/src src
COPY --from=prod-deps /usr/src/app/config.json .
COPY --from=prod-deps /usr/src/contractData ../contractData
COPY --from=prod-deps /usr/src/app/shovel-config.ts .
COPY --from=prod-deps /usr/src/app/package.json .
COPY --from=prod-deps /usr/src/app/node_modules node_modules
COPY --from=prod-deps /usr/src/app/shovel shovel

# run the app
USER bun
EXPOSE 8712/tcp
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENTRYPOINT [ "bun", "run", "start" ]
