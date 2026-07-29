// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.ts'
import { jest } from '@jest/globals'

let currentJsonSchemas: readonly unknown[] = []

jest.unstable_mockModule('@lvce-editor/api', () => ({
  getJsonSchemas: async () => currentJsonSchemas,
}))

interface TestWorkerOptions {
  readonly execMap: Record<string, (...args: any[]) => any>
  readonly jsonSchemas?: readonly any[]
}

export const testWorker = async ({
  execMap,
  jsonSchemas = [],
}: TestWorkerOptions) => {
  currentJsonSchemas = jsonSchemas
  const invocations: any[][] = []
  const worker = await startWorker()
  return {
    async execute(commandId: string, ...args: any[]) {
      const originalFetch = globalThis.fetch
      globalThis.fetch = async (input): Promise<Response> => {
        invocations.push(['Json.loadSchema', input])
        const loadSchema = execMap['Json.loadSchema']
        if (!loadSchema) {
          throw new Error('unknown command Json.loadSchema')
        }
        return {
          json: async () => loadSchema(input),
          ok: true,
          statusText: '',
        } as Response
      }
      try {
        return await worker.execute(commandId, ...args)
      } finally {
        globalThis.fetch = originalFetch
      }
    },
    invocations,
  }
}
