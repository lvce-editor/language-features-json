import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'

const definitionPrefix = '#/definitions/'

export const resolveSchemaRef = (
  schema: JsonSchema,
  ref: string,
): JsonSchema => {
  if (!ref.startsWith(definitionPrefix)) {
    return {}
  }
  const path = ref.slice(definitionPrefix.length)
  const resolved = schema.definitions?.[path]
  if (!resolved) {
    return {}
  }
  return resolved
}
