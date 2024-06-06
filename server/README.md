# Anybody Problem API

blockchains => shovel => postgres => read-only api => app

## Install

1. bun: install bun then `bun install`
2. postgres: `brew install postgresql@15`
3. [shovel](https://www.indexsupply.com/shovel/docs/#install): `curl -LO https://indexsupply.net/bin/1.6/darwin/arm64/shovel && chmod +x shovel`

## Run shovel

blockchains => shovel => postgres

`bun run shovel`

## Run api

postgres => read-only api => app

`bun run dev`
