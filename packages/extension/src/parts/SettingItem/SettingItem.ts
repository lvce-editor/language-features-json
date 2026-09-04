interface SettingItemOption {
  readonly id: string
  readonly label: string
}

type SettingType =
  | number
  | 'array'
  | 'boolean'
  | 'color'
  | 'enum'
  | 'none'
  | 'number'
  | 'string'
  | 'url'

export interface SettingItem {
  readonly description?: string
  readonly id: string
  readonly maximum?: number
  readonly minimum?: number
  readonly options?: readonly SettingItemOption[]
  readonly type: SettingType
  readonly value?: unknown
}
