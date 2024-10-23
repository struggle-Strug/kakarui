export const handleKeyDown = (e, onSubmit = () => {}) => {
  const keyCode = e.which || e.keyCode
  if (keyCode === 13 && !e.shiftKey) {
    e.preventDefault()
    onSubmit()
  }
}

export const stringifyJsonData = (text) => (text ? JSON.stringify(text, null, 2) : '')

export const removeQuotes = (str) => {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1)
  }
  return str
}
