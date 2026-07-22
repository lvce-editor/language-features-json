import { cp, mkdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const source = join(root, 'packages', 'extension')
const target = join(root, 'packages', 'e2e', '.tmp', 'extension')

await rm(target, { force: true, recursive: true })
await cp(source, target, { recursive: true })
await mkdir(join(target, 'schemas'), { recursive: true })
await cp(join(root, 'packages', 'schemas', 'src'), join(target, 'schemas', 'src'), {
  recursive: true,
})
await cp(
  join(root, 'packages', 'e2e', 'fixtures', 'prettier-schema', 'schemas', 'package.schema.json'),
  join(target, 'schemas', 'prettier-package.schema.json'),
)
