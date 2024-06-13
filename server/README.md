# Anybody Problem API

blockchains => shovel => postgres => read-only api => app

## Install

1. bun: install bun then `bun install`
2. (if bun is hanging try running `bun upgrade --canary`)
3. postgres: `brew install postgresql@15`
4. [shovel](https://www.indexsupply.com/shovel/docs/#install): `curl -LO https://indexsupply.net/bin/1.6/darwin/arm64/shovel && chmod +x shovel`

## Run postgres

```
brew services start postgresql@15
createdb shovel
```

## Env setup

`cp .env.template .env` then fill it in with your database info. `bun` will automatically source `.env` when it runs.

## Run shovel

blockchains => shovel => postgres

`bun run shovel`

## Run api

postgres => read-only api => app

`bun run dev`

## Reset db

```
dropdb shovel
createdb shovel
bun run shovel
```

## Smoke test

After modifying `shovel-config.ts` and running it with `bun run shovel`, use this script as a sanity check.

`bun run smoke`
