export const parseString = (scanner, ast) => {
  scanner.goBack(1)
  const value = scanner.scanString()
  return value
}
