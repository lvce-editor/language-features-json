export const name = 'json.package-type-completion-before-property'

export const test = async ({
  FileSystem,
  Workspace,
  Main,
  Editor,
  EditorCompletion,
  Locator,
  expect,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/settings.json`
  await FileSystem.writeFile(
    uri,
    `{
  "test.moduleType":${' '}
  "editor.cache": true
}
`,
  )
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(uri)
  await Editor.setCursor(1, 21)
  await Editor.openCompletion()

  // assert
  const completions = Locator('#Completions')
  await expect(completions).toBeVisible()
  const completionItems = completions.locator('.EditorCompletionItem')
  await expect(completionItems.nth(0)).toHaveText('commonjs')
  await EditorCompletion.selectIndex(0)
  await Editor.shouldHaveText(
    '{\n  "test.moduleType": "commonjs",\n  "editor.cache": true\n}\n',
  )
  await Editor.shouldHaveSelections(new Uint32Array([1, 22, 1, 30]))
  await Editor.type('module')
  await Editor.shouldHaveText(
    '{\n  "test.moduleType": "module",\n  "editor.cache": true\n}\n',
  )
}
