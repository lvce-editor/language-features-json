import type { Scanner } from '../Scanner/Scanner.ts'

export const parsePropertyName = (scanner: Scanner) => {
  const propertyName = scanner.scanPropertyName()
  return propertyName
}
