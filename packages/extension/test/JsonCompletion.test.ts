import { expect, jest, test, beforeEach } from '@jest/globals'

jest.unstable_mockModule('@lvce-editor/api', () => ({
  getColorThemeNames: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/GetSchema/GetSchema.ts', () => ({
  getSchema: jest.fn(),
}))

const { getColorThemeNames } = await import('@lvce-editor/api')
const { getSchema } = await import('../src/parts/GetSchema/GetSchema.ts')
const JsonCompletion =
  await import('../src/parts/JsonCompletion/JsonCompletion.ts')

beforeEach(() => {
  jest.mocked(getColorThemeNames).mockReset()
  jest.mocked(getSchema).mockReset()
})

test('suggests current color theme ids for workbench.colorTheme values', async () => {
  jest.mocked(getSchema).mockResolvedValue({
    properties: {
      'workbench.colorTheme': {
        type: 'string',
      },
    },
  })
  jest.mocked(getColorThemeNames).mockResolvedValue(['theme-id'])
  const text = '{"workbench.colorTheme": ""}'

  const result = await JsonCompletion.jsonCompletion(
    { uri: 'file:///settings.json', text },
    text.indexOf('""') + 1,
  )

  expect(result).toEqual([
    {
      kind: 2,
      label: 'theme-id',
      snippet: 'theme-id',
    },
  ])
  expect(getColorThemeNames).toHaveBeenCalledTimes(1)
})

test('resolves theme ids inside an existing JSON string without quotes or commas', async () => {
  const text = '{"workbench.colorTheme": ""}'
  const offset = text.indexOf('""') + 1

  const result = JsonCompletion.resolve({ text }, offset, 'theme-id', {
    kind: 2,
    label: 'theme-id',
    snippet: 'theme-id',
  })

  expect(result.snippet).toBe('theme-id')
  expect(result.selectionRange).toBeUndefined()
})

test('resolves only the remaining theme id text after a typed prefix', async () => {
  const text = '{"workbench.colorTheme": "test."}'
  const offset = text.indexOf('test.') + 'test.'.length

  const result = JsonCompletion.resolve({ text }, offset, 'test.theme-id', {
    kind: 2,
    label: 'test.theme-id',
    snippet: 'test.theme-id',
  })

  expect(result.snippet).toBe('theme-id')
  expect(result.snippet).not.toContain(',')
})

test('keeps unrelated setting enum suggestions independent of color themes', async () => {
  jest.mocked(getSchema).mockResolvedValue({
    properties: {
      'simpleBrowser.openExternalLinks': {
        enum: ['newTab', 'externalBrowser'],
        type: 'string',
      },
    },
  })
  const text = '{"simpleBrowser.openExternalLinks": ""}'

  const result = await JsonCompletion.jsonCompletion(
    { uri: 'file:///settings.json', text },
    text.indexOf('""') + 1,
  )

  expect(result.map((item) => item.label)).toEqual([
    'newTab',
    'externalBrowser',
  ])
  expect(getColorThemeNames).not.toHaveBeenCalled()
})

test('queries contributed theme ids again for each completion request', async () => {
  jest.mocked(getSchema).mockResolvedValue({
    properties: {
      'workbench.colorTheme': {
        type: 'string',
      },
    },
  })
  jest
    .mocked(getColorThemeNames)
    .mockResolvedValueOnce(['theme.before-refresh'])
    .mockResolvedValueOnce(['theme.after-refresh'])
  const text = '{"workbench.colorTheme": "theme."}'
  const textDocument = { uri: 'file:///settings.json', text }
  const offset = text.indexOf('theme.') + 'theme.'.length

  const beforeRefresh = await JsonCompletion.jsonCompletion(
    textDocument,
    offset,
  )
  const afterRefresh = await JsonCompletion.jsonCompletion(textDocument, offset)

  expect(beforeRefresh.map((item) => item.label)).toEqual([
    'theme.before-refresh',
  ])
  expect(afterRefresh.map((item) => item.label)).toEqual([
    'theme.after-refresh',
  ])
  expect(getColorThemeNames).toHaveBeenCalledTimes(2)
})
