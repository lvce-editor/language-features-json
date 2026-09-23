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
    `${tmpDir}/knip.json`,
    `{
  "$schema": "../extension/dist/knip.schema.json",
  "workspaces": {
    "packages/core": {
      "entry": ["src/index.ts"],
      "project": ["src/**/*.ts"]
    }
  }
}`,
  )
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`${tmpDir}/knip.json`)
  await Editor.setCursor(5, 8)
  await Editor.openHover()

  // assert
  const hover = Locator('.EditorHover')
  await expect(hover).toBeVisible()
  await expect(hover).toHaveText(
    'The project files should contain all files to match against the files resolved from the entry files, including potentially unused files.',
  )

  await Editor.setCursor(4, 8)
  await Editor.openHover()
  await expect(hover).toHaveText(
    'The entry files target the starting point(s) to resolve the rest of the imported code.',
  )
}
