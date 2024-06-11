export interface AstNode {
  readonly type: number
  readonly offset: number
  readonly length: number
  readonly childCount: number
}
