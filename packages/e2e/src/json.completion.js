export const name = 'json.completion'

export const test = async ({
  FileSystem,
  Workspace,
  Main,
  Editor,
  Locator,
  expect,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.json`,
    `{
  "type":
}`,
  )
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`${tmpDir}/test.json`)
  await Editor.setCursor(1, 9)
  await Editor.openCompletion()

  // assert
  const completions = Locator('#Completions')
  await expect(completions).toBeVisible()
  const completionItems = completions.locator('.EditorCompletionItem')
  await expect(completionItems.nth(0)).toHaveText('"commonjs"')
}
