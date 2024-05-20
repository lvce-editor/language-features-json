export const expand = (textDocument, positions) => {
  const { text } = textDocument
  const [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex] = positions
  let newStartColumnIndex = startColumnIndex
  while (newStartColumnIndex-- > 0) {
    if (text[newStartColumnIndex] === '"') {
      newStartColumnIndex--
      break
    }
  }
  let newEndColumnIndex = endColumnIndex
  while (newEndColumnIndex++ < text.length) {
    if (text[newEndColumnIndex] === '"') {
      newEndColumnIndex -= 2
      break
    }
  }
  return [
    startRowIndex, newStartColumnIndex, endRowIndex, newEndColumnIndex
  ]
}