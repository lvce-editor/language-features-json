import * as CachedSchema from '../CachedSchemas/CachedSchemas.ts'
import * as GetSchemaUri from '../GetSchemaUri/GetSchemaUri.ts'
import * as LoadSchema from '../LoadSchema/LoadSchema.ts'

const actual = async (uri) => {
  const schemaUri = await GetSchemaUri.getSchemaUri(uri)
  const schema = await LoadSchema.loadSchema(schemaUri)
  return schema
}

export const getSchema = async (uri) => {
  if (!CachedSchema.has(uri)) {
    const schema = await actual(uri)
    CachedSchema.set(uri, schema)
  }
  return CachedSchema.get(uri)
}
