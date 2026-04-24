/**
 * Creates an object composed from key-value pairs.
 *
 * @param {Array} pairs - The key-value pairs.
 * @returns {Object} Returns the new object.
 *
 * @example
 * fromPairs([['a', 1], ['b', 2]])
 * // => { 'a': 1, 'b': 2 }
 */
export const fromPairs = (pairs) => {
  if (!Array.isArray(pairs)) {
    return {};
  }

  return pairs.reduce((result, [key, value]) => {
    if (key !== undefined && key !== null) {
      result[key] = value;
    }
    return result;
  }, {});
};

export default fromPairs;
