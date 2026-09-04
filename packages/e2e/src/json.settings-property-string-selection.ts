import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.settings-property-string-selection'

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
  const uri = `${tmpDir}/settings.json`
  await FileSystem.writeFile(uri, '{}')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, 1)

  await Editor.openCompletion()
  await expect(Locator('.EditorCompletionItem').nth(5)).toHaveText(
    'test.string',
  )
  await EditorCompletion.selectIndex(5)

  await Editor.shouldHaveText('{"test.string": "value"}')
  await Editor.shouldHaveSelections(new Uint32Array([0, 16, 0, 23]))
}
