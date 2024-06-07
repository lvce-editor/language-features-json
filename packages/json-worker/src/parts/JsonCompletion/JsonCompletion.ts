import * as CompletionType from '../CompletionType/CompletionType.ts'

export const jsonCompletion = (text, offset) => {
  return [
    {
      kind: CompletionType.Value,
      label: 'module',
    },
  ]
}
