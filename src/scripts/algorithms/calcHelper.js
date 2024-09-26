/**
 * roundArray rounds an array to a given length
 * @param inArr: Array to round, can also be a string
 * @param count: necassary length
 * @param roundup: true if the array has to be up rounded
 * @param base: base of given array
 * @returns {[]|*}: rounded arraay in the given base
 */
export function roundArray(inArr, count, roundup = false, base = 2) {
  let arr = inArr;

  if (arr.length < count) {
    return arr;
  }

  let isString = false;
  if (typeof arr === 'string') {
    arr = arr.split('').map((num) => parseInt(num, 10));
    isString = true;
  }

  let toRound = roundup;
  if (!toRound) {
    toRound = arr[count] >= (base / 2);
  }
  while (arr.length > count) {
    arr.pop();
  }
  if (toRound) {
    const carryBits = [];
    const final = [];
    carryBits.unshift(1);
    for (let i = arr.length - 1; i >= 0; i -= 1) {
      const m = arr[i] + carryBits[0];

      final.unshift(m % base);
      carryBits.unshift(Math.floor(m / base));
    }
    if (carryBits[0] !== carryBits[1]) {
      final.unshift(1);
      final.pop();
    }
    if (isString) {
      return final.join('');
    }
    return final;
  }
  if (isString) {
    return arr.join('');
  }
  return arr;
}
