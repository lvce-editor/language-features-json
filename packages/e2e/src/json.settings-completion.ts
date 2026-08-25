import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'json.settings-completion'

export const test: Test = async ({ Command, Editor, expect, Locator }) => {
  await Command.execute('Preferences.openSettingsJson')
  await Editor.setCursor(0, 0)

  await Editor.openCompletion()

  const completions = Locator('#Completions')
  await expect(completions).toBeVisible()
  const completionItems = completions.locator('.EditorCompletionItem')
  await expect(completionItems.nth(0)).toHaveText(
    'gptvoice.tools.terminal.enabled',
  )
}
