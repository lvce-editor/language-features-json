interface SettingItemOption {
  readonly id: string
  readonly label: string
}

export interface SettingItem {
  readonly description?: string
  readonly id: string
  readonly maximum?: number
  readonly minimum?: number
  readonly options?: readonly SettingItemOption[]
  readonly type: number
  readonly value?: unknown
}
