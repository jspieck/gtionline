/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import * as tool from './gti-tools';

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    console.log(instance);
    console.log(Constructor);
    throw new TypeError('Cannot call a class as a function');
  }
}

export class IEEESolution {
  constructor(exponentBits, numBits) {
    classCallCheck(this, IEEESolution);
    this.exponentBits = exponentBits;
    this.numBits = numBits;
    this.actBit = '';
    this.bitString = '';
    this.result = '';
    this.resultObject = '';
    this.watcher = '';
    this.negativeSummand = false;
    this.negativeSubtrahend = false;
    this.denominatorZero = true;
  }

  computeSolution(num1, num2, operator) {
    if (num1 !== '' && num2 !== '') {
      const y1 = tool.getIEEEFromString(this.exponentBits, num1);
      const y2 = tool.getIEEEFromString(this.exponentBits, num2);
      let result = null;
      this.negativeSummand = false;
      this.negativeSubtrahend = false;
      this.denominatorZero = false;
      switch (operator) {
        case 'add':
          if (y1.sign === 0 && y2.sign === 0) {
            result = new tool.AdditionIEEE(y1, y2);
            this.resultObject = result.watcher.steps.Result.data.result;
          } else if (y2.sign === 1) {
            y2.sign = 0;
            y2.arr[0] = 0;
            this.negativeSummand = true;
            result = new tool.SubtractionIEEE(y1, y2);
            // eslint-disable-next-line max-len
            this.resultObject = result.watcher.steps.Addition.data.addition.steps.Result.data.result;
          } else {
            this.negativeSummand = true;
            result = new tool.SubtractionIEEE(y1, y2);
            // eslint-disable-next-line max-len
            this.resultObject = result.watcher.steps.Addition.data.addition.steps.Result.data.result;
          }
          break;
        case 'mul':
          result = new tool.MultiplicationIEEE(y1, y2);
          this.resultObject = result.watcher.steps.Result.data.result;
          break;
        case 'sub':
          if (y2.sign === 0) {
            result = new tool.SubtractionIEEE(y1, y2);
            this.resultObject = result.watcher.steps.Result.data.result;
          } else if (y1.sign === 1) {
            this.negativeSubtrahend = true;
            result = new tool.SubtractionIEEE(y1, y2);
            // eslint-disable-next-line max-len
            this.resultObject = result.watcher.steps.Addition.data.addition.steps.Result.data.result;
          } else {
            this.negativeSubtrahend = true;
            y2.sign = 0;
            y2.arr[0] = 0;
            result = new tool.AdditionIEEE(y1, y2);
            this.resultObject = result.watcher.steps.Result.data.result;
          }
          break;
        case 'div':
          if (y2.isZero) {
            this.denominatorZero = true;
            return;
          }
          result = new tool.DivisionIEEE(y1, y2);
          this.resultObject = result.watcher.steps.Result.data.result;
          break;
        default:
      }
      this.watcher = result.watcher;
      let solution = '';
      solution = result.getResult().bitString;
      if (result.getResult().isNaN) solution += ' is Nan';
      if (result.getResult().isZero) solution += ' is Zero';
      if (result.getResult().isInfinity) solution += ' is Inf';
      this.result = solution;
    }
  }
}
