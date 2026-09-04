import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.settings-property-enum-selection'

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
  await expect(Locator('.EditorCompletionItem').nth(2)).toHaveText(
    'simpleBrowser.openExternalLinks',
  )
  await EditorCompletion.selectIndex(2)

  await Editor.shouldHaveText('{"simpleBrowser.openExternalLinks": "newTab"}')
  await Editor.shouldHaveSelections(new Uint32Array([0, 36, 0, 44]))
}
