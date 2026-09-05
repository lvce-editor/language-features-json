import fs from 'node:fs'
import path from 'node:path'
import { root } from './root.js'

const source = path.join(
  root,
  'packages',
  'extension',
  'dist',
  'languageFeaturesJsonMain.js',
)
const targetDirectory = path.join(root, 'packages', 'e2e', 'extension', 'dist')
const target = path.join(targetDirectory, 'languageFeaturesJsonMain.js')

fs.rmSync(targetDirectory, { recursive: true, force: true })
fs.mkdirSync(targetDirectory, { recursive: true })
fs.copyFileSync(source, target)

fs.copyFileSync(
  path.join(root, 'packages', 'e2e', 'fixtures', 'state.schema.json'),
  path.join(targetDirectory, 'state.schema.json'),
)
