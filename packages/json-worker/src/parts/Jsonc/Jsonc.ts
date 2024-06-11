import * as Parser from '../Parser/Parser.ts'
import * as Scanner from '../CreateScanner/CreateScanner.ts'

export const parse = (text) => {
  const scanner = Scanner.createScanner(text)
  const result = Parser.parseValue(scanner)
  return result
}
