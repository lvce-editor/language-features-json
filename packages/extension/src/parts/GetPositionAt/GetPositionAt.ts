export interface Position {
  readonly columnIndex: number
  readonly rowIndex: number
}

export const getPositionAt = (text: string, offset: number): Position => {
  let rowIndex = 0
  let lastLineStart = 0
  for (let index = 0; index < offset; index++) {
    if (text.charCodeAt(index) === 10) {
      rowIndex++
      lastLineStart = index + 1
    }
  }
  return {
    columnIndex: offset - lastLineStart,
    rowIndex,
  }
}
