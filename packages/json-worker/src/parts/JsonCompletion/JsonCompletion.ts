import type { CompletionItem } from '../CompletionItem/CompletionItem.ts'
import * as EnumToCompletionOption from '../EnumToCompletionOption/EnumToCompletionOption.ts'
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
  const { node, schema } = parsed

  if (node.type === TokenType.String) {
    const options = schema?.properties?.type?.enum || []
    return options.map(EnumToCompletionOption.enumToCompletionOption)
  }
  if (node.type === TokenType.Object) {
    return JsonCompletionProperty.jsonCompletionProperty(schema, node)
  }
  return []
}

export const resolve = (textDocument, offset, name, completionItem) => {
  console.log({ name, completionItem })
  return {
    ...completionItem,
    snippet: QuoteString.quoteString(name),
  }
}
