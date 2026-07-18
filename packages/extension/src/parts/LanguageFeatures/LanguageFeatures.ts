import {
  registerCompletionProvider,
  registerHoverProvider,
  registerSelectionProvider,
} from '@lvce-editor/api'
import * as CompletionProvider from '../CompletionProvider/CompletionProvider.ts'
import * as HoverProvider from '../HoverProvider/HoverProvider.ts'
import * as SelectionProvider from '../SelectionProvider/SelectionProvider.ts'

export const register = (): void => {
  registerSelectionProvider(SelectionProvider)
  registerCompletionProvider(CompletionProvider)
  registerHoverProvider(HoverProvider)
}
