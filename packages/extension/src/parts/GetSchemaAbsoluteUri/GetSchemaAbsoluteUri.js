const schemaBaseUri = '../../../../schemas'

export const getSchemaAbsoluteUrl = (schemaUri) => {
  const absoluteUrl = new URL(
    `${schemaBaseUri}/${schemaUri}`,
    import.meta.url,
  ).toString()
  return absoluteUrl
}
