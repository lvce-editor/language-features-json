import { readFile } from '@lvce-editor/api'
import * as GetSchemaAbsoluteUri from '../GetSchemaAbsoluteUri/GetSchemaAbsoluteUri.ts'
import * as GetSchemaUri from '../GetSchemaUri/GetSchemaUri.ts'
import * as LoadSettingsSchema from '../LoadSettingsSchema/LoadSettingsSchema.ts'

export const loadSchema = async (schemaUri: string): Promise<unknown> => {
  if (!schemaUri) {
    return {}
  }
  if (schemaUri === GetSchemaUri.settingsSchemaUri) {
    return LoadSettingsSchema.loadSettingsSchema()
  }
  const absoluteUrl = GetSchemaAbsoluteUri.getSchemaAbsoluteUrl(schemaUri)
  const protocol = new URL(absoluteUrl).protocol
  if (!['blob:', 'data:', 'http:', 'https:'].includes(protocol)) {
    return JSON.parse(await readFile(absoluteUrl))
  }
  const response = await fetch(absoluteUrl)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const result = await response.json()
  return result
}
