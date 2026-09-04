import { afterEach, expect, jest, test } from '@jest/globals'
import * as CreateSettingsSchema from '../src/parts/CreateSettingsSchema/CreateSettingsSchema.ts'
import * as LoadBuiltinSettings from '../src/parts/LoadBuiltinSettings/LoadBuiltinSettings.ts'
import * as SettingsDiagnostics from '../src/parts/SettingsDiagnostics/SettingsDiagnostics.ts'

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

test('loads current built-in settings before validating settings.json', async () => {
  const fetch = jest.fn<typeof globalThis.fetch>(async (input) => {
    const url = String(input)
    if (url.endsWith('/index.json')) {
      return {
        json: async () => ['renderer-worker.json'],
        ok: true,
        statusText: '',
      } as Response
    }
    if (url.endsWith('/renderer-worker.json')) {
      return {
        json: async () => [
          {
            description: 'Controls how application updates are installed',
            id: 'application.updateMode',
            type: 'string',
            value: 'none',
          },
        ],
        ok: true,
        statusText: '',
      } as Response
    }
    throw new Error(`Unexpected URL ${url}`)
  })
  globalThis.fetch = fetch

  const contributions = await LoadBuiltinSettings.loadBuiltinSettings(
    'https://example.com/static/commit/builtin-settings/',
  )
  const schema = CreateSettingsSchema.createSettingsSchema(contributions)

  expect(schema.properties?.['application.updateMode']?.type).toBe('string')
  expect(
    SettingsDiagnostics.getSettingsDiagnostics(
      '{ "application.updateMode": "none" }',
      schema,
    ),
  ).toEqual([])
  expect(fetch.mock.calls.map(([input]) => String(input))).toEqual([
    'https://example.com/static/commit/builtin-settings/index.json',
    'https://example.com/static/commit/builtin-settings/renderer-worker.json',
  ])
})

test('resolves built-in settings next to the current LVCE static bundle', () => {
  expect(
    LoadBuiltinSettings.getBuiltinSettingsBaseUrl(
      'https://example.com/static/commit/extensions/builtin.language-features-json/',
    ),
  ).toBe('https://example.com/static/commit/builtin-settings/')
})

test('uses bundled settings when runtime settings are unavailable', async () => {
  globalThis.fetch = jest.fn(async () => {
    return {
      ok: false,
      statusText: 'Not Found',
    } as Response
  })
  const fallback = [
    [
      {
        id: 'editor.fontSize',
        type: 5,
        value: 15,
      },
    ],
  ]

  await expect(
    LoadBuiltinSettings.loadBuiltinSettings(
      'https://example.com/builtin-settings/',
      fallback,
    ),
  ).resolves.toBe(fallback)
})
