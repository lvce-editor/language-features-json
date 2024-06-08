import * as Parser from '../Parser/Parser.ts'
import * as Scanner from '../Scanner/Scanner.ts'

export const parse = (text) => {
  const scanner = Scanner.createScanner(text)
  const result = Parser.parseValue(scanner)
  return result
}
