import { expect, test } from '@jest/globals'
import { provideDocumentSymbols } from '../src/parts/DocumentSymbolProvider/DocumentSymbolProvider.ts'

const symbols = (text: string) => provideDocumentSymbols({ uri: 'file:///package.json', text, languageId: 'json' })

test('nested JSON symbols retain names, kinds, and source ranges', () => {
  const text = '{"scripts":{"build":"tsc"},"items":[{"enabled":true},null,42]}'
  const result = symbols(text)
  expect(result.map(({ name, kind }) => ({ name, kind }))).toEqual([{ name: 'scripts', kind: 19 }, { name: 'items', kind: 18 }])
  const build = result[0].children![0]
  expect(build.name).toBe('build')
  expect(build.kind).toBe(15)
  expect(text.slice(build.startOffset, build.endOffset)).toBe('"build":"tsc"')
  expect(text.slice(build.selectionStartOffset, build.selectionEndOffset)).toBe('"build"')
  expect(result[1].children!.map(({ name, kind }) => ({ name, kind }))).toEqual([{ name: '0', kind: 19 }, { name: '1', kind: 21 }, { name: '2', kind: 16 }])
  expect(result[1].children![0].children![0]).toMatchObject({ name: 'enabled', kind: 17 })
})

test('supports comments, escaped keys, and trailing commas', () => {
  expect(symbols('{/* comment */ "a\\"b": [],}')[0]).toMatchObject({ name: 'a"b', kind: 18, children: [] })
})

test('handles empty, primitive, root array, and incomplete documents', () => {
  for (const text of ['', '{}', '[]', 'true', '{"missing":']) {
    expect(symbols(text)).toEqual([])
  }
  expect(symbols('["value"]')[0]).toMatchObject({ name: '0', kind: 15 })
  expect(symbols('{"object": {"value": 1')[0]).toMatchObject({ name: 'object', kind: 19 })
})
