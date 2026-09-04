import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.settings-boolean-completion'

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
  const text = '{"editor.cache": }'
  await FileSystem.writeFile(uri, text)
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, text.length - 1)

  await Editor.openCompletion()
  const items = Locator('.EditorCompletionItem')
  await expect(items.nth(0)).toHaveText('true')
  await expect(items.nth(1)).toHaveText('false')
  await EditorCompletion.selectIndex(0)

  await Editor.shouldHaveText('{"editor.cache": true}')
  await Editor.shouldHaveSelections(new Uint32Array([0, 21, 0, 21]))
}
