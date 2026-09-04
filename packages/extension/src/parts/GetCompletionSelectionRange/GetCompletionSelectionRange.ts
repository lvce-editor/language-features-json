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
  return {
    endOffset: snippet.length,
    startOffset: propertyPrefix.length,
  }
}
