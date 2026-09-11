import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.breadcrumbs'

export const test: Test = async ({ Editor, FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/package.json`
  await FileSystem.writeFile(uri, '{\n  "scripts": {\n    "build": "tsc"\n  },\n  "items": [\n    {"enabled": true}\n  ]\n}')
  await Settings.update({ 'breadcrumbs.enabled': true })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(2, 15)
  const symbols = Locator('.EditorBreadcrumbSymbol')
  await expect(symbols).toHaveCount(2)
  await expect(symbols.nth(0)).toHaveText('scripts')
  await expect(symbols.nth(1)).toHaveText('build')
  await Editor.setCursor(5, 18)
  await expect(symbols).toHaveCount(3)
  await expect(symbols.nth(0)).toHaveText('items')
  await expect(symbols.nth(1)).toHaveText('0')
  await expect(symbols.nth(2)).toHaveText('enabled')
}
