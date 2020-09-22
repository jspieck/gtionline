/* eslint-disable */

'use strict';
import {
  MultiplicationBaseN
} from '@/scripts/BaseNOperations';
import {
  _classCallCheck,
  _createClass,
  _toConsumableArray, numToChar$1
} from "@/scripts/gti-tools_helperFunctions";
import {Number} from '@/scripts/Number';
import {Algorithm} from "@/scripts/Algorithm";

export const NumberBaseNComplement =
  /*#__PURE__*/
  function () {
    function NumberBaseNComplement(base, digitNum, representation) {
      const off = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      const negate = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      _classCallCheck(this, NumberBaseNComplement);

      this.base = base;
      this.offset = off;
      this.digitNum = digitNum;
      this.stringRepresentation = null;

      this._checkArray(representation);

      this.arr = _toConsumableArray(representation);

      this._normalizeOffset();

      this._normalizeArray();

      if (negate) {
        this.arr = this.getFlipedArray(); // Add one

        for (let i = this.arr.length - 1; i >= 0; i--) {
          if (this.arr[i] !== this.base - 1) {
            this.arr[i] += 1;
            break;
          } else {
            this.arr[i] = 0;
          }
        }

        this._normalizeOffset();

        this._normalizeArray();
      }

      this.stringRepresentation = this._constructString(this.arr);
    }

    _createClass(NumberBaseNComplement, [{
      key: "_normalizeOffset",
      value: function _normalizeOffset() {
        while (this.offset < 0) {
          this.arr.push(0);
          this.offset++;
        }
      }
    }, {
      key: "_normalizeArray",
      value: function _normalizeArray() {
        // Delete zeros from right.
        while (this.offset > 0 && this.arr[this.arr.length - 1] === 0) {
          this.arr.splice(this.arr.length - 1, 1);
          this.offset--;
        } // Bring array to the right size.


        if (this.arr.length > this.digitNum + this.offset) {
          this.arr.splice(0, this.arr.length - (this.digitNum + this.offset));
        } else {
          let _this$arr;

          (_this$arr = this.arr).unshift.apply(_this$arr, _toConsumableArray(Array(this.digitNum + this.offset - this.arr.length).fill(0)));
        }
      }
    }, {
      key: "_checkArray",
      value: function _checkArray(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] < 0 || this.base <= arr[i]) {
            return false;
          }
        }

        return true;
      }
    }, {
      key: "_constructString",
      value: function _constructString(arr) {
        let result = "";

        for (let i = 0; i < arr.length; i++) {
          result += numToChar$1(arr[i]);

          if (i === this.digitNum - 1 && this.offset > 0) {
            result += '.';
          }
        }

        return result;
      }
    }, {
      key: "getFlipedArray",
      value: function getFlipedArray() {
        let result = [];

        for (let i = 0; i < this.arr.length; i++) {
          result.push(this.base - 1 - this.arr[i]);
        }

        return result;
      }
    }, {
      key: "isNegative",
      value: function isNegative() {
        return this.arr[0] >= Math.ceil(this.base / 2);
      }
    }, {
      key: "translate",
      value: function translate(newDigitNum) {
        if (newDigitNum <= this.digitNum) {
          return new NumberBaseNComplement(this.base, newDigitNum, _toConsumableArray(this.arr).splice(0, this.digitNum - newDigitNum), this.offset);
        } // Sign extend.


        const sign = this.isNegative() ? this.base - 1 : 0;

        let arrCopy = _toConsumableArray(this.arr);

        arrCopy.unshift.apply(arrCopy, _toConsumableArray(Array(newDigitNum - this.digitNum).fill(sign)));
        return new NumberBaseNComplement(this.base, newDigitNum, arrCopy, this.offset);
      }
    }]);

    return NumberBaseNComplement;
  }();

