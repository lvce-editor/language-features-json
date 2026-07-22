import type { Diagnostic } from '@lvce-editor/api'
import * as GetSchema from '../GetSchema/GetSchema.ts'
import * as JsonDiagnostic from '../JsonDiagnostic/JsonDiagnostic.ts'

export const id = 'json.provideDiagnostics.json'

export const languageId = 'json'

interface TextDocument {
  readonly text: string
  readonly uri: string
}

export const provideDiagnostics = async (
  textDocument: TextDocument,
): Promise<readonly Diagnostic[]> => {
  const schema = await GetSchema.getSchema(textDocument.uri)
  return JsonDiagnostic.getDiagnostics(
    textDocument.text,
    textDocument.uri,
    schema,
  )
}
