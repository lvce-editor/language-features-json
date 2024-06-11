import type { CompletionItem } from '../CompletionItem/CompletionItem.ts'
import * as CompletionType from '../CompletionType/CompletionType.ts'
import * as FindNodeAtOffset from '../FindNodeAtOffset/FindNodeAtOffset.ts'
import * as Jsonc from '../Jsonc/Jsonc.ts'
import * as TokenType from '../TokenType/TokenType.ts'

const schema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['commonjs', 'module'],
    },
  },
}

const enumToCompletionOption = (value: string): CompletionItem => {
  return {
    kind: CompletionType.Value,
    label: value,
  }
}

export const jsonCompletion = (
  textDocument: any,
  offset: number,
): readonly CompletionItem[] => {
  const text = textDocument.text
  const parsed = Jsonc.parse(text)
  const node = FindNodeAtOffset.findNodeAtOffset(parsed, offset)
  if (!node) {
    return []
  }
  if (node.type === TokenType.Object) {
    console.log({ parsed, text, node })
    const options = schema.properties.type.enum
    return options.map(enumToCompletionOption)
  }
  return []
}
