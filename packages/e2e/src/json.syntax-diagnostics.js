export const name = 'json.syntax-diagnostics'

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
  Locator,
  expect,
}) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/package.json`
  await FileSystem.writeFile(filePath, '{}')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const cases = [
    {
      text: '{\n  "devDependencies": {\n    "jest": "^30.4.2"\n    "ts-jest": "^29.4.12"\n  }\n}',
      message: 'Expected a comma between JSON values.',
      rowIndex: 3,
      columnIndex: 4,
    },
    {
      text: '{\n  "name": "app"\n  "version": "1.0.0"\n}',
      message: 'Expected a comma between JSON values.',
      rowIndex: 2,
      columnIndex: 2,
    },
    {
      text: '[\n  1\n  2\n]',
      message: 'Expected a comma between JSON values.',
      rowIndex: 2,
      columnIndex: 2,
    },
    {
      text: '{ "name" "app" }',
      message: 'Expected a colon after the property name.',
      rowIndex: 0,
      columnIndex: 9,
    },
    {
      text: '{"name":}',
      message: 'Expected a JSON value.',
      rowIndex: 0,
      columnIndex: 8,
    },
    {
      text: '{"enabled": tru}',
      message: 'Expected a JSON value.',
      rowIndex: 0,
      columnIndex: 12,
    },
    {
      text: '{"name":"app}',
      message: 'Unterminated JSON string.',
      rowIndex: 0,
      columnIndex: 13,
    },
    {
      text: '{"name":"app"',
      message: "Expected '}' to close the object.",
      rowIndex: 0,
      columnIndex: 13,
    },
    {
      text: '{"name":"app"} true',
      message: 'Unexpected content after the JSON value.',
      rowIndex: 0,
      columnIndex: 15,
    },
  ]

  for (const scenario of cases) {
    await Editor.setText(scenario.text)
    const expectedDiagnostic = {
      code: 'syntax',
      columnIndex: scenario.columnIndex,
      endColumnIndex:
        scenario.columnIndex <
        scenario.text.split('\n')[scenario.rowIndex].length
          ? scenario.columnIndex + 1
          : scenario.columnIndex,
      endRowIndex: scenario.rowIndex,
      message: scenario.message,
      rowIndex: scenario.rowIndex,
      source: 'json (syntax)',
      type: 'error',
    }
    await waitFor(() => Editor.shouldHaveDiagnostics([expectedDiagnostic]))
    await expect(Locator('.DiagnosticError')).toBeVisible()
  }

  await Editor.setText('{\n  "name": "app",\n  "version": "1.0.0"\n}')
  await waitFor(() => Editor.shouldHaveDiagnostics([]))
  await expect(Locator('.DiagnosticError')).toHaveCount(0)
}
