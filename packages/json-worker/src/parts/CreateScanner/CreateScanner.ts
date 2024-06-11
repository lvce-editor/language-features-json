import * as CharCode from '../JsoncCharCode/JsoncCharCode.ts'
import * as TokenType from '../JsoncTokenType/JsoncTokenType.ts'

export const createScanner = (text) => {
  let offset = 0
  const length = text.length

  const scanValue = () => {
    while (offset < length) {
      const code = text.charCodeAt(offset)
      switch (code) {
        case CharCode.CurlyOpen:
          offset++
          return TokenType.CurlyOpen
        case CharCode.CurlyClose:
          offset++
          return TokenType.CurlyClose
        case CharCode.SquareOpen:
          offset++
          return TokenType.SquareOpen
        case CharCode.SquareClose:
          offset++
          return TokenType.SquareClose
        case CharCode.DoubleQuote:
          offset++
          return TokenType.DoubleQuote
        case CharCode.Comma:
          text.slice(offset) //?
          offset++
          return TokenType.Comma
        case CharCode.Zero:
        case CharCode.One:
        case CharCode.Two:
        case CharCode.Three:
        case CharCode.Four:
        case CharCode.Five:
        case CharCode.Six:
        case CharCode.Seven:
        case CharCode.Eight:
        case CharCode.Nine:
        case CharCode.Dot:
          offset++
          return TokenType.Numeric
        case CharCode.CarriageReturn:
        case CharCode.LineFeed:
        case CharCode.Tab:
        case CharCode.Space:
          offset++
          break
        case CharCode.Slash:
          return TokenType.Slash
        default:
          return TokenType.Literal
      }
    }
    return TokenType.Eof
  }

  const scanString = () => {
    while (offset < length) {
      const code = text.charCodeAt(offset)
      if (code === CharCode.DoubleQuote) {
        break
      }
      offset++
    }
    offset++
    const start = offset
    while (offset < length) {
      const code = text.charCodeAt(offset)
      if (code === CharCode.DoubleQuote) {
        break
      }
      offset++
    }
    const result = text.slice(start, offset)
    offset++
    return result
  }

  const scanPropertyName = () => {
    return scanString()
  }

  const scanPropertyColon = () => {
    const code = text.charCodeAt(offset)
    offset++
  }

  const goBack = (delta) => {
    offset -= delta
  }

  const scanNumber = () => {
    const start = offset
    outer: while (offset < length) {
      const code = text.charCodeAt(offset)
      switch (code) {
        case CharCode.Zero:
        case CharCode.One:
        case CharCode.Two:
        case CharCode.Three:
        case CharCode.Four:
        case CharCode.Five:
        case CharCode.Six:
        case CharCode.Seven:
        case CharCode.Eight:
        case CharCode.Nine:
        case CharCode.Dot:
          break
        default:
          break outer
      }
      offset++
    }
    const result = text.slice(start, offset)
    result
    return result
  }

  const scanLiteral = () => {
    const start = offset
    outer: while (offset < length) {
      const code = text.charCodeAt(offset)
      switch (code) {
        case CharCode.LineFeed:
        case CharCode.CarriageReturn:
        case CharCode.Tab:
        case CharCode.Space:
        case CharCode.Comma:
          break outer
        default:
          break
      }
      offset++
    }
    const result = text.slice(start, offset)
    return result
  }

  const scanBlockComment = () => {
    while (offset < length) {
      if (
        text.charCodeAt(offset) === CharCode.Star &&
        text.charCodeAt(offset + 1) === CharCode.Slash
      ) {
        break
      }
      offset++
    }
  }

  const scanLineComment = () => {
    while (offset < length) {
      const code = text.charCodeAt(offset)
      if (code === CharCode.LineFeed) {
        break
      }
      offset++
    }
  }

  const scanComment = () => {
    const code = text.charCodeAt(offset)
    switch (code) {
      case CharCode.Star:
        return scanBlockComment()
      case CharCode.Slash:
        return scanLineComment()
      default:
        break
    }
  }

  return {
    scanValue,
    scanPropertyName,
    scanPropertyColon,
    scanString,
    scanNumber,
    goBack,
    scanLiteral,
    scanComment,
    getOffset() {
      return offset
    },
  }
}
