import { executeCommand } from '@lvce-editor/api'
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
  if (protocol === 'live-component-state:') {
    const content = await executeCommand('FileSystem.readFile', absoluteUrl)
    if (typeof content !== 'string') {
      throw new TypeError(
        `Expected schema content to be a string, got ${typeof content}`,
      )
    }
    return JSON.parse(content)
  }
  const response = await fetch(absoluteUrl)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const result = await response.json()
  return result
}
