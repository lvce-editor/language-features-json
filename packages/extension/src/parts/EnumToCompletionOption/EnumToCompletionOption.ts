import type { CompletionItem } from '@lvce-editor/api'
import * as CompletionType from '../CompletionType/CompletionType.ts'

export const enumToCompletionOption = (value: unknown): CompletionItem => {
  return {
    kind: CompletionType.Value,
    label: String(value),
    snippet: JSON.stringify(value),
  }
}
