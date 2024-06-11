const schemaBaseUri = '../../../../schema'

const getSchemaAbsoluteUrl = (schemaUri) => {
  const absoluteUrl = new URL(
    `${schemaBaseUri}/${schemaUri}`,
    import.meta.url,
  ).toString()
  return absoluteUrl
}

export const loadSchema = async (schemaUri) => {
  const absoluteUrl = getSchemaAbsoluteUrl(schemaUri)
  const response = await fetch(absoluteUrl)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const result = await response.json()
  return result
}
