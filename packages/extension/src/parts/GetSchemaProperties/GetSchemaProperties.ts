import * as GetSchemaVariants from '../GetSchemaVariants/GetSchemaVariants.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'

export const getSchemaProperties = (
  rootSchema: JsonSchema,
  schema: JsonSchema,
): JsonSchema['properties'] => {
  const properties: Record<string, JsonSchema> = {}
  for (const variant of GetSchemaVariants.getSchemaVariants(
    rootSchema,
    schema,
  )) {
    Object.assign(properties, variant.properties)
  }
  return properties
}
