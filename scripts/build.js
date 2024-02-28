import { execSync } from 'child_process'
import fs, { readFileSync, writeFileSync } from 'fs'
import path, { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { packageExtension } from '@lvce-editor/package-extension'

const NOT_NEEDED = []

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = path.join(__dirname, '..')
const extension = path.join(root, 'packages', 'extension')
const jsonWorker = path.join(root, 'packages', 'json-worker')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))

const packageJson = JSON.parse(
  readFileSync(join(extension, 'package.json')).toString()
)
delete packageJson.xo
delete packageJson.jest
delete packageJson.prettier
delete packageJson.devDependencies

fs.writeFileSync(
  join(root, 'dist', 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n'
)
fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(join(extension, 'icon.png'), join(root, 'dist', 'icon.png'))
fs.copyFileSync(
  join(extension, 'extension.json'),
  join(root, 'dist', 'extension.json')
)
fs.cpSync(join(extension, 'src'), join(root, 'dist', 'src'), {
  recursive: true,
})
fs.cpSync(join(jsonWorker, 'src'), join(root, 'dist', 'json-worker', 'src'), {
  recursive: true,
})
fs.cpSync(join(jsonWorker, 'data'), join(root, 'dist', 'json-worker', 'data'), {
  recursive: true,
})

const workerUrlFilePath = path.join(
  root,
  'dist',
  'src',
  'parts',
  'jsonWorkerUrl',
  'jsonWorkerUrl.js'
)
const oldContent = readFileSync(workerUrlFilePath, 'utf8')
const newContent = oldContent.replace(
  '../../../../json-worker/src/jsonWorkerMain.js',
  '../../../json-worker/src/jsonWorkerMain.js'
)
writeFileSync(workerUrlFilePath, newContent)

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
