import { NumberBaseNComplement } from './numberBaseNComplement';
import { Algorithm } from '../../algorithm';

// NOTE: This current state is for supporting the addition in IEEE (only binary)
// maybe make a new file that dedicates itself to the BASENCOMPLEMENT Addition separately
export class AdditionBaseNComplement {
  constructor(n1, n2) {
    if (n1.base !== n2.base) {
      throw new Error(`AdditionBaseNComplement.constructor(n1, n2): Base of n1(${n1.base}) and base of n2(${n2.base}) must be qual.`);
    }

    if (n1.digitNum !== n2.digitNum) {
      throw new Error(`AdditionBaseNComplement.constructor(n1, n2): DigitNum of n1(${n1.digitNum}) and digitNum of n2(${n2.digitNum}) must be qual.`);
    }

    this.producedOverflow = false;
    this.carryOutSet = false;
    this.watcher = null;
    this.result = this._add(n1, n2);
  }

  _add(n1, n2) {
    this.watcher = new Algorithm();

    /* const isEqual = n1.arr.length === n2.arr.length &&
      n1.arr.every((value, index) => value === n2.arr[index]);
    if (isEqual && n1.signBit !== n2.signBit) { // edgecase x - x == zero
      const final = [];
      for (let i = 0; i < n1.arr.length; i++) {
        final.shift(0);
      }
      const result = new NumberBaseNComplement(n1.base, n1.digitNum, final, 0, false);
      this.watcher
        .step('Addition')
        .saveVariable('op1', n1)
        .saveVariable('op2', n2)
        .saveVariable('op1Arr', [...n1.arr])
        .saveVariable('op2Arr', [...n2.arr])
        .saveVariable('carryArr', [])
        .saveVariable('resultArr', [...final])
        .saveVariable('result', result)
        .saveVariable('overflow', this.producedOverflow)
        .saveVariable('equal', isEqual);
      return result;
    } */

    const base = n1.base;
    const n1Arr = [...n1.arr];
    const n2Arr = [...n2.arr];
    const carryBits = [];
    const final = [];

    // binary addition
    carryBits.unshift(0);
    for (let i = n1Arr.length - 1; i >= 0; i -= 1) {
      const m = n1Arr[i] + n2Arr[i] + carryBits[0];

      final.unshift(m % base);
      carryBits.unshift(Math.floor(m / base));
    }
    // We have an overflow if the XOR of the first two carry out bits are 1
    this.producedOverflow = carryBits[0] !== carryBits[1];

    // TODO this negative value is IEEE specific, since an overflow does not change the sign
    const isNegative = (n1.signBit === 1 && n2.signBit === 1) || (
      !(n1.signBit === 0 && n2.signBit === 0) && (final[0] === 1 && !this.producedOverflow)
    );
    if (isNegative) { // cut throuth overflow for negative values
      while (final.length > n1.digitNum) {
        final.shift();
      }
    }
    let digitNum = n1.digitNum;
    // add overflow for positive or neg/neg addition
    if ((n1.signBit === n2.signBit) && (carryBits.length > digitNum)) {
      digitNum += 1;
      final.unshift(carryBits[0]);
    }

    this.negativeResult = isNegative;
    const result = new NumberBaseNComplement(base, digitNum, final, 0, false);

    this.watcher
      .step('Addition')
      .saveVariable('op1', n1)
      .saveVariable('op2', n2)
      .saveVariable('op1Arr', [...n1Arr])
      .saveVariable('op2Arr', [...n2Arr])
      .saveVariable('carryArr', [...carryBits])
      .saveVariable('resultArr', [...final])
      .saveVariable('result', result)
      .saveVariable('overflow', this.producedOverflow);
    // .saveVariable('equal', isEqual);

    return result;
  }

  getResult() {
    return this.result;
  }
}
