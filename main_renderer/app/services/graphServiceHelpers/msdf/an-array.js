module.exports = function anArray(arr) {
  return (
    arr.BYTES_PER_ELEMENT
    && Object.prototype.toString.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}
