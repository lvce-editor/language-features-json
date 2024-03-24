import { execaCommand } from 'execa'
import { cp, mkdir, rm } from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const REPO = 'https://github.com/SchemaStore/schemastore'
const COMMIT = '93796f920ccb0efa89b6972bb577eda2f9dbd443'

const schemasToCopy = ['tsconfig.json', 'package.json']

const main = async () => {
  process.chdir(root)
  await rm(`${root}/.tmp`, { recursive: true, force: true })
  await execaCommand(`git clone ${REPO} .tmp/schemastore`, {
    stdio: 'inherit',
  })
  process.chdir(`${root}/.tmp/schemastore`)
  await execaCommand(`git checkout ${COMMIT}`)
  process.chdir(root)
  await mkdir(`${root}/packages/json-worker/data`, { recursive: true })
  for (const schema of schemasToCopy) {
    await cp(
      `${root}/.tmp/schemastore/src/schemas/json/${schema}`,
      `${root}/packages/json-worker/data/${schema}`
    )
  }
}

main()
