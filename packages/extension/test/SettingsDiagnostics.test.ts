import { expect, test } from '@jest/globals'
import * as SettingsDiagnostics from '../src/parts/SettingsDiagnostics/SettingsDiagnostics.ts'

const schema = {
  properties: {
    'editor.fontSize': { type: 'number' },
    'files.exclude': { type: 'object' },
    'gptvoice.tools.terminal.enabled': { type: 'boolean' },
  },
  type: 'object',
}

test('returns a warning for an unknown setting', () => {
  const text = `{
  "editor.fontSiz": 15
}`
  expect(SettingsDiagnostics.getSettingsDiagnostics(text, schema)).toEqual([
    {
      columnIndex: 3,
      endColumnIndex: 17,
      endRowIndex: 1,
      message: 'Unknown setting "editor.fontSiz".',
      rowIndex: 1,
      source: 'json',
      type: 'warning',
    },
  ])
})

test('accepts built-in and extension-contributed settings', () => {
  const text = `{
  "editor.fontSize": 15,
  "gptvoice.tools.terminal.enabled": true
}`
  expect(SettingsDiagnostics.getSettingsDiagnostics(text, schema)).toEqual([])
})

test('only checks top-level setting names', () => {
  const text = `{
  "files.exclude": {
    "**/.git": true
  }
}`
  expect(SettingsDiagnostics.getSettingsDiagnostics(text, schema)).toEqual([])
})

test('ignores incomplete property names', () => {
  expect(SettingsDiagnostics.getSettingsDiagnostics('{ "editor.', schema)).toEqual(
    [],
  )
})
