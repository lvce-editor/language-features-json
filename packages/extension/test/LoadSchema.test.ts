import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('@lvce-editor/api', () => ({
  getConfigurationDefinitions: jest.fn(),
  readFile: jest.fn(),
}))

const { readFile } = await import('@lvce-editor/api')
const LoadSchema = await import('../src/parts/LoadSchema/LoadSchema.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('loads custom protocol schemas through the file system API', async () => {
  jest.mocked(readFile).mockResolvedValue('{"type":"object"}')

  await expect(
    LoadSchema.loadSchema('live-component-state:///schemas/7.json'),
  ).resolves.toEqual({ type: 'object' })
  expect(readFile).toHaveBeenCalledWith('live-component-state:///schemas/7.json')
})

test('rejects non-string custom protocol schema content', async () => {
  jest.mocked(readFile).mockResolvedValue(undefined as unknown as string)

  await expect(
    LoadSchema.loadSchema('live-component-state:///schemas/7.json'),
  ).rejects.toThrow('Expected schema content to be a string, got undefined')
})
