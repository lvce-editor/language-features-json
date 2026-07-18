import * as JsonHover from '../JsonHover/JsonHover.ts'

export const id = 'json.provideHover.json'

export const languageId = 'json'

export const provideHover = (textDocument, offset) => {
  return JsonHover.getHover(textDocument, offset)
}
