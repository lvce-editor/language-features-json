import * as CachedSchema from '../CachedSchemas/CachedSchemas.ts'
import * as GetSchemaUri from '../GetSchemaUri/GetSchemaUri.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'
import * as LoadJsonSchemaContributions from '../LoadJsonSchemaContributions/LoadJsonSchemaContributions.ts'
import * as LoadSchema from '../LoadSchema/LoadSchema.ts'

declare const LOAD_BUILT_IN_JSON_SCHEMAS: boolean | undefined

const actual = async (uri: string): Promise<JsonSchema> => {
  const schemaUri = await GetSchemaUri.getSchemaUri(uri)
  const loadBuiltInSchema =
    typeof LOAD_BUILT_IN_JSON_SCHEMAS === 'undefined' ||
    LOAD_BUILT_IN_JSON_SCHEMAS
  const [schema, contributions] = await Promise.all([
    loadBuiltInSchema
      ? (LoadSchema.loadSchema(schemaUri) as Promise<JsonSchema>)
      : Promise.resolve({}),
    LoadJsonSchemaContributions.loadJsonSchemaContributions(uri),
  ])
  if (contributions.length === 0) {
    return schema
  }
  return {
    allOf: [schema, ...contributions],
  }
}

export const getSchema = async (uri: string): Promise<JsonSchema> => {
  if (!CachedSchema.has(uri)) {
    const schema = await actual(uri)
    CachedSchema.set(uri, schema)
  }
  return CachedSchema.get(uri)
}
