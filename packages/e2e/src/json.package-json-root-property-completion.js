export const skip = true

export const name = 'json.package-json-root-property-completion'

export const test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
  Workspace,
}) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/package.json`, '{\n  "nam"\n}')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/package.json`)
  await Editor.setCursor(1, 6)

  await Editor.openCompletion()

  const completions = Locator('#Completions')
  await expect(completions).toBeVisible()
  await expect(completions.locator('.EditorCompletionItem').nth(0)).toHaveText(
    'name',
  )
}
