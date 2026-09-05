import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.schema-exponent-number'

export const test: Test = async ({
  Command,
  Editor,
  FileSystem,
  Main,
  Workspace,
}) => {
  const tmpDir = await FileSystem.getTmpDir()
  const schemaUri = '../extension/dist/state.schema.json'
  const text = `{
  "$schema": "${schemaUri}",
  "focusedIndex": -1,
  "headerHeight": 1e-7
}`
  await FileSystem.writeFile(`${tmpDir}/state.json`, text)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/state.json`)
  const editorId = (await Command.execute(
    'GetActiveEditor.getActiveEditorId',
  )) as number
  await Editor.shouldHaveDiagnosticProviderResult(
    [
      {
        columnIndex: 18,
        endColumnIndex: 22,
        endRowIndex: 3,
        message: 'Incorrect type. Expected "integer" but received "number".',
        rowIndex: 3,
        source: 'json (schema_validation)',
        type: 'error',
      },
    ],
    editorId,
  )

  await Editor.setText(text.replace('1e-7', '1e+3'))
  await Editor.shouldHaveDiagnosticProviderResult([], editorId)
}
