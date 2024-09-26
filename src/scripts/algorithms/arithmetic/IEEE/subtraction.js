import { NumberIEEE } from './numberIEEE';
import { AdditionIEEE } from './addition';
import { Algorithm } from '../../algorithm';

export class SubtractionIEEE {
  constructor(n1, n2) {
    if (n1.expBitNum !== n2.expBitNum) {
      console.log(`SubtractionIEEE(Number, Number): expBitNum of n1(${n1.expBitNum}) and expBitNum of n2(${n2.expBitNum}) not compatible.`);
    }

    if (n1.manBitNum !== n2.manBitNum) {
      console.log(`SubtractionIEEE(Number, Number): manBitNum of n1(${n1.manBitNum}) and manBitNum of n2(${n2.manBitNum}) not compatible.`);
    }

    this.producedOverflow = false;
    this.result = this._subtract(n1, n2);
  }

  _subtract(n1, n2) {
    this.watcher = new Algorithm();
    const flipedArr2 = [...n2.arr];
    flipedArr2[0] = flipedArr2[0] === 0 ? 1 : 0;

    const op1 = new NumberIEEE(n1.expBitNum, n1.manBitNum, n1.arr);
    const op2 = new NumberIEEE(n2.expBitNum, n2.manBitNum, flipedArr2);

    this.watcher = this.watcher.step('Input')
      .saveVariable('op1Sign', op1.sign)
      .saveVariable('op1Sign', op1.exponentBits)
      .saveVariable('op1Sign', op1.mantissaBits)
      .saveVariable('op1Sign', op2.sign)
      .saveVariable('op1Sign', op2.exponentBits)
      .saveVariable('op1Sign', op2.mantissaBits);

    // a - b = a + (-b)
    const addition = new AdditionIEEE(op1, op2);
    this.watcher = this.watcher.step('Addition')
      .saveVariable('addition', addition.watcher);
    return addition.getResult();
  }

  getResult() {
    return this.result;
  }
}
