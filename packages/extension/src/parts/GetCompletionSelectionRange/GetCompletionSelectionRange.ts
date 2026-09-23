import * as CompletionType from '../CompletionType/CompletionType.ts'

export interface CompletionSelectionRange {
  readonly endOffset: number
  readonly startOffset: number
}

export const getCompletionSelectionRange = (
  kind: number,
  label: string,
  snippet: string,
): CompletionSelectionRange | undefined => {
  if (kind === CompletionType.Value) {
    if (!snippet.startsWith('"') || !snippet.includes('"', 1)) {
      return undefined
    }
    const endOffset = snippet.endsWith(',') ? snippet.length - 2 : snippet.length - 1
    return { endOffset, startOffset: 1 }
  }
  if (kind !== CompletionType.Property) {
    return undefined
  }
  const propertyPrefix = `${JSON.stringify(label)}: `
  if (
    !snippet.startsWith(propertyPrefix) ||
    propertyPrefix.length === snippet.length
  ) {
    return undefined
  }
  const value = snippet.slice(propertyPrefix.length)
  const isString = value.startsWith('"') && value.includes('"', 1)
  const startOffset = propertyPrefix.length + (isString ? 1 : 0)
  const endOffset =
    snippet.length - (isString ? (value.endsWith(',') ? 2 : 1) : 0)
  return { endOffset, startOffset }
}
