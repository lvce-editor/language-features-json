import * as JsonWorker from '../JsonWorker/JsonWorker.js'

export const languageId = 'json'

export const provideCompletions = (textDocument, offset) => {
  return JsonWorker.invoke('Completion.getCompletion', textDocument, offset)
}

export const triggerCharacters = []