export const AdditionBaseNComplement =
  /*#__PURE__*/
  function () {
    function AdditionBaseNComplement(n1, n2) {
      _classCallCheck(this, AdditionBaseNComplement);

      if (n1.base !== n2.base) {
        console.log("AdditionBaseNComplement(Number, Number): Base of n1(".concat(n1.base, ") and base of n2(").concat(n2.base, ") not compatible."));
        process.exit(1);
      }

      if (n1.digitNum !== n2.digitNum) {
        console.log("AdditionBaseNComplement(Number, Number): DigitNum of n1(".concat(n1.digitNum, ") and digitNum of n2(").concat(n2.digitNum, ") not compatible."));
        process.exit(1);
      }

      this.producedOverflow = false;
      this.watcher = null;
      this.result = this._add(n1, n2);
    }

    _createClass(AdditionBaseNComplement, [{
      key: "_add",
      value: function _add(n1, n2) {
        this.watcher = new Algorithm();
        const base = n1.base;
        const digitNum = n1.digitNum;

        let n1Arr = _toConsumableArray(n1.arr);

        let n2Arr = _toConsumableArray(n2.arr);

        const offset = Math.max(n1.offset, n2.offset);

        if (n1.offset < offset) {
          n1Arr.push.apply(n1Arr, _toConsumableArray(Array(offset - n1.offset).fill(0)));
        }

        if (n2.offset < offset) {
          n2Arr.push.apply(n2Arr, _toConsumableArray(Array(offset - n2.offset).fill(0)));
        }

        let overflow = [];
        let _final = [];
        overflow.unshift(0);

        for (let i = n1Arr.length - 1; i >= 0; i--) {
          const m = n1Arr[i] + n2Arr[i] + overflow[0];

          _final.unshift(m % base);

          overflow.unshift(Math.floor(m / base));
        }

        if (overflow[0] > 0) {
          _final.unshift(overflow[0]);
        }

        const result = new NumberBaseNComplement(base, digitNum, _final, offset);
        const overflowPossible = n1.isNegative() && n2.isNegative() || !n1.isNegative() && !n2.isNegative();
        const signChanged = overflowPossible && n1.isNegative() && !result.isNegative() || !n1.isNegative() && result.isNegative();
        this.producedOverflow = overflow[0] > 0 && signChanged;
        this.watcher.step("Addition").saveVariable('op1', n1).saveVariable('op2', n2).saveVariable('op1Arr', _toConsumableArray(n1Arr)).saveVariable('op2Arr', _toConsumableArray(n2Arr)).saveVariable('carryArr', [].concat(overflow)).saveVariable('resultArr', [].concat(_final)).saveVariable('result', result).saveVariable('overflow', this.producedOverflow);
        return result;
      }
    }, {
      key: "getResult",
      value: function getResult() {
        return this.result;
      }
    }]);

    return AdditionBaseNComplement;
  }();

export var MultiplicationBaseNComplement =
  /*#__PURE__*/
  function () {
    function MultiplicationBaseNComplement(n1, n2) {
      _classCallCheck(this, MultiplicationBaseNComplement);

      if (n1.base !== n2.base) {
        console.log("MultiplicationBaseNComplement(Number, Number): Base of n1(".concat(n1.base, ") and base of n2(").concat(n2.base, ") are not compatible."));
      }

      if (n1.digitNum !== n2.digitNum) {
        console.log("MultiplicationBaseNComplement(Number, Number): DigitNum of n1(".concat(n1.digitNum, ") and digitNum of n2(").concat(n2.digitNum, ") are not compatible."));
      }

      this.watcher = null;
      this.producedOverflow = false;
      this.result = this._multiply(n1, n2);
    }

    _createClass(MultiplicationBaseNComplement, [{
      key: "_multiply",
      value: function _multiply(n1, n2) {
        this.watcher = new Algorithm();
        const base = n1.base;
        const offset = Math.max(n1.offset, n2.offset);
        const digitsToTake = 2 * (n1.digitNum + offset);
        this.watcher.step("DetermineSize").saveVariable('n1Offset', n1.offset).saveVariable('n2Offset', n2.offset).saveVariable('digitNum', n1.digitNum).saveVariable('offset', offset).saveVariable('digitsToTake', digitsToTake);
        n1 = n1.translate(digitsToTake - offset);
        n2 = n2.translate(digitsToTake - offset);

        let op1Arr = _toConsumableArray(n1.arr);

        let op2Arr = _toConsumableArray(n2.arr);

        op1Arr.push.apply(op1Arr, _toConsumableArray(Array(Math.max(n2.offset - n1.offset, 0)).fill(0)));
        op2Arr.push.apply(op2Arr, _toConsumableArray(Array(Math.max(n1.offset - n2.offset, 0)).fill(0)));
        const op1 = new Number(n1.base, op1Arr, offset, false);
        const op2 = new Number(n2.base, op2Arr, offset, false);
        const operation = new MultiplicationBaseN(op1, op2);
        const result = operation.getResult();
        this.watcher.step("Multiply").saveVariable('multiplication', operation.watcher);

        let resultArr = _toConsumableArray(result.arr);

        resultArr.push.apply(resultArr, _toConsumableArray(Array(Math.max(2 * offset - result.offset, 0)).fill(0)));

        if (resultArr.length < digitsToTake) {
          resultArr.unshift.apply(resultArr, _toConsumableArray(Array(digitsToTake - resultArr.length).fill(0)));
        }

        if (resultArr.length > digitsToTake) {
          resultArr.splice(0, resultArr.length - digitsToTake);
        }

        const finalResult = new NumberBaseNComplement(base, digitsToTake - 2 * offset, resultArr, 2 * offset);
        this.watcher.step("Result").saveVariable('digitsToTake', digitsToTake).saveVariable('result', finalResult);
        return finalResult;
      }
    }, {
      key: "getResult",
      value: function getResult() {
        return this.result;
      }
    }]);

    return MultiplicationBaseNComplement;
  }();

