import * as JsonWorkerUrl from '../JsonWorkerUrl/JsonWorkerUrl.js'
import * as LoadSchema from '../LoadSchema/LoadSchema.js'

const execute = (method, ...params) => {
  if (method === 'Json.loadSchema') {
    return LoadSchema.loadSchema(...params)
  }
  return {}
}

export const launchJsonWorker = async () => {
  // @ts-ignore
  const rpc = await vscode.createRpc({
    url: JsonWorkerUrl.jsonWorkerUrl,
    name: 'Json Worker',
    execute,
  })
  return rpc
}
