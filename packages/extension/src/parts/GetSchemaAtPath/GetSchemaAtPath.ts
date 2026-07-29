import * as GetSchemaProperties from '../GetSchemaProperties/GetSchemaProperties.ts'
import * as GetSchemaVariants from '../GetSchemaVariants/GetSchemaVariants.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'

const combine = (schemas: readonly JsonSchema[]): JsonSchema => {
  if (schemas.length === 0) {
    return {}
  }
  if (schemas.length === 1) {
    return schemas[0]
  }
  return { allOf: schemas }
}

export const getSchemaAtPath = (
  rootSchema: JsonSchema,
  path: readonly (number | string)[],
): JsonSchema => {
  let schema = rootSchema
  for (const segment of path) {
    const next: JsonSchema[] = []
    if (typeof segment === 'number') {
      for (const variant of GetSchemaVariants.getSchemaVariants(
        rootSchema,
        schema,
      )) {
        if (variant.items) {
          next.push(variant.items)
        }
      }
    } else {
      const property = GetSchemaProperties.getSchemaProperties(
        rootSchema,
        schema,
      )?.[segment]
      if (property) {
        next.push(property)
      }
    }
    schema = combine(next)
  }
  return schema
}
