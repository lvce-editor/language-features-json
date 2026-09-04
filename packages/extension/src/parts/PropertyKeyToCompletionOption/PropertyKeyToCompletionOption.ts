import type { CompletionItem } from '@lvce-editor/api'
import * as CompletionType from '../CompletionType/CompletionType.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'

const getDefaultValue = (schema: JsonSchema): unknown => {
  if (schema.default !== undefined) {
    return schema.default
  }
  if (schema.enum?.length) {
    return schema.enum[0]
  }
  if (schema.type === 'boolean') {
    return true
  }
  return undefined
}

export const propertyKeyToCompletionOption = (
  key: string,
  schema: JsonSchema,
): CompletionItem => {
  const defaultValue = getDefaultValue(schema)
  const suffix =
    defaultValue === undefined ? ': ' : `: ${JSON.stringify(defaultValue)}`
  return {
    kind: CompletionType.Property,
    label: key,
    snippet: `${JSON.stringify(key)}${suffix}`,
  }
}
