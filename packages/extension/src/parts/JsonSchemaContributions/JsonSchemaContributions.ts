import { getJsonSchemas, type JsonSchemaContribution } from '@lvce-editor/api'

let schemas: readonly JsonSchemaContribution[] | undefined
let schemasPromise: Promise<readonly JsonSchemaContribution[]> | undefined

declare const JSON_SCHEMA_CONTRIBUTIONS:
  | readonly JsonSchemaContribution[]
  | undefined

export const initialize = (): void => {
  const builtInSchemas =
    typeof JSON_SCHEMA_CONTRIBUTIONS === 'undefined'
      ? []
      : JSON_SCHEMA_CONTRIBUTIONS
  if (builtInSchemas.length > 0) {
    schemas = builtInSchemas
  }
}

export const get = async (): Promise<readonly JsonSchemaContribution[]> => {
  if (schemas) {
    return schemas
  }
  schemasPromise ||= getJsonSchemas()
  schemas = await schemasPromise
  return schemas
}
