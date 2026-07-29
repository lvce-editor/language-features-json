import * as GetSchemaVariants from '../GetSchemaVariants/GetSchemaVariants.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'

export const getSchemaEnum = (
  rootSchema: JsonSchema,
  schema: JsonSchema,
): readonly string[] => {
  const values = new Set<string>()
  for (const variant of GetSchemaVariants.getSchemaVariants(
    rootSchema,
    schema,
  )) {
    for (const value of variant.enum || []) {
      if (typeof value === 'string') {
        values.add(value)
      }
    }
  }
  return [...values]
}
