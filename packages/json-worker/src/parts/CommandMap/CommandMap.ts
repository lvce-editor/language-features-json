import * as Selection from '../Selection/Selection.ts'
import * as JsonCompletion from '../JsonCompletion/JsonCompletion.ts'

export const commandMap = {
  'Selection.expand': Selection.expand,
  'Completion.getCompletion': JsonCompletion.jsonCompletion,
  'Completion.resolve': JsonCompletion.resolve,
}
