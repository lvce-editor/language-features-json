export const settingsSchemaUri = 'builtin-settings://settings.schema.json'

const schemaPropertyPattern = /^\s*\{\s*"\$schema"\s*:\s*("(?:[^"\\]|\\.)*")/

const getDeclaredSchemaUri = (text: string): string => {
  try {
    const value: unknown = JSON.parse(text)
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const schemaUri = (value as Record<string, unknown>).$schema
      if (typeof schemaUri === 'string') {
        return schemaUri
      }
    }
  } catch {
    // A document can be temporarily invalid while completion is requested. The
    // component-state provider keeps $schema first so it can still be resolved.
  }
  const match = schemaPropertyPattern.exec(text)
  if (!match) {
    return ''
  }
  try {
    const value: unknown = JSON.parse(match[1])
    return typeof value === 'string' ? value : ''
  } catch {
    return ''
  }
}

export const getSchemaUri = async (uri: string, text = '') => {
  const declaredSchemaUri = getDeclaredSchemaUri(text)
  if (declaredSchemaUri) {
    return declaredSchemaUri
  }
  if (uri.endsWith('/settings.json')) {
    return settingsSchemaUri
  }
  if (
    uri.endsWith('package.json') ||
    uri.endsWith('test.json') ||
    uri.endsWith('index.json') ||
    uri.endsWith('file.json')
  ) {
    return 'src/package.schema.json'
  }
  if (uri.endsWith('tsconfig.json')) {
    return 'src/tsconfig.schema.json'
  }
  return ''
}
