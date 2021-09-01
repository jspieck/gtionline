/* eslint no-useless-escape: 0  no-case-declarations: 0 */

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

export class CheckSolution {
  constructor(exponentBits) {
    classCallCheck(this, CheckSolution);
    this.exponentBits = exponentBits;
    this.backVB = '';
    this.backE = '';
    this.backM = '';
  }

  checkSolution(result, propVB, propE, propM) {
    if (propVB.replace(/\s/g, '') === `${result.sign}`) {
      this.backVB = 'correctInput';
    } else {
      this.backVB = 'incorrectInput';
    }
    const resultString = result.bitString.replace(/\s/g, '');
    const resultE = resultString.substring(1, 1 + this.exponentBits);
    const resultM = resultString.substring(1 + this.exponentBits);
    if (propE.replace(/\s/g, '') === resultE) {
      this.backE = 'correctInput';
    } else {
      this.backE = 'incorrectInput';
    }
    if (propM.replace(/\s/g, '') === resultM) {
      this.backM = 'correctInput';
    } else {
      this.backM = 'incorrectInput';
    }
  }
}
