/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import * as tool from './gti-tools';

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
    const fRep = num.replace(',', '.');
    const fParts = fRep.split('.');
    // extract sign
    let sign = 0;
    if (fParts[0][0] === '-') {
      sign = 1;
      fParts[0] = fParts[0].substring(1);
    }
    // get zero
    let isZero = true;
    for (const c of [fParts[0], fParts[1]].join('')) {
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
    const preDecimal = fParts[0].replace(/^0+/, '');
    // transform to 1,xxx format
    let mantisse = preDecimal.substring(1);
    const correction = preDecimal === '';
    const shiftNumber = mantisse.length;
    const numBitsMantisse = this.numBits - this.exponentBits - 1;
    if (fParts[1] != null) {
      mantisse += fParts[1];
    }
    if (correction) {
      mantisse = mantisse.slice(1);
    }
    if (mantisse.length > numBitsMantisse) {
      mantisse = tool.roundArray(mantisse, numBitsMantisse);
    }
    if (mantisse.length < numBitsMantisse) {
      mantisse += '0'.repeat(numBitsMantisse - mantisse.length);
    }
    let exponent = (shiftNumber + bias - correction).toString(2);
    // fill with leading zeroes
    if (exponent.length > this.exponentBits) {
      // TODO Number is too big and cannot be displayed
      exponent = exponent.substring(exponent.length - this.exponentBits);
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
    if ((edgecase !== '') && (edgecase !== 'none')) {
      switch (edgecase) {
        case 'zero':
          this.result = '0.0';
          return;
        case 'nan':
          this.result = 'NaN';
          return;
        case 'inf':
          if (num[0] === 0) {
            this.result = 'Inf';
          } else {
            this.result = '-Inf';
          }
          return;
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
    let decimal = 1.0;
    for (let i = 0; i < mantisse.length; i += 1) {
      decimal += mantisse[i] * (2 ** (-i - 1));
    }
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
