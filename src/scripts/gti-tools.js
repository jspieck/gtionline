/* eslint-disable */

'use strict';
import {
  NumberBaseNComplement,
  AdditionBaseNComplement,
  MultiplicationBaseNComplement,
  DivisonBaseNComplement
} from '@/scripts/BaseNComplementOperations';
import {
  _classCallCheck,
  _createClass,
  _toConsumableArray,
  charToNum,
  numToChar$2
} from "@/scripts/gti-tools_helperFunctions";

export function getIEEEFromString(expBitNum, str) {
  if (str.length <= expBitNum + 2) {
    console.log("getIEEEFromString(expBitNum, str): Given string is not compatible with the given number of expBitNum.");
    process.exit(1);
  }

  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') continue;
    const n = charToNum(str[i]);

    if (n < 0 || n >= 2) {
      console.log("getIEEEFromString(expBitNum, str): Given string is not compatible with base 2.");
      process.exit(1);
    }
  }

  let arr = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') continue;
    arr.push(charToNum(str[i]));
  }

  return new NumberIEEE(expBitNum, arr.length - expBitNum - 1, arr);
} // Representation of a number in N's complement (Up to digitNum digits)

const NumberIEEE =
/*#__PURE__*/
function () {
  function NumberIEEE(expBitNum, manBitNum, representation) {
    _classCallCheck(this, NumberIEEE);

    if (expBitNum <= 0 || manBitNum <= 0) {
      console.log("IEEENumber(number, number, arr): Invalid number of bits for exponent and mantissa.");
    }

    this.expBitNum = expBitNum;
    this.manBitNum = manBitNum;
    this.bitNum = expBitNum + manBitNum + 1;

    this._checkArray(representation);

    this.arr = _toConsumableArray(representation);
    this.sign = this.arr[0];
    this.bias = (1 << expBitNum - 1) - 1;
    this.E = this._constructE();
    this.M = this._constructM();
    this.isNaN = this.E === 1 << expBitNum && this.M !== 0;
    this.isInfinity = this.E === 1 << expBitNum && this.M === 0;
    this.isSmall = this.E === 0 && this.M !== 0;
    this.isZero = this.E === 0 && this.M === 0;
    this.exponent = this._constructExponent();
    this.mantissa = this._constructMantissa();
    this.exponentBits = this._constructExponentBits();
    this.mantissaBits = this._constructMantissaBits();
    this.bitString = this._constructBitString();
    this.valueString = this._constructValString();
  }

  _createClass(NumberIEEE, [{
    key: "_checkArray",
    value: function _checkArray(arr) {
      if (arr.length !== this.bitNum) {
        return false;
      }

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] < 0 || 2 <= arr[i]) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "_constructBitString",
    value: function _constructBitString() {
      let result = "";
      let count = 0;

      for (let i = 0; i < this.arr.length; i++) {
        result += numToChar$2(this.arr[i]);

        if (i === 0 || i === this.expBitNum) {
          count = 0;
          result += " ";
        }

        if (count % 4 === 0) {
          result += " ";
        }

        count++;
      }

      return result;
    }
  }, {
    key: "_constructValString",
    value: function _constructValString() {
      const sign = this.arr[0] === 0 ? '+' : '-';

      if (this.isNan) {
        return 'NaN';
      }

      if (this.isInfinity) {
        return "".concat(sign, "inf");
      }

      if (this.isZero) {
        return "".concat(sign, "0");
      }

      return "".concat(sign).concat(this.mantissa, "e").concat(this.exponent);
    }
  }, {
    key: "_constructE",
    value: function _constructE() {
      let result = 0;

      for (let i = 1; i < 1 + this.expBitNum; i++) {
        result *= 2;
        result += this.arr[i];
      }

      return result;
    }
  }, {
    key: "_constructM",
    value: function _constructM() {
      let result = 0.0;

      for (let i = this.bitNum - 1; i >= 1 + this.expBitNum; i--) {
        result /= 2.0;
        result += this.arr[i];
      }

      result /= 2.0;
      return result;
    }
  }, {
    key: "_constructExponent",
    value: function _constructExponent() {
      return this.E - this.bias;
    }
  }, {
    key: "_constructMantissa",
    value: function _constructMantissa() {
      if (this.isSmall || this.isZero) {
        return this.M;
      }

      return 1 + this.M;
    }
  }, {
    key: "_constructExponentBits",
    value: function _constructExponentBits() {
      let result = _toConsumableArray(this.arr);

      result.splice(0, 1);
      result.splice(1 + this.expBitNum, this.manBitNum);
      return result;
    }
  }, {
    key: "_constructMantissaBits",
    value: function _constructMantissaBits() {
      const firstBit = this.isSmall || this.isZero ? 0 : 1;

      let result = _toConsumableArray(this.arr);

      result.splice(0, 1 + this.expBitNum);
      result.unshift(firstBit);
      return result;
    }
  }]);

  return NumberIEEE;
}();

