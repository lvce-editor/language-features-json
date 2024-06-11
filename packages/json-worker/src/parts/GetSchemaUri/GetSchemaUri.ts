export const getSchemaUri = async (uri: string) => {
  if (
    uri.endsWith('package.json') ||
    uri.endsWith('test.json') ||
    uri.endsWith('index.json')
  ) {
    return 'src/package.schema.json'
  }
  return ''
}
