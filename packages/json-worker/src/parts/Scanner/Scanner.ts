export interface Scanner {
  readonly scanValue: () => number
  readonly scanPropertyName: () => string
  readonly scanPropertyColon: () => void
  readonly scanString: () => void
  readonly goBack: (delta: number) => void
  readonly scanLiteral: () => any
  readonly scanNumber: () => void
  readonly scanComment: () => void
  readonly getOffset: () => number
}