export var AdditionIEEE =
/*#__PURE__*/
function () {
  function AdditionIEEE(n1, n2) {
    _classCallCheck(this, AdditionIEEE);

    if (n1.expBitNum !== n2.expBitNum) {
      console.log("AdditionIEEE(Number, Number): expBitNum of n1(".concat(n1.expBitNum, ") and expBitNum of n2(").concat(n2.expBitNum, ") not compatible."));
    }

    if (n1.manBitNum !== n2.manBitNum) {
      console.log("AdditionIEEE(Number, Number): manBitNum of n1(".concat(n1.manBitNum, ") and manBitNum of n2(").concat(n2.manBitNum, ") not compatible."));
    }

    this.producedOverflow = false;
    this.result = this._add(n1, n2);
  }

  _createClass(AdditionIEEE, [{
    key: "_add",
    value: function _add(n1, n2) {
      const expBitNum = n1.expBitNum;
      const manBitNum = n1.manBitNum;
      const bitNum = n1.bitNum; // Edgecases:

      if (n1.isNaN || n2.isNaN || n1.isInfinity && n2.isInfinity && n1.sign !== n2.sign) {
        // Return NaN
        return new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(1));
      }

      if (n1.isInfinity || n2.isInfinity) {
        // Return Infinty
        const _sign = n1.isInfinity ? n1.sign : n2.sign;

        let infArray = [_sign];
        infArray.push.apply(infArray, _toConsumableArray(Array(expBitNum).fill(1)));
        infArray.push.apply(infArray, _toConsumableArray(Array(manBitNum).fill(0)));
        return new NumberIEEE(expBitNum, manBitNum, infArray);
      }
      /*
      if(n1.isZero || n2.isZero){
        // Return other number
        let sign = n1.isInfinity ? n1.sign : n2.sign;
        let arr = [...(n1.isZero ? n2.arr : n1.arr)];
        return new NumberIEEE(expBitNum, manBitNum, arr);
      }
      */
      // Get unnormalized  exponent


      const anchorExp = n1.exponent;
      const difference = n2.exponent - n1.exponent;
      const digitNum = 3 + Math.max(difference, 0);
      const op1 = new NumberBaseNComplement(2, digitNum, n1.mantissaBits, n1.manBitNum, n1.sign === 1);
      const op2 = new NumberBaseNComplement(2, digitNum, n2.mantissaBits, n2.manBitNum - difference, n2.sign === 1);
      const additionResult = new AdditionBaseNComplement(op1, op2).getResult();
      console.log(n1.mantissaBits.join(' '));
      console.log(n2.mantissaBits.join(' '));
      console.log(op1.stringRepresentation);
      console.log(op2.stringRepresentation);
      console.log(additionResult.stringRepresentation);
      let sign;
      let unnormalizedMantissa;

      if (additionResult.isNegative()) {
        sign = 1;
        const additionResultInverted = new NumberBaseNComplement(2, additionResult.digitNum, additionResult.arr, additionResult.offset, true);
        unnormalizedMantissa = additionResultInverted.arr;
      } else {
        sign = 0;
        unnormalizedMantissa = _toConsumableArray(additionResult.arr);
      }

      let cDigits = digitNum;

      while (cDigits > 1 && unnormalizedMantissa[0] === 0) {
        unnormalizedMantissa.splice(0, 1);
        cDigits--;
      } // Calculate shift
      // Positive: Rightshift | Negative: Leftshift

      let shift;

      if (cDigits >= 1) {
        shift = cDigits - 1;
      } else {
        shift = 0;

        for (let i = 1; i < unnormalizedMantissa.length; i++) {
          shift--;

          if (unnormalizedMantissa[i] === 1) {
            break;
          }
        }
      }

      if (shift === unnormalizedMantissa.length - 1 && unnormalizedMantissa[0] === 0) {
        // Return zero
        return new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(0));
      }

      let normalizedMatissa = [];

      for (let i = 0; i < manBitNum; i++) {
        const access = i + Math.max(-shift, 0) + 1;
        const num = access < unnormalizedMantissa.length ? unnormalizedMantissa[access] : 0;
        normalizedMatissa.push(num);
      } // Calculate exponent


      console.log(unnormalizedMantissa.join(' '));
      console.log(normalizedMatissa.join(' '));
      console.log(anchorExp, shift);
      const finalE = anchorExp + shift + n1.bias;
      console.log(anchorExp + shift);
      let curE = finalE;
      let exponentBits = [];

      for (let i = 0; i < expBitNum; i++) {
        exponentBits.unshift(curE % 2);
        curE = Math.floor(curE / 2);
      }

      let result = [sign];
      result.push.apply(result, exponentBits);
      result.push.apply(result, normalizedMatissa);
      return new NumberIEEE(expBitNum, manBitNum, result);
    }
  }, {
    key: "getResult",
    value: function getResult() {
      return this.result;
    }
  }]);

  return AdditionIEEE;
}();

