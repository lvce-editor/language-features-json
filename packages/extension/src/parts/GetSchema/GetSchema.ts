import * as CachedSchema from '../CachedSchemas/CachedSchemas.ts'
import * as GetSchemaUri from '../GetSchemaUri/GetSchemaUri.ts'
import * as LoadSchema from '../LoadSchema/LoadSchema.ts'

export const getSchema = async (uri: string, text = ''): Promise<any> => {
  const schemaUri = await GetSchemaUri.getSchemaUri(uri, text)
  if (!CachedSchema.has(schemaUri)) {
    const schema = await LoadSchema.loadSchema(schemaUri)
    CachedSchema.set(schemaUri, schema)
  }
  return CachedSchema.get(schemaUri)
}
