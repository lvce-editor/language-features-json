import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.settings-property-partial-key-completion'

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
  const text = '{editor}'
  await FileSystem.writeFile(uri, text)
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, text.length - 1)

  await Editor.openCompletion()
  await expect(Locator('.EditorCompletionItem').nth(0)).toHaveText(
    'editor.cache',
  )
  await EditorCompletion.selectIndex(0)

  await Editor.shouldHaveText('{"editor.cache": true}')
  await Editor.shouldHaveSelections(new Uint32Array([0, 17, 0, 21]))
}
