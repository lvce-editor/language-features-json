import type { CompletionItem } from '@lvce-editor/api'
import * as EnumToCompletionOption from '../EnumToCompletionOption/EnumToCompletionOption.ts'
import * as GetCompletionContext from '../GetCompletionContext/GetCompletionContext.ts'
import * as GetSchema from '../GetSchema/GetSchema.ts'
import * as GetSchemaAtPath from '../GetSchemaAtPath/GetSchemaAtPath.ts'
import * as GetSchemaEnum from '../GetSchemaEnum/GetSchemaEnum.ts'
import * as JsonCompletionProperty from '../JsonCompletionProperty/JsonCompletionProperty.ts'
import * as QuoteString from '../QuoteString/QuoteString.ts'

export const jsonCompletion = async (
  textDocument: any,
  offset: number,
): Promise<readonly CompletionItem[]> => {
  const context = GetCompletionContext.getCompletionContext(
    textDocument.text,
    offset,
  )
  if (!context) {
    return []
  }
  const schema = await GetSchema.getSchema(textDocument.uri)
  const schemaAtPath = GetSchemaAtPath.getSchemaAtPath(schema, context.path)
  if (context.kind === 'value') {
    const options = GetSchemaEnum.getSchemaEnum(schema, schemaAtPath)
    return options.map(EnumToCompletionOption.enumToCompletionOption)
  }
  return JsonCompletionProperty.jsonCompletionProperty(
    schema,
    { childCount: 0, length: 0, offset, type: 1 },
    schemaAtPath,
  )
}

export const resolve = (textDocument, offset, name, completionItem) => {
  console.log({ name, completionItem })
  return {
    ...completionItem,
    snippet: QuoteString.quoteString(name),
  }
}
