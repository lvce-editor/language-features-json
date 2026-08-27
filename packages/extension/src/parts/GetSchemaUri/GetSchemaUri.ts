export const settingsSchemaUri = 'builtin-settings://settings.schema.json'

export const getSchemaUri = async (uri: string) => {
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
