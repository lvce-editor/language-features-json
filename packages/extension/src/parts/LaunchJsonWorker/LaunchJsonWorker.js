import * as JsonWorkerUrl from '../JsonWorkerUrl/JsonWorkerUrl.js'

export const launchJsonWorker = async () => {
  // @ts-ignore
  const rpc = await vscode.createRpc({
    url: JsonWorkerUrl.jsonWorkerUrl,
    name: 'Json Worker',
  })
  return rpc
}
