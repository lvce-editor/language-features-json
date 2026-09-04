import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('@lvce-editor/api', () => ({
  executeCommand: jest.fn(),
  getConfigurationDefinitions: jest.fn(),
}))

const { executeCommand } = await import('@lvce-editor/api')
const LoadSchema = await import('../src/parts/LoadSchema/LoadSchema.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('loads custom protocol schemas through the renderer file system dispatcher', async () => {
  jest.mocked(executeCommand).mockResolvedValue('{"type":"object"}')

  await expect(
    LoadSchema.loadSchema('live-component-state:///schemas/7.json'),
  ).resolves.toEqual({ type: 'object' })
  expect(executeCommand).toHaveBeenCalledWith(
    'FileSystem.readFile',
    'live-component-state:///schemas/7.json',
  )
})

test('rejects non-string custom protocol schema content', async () => {
  jest.mocked(executeCommand).mockResolvedValue(undefined)

  await expect(
    LoadSchema.loadSchema('live-component-state:///schemas/7.json'),
  ).rejects.toThrow('Expected schema content to be a string, got undefined')
})
