import * as GetSchemaVariants from '../GetSchemaVariants/GetSchemaVariants.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'

export const getSchemaTypes = (
  rootSchema: JsonSchema,
  schema: JsonSchema,
): readonly string[] => {
  const types = new Set<string>()
  for (const variant of GetSchemaVariants.getSchemaVariants(
    rootSchema,
    schema,
  )) {
    if (typeof variant.type === 'string') {
      types.add(variant.type)
    } else {
      for (const type of variant.type || []) {
        types.add(type)
      }
    }
  }
  return [...types]
}
