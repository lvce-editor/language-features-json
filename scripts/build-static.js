import { exportStatic } from '@lvce-editor/shared-process'
import { cp, readdir, readFile, writeFile } from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

await exportStatic({
  extensionPath: 'packages/extension',
  testPath: 'packages/e2e',
  root,
})

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

const dirents = await readdir(path.join(root, 'dist'))
const commitHash = dirents.find(isCommitHash) || ''

for (const dirent of ['src', 'data']) {
  await cp(
    path.join(root, 'packages', 'json-worker', dirent),
    path.join(
      root,
      'dist',
      commitHash,
      'extensions',
      'builtin.language-features-json',
      'json-worker',
      dirent
    ),
    { recursive: true, force: true }
  )
}

const workerUrlFilePath = path.join(
  root,
  'dist',
  commitHash,
  'extensions',
  'builtin.language-features-json',
  'src',
  'parts',
  'jsonWorkerUrl',
  'jsonWorkerUrl.js'
)
const oldContent = await readFile(workerUrlFilePath, 'utf8')
const newContent = oldContent.replace(
  '../../../../json-worker/src/jsonWorkerMain.js',
  '../../../json-worker/src/jsonWorkerMain.js'
)
await writeFile(workerUrlFilePath, newContent)
