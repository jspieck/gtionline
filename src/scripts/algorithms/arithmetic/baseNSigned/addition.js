import { NumberBaseNSigned } from './numberBaseNSigned';
import { SubtractionBaseNSigned } from './subtraction';
import { Algorithm } from '../../algorithm';

export class AdditionBaseNSigned {
  constructor(n1, n2) {
    if (n1.base !== n2.base) {
      throw new Error(`AdditionBaseNSigned.constructor(n1, n2): Base of n1(${n1.base})
        and base of n2(${n2.base}) must be qual.`);
    }

    this.watcher = null;
    this.result = this._add(n1, n2);
  }

  _add(n1, n2) {
    this.watcher = new Algorithm();
    if (!n1.isNegative && n2.isNegative) {
      // Subtract abs(n2) from n1.
      const toSubtract = new NumberBaseNSigned(n2.base, n2.arr, n2.offset);
      const subtraction = new SubtractionBaseNSigned(n1, toSubtract);
      this.watcher
        .step('OperatorSwitch')
        .saveVariable('subtraction', subtraction.watcher);
      return subtraction.getResult();
    }

    if (n1.isNegative && !n2.isNegative) {
      // Subtract abs(n1) from n2.
      const toSubtract = new NumberBaseNSigned(n1.base, n1.arr, n1.offset);
      const subtraction = new SubtractionBaseNSigned(n2, toSubtract);
      this.watcher
        .step('OperatorSwitch')
        .saveVariable('subtraction', subtraction.watcher);
      return subtraction.getResult();
    }

    const base = n1.base;

    // If both n1 and n2 are negative the result must also be negative.
    const isNegative = n1.isNegative && n2.isNegative;

    this.watcher.step('GetSign')
      .saveVariable('signN1', n1.isNegative)
      .saveVariable('signN2', n2.isNegative)
      .saveVariable('isNegative', isNegative);

    const n1Arr = [...n1.arr];
    const n2Arr = [...n2.arr];

    const offset = Math.max(n1.offset, n2.offset);

    if (n1.offset < offset) {
      n1Arr.push(...Array(offset - n1.offset).fill(0));
    }

    if (n2.offset < offset) {
      n2Arr.push(...Array(offset - n2.offset).fill(0));
    }

    // make arrays with the same length
    const length = Math.max(n1Arr.length, n2Arr.length);
    if (n1Arr.length < length) {
      n1Arr.unshift(...Array(length - n1Arr.length).fill(0));
    }
    if (n2Arr.length < length) {
      n2Arr.unshift(...Array(length - n2Arr.length).fill(0));
    }

    const overflow = [];
    const final = [];

    // binary addition
    overflow.unshift(0);
    for (let i = length - 1; i >= 0; i -= 1) {
      const m = n1Arr[i] + n2Arr[i] + overflow[0];

      final.unshift(m % base);
      overflow.unshift(Math.floor(m / base));
    }

    if (overflow[0] > 0) {
      final.unshift(overflow[0]);
    }

    const result = new NumberBaseNSigned(base, final, offset, isNegative);

    this.watcher.step('Addition')
      .saveVariable('op1', n1)
      .saveVariable('op2', n2)
      .saveVariable('op1Arr', [...n1Arr])
      .saveVariable('op2Arr', [...n2Arr])
      .saveVariable('carryArr', [...overflow])
      .saveVariable('resultArr', [...final])
      .saveVariable('result', result);

    this.watcher.step('Final')
      .saveVariable('result', result);

    return new NumberBaseNSigned(base, final, offset, isNegative);
  }

  getResult() {
    return this.result;
  }
}
