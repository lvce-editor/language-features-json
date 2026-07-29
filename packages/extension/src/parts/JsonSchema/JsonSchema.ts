export interface JsonSchema {
  readonly $ref?: string
  readonly additionalProperties?: boolean | JsonSchema
  readonly properties?: {
    readonly [key: string]: JsonSchema
  }
  readonly definitions?: {
    readonly [key: string]: JsonSchema
  }
  readonly allOf?: readonly JsonSchema[]
  readonly anyOf?: readonly JsonSchema[]
  readonly oneOf?: readonly JsonSchema[]
  readonly description?: string
  readonly type?: string | readonly string[]
  readonly enum?: readonly unknown[]
  readonly items?: JsonSchema
  readonly minimum?: number
}
