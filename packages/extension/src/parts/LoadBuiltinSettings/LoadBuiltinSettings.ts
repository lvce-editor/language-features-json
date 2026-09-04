import * as AssetDir from '../AssetDir/AssetDir.ts'
import type { SettingItem } from '../SettingItem/SettingItem.ts'

const loadJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export const getBuiltinSettingsBaseUrl = (
  assetDir: string = AssetDir.assetDir,
): string => {
  return new URL('../../builtin-settings/', assetDir).toString()
}

export const loadBuiltinSettings = async (
  baseUrl: string = getBuiltinSettingsBaseUrl(),
): Promise<readonly (readonly SettingItem[])[]> => {
  const fileNames = await loadJson<readonly string[]>(
    new URL('index.json', baseUrl).toString(),
  )
  return Promise.all(
    fileNames.map((fileName) =>
      loadJson<readonly SettingItem[]>(
        new URL(fileName, baseUrl).toString(),
      ),
    ),
  )
}
