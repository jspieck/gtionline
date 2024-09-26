import { NumberPolyadic } from './numberPolyadic';

export class SubtractionPolyadic {
  constructor(n1, n2) {
    if (n1.power !== n2.power) {
      console.log(`SubtractionPolyadic(Number, Number): power of n1(${n1.power})
            and power of n2(${n2.power}) not compatible.`);
      process.exit(1);
    }

    this.result = this._sub(n1, n2);
    this.watcher = JSON.parse(JSON.stringify(this.result.watcher));
  }

  _sub(n1, n2) {
    let result;
    if ((n1.sign === '+') && (n2.sign === '+')) { // (+) - (+)
      result = new NumberPolyadic(n1.power, n1.bitString);
      result._subtractionFloat(n2.bitString);
    } else if ((n1.sign === '+') && (n2.sign === '-')) { // (+) - (-) => (+) + (+)
      result = new NumberPolyadic(n1.power, n1.bitString);
      const bitString = n2.bitString.substring(1);
      result._additionFloat(bitString);
    } else if ((n1.sign === '-') && (n2.sign === '+')) { // (-) - (+) => - ((+) + (+))
      const bitString1 = n1.bitString.substring(1);
      const intermidiate = new NumberPolyadic(n1.power, bitString1);
      intermidiate._additionFloat(n2.bitString);
      let resultBitString = intermidiate.bitString;
      resultBitString = `-${resultBitString}`;
      result = new NumberPolyadic(n1.power, resultBitString);
    }
    return result;
  }

  getResult() {
    return this.result;
  }
}
