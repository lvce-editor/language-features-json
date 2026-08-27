import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))

export const loadBuiltinSettings = () => {
  const staticServerPath = fileURLToPath(
    new URL('../', import.meta.resolve('@lvce-editor/static-server')),
  )
  const config = readJson(join(staticServerPath, 'config.json'))
  const settingsPath = join(
    staticServerPath,
    'static',
    config.commit,
    'builtin-settings',
  )
  const fileNames = readJson(join(settingsPath, 'index.json'))
  return fileNames.map((fileName) => readJson(join(settingsPath, fileName)))
}
