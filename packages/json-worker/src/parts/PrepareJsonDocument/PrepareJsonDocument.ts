import { AstNode } from '../AstNode/AstNode.ts'
import * as FindNodeAtOffset from '../FindNodeAtOffset/FindNodeAtOffset.ts'
import * as GetSchemaUri from '../GetSchemaUri/GetSchemaUri.ts'
import * as Jsonc from '../Jsonc/Jsonc.ts'
import * as LoadSchema from '../LoadSchema/LoadSchema.ts'

export interface ParseJsonDocument {
  readonly schema: any
  readonly node: AstNode
}

export const emptyDocument: ParseJsonDocument = {
  schema: {},
  node: {
    type: 0,
    childCount: 0,
    length: 0,
    offset: 0,
  },
}

export const prepareJsonDocument = async (
  textDocument: any,
  offset: number,
) => {
  const { uri, text } = textDocument
  const parsed = Jsonc.parse(text)
  const node = FindNodeAtOffset.findNodeAtOffset(parsed, offset)
  if (!node) {
    return emptyDocument
  }
  const schemaUri = await GetSchemaUri.getSchemaUri(uri)
  const schema = await LoadSchema.loadSchema(schemaUri)
  return {
    schema,
    node,
  }
}
