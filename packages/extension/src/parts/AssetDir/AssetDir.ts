declare const ASSET_PATH_PREFIX: string | undefined

const assetPathPrefix =
  typeof ASSET_PATH_PREFIX === 'string' ? ASSET_PATH_PREFIX : '../../../../'

export const assetDir = new URL(assetPathPrefix, import.meta.url).toString()
