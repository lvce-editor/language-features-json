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

const enumToCompletionOption = (value) => {
  return {
    kind: CompletionType.Value,
    label: value,
  }
}

export const jsonCompletion = (textDocument, offset) => {
  const text = textDocument.text
  const parsed = Jsonc.parse(text)
  console.log({ parsed, text })
  const options = schema.properties.type.enum
  return options.map(enumToCompletionOption)
}
