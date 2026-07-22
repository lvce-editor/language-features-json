export const skip = true

export const name = 'json.package-json-prettier-boolean-diagnostic'

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
    '{\n  "prettier": {\n    "semi": "yes"\n  }\n}',
  )
  await Workspace.setPath(tmpDir)
  await Settings.update({ 'editor.diagnostics': true })
  await Main.openUri(uri)

  await Editor.shouldHaveDiagnostics([
    {
      code: 'type',
      columnIndex: 12,
      endColumnIndex: 17,
      endRowIndex: 2,
      message: 'Incorrect type. Expected "boolean" but received "string".',
      rowIndex: 2,
      source: 'json',
      type: 'error',
      uri,
    },
  ])
}