export var SubtractionIEEE =
/*#__PURE__*/
function () {
  function SubtractionIEEE(n1, n2) {
    _classCallCheck(this, SubtractionIEEE);

    if (n1.expBitNum !== n2.expBitNum) {
      console.log("SubtractionIEEE(Number, Number): expBitNum of n1(".concat(n1.expBitNum, ") and expBitNum of n2(").concat(n2.expBitNum, ") not compatible."));
    }

    if (n1.manBitNum !== n2.manBitNum) {
      console.log("SubtractionIEEE(Number, Number): manBitNum of n1(".concat(n1.manBitNum, ") and manBitNum of n2(").concat(n2.manBitNum, ") not compatible."));
    }

    this.producedOverflow = false;
    this.result = this._subtract(n1, n2);
  }

  _createClass(SubtractionIEEE, [{
    key: "_subtract",
    value: function _subtract(n1, n2) {
      let flipedArr2 = _toConsumableArray(n2.arr);

      flipedArr2[0] = flipedArr2[0] === 0 ? 1 : 0;
      const op1 = new NumberIEEE(n1.expBitNum, n1.manBitNum, n1.arr);
      const op2 = new NumberIEEE(n2.expBitNum, n2.manBitNum, flipedArr2);
      return new AdditionIEEE(op1, op2).getResult();
    }
  }, {
    key: "getResult",
    value: function getResult() {
      return this.result;
    }
  }]);

  return SubtractionIEEE;
}();

