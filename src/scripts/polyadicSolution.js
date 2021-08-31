/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import * as tool from './gti-tools';

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    console.log(instance);
    console.log(Constructor);
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
      const number = new tool.NumberPolyadic(format1, num1.toString());
      const converter = new tool.ConversionPolyadicNumbers(number, format2);
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
}
