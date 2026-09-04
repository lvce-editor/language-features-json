import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.settings-property-false-selection'

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
  await expect(Locator('.EditorCompletionItem').nth(3)).toHaveText(
    'test.boolean.false',
  )
  await EditorCompletion.selectIndex(3)

  await Editor.shouldHaveText('{"test.boolean.false": false}')
  await Editor.shouldHaveSelections(new Uint32Array([0, 23, 0, 28]))
}