export var MultiplicationIEEE =
/*#__PURE__*/
function () {
  function MultiplicationIEEE(n1, n2) {
    _classCallCheck(this, MultiplicationIEEE);

    if (n1.expBitNum !== n2.expBitNum) {
      console.log("MultiplicationIEEE(Number, Number): expBitNum of n1(".concat(n1.expBitNum, ") and expBitNum of n2(").concat(n2.expBitNum, ") not compatible."));
    }

    if (n1.manBitNum !== n2.manBitNum) {
      console.log("MultiplicationIEEE(Number, Number): manBitNum of n1(".concat(n1.manBitNum, ") and manBitNum of n2(").concat(n2.manBitNum, ") not compatible."));
    }

    this.producedOverflow = false;
    this.result = this._multiply(n1, n2);
  }

  _createClass(MultiplicationIEEE, [{
    key: "_multiply",
    value: function _multiply(n1, n2) {
      const expBitNum = n1.expBitNum;
      const manBitNum = n1.manBitNum;
      const bitNum = n1.bitNum;
      const sign = (n1.sign && !n2.sign || !n1.sign && n2.sign) + 0; // Edgecases:

      if (n1.isNaN || n2.isNaN || n1.isInfinity && n2.isZero || n1.isZero && n2.isInfinity) {
        // Return NaN
        return new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(1));
      }

      if (n1.isInfinity || n2.isInfinity) {
        // Return Infinty
        let infArray = [sign];
        infArray.push.apply(infArray, _toConsumableArray(Array(expBitNum).fill(1)));
        infArray.push.apply(infArray, _toConsumableArray(Array(manBitNum).fill(0)));
        return new NumberIEEE(expBitNum, manBitNum, infArray);
      }

      const op1 = new NumberBaseNComplement(2, 3, n1.mantissaBits, n1.manBitNum, false); // 2er Komplement, Mantisse
      const op2 = new NumberBaseNComplement(2, 3, n2.mantissaBits, n2.manBitNum, false);
      const multiplicationResult = new MultiplicationBaseNComplement(op1, op2).getResult(); // Multipliziere Mantissen
      const digitNum = multiplicationResult.digitNum;

      let unnormalizedMantissa = _toConsumableArray(multiplicationResult.arr);

      let cDigits = digitNum;

      while (cDigits > 1 && unnormalizedMantissa[0] === 0) {
        unnormalizedMantissa.splice(0, 1);
        cDigits--;
      } // Calculate shift
      // Positive: Rightshift | Negative: Leftshift


      let shift;

      if (cDigits >= 1) {
        shift = cDigits - 1;
      } else {
        shift = 0;

        for (let i = 1; i < unnormalizedMantissa.length; i++) {
          shift--;

          if (unnormalizedMantissa[i] === 1) {
            break;
          }
        }
      }

      if (shift === unnormalizedMantissa.length - 1 && unnormalizedMantissa[0] === 0) {
        // Return zero
        return new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(0));
      }

      let normalizedMatissa = [];

      for (let i = 0; i < manBitNum; i++) {
        const access = i + Math.max(-shift, 0) + 1;
        const num = access < unnormalizedMantissa.length ? unnormalizedMantissa[access] : 0;
        normalizedMatissa.push(num);
      }

      let curE = n1.E + n2.E - n1.bias + shift; // Exponenente addieren, bias subtrahieren
      let exponentBits = [];

      for (let i = 0; i < expBitNum; i++) {
        exponentBits.unshift(curE % 2);
        curE = Math.floor(curE / 2);
      }

      let result = [sign];
      result.push.apply(result, exponentBits);
      result.push.apply(result, normalizedMatissa);
      return new NumberIEEE(expBitNum, manBitNum, result);
    }
  }, {
    key: "getResult",
    value: function getResult() {
      return this.result;
    }
  }]);

  return MultiplicationIEEE;
}();

