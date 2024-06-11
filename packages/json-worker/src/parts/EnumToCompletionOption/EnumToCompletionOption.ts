import type { CompletionItem } from '../CompletionItem/CompletionItem.ts'
import * as CompletionType from '../CompletionType/CompletionType.ts'

export const enumToCompletionOption = (value: string): CompletionItem => {
  return {
    kind: CompletionType.Value,
    label: value,
  }
}
