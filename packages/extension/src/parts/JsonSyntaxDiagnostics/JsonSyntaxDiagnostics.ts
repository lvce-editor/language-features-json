import type { Diagnostic } from '@lvce-editor/api'

const removeComments = (
  text: string,
): { readonly text: string; readonly errorOffset: number } => {
  const characters = text.split('')
  let inString = false
  let escaped = false
  for (let i = 0; i < characters.length; i++) {
    const character = characters[i]
    if (inString) {
      if (escaped) {
        escaped = false
      } else if (character === '\\') {
        escaped = true
      } else if (character === '"') {
        inString = false
      }
      continue
    }
    if (character === '"') {
      inString = true
      continue
    }
    if (character !== '/') {
      continue
    }
    const next = characters[i + 1]
    if (next === '/') {
      while (
        i < characters.length &&
        characters[i] !== '\n' &&
        characters[i] !== '\r'
      ) {
        characters[i] = ' '
        i++
      }
      i--
    } else if (next === '*') {
      const start = i
      const end = text.indexOf('*/', i + 2)
      if (end < 0) {
        return { text: characters.join(''), errorOffset: start }
      }
      for (let offset = start; offset < end + 2; offset++) {
        if (characters[offset] !== '\n' && characters[offset] !== '\r') {
          characters[offset] = ' '
        }
      }
      i = end + 1
    }
  }
  return { text: characters.join(''), errorOffset: -1 }
}

const removeTrailingCommas = (text: string): string => {
  const characters = text.split('')
  let inString = false
  let escaped = false
  for (let i = 0; i < characters.length; i++) {
    const character = characters[i]
    if (inString) {
      if (escaped) {
        escaped = false
      } else if (character === '\\') {
        escaped = true
      } else if (character === '"') {
        inString = false
      }
      continue
    }
    if (character === '"') {
      inString = true
    } else if (character === ',') {
      let next = i + 1
      while (/\s/.test(characters[next] || '')) {
        next++
      }
      if (characters[next] === '}' || characters[next] === ']') {
        characters[i] = ' '
      }
    }
  }
  return characters.join('')
}

const getOffset = (error: Error): number => {
  const match = /position (\d+)/.exec(error.message)
  return match ? Number(match[1]) : 0
}

const getMessage = (
  error: Error,
  offset: number,
  textLength: number,
): string => {
  const message = error.message.toLowerCase()
  if (message.includes('unterminated string')) {
    return 'Unterminated JSON string.'
  }
  if (offset >= textLength) {
    return 'Expected a closing brace or bracket.'
  }
  if (message.includes("expected ',' or")) {
    return 'Expected a comma between JSON values.'
  }
  if (message.includes("expected ':'")) {
    return 'Expected a colon after the property name.'
  }
  if (message.includes('expected double-quoted property name')) {
    return 'Expected a quoted property name.'
  }
  return 'Invalid JSON syntax.'
}

const getPosition = (
  text: string,
  offset: number,
): { readonly columnIndex: number; readonly rowIndex: number } => {
  let columnIndex = 0
  let rowIndex = 0
  for (let i = 0; i < offset; i++) {
    if (text.charCodeAt(i) === 10) {
      columnIndex = 0
      rowIndex++
    } else {
      columnIndex++
    }
  }
  return { columnIndex, rowIndex }
}

const createDiagnostic = (
  text: string,
  offset: number,
  message: string,
): Diagnostic => {
  const start = Math.min(offset, text.length)
  const end = Math.min(start + (start < text.length ? 1 : 0), text.length)
  const endPosition = getPosition(text, end)
  return {
    ...getPosition(text, start),
    code: 'syntax',
    endColumnIndex: endPosition.columnIndex,
    endRowIndex: endPosition.rowIndex,
    message,
    source: 'json (syntax)',
    type: 'error',
  }
}

export const getDiagnostics = (text: string): readonly Diagnostic[] => {
  const commentsRemoved = removeComments(text)
  if (commentsRemoved.errorOffset >= 0) {
    return [
      createDiagnostic(
        text,
        commentsRemoved.errorOffset,
        'Unterminated JSON comment.',
      ),
    ]
  }
  try {
    JSON.parse(removeTrailingCommas(commentsRemoved.text))
    return []
  } catch (error) {
    if (!(error instanceof Error)) {
      return [createDiagnostic(text, 0, 'Invalid JSON syntax.')]
    }
    const offset = getOffset(error)
    return [
      createDiagnostic(
        text,
        offset,
        getMessage(error, offset, text.length),
      ),
    ]
  }
}
