import { NumberPolyadic } from './numberPolyadic';

export class AdditionPolyadic {
  constructor(n1, n2) {
    if (n1.power !== n2.power) {
      console.log(`AdditionPolyadic(Number, Number): power of n1(${n1.power})
            and power of n2(${n2.power}) not compatible.`);
      process.exit(1);
    }

    this.result = this._add(n1, n2);
    this.watcher = JSON.parse(JSON.stringify(this.result.watcher));
  }

  _add(n1, n2) {
    let result = '';
    if ((n1.sign === '+') && (n2.sign === '+')) { // (+) + (+)
      result = new NumberPolyadic(n1.power, n1.bitString);
      result._additionFloat(n2.bitString);
    } else if ((n1.sign === '+') && (n2.sign === '-')) { // (+) + (-) => (+) - (+)
      result = new NumberPolyadic(n1.power, n1.bitString);
      const bitString = n2.bitString.substring(1);
      result._subtractionFloat(bitString);
    } else if ((n1.sign === '-') && (n2.sign === '+')) { // (-) + (-) => - ((+) + (+))
      const bitString1 = n2.bitString.substring(1);
      const bitString2 = n2.bitString.substring(1);
      bitString2.shift();
      const intermidiate = new NumberPolyadic(n1.power, bitString1);
      intermidiate._additionFloat(bitString2);
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
