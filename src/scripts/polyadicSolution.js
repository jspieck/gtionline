/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import { NumberPolyadic } from './algorithms/arithmetic/polyadic/numberPolyadic';
import { AdditionPolyadic } from './algorithms/arithmetic/polyadic/addition';
import { SubtractionPolyadic } from './algorithms/arithmetic/polyadic/subtraction';
import { ConversionPolyadicNumbers } from './algorithms/arithmetic/polyadic/conversionPolyadicNumbers';

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

export class PolyadicSolution {
  constructor() {
    classCallCheck(this, PolyadicSolution);
    this.result = '';
    this.resultObject = '';
    this.watcher = '';
    this.modus = '';
  }

  convertFormat(num1, format1, format2) {
    if (num1 !== '') {
      const number = new NumberPolyadic(format1, num1.toString(format1));
      const converter = new ConversionPolyadicNumbers(number, format2);
      this.modus = converter.modus;
      this.result = converter.solution.bitString;
      this.watcher = converter.watcher;
      if (Array.isArray(this.watcher)) {
        if (this.modus === 'PowerToTen') {
          this.resultObject = this.watcher[0].steps.Result.data.resultNumber;
        } else {
          this.resultObject = this.watcher[1].steps.Result.data.resultNumber;
        }
      } else {
        this.resultObject = this.watcher.steps.Result.data.resultNumber;
      }
    }
  }

  calcArithmeticSolution(num1, num2, format, operator) {
    const number1 = new NumberPolyadic(format, num1.toString(format));
    const number2 = new NumberPolyadic(format, num2.toString(format));
    switch (operator) {
      case 'add':
        const addition = new AdditionPolyadic(number1, number2);
        this.result = addition.result.bitString;
        this.resultObject = addition.result;
        this.watcher = JSON.parse(JSON.stringify(addition.watcher));
        break;
      case 'sub':
        const subtraction = new SubtractionPolyadic(number1, number2);
        this.result = subtraction.result.bitString;
        this.resultObject = subtraction.result;
        this.watcher = JSON.parse(JSON.stringify(subtraction.watcher));
        break;
      default:
    }
  }
}
