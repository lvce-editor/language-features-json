import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.settings-property-boolean-replace-selection'

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
  await Editor.shouldHaveSelections(new Uint32Array([0, 17, 0, 21]))
  await Editor.type('false')

  await Editor.shouldHaveText('{"editor.cache": false}')
  await Editor.shouldHaveSelections(new Uint32Array([0, 22, 0, 22]))
}
