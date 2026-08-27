import * as AssetDir from '../AssetDir/AssetDir.ts'

const schemaBaseUri = `${AssetDir.assetDir}schemas/`

export const getSchemaAbsoluteUrl = (schemaUri: string): string => {
  return new URL(schemaUri, schemaBaseUri).toString()
}
