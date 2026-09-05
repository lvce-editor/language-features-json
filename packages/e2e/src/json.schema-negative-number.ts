import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.schema-negative-number'

export const test: Test = async ({
  Command,
  Editor,
  FileSystem,
  Main,
  Workspace,
}) => {
  const tmpDir = await FileSystem.getTmpDir()
  const schemaUri = '../extension/dist/state.schema.json'
  const text = JSON.stringify(
    { $schema: schemaUri, focusedIndex: -1, headerHeight: 61 },
    null,
    2,
  )
  await FileSystem.writeFile(`${tmpDir}/state.json`, text)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/state.json`)
  const editorId = (await Command.execute(
    'GetActiveEditor.getActiveEditorId',
  )) as number

  await Editor.shouldHaveDiagnosticProviderResult([], editorId)

  await Editor.setText(
    JSON.stringify(
      { $schema: schemaUri, focusedIndex: -1, headerHeight: 'invalid' },
      null,
      2,
    ),
  )
  await Editor.shouldHaveDiagnosticProviderResult(
    [
      {
        columnIndex: 18,
        endColumnIndex: 27,
        endRowIndex: 3,
        message: 'Incorrect type. Expected "integer" but received "string".',
        rowIndex: 3,
        source: 'json (schema_validation)',
        type: 'error',
      },
    ],
    editorId,
  )
}
