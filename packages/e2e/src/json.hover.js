export const name = 'json.hover'

export const test = async ({
  FileSystem,
  Workspace,
  Main,
  Editor,
  Locator,
  expect,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.json`,
    `{
  "type": "module"
}`,
  )
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`${tmpDir}/test.json`)
  await Editor.setCursor(1, 7)
  await Editor.openHover()

  // assert
  const hover = Locator('.EditorHover')
  await expect(hover).toBeVisible()
  await expect(hover).toHaveText(
    'When set to "module", the type field allows a package to specify all .js files within are ES modules. If the "type" field is omitted or set to "commonjs", all .js files are treated as CommonJS.',
  )
}
