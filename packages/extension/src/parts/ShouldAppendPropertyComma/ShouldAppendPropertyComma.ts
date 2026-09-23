const skipTrivia = (text: string, start: number): number => {
  let offset = start
  while (offset < text.length) {
    const char = text[offset]
    if (/\s/.test(char)) {
      offset++
      continue
    }
    if (char === '/' && text[offset + 1] === '/') {
      offset += 2
      while (offset < text.length && text[offset] !== '\n') {
        offset++
      }
      continue
    }
    if (char === '/' && text[offset + 1] === '*') {
      offset += 2
      while (
        offset < text.length &&
        !(text[offset] === '*' && text[offset + 1] === '/')
      ) {
        offset++
      }
      offset = Math.min(text.length, offset + 2)
      continue
    }
    break
  }
  return offset
}

export const shouldAppendPropertyComma = (
  text: string,
  offset: number,
): boolean => {
  const after = skipTrivia(text, offset)
  const nextChar = text[after]
  return nextChar !== undefined && nextChar !== ',' && nextChar !== '}'
}
