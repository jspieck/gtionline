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
  }

  convertFormat(num1, format1, format2) {
    if (num1 !== '') {
      const number = new tool.NumberPolyadic(format1, num1.toString());
      const converter = new tool.ConversionPolyadicNumbers(number, format2);
      this.result = converter.solution;
      this.watcher = converter.watcher;
      console.log(`Solution ${this.result}`);
      console.log(this.watcher);
    }
  }
}
