import type { CompletionItem } from '../CompletionItem/CompletionItem.ts'
import * as EnumToCompletionOption from '../EnumToCompletionOption/EnumToCompletionOption.ts'
import * as QuoteString from '../QuoteString/QuoteString.ts'
import * as FindNodeAtOffset from '../FindNodeAtOffset/FindNodeAtOffset.ts'
import * as JsonCompletionProperty from '../JsonCompletionProperty/JsonCompletionProperty.ts'
import * as GetSchemaUri from '../GetSchemaUri/GetSchemaUri.ts'
import * as Jsonc from '../Jsonc/Jsonc.ts'
import * as TokenType from '../TokenType/TokenType.ts'
import * as LoadSchema from '../LoadSchema/LoadSchema.ts'

const schema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['commonjs', 'module'],
    },
  },
}

export const jsonCompletion = async (
  textDocument: any,
  offset: number,
): Promise<readonly CompletionItem[]> => {
  const { uri, text } = textDocument
  const parsed = Jsonc.parse(text)
  const node = FindNodeAtOffset.findNodeAtOffset(parsed, offset)
  if (!node) {
    return []
  }
  const schemaUri = await GetSchemaUri.getSchemaUri(uri)
  const schema = await LoadSchema.loadSchema(schemaUri)
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
