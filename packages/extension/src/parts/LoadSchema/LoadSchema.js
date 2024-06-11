import * as GetSchemaAbsoluteUri from '../GetSchemaAbsoluteUri/GetSchemaAbsoluteUri.js'

export const loadSchema = async (schemaUri) => {
  const absoluteUrl = GetSchemaAbsoluteUri.getSchemaAbsoluteUrl(schemaUri)
  const response = await fetch(absoluteUrl)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const result = await response.json()
  return result
}
