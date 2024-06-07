import * as CompletionType from '../CompletionType/CompletionType.ts'
import * as Jsonc from '../Jsonc/Jsonc.ts'

const schema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['commonjs', 'module'],
    },
  },
}

export const jsonCompletion = (textDocument, offset) => {
  const text = textDocument.text
  const parsed = Jsonc.parse(text)
  console.log({ parsed, text })
  return [
    {
      kind: CompletionType.Value,
      label: 'module',
    },
  ]
}
