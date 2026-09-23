import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.settings-color-theme-completion'

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
  const text = '{"workbench.colorTheme": "test."}'
  await FileSystem.writeFile(uri, text)
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, text.indexOf('test.') + 'test.'.length)

  await Editor.openCompletion()
  const items = Locator('.EditorCompletionItem')
  await expect(items.nth(0)).toHaveText('test.theme-id')
  await EditorCompletion.selectIndex(0)

  await Editor.shouldHaveText('{"workbench.colorTheme": "test.theme-id"}')
}
