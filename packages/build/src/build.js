import { packageExtension } from '@lvce-editor/package-extension'
import * as esbuild from 'esbuild'
import fs, { readFileSync } from 'node:fs'
import path, { join } from 'node:path'
import { loadBuiltinSettings } from './loadBuiltinSettings.js'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')
const schemas = path.join(root, 'packages', 'schemas')
const dist = join(root, 'dist')

fs.rmSync(dist, { recursive: true, force: true })
fs.mkdirSync(dist)

const packageJson = JSON.parse(
  readFileSync(join(extension, 'package.json'), 'utf8'),
)
delete packageJson.jest
delete packageJson.prettier
delete packageJson.devDependencies
packageJson.main = 'dist/languageFeaturesJsonMain.js'

fs.writeFileSync(
  join(dist, 'package.json'),
  `${JSON.stringify(packageJson, null, 2)}\n`,
)
fs.copyFileSync(join(root, 'README.md'), join(dist, 'README.md'))
fs.copyFileSync(join(extension, 'icon.png'), join(dist, 'icon.png'))
fs.copyFileSync(join(extension, 'extension.json'), join(dist, 'extension.json'))
fs.cpSync(join(schemas, 'src'), join(dist, 'schemas', 'src'), {
  recursive: true,
})

await esbuild.build({
  bundle: true,
  define: {
    ASSET_PATH_PREFIX: JSON.stringify('../'),
    BUILTIN_SETTINGS: JSON.stringify(loadBuiltinSettings()),
  },
  entryPoints: [join(extension, 'src', 'languageFeaturesJsonMain.ts')],
  external: ['electron', 'node:*'],
  format: 'esm',
  outfile: join(dist, 'dist', 'languageFeaturesJsonMain.js'),
  platform: 'browser',
  target: 'esnext',
})

await packageExtension({
  highestCompression: true,
  inDir: dist,
  outFile: join(root, 'extension.tar.br'),
})