export var DivisionIEEE =
  /*#__PURE__*/
  function () {
    function DivisionIEEE(n1, n2) {
      _classCallCheck(this, DivisionIEEE);

      if (n1.expBitNum !== n2.expBitNum) {
        console.log("DivisionIEEE(Number, Number): expBitNum of n1(".concat(n1.expBitNum, ") and expBitNum of n2(").concat(n2.expBitNum, ") not compatible."));
      }

      if (n1.manBitNum !== n2.manBitNum) {
        console.log("DivisionIEEE(Number, Number): manBitNum of n1(".concat(n1.manBitNum, ") and manBitNum of n2(").concat(n2.manBitNum, ") not compatible."));
      }

      this.producedOverflow = false;
      this.result = this._divide(n1, n2);
    }

    _createClass(DivisionIEEE, [{
      key: "_divide",
      value: function _divide(n1, n2) {
        if (n1.isNaN || n2.isNaN || n1.isInfinity && n2.isZero || n1.isZero && n2.isInfinity) {
          // Return NaN
          return new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(1));
        }
        const expBitNum = n1.expBitNum;
        const manBitNum = n1.manBitNum;
        const bitNum = n1.bitNum;
        const sign = (n1.sign && !n2.sign || !n1.sign && n2.sign) + 0; // Edgecases:

        if ((n1.isInfinity && !n2.isInfinity) || (!n1.isZero && n2.isZero)){
          // Return Infinty
          let infArray = [sign];
          infArray.push.apply(infArray, _toConsumableArray(Array(expBitNum).fill(1)));
          infArray.push.apply(infArray, _toConsumableArray(Array(manBitNum).fill(0)));
          return new NumberIEEE(expBitNum, manBitNum, infArray);
        }

        if ((n1.isInfinity && n2.isInfinity) || (n1.isZero && n2.isZero)) {
          // Return NaN
          let infArray = [0];
          infArray.push.apply(infArray, _toConsumableArray(Array(expBitNum).fill(1)));
          infArray.push.apply(infArray, _toConsumableArray(Array(manBitNum).fill(1)));
          return new NumberIEEE(expBitNum, manBitNum, infArray);
        }

        if ((!n1.isInfinity && n2.isInfinity) || n1.isZero){
          // Return Zero
          let infArray = [sign];
          infArray.push.apply(infArray, _toConsumableArray(Array(expBitNum).fill(0)));
          infArray.push.apply(infArray, _toConsumableArray(Array(manBitNum).fill(0)));
          return new NumberIEEE(expBitNum, manBitNum, infArray);
        }

        // TODO: Zeus, Add Calculation
        // 1. Mantissen dividieren und neues Vorzeichen
        // 2. Exponenten voneinander Abziehen.
        // 3. Normalisieren

        const op1 = new NumberBaseNComplement(2, 3, n1.mantissaBits, n1.manBitNum, false);
        const op2 = new NumberBaseNComplement(2, 3, n2.mantissaBits, n2.manBitNum, false);
        const divisionResult = new DivisonBaseNComplement(op1, op2).getResult();
        const digitNum = divisionResult.digitNum;

        let unnormalizedMantissa = _toConsumableArray(divisionResult.arr);

        let cDigits = digitNum;

        while (cDigits > 1 && unnormalizedMantissa[0] === 0) {
          unnormalizedMantissa.splice(0, 1);
          cDigits--;
        } // Calculate shift
        // Positive: Rightshift | Negative: Leftshift


        let shift;

        if (cDigits >= 1) {
          shift = cDigits - 1;
        } else {
          shift = 0;

          for (let i = 1; i < unnormalizedMantissa.length; i++) {
            shift--;

            if (unnormalizedMantissa[i] === 1) {
              break;
            }
          }
        }

        if (shift === unnormalizedMantissa.length - 1 && unnormalizedMantissa[0] === 0) {
          // Return zero
          return new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(0));
        }

        let normalizedMatissa = [];

        for (let i = 0; i < manBitNum; i++) {
          const access = i + Math.max(-shift, 0) + 1;
          const num = access < unnormalizedMantissa.length ? unnormalizedMantissa[access] : 0;
          normalizedMatissa.push(num);
        }

        let curE = n1.E - n2.E - n1.bias + shift;
        let exponentBits = [];

        for (let i = 0; i < expBitNum; i++) {
          exponentBits.unshift(curE % 2);
          curE = Math.floor(curE / 2);
        }

        let result = [sign];
        result.push.apply(result, exponentBits);
        result.push.apply(result, normalizedMatissa);
        return new NumberIEEE(expBitNum, manBitNum, result);
      }
    }, {
      key: "getResult",
      value: function getResult() {
        return this.result;
      }
    }]);

    return DivisionIEEE;
  }();

//export * from './boolean/index.js';
/*
let num1 = getBaseNComplementFromString(2, 4,"0101");
let num2 = getBaseNComplementFromString(2, 4,"1011");



let op = new AdditionBaseNComplement(num1, num2);

console.log((new AdditionBaseNComplementToLatex(op.watcher)).getResult());
*/

/*
// Tests Addition
let x1 = getIEEEFromString(8, "1  0111 1011 0101 1110 0000 0000 0000 000");
let x2 = getIEEEFromString(8, "0  1000 0000 1011 0011 1010 1110 0101 000");
let x3 = getIEEEFromString(8, "0  1010 0101 0000 0101 1100 0100 0000 000");
let x4 = getIEEEFromString(8, "1  0101 1010 0101 1000 0001 0000 0000 000");
let x5 = getIEEEFromString(8, "1  0000 0000 0000 0000 0000 0000 0000 000");

//console.log(`x1: ${x1.bitString}|${x1.valueString}`);

let x6 = (new AdditionIEEE(x1, x3)).getResult();
let x7 = (new AdditionIEEE(x4, x2)).getResult();
let x8 = (new AdditionIEEE(x1, x4)).getResult();
let x9 = (new AdditionIEEE(x3, x6)).getResult();
let x10 = (new AdditionIEEE(x7, x2)).getResult();
let x11 = (new AdditionIEEE(x5, x1)).getResult();

console.log(`x1: ${x1.bitString}|${x1.valueString}`);
console.log(`x2: ${x2.bitString}|${x2.valueString}`);
console.log(`x3: ${x3.bitString}|${x3.valueString}`);
console.log(`x4: ${x4.bitString}|${x4.valueString}`);
console.log(`x5: ${x5.bitString}|${x5.valueString}`);
console.log(`x6(x1+x3): ${x6.bitString}|${x6.valueString}`);
console.log(`x7(x2+x4): ${x7.bitString}|${x7.valueString}`);
console.log(`x8(x1+x3): ${x8.bitString}|${x8.valueString}`);
console.log(`x9(x3+x6): ${x9.bitString}|${x9.valueString}`);
console.log(`x10(x2+x7): ${x10.bitString}|${x10.valueString}`);
console.log(`x11(x1+x5): ${x11.bitString}|${x11.valueString}`);
*/
// Tests Multiplication
// Tests Addition

