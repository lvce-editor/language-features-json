import * as GetSchemaAbsoluteUri from '../GetSchemaAbsoluteUri/GetSchemaAbsoluteUri.ts'

export const loadSchema = async (schemaUri: string): Promise<unknown> => {
  if (!schemaUri) {
    return {}
  }
  const absoluteUrl = GetSchemaAbsoluteUri.getSchemaAbsoluteUrl(schemaUri)
  const response = await fetch(absoluteUrl)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const result = await response.json()
  return result
}
