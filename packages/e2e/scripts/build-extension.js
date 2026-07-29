import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = join(import.meta.dirname, '..', '..', '..')
const schema = await readFile(
  join(
    root,
    'packages',
    'e2e',
    'fixtures',
    'prettier-schema',
    'schemas',
    'package.schema.json',
  ),
  'utf8',
)

process.env.JSON_SCHEMA_CONTRIBUTIONS = JSON.stringify([
  {
    fileMatch: 'package.json',
    schema: JSON.parse(schema),
    url: 'inline:e2e',
  },
])
process.env.ASSET_PATH_PREFIX = '../'
process.env.LOAD_BUILT_IN_JSON_SCHEMAS = 'false'

await import(pathToFileURL(join(root, 'packages', 'build', 'src', 'build-extension.js')).href)
