export const parseNumber = (scanner, ast) => {
  scanner.goBack(1)
  const rawValue = scanner.scanNumber()
  const value = parseFloat(rawValue)
  return value
}