export var DivisonBaseNComplement =
  /*#__PURE__*/
  function () {
    function DivisonBaseNComplement(n1, n2) {
      _classCallCheck(this, DivisonBaseNComplement);

      if (n1.base !== n2.base) {
        console.log("DivisonBaseNComplement(Number, Number): Base of n1(".concat(n1.base, ") and base of n2(").concat(n2.base, ") are not compatible."));
      }

      if (n1.digitNum !== n2.digitNum) {
        console.log("DivisonBaseNComplement(Number, Number): DigitNum of n1(".concat(n1.digitNum, ") and digitNum of n2(").concat(n2.digitNum, ") are not compatible."));
      }

      this.watcher = null;
      this.producedOverflow = false;
      this.result = this._divide(n1, n2);
    }

    _createClass(DivisonBaseNComplement, [{
      key: "_divide",
      value: function _divide(n1, n2) {
        this.watcher = new Algorithm();
        const base = n1.base;
        const offset = Math.max(n1.offset, n2.offset);
        const digitsToTake = n1.digitNum + offset + 1;
        this.watcher.step("DetermineSize").saveVariable('n1Offset', n1.offset).saveVariable('n2Offset', n2.offset).saveVariable('digitNum', n1.digitNum).saveVariable('offset', offset).saveVariable('digitsToTake', digitsToTake);
        n1 = n1.translate(digitsToTake - offset);
        n2 = n2.translate(digitsToTake - offset);

        let i = 1;
        let op1arr = _toConsumableArray(n1.arr.slice());
        op1arr.unshift(1);
        let op2arr = _toConsumableArray(n2.arr.slice());
        op2arr.unshift(1)
        let arr = [];
        let remain = true
        n2.arr.unshift(1)
        const op2 = new NumberBaseNComplement(2, 3, op2arr.slice(), n2.offset, true);
        while ((i < n1.arr.length -1) && remain) {
          const op1 = new NumberBaseNComplement(2, 3, op1arr, n1.offset, false);
          const subtractionResult = new AdditionBaseNComplement(op1, op2).getResult();
          let subarray = subtractionResult.arr.slice(1, subtractionResult.arr.length-2);
          if (!(subarray.every(a => a === 0))) { // subt. not zero
            if (subtractionResult.arr[0] === 0) { // subt. positive result
              arr.push(1);
              op1arr = subtractionResult.arr;
            } else { // subt. negative result
              arr.push(0);
              op1arr.push(n1.arr[i])
            }
          } else {
            remain = false; // subt. result is zero => no remain
          }
          i = i + 1;
        }

        // this.watcher.step("Divide").saveVariable('division', operation.watcher);

        let resultArr = _toConsumableArray(arr);

        resultArr.push.apply(resultArr, _toConsumableArray(Array(Math.max(offset, 0)).fill(0)));

        if (resultArr.length < digitsToTake) {
          resultArr.unshift.apply(resultArr, _toConsumableArray(Array(digitsToTake - resultArr.length).fill(0)));
        }

        if (resultArr.length > digitsToTake) {
          resultArr.splice(0, resultArr.length - digitsToTake);
        }

        const finalResult = new NumberBaseNComplement(base, digitsToTake - 2 * offset, resultArr, 2 * offset);
        this.watcher.step("Result").saveVariable('digitsToTake', digitsToTake).saveVariable('result', finalResult);
        return finalResult;
      }
    }, {
      key: "getResult",
      value: function getResult() {
        return this.result;
      }
    }]);

    return DivisonBaseNComplement;
  }();
