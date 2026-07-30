const schemas = Object.create(null)

export const get = (uri) => {
  return schemas[uri]
}

export const has = (uri) => {
  return uri in schemas
}

export const set = (uri, schema) => {
  schemas[uri] = schema
}
