import * as AssetDir from '../AssetDir/AssetDir.ts'
import type { SettingItem } from '../SettingItem/SettingItem.ts'

declare const BUILTIN_SETTINGS: readonly (readonly SettingItem[])[] | undefined

const bundledSettings =
  typeof BUILTIN_SETTINGS === 'undefined' ? undefined : BUILTIN_SETTINGS

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
  fallback: readonly (readonly SettingItem[])[] | undefined = bundledSettings,
): Promise<readonly (readonly SettingItem[])[]> => {
  try {
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
  } catch (error) {
    if (fallback) {
      return fallback
    }
    throw error
  }
}
