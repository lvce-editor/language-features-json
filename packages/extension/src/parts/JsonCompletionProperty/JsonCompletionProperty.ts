import { AstNode } from '../AstNode/AstNode.ts'
import type { CompletionItem } from '@lvce-editor/api'
import * as GetSchemaProperties from '../GetSchemaProperties/GetSchemaProperties.ts'
import * as PropertyKeyToCompletionOption from '../PropertyKeyToCompletionOption/PropertyKeyToCompletionOption.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'

export const jsonCompletionProperty = (
  rootSchema: JsonSchema,
  node: AstNode,
  schema: JsonSchema = rootSchema,
): readonly CompletionItem[] => {
  const properties = GetSchemaProperties.getSchemaProperties(rootSchema, schema)
  const keys = Object.keys(properties || {})
  return keys.map(PropertyKeyToCompletionOption.propertyKeyToCompletionOption)
}
