import type { Diagnostic } from '@lvce-editor/api'

interface SyntaxError {
  readonly message: string
  readonly offset: number
}

const numberPattern = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y

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

const getSyntaxError = (text: string): SyntaxError | undefined => {
  let offset = 0
  let syntaxError: SyntaxError | undefined

  const fail = (message: string): false => {
    syntaxError = { message, offset }
    return false
  }

  const skipWhitespace = (): void => {
    while (
      text[offset] === ' ' ||
      text[offset] === '\t' ||
      text[offset] === '\r' ||
      text[offset] === '\n'
    ) {
      offset++
    }
  }

  const parseString = (): boolean => {
    const start = offset
    offset++
    while (offset < text.length) {
      const character = text[offset]
      if (character === '"') {
        offset++
        return true
      }
      if (character.charCodeAt(0) < 0x20) {
        return fail('Invalid character in JSON string.')
      }
      if (character === '\\') {
        offset++
        const escape = text[offset]
        if (escape === 'u') {
          const digits = text.slice(offset + 1, offset + 5)
          if (!/^[0-9a-f]{4}$/i.test(digits)) {
            return fail('Invalid Unicode escape in JSON string.')
          }
          offset += 5
          continue
        }
        if (!'"\\/bfnrt'.includes(escape || '')) {
          return fail('Invalid escape in JSON string.')
        }
      }
      offset++
    }
    offset = text.length
    if (offset < start) {
      offset = start
    }
    return fail('Unterminated JSON string.')
  }

  const parseObject = (): boolean => {
    offset++
    skipWhitespace()
    if (text[offset] === '}') {
      offset++
      return true
    }
    while (offset < text.length) {
      if (text[offset] !== '"') {
        return fail('Expected a quoted property name.')
      }
      if (!parseString()) {
        return false
      }
      skipWhitespace()
      if (text[offset] !== ':') {
        return fail('Expected a colon after the property name.')
      }
      offset++
      skipWhitespace()
      if (!parseValue()) {
        return false
      }
      skipWhitespace()
      if (text[offset] === '}') {
        offset++
        return true
      }
      if (text[offset] !== ',') {
        if (offset >= text.length) {
          return fail("Expected '}' to close the object.")
        }
        return fail('Expected a comma between JSON values.')
      }
      offset++
      skipWhitespace()
      if (text[offset] === '}') {
        offset++
        return true
      }
    }
    return fail("Expected '}' to close the object.")
  }

  const parseArray = (): boolean => {
    offset++
    skipWhitespace()
    if (text[offset] === ']') {
      offset++
      return true
    }
    while (offset < text.length) {
      if (!parseValue()) {
        return false
      }
      skipWhitespace()
      if (text[offset] === ']') {
        offset++
        return true
      }
      if (text[offset] !== ',') {
        if (offset >= text.length) {
          return fail("Expected ']' to close the array.")
        }
        return fail('Expected a comma between JSON values.')
      }
      offset++
      skipWhitespace()
      if (text[offset] === ']') {
        offset++
        return true
      }
    }
    return fail("Expected ']' to close the array.")
  }

  const parseValue = (): boolean => {
    skipWhitespace()
    const character = text[offset]
    if (character === '"') {
      return parseString()
    }
    if (character === '{') {
      return parseObject()
    }
    if (character === '[') {
      return parseArray()
    }
    const literal = ['true', 'false', 'null'].find((value) =>
      text.startsWith(value, offset),
    )
    if (literal) {
      offset += literal.length
      return true
    }
    if (character === '-' || (character >= '0' && character <= '9')) {
      numberPattern.lastIndex = offset
      const number = numberPattern.exec(text)
      if (number) {
        offset += number[0].length
        return true
      }
      return fail('Invalid JSON number.')
    }
    return fail('Expected a JSON value.')
  }

  skipWhitespace()
  if (!parseValue()) {
    return syntaxError
  }
  skipWhitespace()
  if (offset < text.length) {
    fail('Unexpected content after the JSON value.')
  }
  return syntaxError
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

const createDiagnostic = (text: string, error: SyntaxError): Diagnostic => {
  const start = Math.min(error.offset, text.length)
  const end = Math.min(start + (start < text.length ? 1 : 0), text.length)
  const endPosition = getPosition(text, end)
  return {
    ...getPosition(text, start),
    code: 'syntax',
    endColumnIndex: endPosition.columnIndex,
    endRowIndex: endPosition.rowIndex,
    message: error.message,
    source: 'json (syntax)',
    type: 'error',
  }
}

export const getDiagnostics = (text: string): readonly Diagnostic[] => {
  const commentsRemoved = removeComments(text)
  if (commentsRemoved.errorOffset >= 0) {
    return [
      createDiagnostic(text, {
        message: 'Unterminated JSON comment.',
        offset: commentsRemoved.errorOffset,
      }),
    ]
  }
  const error = getSyntaxError(commentsRemoved.text)
  return error ? [createDiagnostic(text, error)] : []
}