const x1 = getIEEEFromString(8, "0 10000001  01011001100110011001101");
const y1 = getIEEEFromString(8, "0 10000000  00001100110011001100110");
const x2 = getIEEEFromString(8, "0 10001111  10101101000011000000000");
const y2 = getIEEEFromString(8, "0 01111010  00100100111111001010010");
const x3 = getIEEEFromString(8, "0 10000111  11110101010000000101100");
const y3 = getIEEEFromString(8, "0 01110110  11010100100101010001100");
const x4 = getIEEEFromString(8, "1 00000000  00000000000000000000000");
const y4 = getIEEEFromString(8, "1 10000000  10001000000000000000000");
const z1 = new MultiplicationIEEE(x1, y1).getResult();
const z2 = new MultiplicationIEEE(x2, y2).getResult();
const z3 = new MultiplicationIEEE(x3, y3).getResult();
const z4 = new MultiplicationIEEE(x4, y4).getResult();
const z5 = new AdditionIEEE(x4, y4).getResult();
const z6 = new SubtractionIEEE(x4, y4).getResult();
console.log("x1: ".concat(x1.bitString, "|").concat(x1.valueString));
console.log("y1: ".concat(y1.bitString, "|").concat(y1.valueString));
console.log("z1: ".concat(z1.bitString, "|").concat(z1.valueString));
console.log("--------------------------");
console.log("x2: ".concat(x2.bitString, "|").concat(x2.valueString));
console.log("y2: ".concat(y2.bitString, "|").concat(y2.valueString));
console.log("z2: ".concat(z2.bitString, "|").concat(z2.valueString));
console.log("--------------------------");
console.log("x3: ".concat(x3.bitString, "|").concat(x3.valueString));
console.log("y3: ".concat(y3.bitString, "|").concat(y3.valueString));
console.log("z3: ".concat(z3.bitString, "|").concat(z3.valueString));
console.log("--------------------------");
console.log("x4: ".concat(x4.bitString, "|").concat(x4.valueString));
console.log("y4: ".concat(y4.bitString, "|").concat(y4.valueString));
console.log("z4: ".concat(z4.bitString, "|").concat(z4.valueString));
console.log("z5: ".concat(z5.bitString, "|").concat(z5.valueString));
console.log("z6: ".concat(z6.bitString, "|").concat(z6.valueString));
console.log("--------------------------");
/*
let num1 = getNumFromString(2, "1110100.110");
let num2 = getNumFromString(2, "-11100010.110");

let op = new MultiplicationBaseN(num1, num2);
//console.log(op);
console.log((new MultiplicationBaseNSignedToLatex(op.watcher)).getResult());
*/

/*
let op = new MultiplicationBaseNComplement(num1, num2);

 num = op.getResult();
console.log(num);

console.log();



let x1 = getIEEEFromString(8, "0 10011001 0000 1001 1001 0000 0000 0000");
let x2 = getIEEEFromString(8, "0 10011001 1111 1111 0000 0000 0000 0000");
let x3 = getIEEEFromString(8, "1 10010100 0011 0110 0000 0000 0000 0000");

let y1 = getIEEEFromString(7, "0 1001000 1001 1011");
let y2 = getIEEEFromString(7, "1 1001010 1110 1000");

 op = new MultiplicationIEEE(y1, y2);

console.log(op.getResult());
*/
