export interface JsonSchema {
  readonly $ref?: string
  readonly additionalProperties?: boolean | JsonSchema
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
  readonly items?: JsonSchema
  readonly type?: string | readonly string[]
  readonly enum?: readonly unknown[]
  readonly maximum?: number
  readonly minimum?: number
}
