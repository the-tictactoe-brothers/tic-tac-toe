function maybe(key, value) {
  return value && { [key]: value }
}

module.exports = {
  maybe
}
