import { expect, test } from '@jest/globals'
import * as SettingsDiagnostics from '../src/parts/SettingsDiagnostics/SettingsDiagnostics.ts'

const schema = {
  properties: {
    'editor.fontSize': { maximum: 100, minimum: 10, type: 'number' },
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
      source: 'json (settings_validation)',
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

test.each([
  [-15, 'minimum'],
  [9, 'minimum'],
  [101, 'maximum'],
])('reports a numeric bound error for editor.fontSize=%s', (value, code) => {
  expect(
    SettingsDiagnostics.getSettingsDiagnostics(
      `{"editor.fontSize": ${value}}`,
      schema,
    ),
  ).toEqual([
    expect.objectContaining({
      code,
      message:
        code === 'minimum'
          ? 'Value must be greater than or equal to 10.'
          : 'Value must be less than or equal to 100.',
      source: 'json (schema_validation)',
      type: 'error',
    }),
  ])
})

test.each([10, 15, 100])(
  'accepts editor.fontSize=%s at or within its bounds',
  (value) => {
    expect(
      SettingsDiagnostics.getSettingsDiagnostics(
        `{"editor.fontSize": ${value}}`,
        schema,
      ),
    ).toEqual([])
  },
)

test('clears the bound diagnostic when the setting is corrected', () => {
  expect(
    SettingsDiagnostics.getSettingsDiagnostics(
      '{"editor.fontSize": -15}',
      schema,
    ),
  ).toHaveLength(1)
  expect(
    SettingsDiagnostics.getSettingsDiagnostics(
      '{"editor.fontSize": 15}',
      schema,
    ),
  ).toEqual([])
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
  expect(
    SettingsDiagnostics.getSettingsDiagnostics('{ "editor.', schema),
  ).toEqual([])
})
