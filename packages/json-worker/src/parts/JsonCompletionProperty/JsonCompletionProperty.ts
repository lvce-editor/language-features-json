import { AstNode } from '../AstNode/AstNode.ts'
import type { CompletionItem } from '../CompletionItem/CompletionItem.ts'
import * as PropertyKeyToCompletionOption from '../PropertyKeyToCompletionOption/PropertyKeyToCompletionOption.ts'

export const jsonCompletionProperty = (
  schema: any,
  node: AstNode,
): readonly CompletionItem[] => {
  const keys = Object.keys(schema?.properties || {})
  return keys.map(PropertyKeyToCompletionOption.propertyKeyToCompletionOption)
}
