import * as CachedSchema from '../CachedSchemas/CachedSchemas.ts'
import * as GetSchemaUri from '../GetSchemaUri/GetSchemaUri.ts'
import * as LoadSchema from '../LoadSchema/LoadSchema.ts'

export const getSchema = async (uri: string, text = ''): Promise<any> => {
  const schemaUri = await GetSchemaUri.getSchemaUri(uri, text)
  const cacheKey = `${uri}\0${schemaUri}`
  if (!CachedSchema.has(cacheKey)) {
    const schema = await LoadSchema.loadSchema(schemaUri)
    CachedSchema.set(cacheKey, schema)
  }
  return CachedSchema.get(cacheKey)
}
