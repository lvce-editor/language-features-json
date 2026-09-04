import type { CompletionItem } from '@lvce-editor/api'
import * as EnumToCompletionOption from '../EnumToCompletionOption/EnumToCompletionOption.ts'
import * as GetPropertySchemaAtOffset from '../GetPropertySchemaAtOffset/GetPropertySchemaAtOffset.ts'
import * as JsonCompletionProperty from '../JsonCompletionProperty/JsonCompletionProperty.ts'
import * as PrepareJsonDocument from '../PrepareJsonDocument/PrepareJsonDocument.ts'
import * as QuoteString from '../QuoteString/QuoteString.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const jsonCompletion = async (
  textDocument: any,
  offset: number,
): Promise<readonly CompletionItem[]> => {
  const parsed = await PrepareJsonDocument.prepareJsonDocument(
    textDocument,
    offset,
  )
  if (parsed === PrepareJsonDocument.emptyDocument) {
    return []
  }
  const { node, nodes, schema } = parsed
  const propertySchema = GetPropertySchemaAtOffset.getPropertySchemaAtOffset(
    schema,
    nodes,
    textDocument.text,
    offset,
  )

  if (propertySchema) {
    const options =
      propertySchema.enum ||
      (propertySchema.type === 'boolean' ? [true, false] : [])
    return options.map(EnumToCompletionOption.enumToCompletionOption)
  }
  if (node.type === TokenType.Object || node.type === TokenType.String) {
    return JsonCompletionProperty.jsonCompletionProperty(schema, node)
  }
  return []
}

export const resolve = (textDocument, offset, name, completionItem) => {
  return {
    ...completionItem,
    snippet:
      typeof completionItem.snippet === 'string'
        ? completionItem.snippet
        : QuoteString.quoteString(name),
  }
}
