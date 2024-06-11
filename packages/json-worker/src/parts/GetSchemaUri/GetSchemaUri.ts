export const getSchemaUri = async (uri) => {
  if (uri.endsWith('package.json') || uri.endsWith('test.json')) {
    return 'src/package.schema.json'
  }
  return ''
}
