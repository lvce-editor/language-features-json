import {
  bundleJs,
  packageExtension,
  replace,
} from '@lvce-editor/package-extension'
import fs, { readFileSync } from 'fs'
import path, { join } from 'path'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')
const jsonWorker = path.join(root, 'packages', 'json-worker')
const schemas = path.join(root, 'packages', 'schemas')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))

const packageJson = JSON.parse(
  readFileSync(join(extension, 'package.json')).toString(),
)
delete packageJson.xo
delete packageJson.jest
delete packageJson.prettier
delete packageJson.devDependencies
packageExtension.main = 'dist/languageFeaturesJsonMain.js'

fs.writeFileSync(
  join(root, 'dist', 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n',
)
fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(join(extension, 'icon.png'), join(root, 'dist', 'icon.png'))
fs.copyFileSync(
  join(extension, 'extension.json'),
  join(root, 'dist', 'extension.json'),
)
fs.cpSync(join(extension, 'src'), join(root, 'dist', 'src'), {
  recursive: true,
})
fs.cpSync(join(jsonWorker, 'src'), join(root, 'dist', 'json-worker', 'src'), {
  recursive: true,
})
fs.cpSync(join(schemas, 'src'), join(root, 'dist', 'schemas', 'src'), {
  recursive: true,
})

const workerUrlFilePath = path.join(
  root,
  'dist',
  'src',
  'parts',
  'JsonWorkerUrl',
  'JsonWorkerUrl.js',
)
await replace({
  path: workerUrlFilePath,
  occurrence: 'src/jsonWorkerMain.ts',
  replacement: 'dist/jsonWorkerMain.js',
})

const assetDirPath = path.join(
  root,
  'dist',
  'src',
  'parts',
  'AssetDir',
  'AssetDir.js',
)
await replace({
  path: assetDirPath,
  occurrence: '../../../../',
  replacement: '../',
})

await bundleJs(
  join(root, 'dist', 'src', 'languageFeaturesJsonMain.js'),
  join(root, 'dist', 'dist', 'languageFeaturesJsonMain.js'),
)

await bundleJs(
  join(root, 'dist', 'json-worker', 'src', 'jsonWorkerMain.ts'),
  join(root, 'dist', 'json-worker', 'dist', 'jsonWorkerMain.js'),
)

const extensionJsonPath = join(root, 'dist', 'extension.json')

await replace({
  path: extensionJsonPath,
  occurrence: 'src/languageFeaturesJsonMain.js',
  replacement: 'dist/languageFeaturesJsonMain.js',
})

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
