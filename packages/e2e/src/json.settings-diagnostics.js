export const name = 'json.settings-diagnostics'

const waitFor = async (assertion) => {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      await assertion()
      return
    } catch (error) {
      if (attempt === 99) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

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
  "editor.fontSize": -15,
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
      columnIndex: 21,
      code: 'minimum',
      endColumnIndex: 24,
      endRowIndex: 1,
      message: 'Value must be greater than or equal to 10.',
      rowIndex: 1,
      source: 'json (schema_validation)',
      type: 'error',
    },
    {
      columnIndex: 3,
      endColumnIndex: 33,
      endRowIndex: 3,
      message: 'Unknown setting "gptvoice.tools.terminal.enable".',
      rowIndex: 3,
      source: 'json (settings_validation)',
      type: 'warning',
    },
  ]
  await waitFor(() => Editor.shouldHaveDiagnostics(expectedDiagnostics))

  const diagnosticWarning = Locator('.DiagnosticWarning')
  const diagnosticError = Locator('.DiagnosticError')
  await expect(diagnosticWarning).toBeVisible()
  await expect(diagnosticError).toBeVisible()

  // Correct the number and verify its diagnostic clears.
  const correctedSettingsText = settingsText.replace(
    '"editor.fontSize": -15',
    '"editor.fontSize": 15',
  )
  await Editor.setText(correctedSettingsText)
  await waitFor(() => Editor.shouldHaveDiagnostics([expectedDiagnostics[1]]))
  await expect(diagnosticError).toHaveCount(0)

  await Panel.open('Problems')
  const problems = Locator('.Viewlet.Problems')
  await expect(problems.locator('.ProblemsWarningIcon')).toBeVisible()
  await expect(problems.locator('.ProblemsErrorIcon')).toHaveCount(0)
}
