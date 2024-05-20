import { exportStatic } from '@lvce-editor/shared-process'
import { readFileSync, writeFileSync } from 'node:fs'
import { cp, readdir } from 'node:fs/promises'
import path, { join } from 'node:path'
import { root } from './root.js'

await import('./build.js')

await cp(path.join(root, 'dist'), path.join(root, 'dist2'), {
  recursive: true,
  force: true,
})

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

await cp(
  path.join(root, 'dist2'),
  path.join(
    root,
    'dist',
    commitHash,
    'extensions',
    'builtin.language-features-json',
  ),
  { recursive: true, force: true },
)

const updateJson = (path, update) => {
  const oldJson = JSON.parse(readFileSync(path, 'utf8'))
  const newJson = update(oldJson)
  writeFileSync(path, JSON.stringify(newJson, null, 2) + '\n')
}

const fileMapPath = join(root, 'dist', commitHash, 'config', 'fileMap.json')
const updateFileMap = (oldFileMap) => {
  return [...oldFileMap, '/playground/languages/file.json']
}
updateJson(fileMapPath, updateFileMap)

const fileJsonPath = join(
  root,
  'dist',
  commitHash,
  'playground',
  'languages',
  'file.json',
)
writeFileSync(
  fileJsonPath,
  JSON.stringify(
    {
      key: 'value',
    },
    null,
    2,
  ) + '\n',
)
