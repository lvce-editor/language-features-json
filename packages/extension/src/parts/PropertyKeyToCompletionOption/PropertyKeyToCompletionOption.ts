import type { CompletionItem } from '@lvce-editor/api'
import * as CompletionType from '../CompletionType/CompletionType.ts'

export const propertyKeyToCompletionOption = (key: string): CompletionItem => {
  return {
    kind: CompletionType.Property,
    label: key,
  }
}
