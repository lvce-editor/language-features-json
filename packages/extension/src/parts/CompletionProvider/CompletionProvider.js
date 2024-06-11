import * as JsonWorker from '../JsonWorker/JsonWorker.js'

export const languageId = 'json'

export const provideCompletions = (textDocument, offset) => {
  return JsonWorker.invoke('Completion.getCompletion', textDocument, offset)
}

export const resolveCompletionItem = (
  textDocument,
  offset,
  name,
  completionItem,
) => {
  return JsonWorker.invoke(
    'Completion.resolve',
    textDocument,
    offset,
    name,
    completionItem,
  )
}

export const triggerCharacters = []
