import { activate as activateExtensionApi } from '@lvce-editor/api'
import * as JsonSchemaContributions from '../JsonSchemaContributions/JsonSchemaContributions.ts'
import * as LanguageFeatures from '../LanguageFeatures/LanguageFeatures.ts'

const state = {
  isActivated: false,
}

export const activate = async (): Promise<void> => {
  if (state.isActivated) {
    return
  }
  state.isActivated = true
  await activateExtensionApi()
  JsonSchemaContributions.initialize()
  LanguageFeatures.register()
}

export const deactivate = (): void => {}
