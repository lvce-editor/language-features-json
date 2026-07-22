import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'
import * as ResolveSchemaRef from '../ResolveSchemaRef/ResolveSchemaRef.ts'

export const getSchemaVariants = (
  rootSchema: JsonSchema,
  schema: JsonSchema,
): readonly JsonSchema[] => {
  const variants: JsonSchema[] = [schema]
  if (schema.$ref) {
    const resolved = ResolveSchemaRef.resolveSchemaRef(rootSchema, schema.$ref)
    if (resolved !== schema) {
      variants.push(...getSchemaVariants(rootSchema, resolved))
    }
  }
  for (const child of [
    ...(schema.allOf || []),
    ...(schema.anyOf || []),
    ...(schema.oneOf || []),
  ]) {
    variants.push(...getSchemaVariants(rootSchema, child))
  }
  return variants
}
