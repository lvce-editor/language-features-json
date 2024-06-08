export const parsePropertyName = (scanner) => {
  const propertyName = scanner.scanPropertyName()
  return propertyName
}
