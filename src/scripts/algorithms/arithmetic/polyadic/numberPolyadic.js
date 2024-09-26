import { Algorithm } from '../../algorithm';

// Representation of a number respective a given power
export class NumberPolyadic {
  constructor(power, representation) {
    if (power <= 1) {
      throw new TypeError('Polyadic Number: Invalid power given, has to be greater 1.');
    }

    if (power === 16) {
      this.power = 0x10;
    } else {
      this.power = power;
    }

    this.comma = representation.length;
    if (!this._checkArray(representation)) {
      throw new TypeError('Polyadic Number: Invalid representation given.');
    }

    this.arr = [...representation];
    this._actualizeValues();
    this.isNegative = false; // for subtraction
    this.watcher = new Algorithm();
  }

  _actualizeValues() {
    this._checkArray(this.arr);
    this.value = this._getValue();
    this.bitString = this.arr.join('');
    this.valueString = this._constructValString();
  }

  _checkArray(arr) {
    this.comma = arr.length;
    let commas = 0;
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i] < 0 || arr[i] >= this.power) {
        return false;
      }
      if ((arr[i] === ',') || (arr[i] === '.')) {
        this.comma = i;
        commas += 1;
        if (commas > 1) {
          return false;
        }
      }
    }
    return true;
  }

  _getValue() {
    let firstNum = 0;
    if (this.arr[0] === '-') {
      this.sign = '-';
      firstNum = 1;
    } else if (this.arr[0] === '+') {
      this.sign = '+';
      firstNum = 1;
    } else {
      this.sign = '+';
    }
    if (this.power === 10) {
      return parseFloat(this.arr.join(''));
    }
    let val = 0;
    let count = 0;
    for (let i = this.comma - 1; i >= firstNum; i -= 1) {
      val += parseInt(this.arr[i], this.power) * (this.power ** count);
      count += 1;
    }
    count = 1;
    for (let i = this.comma + 1; i < this.arr.length; i += 1) {
      val += parseInt(this.arr[i], this.power) * ((1 / this.power) ** count);
      count += 1;
    }
    if (this.sign === '-') {
      return -val;
    }
    return val;
  }

  _constructValString() {
    return `${this.value}`;
  }

  // arithmetical methods for direct conversion and polyadic arithmetic

  /** !!Internal method!!
   * Add a single digit to the actual number.
   * @param {*} digit : Int, single digit number.
   * @param {*} exp : Int, optional position in the array.
   */
  _additionOneDigit(digit, exp = 0) {
    // pepare working arrays
    const splitted = this.arr.join('').split('.');
    let numBeforeComma = [];
    let numAfterComma = [];
    if ((Array.isArray(splitted)) && (splitted.length === 2)) {
      numBeforeComma = splitted[0].split('');
      numAfterComma = splitted[1].split('');
    } else {
      numBeforeComma = splitted[0].split('');
    }

    let overflow = 0;
    let act = digit;
    let breakAfterComma = false;
    // before comma
    if (exp < 0) {
      for (let i = 0; i < Math.abs(exp) + 1 - numAfterComma.length; i += 1) { // left padding
        numAfterComma.push('0');
      }
      for (let i = Math.abs(exp) - 1; i >= 0; i -= 1) {
        let res = 0;
        if (this.power === 16) {
          res = parseInt(numAfterComma[i], 16) + parseInt(act, 16);
        } else {
          res = parseInt(numAfterComma[i], 10) + parseInt(act, 10);
        }
        if (res >= this.power) {
          overflow = res - this.power;
          numAfterComma[i] = overflow.toString(this.power).toUpperCase();
          act = 1;
          this.watcher = this.watcher.step('constructResult')
            .saveVariable(`overflowAfterComma${i}`, 1);
        } else {
          numAfterComma[i] = res.toString(this.power).toUpperCase();
          breakAfterComma = true;
          // this.watcher = this.watcher.step('constructResult')
          //   .saveVariable(`overflowAfterComma${i}`, 0);
          break;
        }
      }
    }

    // after comma
    if (!breakAfterComma || (exp >= 0)) {
      let start = numBeforeComma.length - 1;
      if (exp >= 0) {
        for (let i = 0; i < exp + 1 - numBeforeComma.length; i += 1) { // left padding
          numBeforeComma.unshift('0');
        }
        start = numBeforeComma.length - 1 - exp;
      }
      for (let i = start; i >= 0; i -= 1) {
        let res = 0;
        if (this.power === 16) {
          res = parseInt(numBeforeComma[i], 16) + parseInt(act, 16);
        } else {
          res = parseInt(numBeforeComma[i], 10) + parseInt(act, 10);
        }
        if (res >= this.power) {
          overflow = res - this.power;
          numBeforeComma[i] = overflow.toString(this.power).toUpperCase();
          act = 1;
          this.watcher = this.watcher.step('constructResult')
            .saveVariable(`overflowBeforeComma${i}`, 1);
          if (i === 0) { // overflow at highest position
            numBeforeComma.unshift('1');
          }
        } else {
          numBeforeComma[i] = res.toString(this.power).toUpperCase();
          // this.watcher = this.watcher.step('constructResult')
          //   .saveVariable(`overflowBeforeComma${i}`, 1);
          break;
        }
      }
    }

    const resultArray = [];
    numBeforeComma.map((a) => resultArray.push(a));
    if ((Array.isArray(splitted)) && (splitted.length === 2)) {
      resultArray.push('.');
      numAfterComma.map((a) => resultArray.push(a));
    }
    this.arr = resultArray;
  }

  /** !!Internal method!!
   * Subtract a single digit to the actual number.
   * @param {*} digit : Int, single digit number.
   * @param {*} exp : Int, optional position in the array.
   */
  _subtractOneDigit(digit, exp = 0) {
    // pepare working arrays
    const splitted = this.arr.join('').split('.');
    let numBeforeComma = [];
    let numAfterComma = [];
    if ((Array.isArray(splitted)) && (splitted.length === 2)) { // have comma?
      numBeforeComma = splitted[0].split('');
      numAfterComma = splitted[1].split('');
    } else {
      numBeforeComma = splitted[0].split('');
    }

    let underflow = 0;
    let act = digit;
    // Check if result must be negative
    if ((exp >= 0) && (numBeforeComma.length < exp + 1)) {
      // case general higher exponent at subtrahend
      this.isNegative = true;
      for (let i = 0; i < exp + 1 - numBeforeComma.length; i += 1) { // left padding
        numBeforeComma.unshift('0');
      }
    } else if (
      // case subtrahend and minuend has the same exponent
      // but subtrahend has the higher digit at highest exponent
      (exp >= 0)
      && (numBeforeComma.length === exp + 1)
      && (parseInt(numBeforeComma[exp], this.power) - parseInt(act, this.power) < 0)
    ) {
      this.isNegative = true;
    } else if (
      // case no number before comma
      // exponenten subtrahend after comma is greater the exponent of the minuend
      (exp < 0)
      && (numBeforeComma.length === 0)
      && (numAfterComma.length + exp < 0)) {
      this.isNegative = true;
    }

    // calc result for a single digit
    let breakAfterComma = false;
    this.watcher = this.watcher.step('constructResult')
      .saveVariable('digit', digit)
      .saveVariable('exp', exp);
    // before comma
    if (exp < 0) {
      for (let i = 0; i < Math.abs(exp) - numAfterComma.length; i += 1) { // left padding
        numAfterComma.push('0');
      }
      for (let i = Math.abs(exp) - 1; i >= 0; i -= 1) {
        let res = 0;
        if (this.power === 16) {
          res = parseInt(numAfterComma[i], 16) - parseInt(act, 16);
        } else {
          res = parseInt(numAfterComma[i], 10) - parseInt(act, 10);
        }
        if (res < 0) {
          underflow = Math.abs(res);
          numAfterComma[i] = (this.power - underflow).toString(this.power).toUpperCase();
          act = 1;
          if ((numBeforeComma.length === 0) && ((i === 0) || ((i === 1) && (numAfterComma[0] === '0')))) {
            // case underflow makes result negative
            this.isNegative = true;
          }
          this.watcher = this.watcher.step('constructResult')
            .saveVariable(`underflowAfterComma${i}`, 1);
        } else {
          numAfterComma[i] = res.toString(this.power).toUpperCase();
          breakAfterComma = true;
          this.watcher = this.watcher.step('constructResult')
            .saveVariable(`underflowAfterComma${i}`, 0);
          break;
        }
      }
    }

    // after comma
    if (!breakAfterComma || (exp >= 0)) {
      let start = numBeforeComma.length - 1;
      if (exp >= 0) {
        for (let i = 0; i < exp + 1 - numBeforeComma.length; i += 1) { // left padding
          numBeforeComma.unshift('0');
        }
        start = numBeforeComma.length - 1 - exp;
      }
      for (let i = start; i >= 0; i -= 1) {
        let res = 0;
        if (this.power === 16) {
          res = parseInt(numBeforeComma[i], 16) - parseInt(act, 16);
        } else {
          res = parseInt(numBeforeComma[i], 10) - parseInt(act, 10);
        }
        if (res < 0) {
          underflow = Math.abs(res);
          numBeforeComma[i] = (this.power - underflow).toString(this.power).toUpperCase();
          act = 1;
          if ((i === 0) || ((i === 1) && (numBeforeComma[0] === '0'))) {
            // case underflow makes result negative
            this.isNegative = true;
          }
          this.watcher = this.watcher.step('constructResult')
            .saveVariable(`underflowBeforeComma${i}`, 1);
        } else {
          numBeforeComma[i] = res.toString(this.power).toUpperCase();
          this.watcher = this.watcher.step('constructResult')
            .saveVariable(`underflowBeforeComma${i}`, 0);
          break;
        }
      }
    }

    const resultArray = [];
    numBeforeComma.map((a) => resultArray.push(a));
    if ((Array.isArray(splitted)) && (splitted.length === 2)) {
      resultArray.push('.');
      numAfterComma.map((a) => resultArray.push(a));
    }
    this.arr = resultArray;
  }

  /**
   * Add a float to the actual polyadic
   * @param {*} input : String, Float to add
   */
  _additionFloat(input) {
    this.watcher = this.watcher.step('Input')
      .saveVariable('operator', '+')
      .saveVariable('bitString1', this.bitString)
      .saveVariable('bitString2', input);
    const val = input.split('.');
    if ((Array.isArray(val)) && (val.length === 2)) {
      const afterComma = val[1].split('');
      this.watcher = this.watcher.step('Input')
        .saveVariable('afterComma', [...afterComma]);
      for (let i = afterComma.length - 1; i >= 0; i -= 1) {
        this.watcher = this.watcher.step('constructResult')
          .saveVariable(`digitAfterComma${i}`, afterComma[i])
          .saveVariable(`expAfterComma${i}`, -i - 1);
        this._additionOneDigit(afterComma[i], -i - 1);
      }
    }
    // reverse, so index and exponent go the same way
    const beforeComma = val[0].split('').reverse();
    this.watcher = this.watcher.step('Input')
      .saveVariable('beforeComma', [...beforeComma].reverse());
    for (let i = 0; i < beforeComma.length; i += 1) {
      this.watcher = this.watcher.step('constructResult')
        .saveVariable(`digitBeforeComma${i}`, beforeComma[i])
        .saveVariable(`expBeforComma${i}`, -i - 1);
      this._additionOneDigit(beforeComma[i], i);
    }
    this._actualizeValues();
    this.watcher = this.watcher.step('Result')
      .saveVariable('array', [...this.arr])
      .saveVariable('bitString', this.bitString)
      .saveVariable('value', this.value)
      .saveVariable('valueString', this.valueString)
      .saveVariable('sign', this.sign)
      .saveVariable('comma', this.comma);
  }

  /**
   * Subtract a float to the actual polydic
   * @param {*} input : String, Float to subtract
   */
  _subtractionFloat(input) {
    this.watcher = this.watcher.step('Input')
      .saveVariable('operator', '-')
      .saveVariable('bitString1', this.bitString)
      .saveVariable('bitString2', input);
    const inputSplitted = input.toString().split('.');
    if ((Array.isArray(inputSplitted)) && (inputSplitted.length === 2)) {
      const afterComma = inputSplitted[1].split('');
      this.watcher = this.watcher.step('Input')
        .saveVariable('afterComma', [...afterComma]);
      for (let i = afterComma.length - 1; i >= 0; i -= 1) {
        this._subtractOneDigit(afterComma[i], -i - 1);
      }
    }
    const beforeComma = inputSplitted[0].split('').reverse();
    this.watcher = this.watcher.step('Input')
      .saveVariable('beforeComma', [...beforeComma].reverse());
    const lenPadding = Math.max(beforeComma.length - this.comma, 0);
    this.arr = Array(lenPadding).fill('0').concat(this.arr);

    for (let i = 0; i < beforeComma.length; i += 1) {
      this._subtractOneDigit(beforeComma[i], i);
    }

    // invert digit if the result is negative
    if (this.isNegative) {
      this.arr[this.arr.length - 1] = (
        parseInt(this.arr[this.arr.length - 1], this.power) - 1
      ).toString(this.power).toUpperCase();
      for (let i = 0; i < this.arr.length; i += 1) {
        const a = this.arr[i];
        if ((a !== '-') && (a !== '.') && (a !== ',')) {
          this.arr[i] = (this.power - parseInt(a, this.power) - 1).toString(this.power).toUpperCase();
        }
      }
      this.arr.unshift('-');
      this.isNegative = false;
    }
    this._actualizeValues();
    this.watcher = this.watcher.step('Result')
      .saveVariable('array', [...this.arr])
      .saveVariable('bitString', this.bitString)
      .saveVariable('value', this.value)
      .saveVariable('valueString', this.valueString)
      .saveVariable('sign', this.sign)
      .saveVariable('comma', this.comma);
  }
}
