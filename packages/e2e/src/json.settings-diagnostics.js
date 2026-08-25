export const name = 'json.settings-diagnostics'

export const test = async ({
  FileSystem,
  Workspace,
  Main,
  Editor,
  Panel,
  Settings,
  Locator,
  expect,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const settingsText = `{
  "gptvoice.tools.terminal.enabled": true,
  "gptvoice.tools.terminal.enable": true
}`
  await FileSystem.writeFile(
    `${tmpDir}/settings.json`,
    settingsText,
  )
  await Workspace.setPath(tmpDir)
  await Settings.update({ 'editor.diagnostics': true })

  // act
  await Main.openUri(`${tmpDir}/settings.json`)
  await Editor.setText(settingsText)

  // assert
  const expectedDiagnostics = [
    {
      columnIndex: 3,
      endColumnIndex: 33,
      endRowIndex: 2,
      message: 'Unknown setting "gptvoice.tools.terminal.enable".',
      rowIndex: 2,
      source: 'json (settings_validation)',
      type: 'warning',
    },
  ]
  await Editor.shouldHaveDiagnostics(expectedDiagnostics)

  const diagnosticWarning = Locator('.DiagnosticWarning')
  const diagnosticError = Locator('.DiagnosticError')
  await expect(diagnosticWarning).toBeVisible()
  await expect(diagnosticError).toHaveCount(0)

  await Panel.open('Problems')
  const problems = Locator('.Viewlet.Problems')
  await expect(problems.locator('.ProblemsWarningIcon')).toBeVisible()
  await expect(problems.locator('.ProblemsErrorIcon')).toHaveCount(0)
}
