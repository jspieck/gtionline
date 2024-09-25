/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import { roundArray } from './algorithms/calcHelper';

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

export class FormatConversions {
  constructor(exponentBits, numBits) {
    classCallCheck(this, FormatConversions);
    this.exponentBits = exponentBits;
    this.numBits = numBits;
    this.result = '';
  }

  getBias() {
    return (2 ** (this.exponentBits - 1)) - 1;
  }

  binToIEEE(num) {
    this.result = '';
    const bias = this.getBias();
    const fParts = num.replace(',', '.').split('.');
    let preCommaStr = fParts[0];
    const afterCommaStr = fParts[1];
    // extract sign
    let sign = 0;
    if (preCommaStr[0] === '-') {
      sign = 1;
      preCommaStr = preCommaStr.substring(1);
    }
    // get zero
    let isZero = true;
    for (const c of [preCommaStr, afterCommaStr].join('')) {
      if (c !== '0') {
        isZero = false;
        break;
      }
    }
    if (isZero) {
      const exponent = '0'.repeat(this.exponentBits);
      const mantissa = '0'.repeat(this.numBits - this.exponentBits - 1);
      this.result = `${sign} ${exponent} ${mantissa}`;
      return;
    }
    // trim leading zeroes
    const preDecimal = preCommaStr.replace(/^0+/, '');
    console.log(preDecimal);
    // transform to 1,xxx format
    let mantisse = preDecimal.substring(1);
    // console.log('Mantisse');
    // console.log(mantisse);
    const expBasis = mantisse.length;
    const numBitsMantisse = this.numBits - this.exponentBits - 1;
    // fParts[1] are the digits after the comma
    if (afterCommaStr != null) {
      mantisse += afterCommaStr;
    }
    let shiftFactor = 0;
    // eslint-disable-next-line
    // console.log("Before Correction", mantisse);
    if (preDecimal === '') {
      shiftFactor = mantisse.indexOf('1') + 1;
      mantisse = mantisse.slice(shiftFactor);
    }
    // console.log(shiftFactor, mantisse);
    if (mantisse.length > numBitsMantisse) {
      mantisse = roundArray(mantisse, numBitsMantisse);
    }
    if (mantisse.length < numBitsMantisse) {
      mantisse += '0'.repeat(numBitsMantisse - mantisse.length);
    }
    // console.log(mantisse);
    let exponent = (expBasis + bias - shiftFactor).toString(2);
    // fill with leading zeroes
    if (exponent.length > this.exponentBits || exponent === '1'.repeat(this.exponentBits)) {
      // ! We get infinity
      exponent = '1'.repeat(this.exponentBits);
      mantisse = '0'.repeat(numBitsMantisse);
      // exponent = exponent.substring(exponent.length - this.exponentBits);
    }
    exponent = '0'.repeat(this.exponentBits - exponent.length) + exponent;

    this.result = `${sign} ${exponent} ${mantisse}`;
  }

  ieeeToBin(num) {
    this.result = '';
    const ieeeWithoutSpace = num.replace(/\s/g, '');
    if (ieeeWithoutSpace.length !== this.numBits) {
      this.result = 0;
    }
    const sign = ieeeWithoutSpace[0] === 0 ? '' : '-';
    let exponent = ieeeWithoutSpace.substring(1, 1 + this.exponentBits);
    const mantisse = ieeeWithoutSpace.substring(1 + this.exponentBits, this.numBits);
    const bias = this.getBias();
    exponent -= bias;
    let preDecimal = 1;
    let decimal = mantisse;
    if (exponent < 0) {
      preDecimal = 0;
      decimal = `${'0'.repeat(exponent - 1)}1${mantisse}`;
    } else {
      preDecimal = `1${mantisse.substring(0, Math.min(exponent, mantisse.length))}
          ${'0'.repeat(Math.max(0, exponent - mantisse.length))}`;
      decimal = mantisse.substring(exponent);
    }
    if (decimal === '') {
      this.result = `${sign}${preDecimal}`;
    }
    this.result = `${sign}${preDecimal},${decimal}`;
  }

  ieeeToDec(num, edgecase = '') {
    let isDenormalized = false;
    if ((edgecase !== '') && (edgecase !== 'none')) {
      switch (edgecase) {
        case 'zero':
          this.result = '0.0';
          return;
        case 'nan':
          this.result = 'NaN';
          return;
        case 'inf':
          if (Number(num[0]) === 0) {
            this.result = 'Inf';
          } else {
            this.result = '-Inf';
          }
          return;
        case 'denormalized':
          isDenormalized = true;
          break;
        default:
      }
    }
    this.result = '';
    const ieeeWithoutSpace = num.replace(/\s/g, '');
    // get zero
    let isZero = true;
    for (const c of ieeeWithoutSpace.substr(1)) {
      if (c !== '0') {
        isZero = false;
        break;
      }
    }
    if (isZero) {
      this.result = 0.0;
      return;
    }
    // get nan
    let isNan = true;
    for (const c of ieeeWithoutSpace.substr(1)) {
      if (c !== '1') {
        isNan = false;
        break;
      }
    }
    if (isNan) {
      this.result = 'NaN';
      return;
    }
    if (ieeeWithoutSpace.length !== this.numBits) {
      this.result = 0;
    }
    console.log(ieeeWithoutSpace, this.exponentBits, this.numBits);
    const sign = ieeeWithoutSpace[0] === '0' ? 1 : -1;
    const exponentbits = ieeeWithoutSpace.substring(1, 1 + this.exponentBits);
    const mantisse = ieeeWithoutSpace.substring(1 + this.exponentBits, this.numBits);
    const bias = this.getBias();
    let exponent = 0.0;
    let calcExp = 0;
    for (let i = exponentbits.length - 1; i >= 0; i -= 1) {
      exponent += exponentbits[i] * (2 ** calcExp);
      calcExp += 1;
    }
    exponent -= bias;
    let decimal = isDenormalized ? 0.0 : 1.0;
    for (let i = 0; i < mantisse.length; i += 1) {
      decimal += mantisse[i] * (2 ** (-i - 1));
    }
    console.log(mantisse);
    console.log(sign, decimal, exponent, sign * decimal * (2 ** exponent));
    this.result = sign * decimal * (2 ** exponent);
  }

  decToBin(num) {
    this.result = '';
    const fRep = parseFloat(num.replace(',', '.'));
    this.result = fRep.toString(2);
  }

  binToDec(num) {
    this.result = '';
    const fRep = num.replace(',', '.');
    const fParts = fRep.split('.');
    let devVal = parseInt(fParts[0], 2);
    if (fParts[1] != null && fParts[1].lastIndexOf('1') !== -1) {
      const stripZeros = fParts[1].substring(0, fParts[1].lastIndexOf('1') + 1);
      const decimalPart = parseInt(stripZeros, 2) / (2 ** stripZeros.length);
      if (devVal < 0) {
        devVal -= decimalPart;
      } else {
        devVal += decimalPart;
      }
    }
    this.result = devVal;
  }
}
