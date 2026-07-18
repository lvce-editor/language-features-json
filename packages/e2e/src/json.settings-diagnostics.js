export const skip = true

export const name = 'json.settings-diagnostics'

export const test = async ({
  FileSystem,
  Workspace,
  Main,
  Settings,
  Locator,
  expect,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/settings.json`,
    `{
  "editor.fontSize": "invalid"
}`,
  )
  await Workspace.setPath(tmpDir)
  await Settings.update({ 'editor.diagnostics': true })

  // act
  await Main.openUri(`${tmpDir}/settings.json`)

  // assert
  const diagnosticError = Locator('.DiagnosticError')
  await expect(diagnosticError).toBeVisible()
}
