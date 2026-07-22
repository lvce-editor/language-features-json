import type { JsonSchemaContribution } from '@lvce-editor/api'

const getBaseName = (uri: string): string => {
  const withoutQuery = uri.split(/[?#]/, 1)[0]
  return withoutQuery.slice(withoutQuery.lastIndexOf('/') + 1)
}

const matchesPattern = (fileName: string, pattern: string): boolean => {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replaceAll('*', '.*')
  return new RegExp(`^${escaped}$`).test(fileName)
}

export const matchesJsonSchema = (
  uri: string,
  contribution: JsonSchemaContribution,
): boolean => {
  const fileName = getBaseName(uri)
  const patterns =
    typeof contribution.fileMatch === 'string'
      ? [contribution.fileMatch]
      : contribution.fileMatch
  return patterns.some((pattern) => matchesPattern(fileName, pattern))
}
