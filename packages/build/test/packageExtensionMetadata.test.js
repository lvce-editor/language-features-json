import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { packageExtension } from '@lvce-editor/package-extension'

test('adds version and last updated metadata to the packaged extension', async () => {
  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), 'language-features-json-package-'),
  )
  const extensionDirectory = join(temporaryDirectory, 'extension')
  const extensionJsonPath = join(extensionDirectory, 'extension.json')
  const gitCommitDate = 1_724_544_000

  try {
    await mkdir(extensionDirectory)
    await writeFile(
      extensionJsonPath,
      JSON.stringify({ id: 'builtin.language-features-json' }),
    )

    await packageExtension({
      env: {
        GIT_COMMIT_DATE: String(gitCommitDate),
        GIT_TAG: 'v1.2.3',
      },
      inDir: extensionDirectory,
      outFile: join(temporaryDirectory, 'extension.tar.br'),
    })

    const extensionJson = JSON.parse(
      await readFile(extensionJsonPath, 'utf8'),
    )
    assert.equal(extensionJson.version, '1.2.3')
    assert.equal(extensionJson.lastUpdated, '2024-08-25T00:00:00.000Z')
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true })
  }
})
