import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'

export const resolveSchemaRef = (
  schema: JsonSchema,
  ref: string,
): JsonSchema => {
  if (!ref.startsWith('#/')) {
    return {}
  }
  const segments = ref
    .slice(2)
    .split('/')
    .map((segment) => segment.replaceAll('~1', '/').replaceAll('~0', '~'))
  const candidates = [
    schema,
    ...(schema.allOf || []),
    ...(schema.anyOf || []),
    ...(schema.oneOf || []),
  ]
  for (const candidate of candidates) {
    let current: any = candidate
    for (const segment of segments) {
      current = current?.[segment]
      if (!current) {
        break
      }
    }
    if (current) {
      return current
    }
  }
  return {}
}
