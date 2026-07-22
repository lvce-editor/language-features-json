export const skip = true

export const name = 'json.package-json-prettier-enum-completion'

export const test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
  Workspace,
}) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/package.json`,
    '{\n  "prettier": {\n    "trailingComma":\n  }\n}',
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/package.json`)
  await Editor.setCursor(2, 20)

  await Editor.openCompletion()

  const completionItems = Locator('#Completions .EditorCompletionItem')
  await expect(completionItems.nth(0)).toHaveText('all')
  await expect(completionItems.nth(1)).toHaveText('es5')
  await expect(completionItems.nth(2)).toHaveText('none')
}
