import type { Diagnostic } from '@lvce-editor/api'
import * as GetSchema from '../GetSchema/GetSchema.ts'
import * as GetSchemaUri from '../GetSchemaUri/GetSchemaUri.ts'
import * as JsonDiagnostics from '../JsonDiagnostics/JsonDiagnostics.ts'
import * as SettingsDiagnostics from '../SettingsDiagnostics/SettingsDiagnostics.ts'

interface TextDocument {
  readonly text: string
  readonly uri: string
}

export const id = 'json.provideDiagnostics.json'

export const languageId = 'json'

export const provideDiagnostics = async (
  textDocument: TextDocument,
): Promise<readonly Diagnostic[]> => {
  const schemaUri = await GetSchemaUri.getSchemaUri(
    textDocument.uri,
    textDocument.text,
  )
  if (!schemaUri) {
    return []
  }
  const schema = await GetSchema.getSchema(textDocument.uri, textDocument.text)
  if (schemaUri === GetSchemaUri.settingsSchemaUri) {
    return SettingsDiagnostics.getSettingsDiagnostics(textDocument.text, schema)
  }
  return JsonDiagnostics.getDiagnostics(textDocument.text, schema)
}
