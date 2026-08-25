import { getConfigurationDefinitions } from '@lvce-editor/api'
import * as CreateSettingsSchema from '../CreateSettingsSchema/CreateSettingsSchema.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'
import type { SettingItem } from '../SettingItem/SettingItem.ts'

declare const BUILTIN_SETTINGS: readonly (readonly SettingItem[])[] | undefined

export const loadSettingsSchema = async (): Promise<JsonSchema> => {
  const contributions =
    typeof BUILTIN_SETTINGS === 'undefined' ? [] : BUILTIN_SETTINGS
  const extensionDefinitions = await getConfigurationDefinitions()
  return CreateSettingsSchema.createSettingsSchema(
    contributions,
    extensionDefinitions,
  )
}
