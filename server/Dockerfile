FROM --platform=$BUILDPLATFORM node:lts-slim AS base
WORKDIR /usr/src/app

COPY server .
COPY contractData ../contractData
COPY ../contractData .
RUN npm i -g bun && bun -v
RUN apt update && apt install -y curl
COPY server/db-cert.crt /usr/local/share/ca-certificates/db-cert.crt
RUN update-ca-certificates

FROM base AS all-deps
RUN bun install

FROM base AS prod-deps
RUN bun install --production
RUN curl -LO --silent https://indexsupply.net/bin/1.6/linux/amd64/shovel
RUN chmod +x shovel

FROM all-deps AS build
ENV NODE_ENV=production

FROM base AS runtime
COPY --from=base /usr/src/app/src src
COPY --from=base /usr/src/app/config.json .
COPY --from=base /usr/src/contractData ../contractData
COPY --from=base /usr/src/app/shovel-config.ts .
COPY --from=base /usr/src/app/package.json .
COPY --from=prod-deps /usr/src/app/node_modules node_modules
COPY --from=prod-deps /usr/src/app/shovel shovel

COPY server/db-cert.crt /usr/local/share/ca-certificates/db-cert.crt
RUN update-ca-certificates

# run the app
USER bun
EXPOSE 8712/tcp
# TODO remove when the db cert is working correctly
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENTRYPOINT [ "bun", "run", "start" ]
