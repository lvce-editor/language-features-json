import type { CompletionItem } from '../CompletionItem/CompletionItem.ts'
import * as EnumToCompletionOption from '../EnumToCompletionOption/EnumToCompletionOption.ts'
import * as FindNodeAtOffset from '../FindNodeAtOffset/FindNodeAtOffset.ts'
import * as PropertyKeyToCompletionOption from '../PropertyKeyToCompletionOption/PropertyKeyToCompletionOption.ts'
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
  console.log({ node })
  if (node.type === TokenType.String) {
    console.log({ parsed, text, node })
    const options = schema.properties.type.enum
    return options.map(EnumToCompletionOption.enumToCompletionOption)
  }
  if (node.type === TokenType.Object) {
    const keys = Object.keys(schema.properties)
    return keys.map(PropertyKeyToCompletionOption.propertyKeyToCompletionOption)
  }
  return []
}
