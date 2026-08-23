import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'
import type { SettingItem } from '../SettingItem/SettingItem.ts'
import * as SettingType from '../SettingType/SettingType.ts'

const getJsonType = (setting: SettingItem): string | undefined => {
  switch (setting.type) {
    case SettingType.Enum:
    case SettingType.String:
    case SettingType.Color:
    case SettingType.Url:
      return 'string'
    case SettingType.Boolean:
      return 'boolean'
    case SettingType.Array:
      return setting.value &&
        typeof setting.value === 'object' &&
        !Array.isArray(setting.value)
        ? 'object'
        : 'array'
    case SettingType.Number:
      return 'number'
    default:
      return undefined
  }
}

const getEnumValues = (setting: SettingItem): readonly string[] | undefined => {
  if (!setting.options) {
    return undefined
  }
  const prefix = setting.id.slice(0, setting.id.lastIndexOf('.') + 1)
  return setting.options.map((option) =>
    option.id.startsWith(prefix) ? option.id.slice(prefix.length) : option.id,
  )
}

const createPropertySchema = (setting: SettingItem): JsonSchema => {
  return {
    default: setting.value,
    description: setting.description,
    enum: getEnumValues(setting),
    maximum: setting.maximum,
    minimum: setting.minimum,
    type: getJsonType(setting),
  }
}

export const createSettingsSchema = (
  contributions: readonly (readonly SettingItem[])[],
): JsonSchema => {
  const properties: Record<string, JsonSchema> = {}
  for (const contribution of contributions) {
    for (const setting of contribution) {
      properties[setting.id] = createPropertySchema(setting)
    }
  }
  return {
    properties,
    type: 'object',
  }
}
