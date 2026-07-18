import * as Selection from '../Selection/Selection.ts'

export const id = 'json.provideSelections.json'

export const languageId = 'json'

export const provideSelections = (textDocument, positions) => {
  return Selection.expand(textDocument, positions)
}
