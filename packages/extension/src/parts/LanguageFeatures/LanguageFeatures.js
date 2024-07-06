import * as SelectionProvider from '../SelectionProvider/SelectionProvider.js'
import * as CompletionProvider from '../CompletionProvider/CompletionProvider.js'
import * as HoverProvider from '../HoverProvider/HoverProvider.js'

export const register = () => {
  // @ts-ignore
  vscode.registerSelectionProvider({
    languageId: 'json',
    provideSelections: SelectionProvider.provideSelections,
  })
  // @ts-ignore
  vscode.registerCompletionProvider(CompletionProvider)
  // @ts-ignore
  vscode.registerHoverProvider(HoverProvider)
}
