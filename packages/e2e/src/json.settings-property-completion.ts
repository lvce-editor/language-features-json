import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.settings-property-completion'

export const test: Test = async ({
  Editor,
  EditorCompletion,
  FileSystem,
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
  await EditorCompletion.selectIndex(1)

  await Editor.shouldHaveText('{"editor.cache": true}')
}
