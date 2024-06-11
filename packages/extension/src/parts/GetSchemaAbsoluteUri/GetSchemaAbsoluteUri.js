import * as AssetDir from '../AssetDir/AssetDir.js'

const schemaBaseUri = `${AssetDir.assetDir}/schemas`

export const getSchemaAbsoluteUrl = (schemaUri) => {
  const absoluteUrl = new URL(
    `${schemaBaseUri}/${schemaUri}`,
    import.meta.url,
  ).toString()
  return absoluteUrl
}
