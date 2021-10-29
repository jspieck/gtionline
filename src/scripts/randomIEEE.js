/* eslint no-useless-escape: 0  no-case-declarations: 0 */
function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

export class RandomIEEE {
  constructor(exponentBits, numBits) {
    classCallCheck(this, RandomIEEE);
    this.exponentBits = exponentBits;
    this.numBits = numBits;
    this.actBit = '';
    this.bitString = '';
    this.result = '';
  }

  generateRandomBit() {
    this.actBit = Math.round(Math.random());
  }

  generateRandomBits(n) {
    let bitString = '';
    for (let i = 0; i < n; i += 1) {
      this.generateRandomBit();
      bitString += this.actBit;
    }
    this.bitString = bitString;
  }

  generateRandomIEEE() {
    this.generateRandomBit();
    const actBit = this.actBit;
    this.generateRandomBits(this.exponentBits);
    const exponentBits = this.bitString;
    this.generateRandomBits(this.numBits - 1 - this.exponentBits);
    const mantissaBits = this.bitString;
    this.result = `${actBit} ${exponentBits} ${mantissaBits}`;
  }
}
