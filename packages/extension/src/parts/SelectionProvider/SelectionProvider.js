import * as JsonWorker from '../JsonWorker/JsonWorker.js'

export const provideSelections = (textDocument, positions) => {
  return JsonWorker.invoke('Selection.expand', textDocument, positions)
}
