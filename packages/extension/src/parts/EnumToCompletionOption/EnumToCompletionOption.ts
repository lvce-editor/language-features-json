import type { CompletionItem } from '@lvce-editor/api'
import * as CompletionType from '../CompletionType/CompletionType.ts'

export const enumToCompletionOption = (value: string): CompletionItem => {
  return {
    kind: CompletionType.Value,
    label: value,
  }
}
