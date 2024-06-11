import * as Literal from '../Literal/Literal.ts'

export const parseLiteral = (scanner, ast) => {
  const rawValue = scanner.scanLiteral()
  switch (rawValue) {
    case Literal.True:
      return true
    case Literal.False:
      return false
    case Literal.Null:
      return null
    default:
      return undefined
  }
}
