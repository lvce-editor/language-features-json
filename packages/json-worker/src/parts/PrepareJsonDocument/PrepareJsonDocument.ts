import { AstNode } from '../AstNode/AstNode.ts'
import * as FindNodeAtOffset from '../FindNodeAtOffset/FindNodeAtOffset.ts'
import * as GetSchema from '../GetSchema/GetSchema.ts'
import * as Jsonc from '../Jsonc/Jsonc.ts'

interface ParseJsonDocument {
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
  const schema = await GetSchema.getSchema(uri)
  return {
    schema,
    node,
  }
}
