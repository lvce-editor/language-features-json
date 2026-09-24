import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.nested-array-schema-property-completion'

export const test: Test = async ({
  Editor,
  EditorCompletion,
  expect,
  FileSystem,
  Locator,
  Main,
  Workspace,
}) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/state.json`
  const schemaUri = '../extension/dist/state.schema.json'
  const text = `{"$schema":"${schemaUri}","nested":{"entries":[{}]}}`
  await FileSystem.writeFile(uri, text)
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, text.lastIndexOf('{') + 1)

  await Editor.openCompletion()
  const items = Locator('.EditorCompletionItem')
  await expect(items).toHaveCount(1)
  await expect(items.nth(0)).toHaveText('arrayOnly')
  await EditorCompletion.selectIndex(0)
  await Editor.shouldHaveText(
    `{"$schema":"${schemaUri}","nested":{"entries":[{"arrayOnly": true}]}}`,
  )
}
