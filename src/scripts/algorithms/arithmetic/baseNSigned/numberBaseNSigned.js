function numToChar(num) {
  if (num >= 0 && num <= 9) {
    return String.fromCharCode(num + '0'.charCodeAt());
  }
  if (num >= 10 && num <= 35) {
    return String.fromCharCode(num + 'A'.charCodeAt());
  }

  return '';
}

function charToNum(chr) {
  if ('0'.charCodeAt() <= chr.charCodeAt() && chr.charCodeAt() <= '9'.charCodeAt()) {
    return chr.charCodeAt() - '0'.charCodeAt();
  }
  if ('A'.charCodeAt() <= chr.charCodeAt() && chr.charCodeAt() <= 'Z') {
    return chr.charCodeAt() - 'A'.charCodeAt() + 10;
  }

  return -1;
}

// Representation of a number in base n (2 <= n <= 26) with support of floating points.
export class NumberBaseNSigned {
  constructor(base, representation, offset = 0, isNegative = false) {
    if (base < 2 || base > 36) {
      throw new Error(`NumberBaseNSigned.constructor(base, representation, ...): Base ${base} is not supported.`);
    }

    this.base = base;
    this.offset = offset;
    this.isNegative = isNegative;

    this.arr = null;
    this.stringRepresentation = null;

    if (!this._checkArray(representation)) {
      throw new Error('NumberBaseNSigned.constructor(base, representation, ...): representation contains invalid number.');
    }

    this.arr = [...representation];

    this._normalizeOffset();
    this._normalizeArray();

    this.stringRepresentation = this._constructString(this.arr);
  }

  _normalizeOffset() {
    while (this.offset < 0) {
      this.arr.push(0);
      this.offset += 1;
    }
  }

  _normalizeArray() {
    while (this.arr.length > this.offset + 1 && this.arr[0] === 0) {
      this.arr.splice(0, 1);
    }

    while (this.offset > 0 && this.arr[this.arr.length - 1] === 0) {
      this.arr.splice(this.arr.length - 1, 1);
      this.offset -= 1;
    }
  }

  _checkArray(arr) {
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i] < 0 || this.base <= arr[i]) {
        return false;
      }
    }
    return true;
  }

  _constructString(arr) {
    let result = '';
    for (let i = 0; i < arr.length; i += 1) {
      result += numToChar(arr[i]);
      if (arr.length - 1 - i === this.offset && this.offset > 0) {
        result += '.';
      }
    }
    if (this.isNegative) {
      result = `-${result}`;
    }

    return result;
  }
}

export function getNumFromString(base, str) {
  if (base < 2 || base > 36) {
    throw new Error(`getNumFromString(base, str): Base ${base} is not supported.`);
  }

  let pointCount = 0;
  let signCount = 0;

  const arr = [];
  let offset = 0;
  let isNegative = false;

  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === '-' || str[i] === '+') {
      isNegative = (str[i] === '-');
      signCount += 1;
      continue;
    }

    if (str[i] === '.') {
      offset = str.length - i - 1;
      pointCount += 1;
      continue;
    }

    const n = charToNum(str[i]);
    if (n < 0 || n >= base) {
      throw new Error('getNumFromString(base, str): Given string is not compatible with base.');
    }
    arr.push(charToNum(str[i]));
  }

  if (pointCount > 1) {
    throw new Error('getNumFromString(base, str): Given string contains more than 1 point.');
  }

  if (signCount > 1) {
    throw new Error('getNumFromString(base, str): Given string contains more than 1 sign.');
  }

  return new NumberBaseNSigned(base, arr, offset, isNegative);
}
