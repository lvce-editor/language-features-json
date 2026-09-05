export const name = 'json.component-state-numbers'

export const test = async ({
  Command,
  Editor,
  FileSystem,
  Main,
  Workspace,
}) => {
  const tmpDir = await FileSystem.getTmpDir()
  const schema = {
    type: 'object',
    properties: {
      pointerDownGroupIndex: { type: 'integer' },
      pointerDownTabIndex: { type: 'integer' },
      uid: { type: 'number' },
    },
  }
  const schemaUri = `data:application/json,${encodeURIComponent(JSON.stringify(schema))}`
  const state = {
    $schema: schemaUri,
    pointerDownGroupIndex: -1,
    pointerDownTabIndex: -1,
    uid: 1e-7,
  }
  await FileSystem.writeFile(
    `${tmpDir}/state.json`,
    JSON.stringify(state, null, 2),
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/state.json`)
  const editorId = await Command.execute('GetActiveEditor.getActiveEditorId')
  await Editor.shouldHaveDiagnosticProviderResult([], editorId)

  await Editor.setText(JSON.stringify({ ...state, uid: 'invalid' }, null, 2))
  await Editor.shouldHaveDiagnosticProviderResult(
    [
      {
        columnIndex: 9,
        endColumnIndex: 18,
        endRowIndex: 4,
        message: 'Incorrect type. Expected "number" but received "string".',
        rowIndex: 4,
        source: 'json (schema_validation)',
        type: 'error',
      },
    ],
    editorId,
  )
}
