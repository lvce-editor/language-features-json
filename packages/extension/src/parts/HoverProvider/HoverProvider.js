import * as JsonWorker from '../JsonWorker/JsonWorker.js'

export const languageId = 'json'

export const provideHover = (textDocument, offset) => {
  return JsonWorker.invoke('Hover.getHover', textDocument, offset)
}
