import { activate as activateExtensionApi } from '@lvce-editor/api'
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
  LanguageFeatures.register()
}

export const deactivate = (): void => {}
