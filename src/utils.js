export function delegate (wrapper, method, key) {
  wrapper.prototype[method] = function (...args) {
    const origin = this[key]
    const result = origin[method](...args)

    return result === origin
      // If the original method returns this, then returns this of the wrapper
      ? this
      // If
      : result
  }
}
