import * as JsonWorkerUrl from '../JsonWorkerUrl/JsonWorkerUrl.js'
import * as LoadSchema from '../LoadSchema/LoadSchema.js'

const commandMap = {
  'Json.loadSchema': LoadSchema.loadSchema,
}

export const launchJsonWorker = async () => {
  // @ts-ignore
  const rpc = await vscode.createRpc({
    url: JsonWorkerUrl.jsonWorkerUrl,
    name: 'Json Worker',
    commandMap,
  })
  return rpc
}
