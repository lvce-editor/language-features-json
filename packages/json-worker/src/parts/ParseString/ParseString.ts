export const parseString = (scanner) => {
  scanner.goBack(1)
  const value = scanner.scanString()
  return value
}
