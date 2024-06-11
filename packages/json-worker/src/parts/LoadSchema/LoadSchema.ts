export const loadSchema = (schemaUri) => {
  try {
    if (!schemaUri) {
      return {}
    }
    return globalThis.rpc.invoke('Json.loadSchema', schemaUri)
  } catch (error) {
    throw new Error(`Failed to load schema: ${error}`)
  }
}
