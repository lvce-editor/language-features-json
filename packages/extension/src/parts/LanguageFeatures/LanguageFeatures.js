import * as SelectionProvider from '../SelectionProvider/SelectionProvider.js'

export const register = () => {
  // @ts-ignore
  vscode.registerSelectionProvider({
    languageId: 'json',
    provideSelections: SelectionProvider.provideSelections,
  })
}
