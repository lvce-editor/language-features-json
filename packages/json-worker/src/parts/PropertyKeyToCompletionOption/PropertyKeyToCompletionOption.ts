import { CompletionItem } from '../CompletionItem/CompletionItem.ts'
import * as CompletionType from '../CompletionType/CompletionType.ts'

export const propertyKeyToCompletionOption = (key: string): CompletionItem => {
  return {
    kind: CompletionType.Property,
    label: `"${key}"`,
  }
}
