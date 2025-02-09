import { AstNode } from '../AstNode/AstNode.ts'
import type { CompletionItem } from '../CompletionItem/CompletionItem.ts'
import * as PropertyKeyToCompletionOption from '../PropertyKeyToCompletionOption/PropertyKeyToCompletionOption.ts'
import * as ResolveSchemaRef from '../ResolveSchemaRef/ResolveSchemaRef.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'

const getSchemaProperties = (
  rootSchema: JsonSchema,
  schema: JsonSchema,
): JsonSchema['properties'] => {
  if (schema.properties) {
    return schema.properties
  }

  if (schema.$ref) {
    const resolved = ResolveSchemaRef.resolveSchemaRef(rootSchema, schema.$ref)
    return getSchemaProperties(rootSchema, resolved)
  }

  if (schema.allOf) {
    const properties: { [key: string]: JsonSchema } = {}
    for (const subSchema of schema.allOf) {
      const subProperties = getSchemaProperties(rootSchema, subSchema)
      Object.assign(properties, subProperties)
    }
    return properties
  }

  if (schema.anyOf) {
    const properties: { [key: string]: JsonSchema } = {}
    for (const subSchema of schema.anyOf) {
      const subProperties = getSchemaProperties(rootSchema, subSchema)
      Object.assign(properties, subProperties)
    }
    return properties
  }

  return {}
}

export const jsonCompletionProperty = (
  schema: JsonSchema,
  node: AstNode,
): readonly CompletionItem[] => {
  const properties = getSchemaProperties(schema, schema)
  const keys = Object.keys(properties || {})
  return keys.map(PropertyKeyToCompletionOption.propertyKeyToCompletionOption)
}
