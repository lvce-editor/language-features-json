import * as JsonCompletion from '../JsonCompletion/JsonCompletion.ts'

export const id = 'json.provideCompletions.json'

export const languageId = 'json'

export const provideCompletions = (textDocument, offset) => {
  return JsonCompletion.jsonCompletion(textDocument, offset)
}

export const resolveCompletionItem = (
  textDocument,
  offset,
  name,
  completionItem,
) => {
  return JsonCompletion.resolve(textDocument, offset, name, completionItem)
}

export const triggerCharacters = []
