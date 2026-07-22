export const skip = true

export const name = 'json.package-json-prettier-valid-diagnostics'

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
    '{\n  "prettier": {\n    "semi": false,\n    "printWidth": 100,\n    "trailingComma": "all"\n  }\n}',
  )
  await Workspace.setPath(tmpDir)
  await Settings.update({ 'editor.diagnostics': true })
  await Main.openUri(uri)

  await Editor.shouldHaveDiagnostics([])
}
