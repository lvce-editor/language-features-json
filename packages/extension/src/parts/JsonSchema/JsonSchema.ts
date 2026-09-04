export interface JsonSchema {
  readonly $ref?: string
  readonly default?: unknown
  readonly properties?: {
    readonly [key: string]: JsonSchema
  }
  readonly definitions?: {
    readonly [key: string]: JsonSchema
  }
  readonly allOf?: readonly JsonSchema[]
  readonly anyOf?: readonly JsonSchema[]
  readonly description?: string
  readonly type?: string
  readonly enum?: readonly unknown[]
  readonly maximum?: number
  readonly minimum?: number
}
