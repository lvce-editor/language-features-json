import { getConfigurationDefinitions } from '@lvce-editor/api'
import * as CreateSettingsSchema from '../CreateSettingsSchema/CreateSettingsSchema.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'
import * as LoadBuiltinSettings from '../LoadBuiltinSettings/LoadBuiltinSettings.ts'

export const loadSettingsSchema = async (): Promise<JsonSchema> => {
  const contributions = await LoadBuiltinSettings.loadBuiltinSettings()
  const extensionDefinitions = await getConfigurationDefinitions()
  return CreateSettingsSchema.createSettingsSchema(
    contributions,
    extensionDefinitions,
  )
}
