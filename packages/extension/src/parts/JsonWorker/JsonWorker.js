import * as Command from '../Command/Command.js'

// @ts-ignore
const rpc = vscode.createRpc({
  id: 'builtin.language-features-json.json-worker',
  execute: Command.execute,
})

export const invoke = (method, ...params) => {
  return rpc.invoke(method, ...params)
}
