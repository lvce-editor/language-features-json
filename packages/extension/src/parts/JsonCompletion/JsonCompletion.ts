import { getColorThemeNames, type CompletionItem } from '@lvce-editor/api'
import * as EnumToCompletionOption from '../EnumToCompletionOption/EnumToCompletionOption.ts'
import * as GetCompletionSelectionRange from '../GetCompletionSelectionRange/GetCompletionSelectionRange.ts'
import * as GetPropertySchemaAtOffset from '../GetPropertySchemaAtOffset/GetPropertySchemaAtOffset.ts'
import * as GetSchemaAtOffset from '../GetSchemaAtOffset/GetSchemaAtOffset.ts'
import * as JsonCompletionProperty from '../JsonCompletionProperty/JsonCompletionProperty.ts'
import * as PrepareJsonDocument from '../PrepareJsonDocument/PrepareJsonDocument.ts'
import * as QuoteString from '../QuoteString/QuoteString.ts'
import * as ShouldAppendPropertyComma from '../ShouldAppendPropertyComma/ShouldAppendPropertyComma.ts'
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
  const schemaAtOffset = GetSchemaAtOffset.getSchemaAtOffset(
    schema,
    nodes,
    textDocument.text,
    offset,
  )
  const propertySchema = GetPropertySchemaAtOffset.getPropertySchemaAtOffset(
    schema,
    nodes,
    textDocument.text,
    offset,
    schemaAtOffset,
  )

  const propertyName = GetPropertySchemaAtOffset.getPropertyNameAtOffset(
    nodes,
    textDocument.text,
    offset,
  )
  if (
    propertyName === 'workbench.colorTheme' &&
    propertySchema?.type === 'string' &&
    node.type === TokenType.String
  ) {
    const colorThemeNames = await getColorThemeNames()
    return colorThemeNames.map((name) => ({
      ...EnumToCompletionOption.enumToCompletionOption(name),
      snippet: name,
    }))
  }

  if (propertySchema) {
    const schemas = propertySchema.oneOf || [propertySchema]
    const options = schemas.flatMap(
      (subSchema) =>
        subSchema.enum || (subSchema.type === 'boolean' ? [true, false] : []),
    )
    return options.map(EnumToCompletionOption.enumToCompletionOption)
  }
  if (node.type === TokenType.Object || node.type === TokenType.String) {
    return JsonCompletionProperty.jsonCompletionProperty(
      schema,
      node,
      schemaAtOffset,
    )
  }
  return []
}

const getStringEndOffset = (text: string, offset: number): number => {
  let escaped = false
  for (let index = offset; index < text.length; index++) {
    const char = text[index]
    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\') {
      escaped = true
      continue
    }
    if (char === '"') {
      return index + 1
    }
  }
  return offset
}

const isInsideString = (text: string, offset: number): boolean => {
  let inString = false
  let escaped = false
  for (let index = 0; index < offset; index++) {
    const char = text[index]
    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\') {
      escaped = true
      continue
    }
    if (char === '"') {
      inString = !inString
    }
  }
  return inString
}

export const resolve = (textDocument, offset, name, completionItem) => {
  let baseSnippet =
    typeof completionItem.snippet === 'string'
      ? completionItem.snippet
      : QuoteString.quoteString(name)
  const text = textDocument.text
  let hasOpenPropertyQuote = false
  if (completionItem.kind === 1 && baseSnippet.startsWith('"')) {
    const afterCursor = text.slice(offset)
    hasOpenPropertyQuote = isInsideString(text, offset)
    const hasExistingClosingQuote = afterCursor.startsWith('"')
    if (hasOpenPropertyQuote) {
      baseSnippet = baseSnippet.slice(1)
      if (hasExistingClosingQuote) {
        const keyEnd = baseSnippet.indexOf('"')
        if (keyEnd >= 0) {
          baseSnippet =
            baseSnippet.slice(0, keyEnd) + baseSnippet.slice(keyEnd + 1)
        }
      }
    }
  }
  const isColorThemeValue =
    /"workbench\.colorTheme"\s*:\s*"(?:[^"\\]|\\.)*$/.test(
      text.slice(0, offset),
    ) &&
    completionItem.kind === 2 &&
    baseSnippet === name
  const quoteStart = isColorThemeValue ? text.lastIndexOf('"', offset - 1) : -1
  const prefix = isColorThemeValue ? text.slice(quoteStart + 1, offset) : ''
  const snippet =
    isColorThemeValue && name.startsWith(prefix)
      ? name.slice(prefix.length)
      : baseSnippet
  const valueEndOffset = isColorThemeValue
    ? getStringEndOffset(text, offset)
    : offset
  const resolvedSnippet =
    completionItem.kind !== 1 &&
    ShouldAppendPropertyComma.shouldAppendPropertyComma(
      text,
      offset,
      valueEndOffset,
    )
      ? `${snippet},`
      : snippet
  const selectionSnippet = hasOpenPropertyQuote
    ? `"${resolvedSnippet}`
    : resolvedSnippet
  const selectionRange =
    GetCompletionSelectionRange.getCompletionSelectionRange(
      completionItem.kind,
      name,
      selectionSnippet,
    )
  return {
    ...completionItem,
    snippet: resolvedSnippet,
    ...(selectionRange && {
      selectionRange: hasOpenPropertyQuote
        ? {
            startOffset: selectionRange.startOffset - 1,
            endOffset: selectionRange.endOffset - 1,
          }
        : selectionRange,
    }),
  }
}
