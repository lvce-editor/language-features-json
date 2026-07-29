export const skip = true

export const name = 'json.package-json-prettier-integer-diagnostic'

export const test = async ({
  Editor,
  FileSystem,
  Main,
  Settings,
  Workspace,
}) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/package.json`
  await FileSystem.writeFile(
    uri,
    '{\n  "prettier": {\n    "printWidth": 80.5\n  }\n}',
  )
  await Workspace.setPath(tmpDir)
  await Settings.update({ 'editor.diagnostics': true })
  await Main.openUri(uri)

  await Editor.shouldHaveDiagnostics([
    {
      code: 'type',
      columnIndex: 18,
      endColumnIndex: 22,
      endRowIndex: 2,
      message: 'Incorrect type. Expected "integer" but received "number".',
      rowIndex: 2,
      source: 'json',
      type: 'error',
      uri,
    },
  ])
}
