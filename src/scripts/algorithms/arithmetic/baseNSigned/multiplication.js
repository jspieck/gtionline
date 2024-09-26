import { NumberBaseNSigned } from './numberBaseNSigned';
import { AdditionBaseNSigned } from './addition';
import { Algorithm } from '../../algorithm';

export class MultiplicationBaseNSingleDigit {
  constructor(n, d) {
    if (d < 0 || d >= n.base) {
      throw new Error(`MultiplicationBaseNSigned.constructor(n1, n2): d(${d}) is not a part of base of n1(${n.base}).`);
    }

    this.result = this._multiply(n, d);
  }

  _multiply(n, d) {
    const offset = n.offset;
    const base = n.base;

    const isNegative = n.isNegative;

    const overflow = [0];
    const final = [];

    for (let i = n.arr.length - 1; i >= 0; i -= 1) {
      const m = d * n.arr[i] + overflow[0];
      final.unshift(m % base);
      overflow.unshift(Math.floor(m / base));
    }

    final.unshift(overflow[0]);

    return new NumberBaseNSigned(base, final, offset, isNegative);
  }

  getResult() {
    return this.result;
  }
}

export class MultiplicationBaseNSigned {
  constructor(n1, n2) {
    if (n1.base !== n2.base) {
      throw new Error(`MultiplicationBaseNSigned.constructor(n1, n2): Base of n1(${n1.base}) and base of n2(${n2.base}) must be qual.`);
    }

    this.watcher = null;
    this.result = this._multiply(n1, n2);
  }

  _multiply(n1, n2) {
    this.watcher = new Algorithm();

    this.watcher.step('MultiplicationInput')
      .saveVariable('n1Arr', [...n1.arr])
      .saveVariable('n2Arr', [...n2.arr]);

    const base = n1.base;
    const isNegative = (n1.isNegative && !n2.isNegative) || (n2.isNegative && !n1.isNegative);
    this.watcher.step('GetSign')
      .saveVariable('signN1', n1.isNegative)
      .saveVariable('signN2', n2.isNegative)
      .saveVariable('isNegative', isNegative);

    let cur = new NumberBaseNSigned(base, [0], 0, false);

    this.watcher.step('Multiplication')
      .saveVariable('num1', n1)
      .saveVariable('num2', n2);

    // remove right zeros, fastening the multiplication
    const arr1 = n1.arr;
    const arr2 = n2.arr;
    while ((arr1[arr1.length - 1] === 0 && arr2[arr2.length - 1] === 0)
      && (Math.min(n1.arr.length, n2.arr.length) > 0)) {
      arr1.pop();
      arr2.pop();
    }

    this.watcher.step('MultiplicationInput')
      .saveVariable('n1Arr', [...n1.arr])
      .saveVariable('n2Arr', [...n2.arr])
      .saveVariable('leftArr', [...arr1])
      .saveVariable('rightArr', [...arr2]);

    // multiplication with 0
    if (Math.min(n1.arr.length, n2.arr.length) === 0) {
      const result = new NumberBaseNSigned(base, [0]);
      this.watcher.step('Result')
        .saveVariable('result', result)
        .saveVariable('resultArr', [...result.arr]);
      return result;
    }

    // main multiplication
    this.watcher.step('MultiplicationSteps')
      .saveVariable('countSteps', n2.arr.length);

    for (let i = 0; i < n2.arr.length; i += 1) {
      const num = new NumberBaseNSigned(base, n1.arr, i, false);
      const toAdd = (new MultiplicationBaseNSingleDigit(num, arr2[i])).getResult();

      this.watcher.step('MultiplicationSteps')
        .saveVariable(`Step${i}_cur`, cur)
        .saveVariable(`Step${i}_toAdd`, toAdd);

      for (let j = 0; j < i; j += 1) {
        toAdd.arr.unshift(0);
      }
      cur = (new AdditionBaseNSigned(cur, toAdd)).getResult();
    }

    this.watcher.step('MultFinal')
      .saveVariable('cur', cur);

    const result = new NumberBaseNSigned(base, cur.arr, cur.offset, isNegative);

    this.watcher.step('Result')
      .saveVariable('result', result)
      .saveVariable('resultArr', [...result.arr]);

    return result;
  }

  getResult() {
    return this.result;
  }
}
