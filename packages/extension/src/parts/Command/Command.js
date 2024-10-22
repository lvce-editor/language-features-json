import * as LoadSchema from '../LoadSchema/LoadSchema.js'

export const execute = (method, ...params) => {
  if (method === 'Json.loadSchema') {
    return LoadSchema.loadSchema(...params)
  }
  return {}
}
