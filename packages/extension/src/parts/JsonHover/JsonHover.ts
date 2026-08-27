import * as PrepareJsonDocument from '../PrepareJsonDocument/PrepareJsonDocument.ts'
import * as TokenType from '../TokenType/TokenType.ts'

const definitionPrefix = '#/definitions/'

export const getHover = async (textDocument, offset) => {
  const parsed = await PrepareJsonDocument.prepareJsonDocument(
    textDocument,
    offset,
  )
  if (parsed === PrepareJsonDocument.emptyDocument) {
    return undefined
  }
  const { schema, node } = parsed
  if (node.type === TokenType.String) {
    const text = textDocument.text.slice(
      node.offset + 1,
      node.offset + node.length - 1,
    )
    const displayString = ''
    if (schema.allOf && Array.isArray(schema.allOf)) {
      for (const item of schema.allOf) {
        if (item.$ref) {
          const resolved =
            schema.definitions[item.$ref.slice(definitionPrefix.length)]
          const documentation = resolved?.properties?.[text]?.description || ''
          if (documentation) {
            return {
              displayString,
              documentation,
            }
          }
        }
      }
    }
    const documentation = schema?.properties?.[text]?.description || ''
    return {
      displayString,
      documentation,
    }
  }
  return undefined
}
