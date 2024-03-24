import { exportStatic } from '@lvce-editor/shared-process'
import { cp, readdir } from 'node:fs/promises'
import path from 'node:path'
import { root } from './root.js'

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

for (const dirent of ['src']) {
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
