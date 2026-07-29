import * as esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')
const entryPoint = path.join(extension, 'src', 'languageFeaturesJsonMain.ts')
const outdir = path.join(extension, 'dist')
const outfile = path.join(outdir, 'languageFeaturesJsonMain.js')
const jsonSchemaContributions = process.env.JSON_SCHEMA_CONTRIBUTIONS || '[]'
const assetPathPrefix = process.env.ASSET_PATH_PREFIX || '../../'
const loadBuiltInJsonSchemas = process.env.LOAD_BUILT_IN_JSON_SCHEMAS || 'true'

fs.rmSync(outdir, { recursive: true, force: true })
fs.mkdirSync(outdir, { recursive: true })

await esbuild.build({
  bundle: true,
  define: {
    ASSET_PATH_PREFIX: JSON.stringify(assetPathPrefix),
    JSON_SCHEMA_CONTRIBUTIONS: jsonSchemaContributions,
    LOAD_BUILT_IN_JSON_SCHEMAS: loadBuiltInJsonSchemas,
  },
  entryPoints: [entryPoint],
  external: ['electron', 'node:*'],
  format: 'esm',
  outfile,
  platform: 'browser',
  sourcemap: true,
  target: 'esnext',
})
