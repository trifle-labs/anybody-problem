// Backward-compatible re-export.
//
// Earlier versions of this library exposed a flat `ANYBODY_DEFAULTS` object
// and a `validateConfig` helper. The schema is now richer (see schema.js)
// and presets live in presets/. This file is kept so existing imports keep
// working while you migrate.
//
// New code should import from './schema.js' (defineGame) or pick a preset
// from './presets/'.

export { defineGame } from './schema.js'
export { anybody as ANYBODY_DEFAULTS } from './presets/anybody.js'
