/* eslint-disable */

import {
  MultiplicationBaseNSingleDigit,
  DivisionBaseNSingleDigit
} from '@/scripts/SingleDigitOperatorions';
import {
  _classCallCheck,
  _createClass,
  _toConsumableArray
} from "@/scripts/gti-tools_helperFunctions";
import {Number} from '@/scripts/Number';
import {Algorithm} from "@/scripts/Algorithm";

export const ComparisonBaseN =
  /*#__PURE__*/
  function () {
    function ComparisonBaseN(n1, n2) {
      _classCallCheck(this, ComparisonBaseN);

      if (n1.base !== n2.base) {
        console.log("ComparisonBaseN(Number, Number): Base of n1(".concat(n1.base, ") and base of n2(").concat(n2.base, ") not compatible."));
      }

      this.result = this._compare(n1, n2);
    }

    _createClass(ComparisonBaseN, [{
      key: "_compare",
      value: function _compare(n1, n2) {
        if (n1.arr.length === 1 && n2.arr.length === 1 && n1.arr[0] === 0 && n1.arr[0] === 0) {
          return 0;
        }

        if (n1.isNegative && !n2.isNegative) {
          return -1;
        }

        if (!n1.isNegative && n2.isNegative) {
          return 1;
        }

        const mult = n1.isNegative && n2.isNegative ? -1 : 1;

        if (n1.arr.length - n1.offset > n2.arr.length - n2.offset) {
          return mult;
        }

        if (n1.arr.length - n1.offset < n2.arr.length - n2.offset) {
          return mult * -1;
        }

        let i = 0;

        while (i < n1.arr.length || i < n2.arr.length) {
          const a = i < n1.arr.length ? n1.arr[i] : 0;
          const b = i < n2.arr.length ? n2.arr[i] : 0;

          if (a > b) {
            return mult;
          }

          if (b > a) {
            return mult * -1;
          }

          i++;
        }

        return 0;
      }
    }, {
      key: "getResult",
      value: function getResult() {
        return this.result;
      }
    }]);

    return ComparisonBaseN;
  }();

export const SubtractionBaseN =
  /*#__PURE__*/
  function () {
    function SubtractionBaseN(n1, n2) {
      _classCallCheck(this, SubtractionBaseN);

      if (n1.base !== n2.base) {
        console.log("Subtraction(Number, Number): Base of n1(".concat(n1.base, ") and base of n2(").concat(n2.base, ") not compatible."));
        process.exit(1);
      }

      this.watcher = null;
      this.result = this._subtract(n1, n2);
    }

    _createClass(SubtractionBaseN, [{
      key: "_subtract",
      value: function _subtract(n1, n2) {
        this.watcher = new Algorithm();

        if (!n1.isNegative && n2.isNegative || n1.isNegative && !n2.isNegative) {
          const addition = new AdditionBaseN(n1, Number(n2.base, n2.arr, n2.offset, !n2.isNegative));
          this.watcher = this.watcher.step("OperatorSwitch").saveVariable("addition", addition.watcher);
          return addition.getResult();
        }

        const base = n1.base;
        const comp = new ComparisonBaseN(Number(n1.base, n1.arr, n1.offset, false), Number(n2.base, n2.arr, n2.offset, false)).getResult();
        let isNegative;
        let op1;
        let op2;

        if (comp >= 0) {
          // |n1| >= |n2|
          op1 = n1;
          op2 = n2;
          isNegative = n1.isNegative && n2.isNegative;
        } else {
          op1 = n2;
          op2 = n1;
          isNegative = !(n1.isNegative && n2.isNegative);
        }

        this.watcher.step("GetSign").saveVariable('compareValue', comp).saveVariable('signN1', n1.isNegative).saveVariable('signN2', n2.isNegative).saveVariable('isNegative', isNegative);

        const op1Arr = _toConsumableArray(op1.arr);

        const op2Arr = _toConsumableArray(op2.arr);

        const offset = Math.max(op1.offset, op2.offset);

        if (op1.offset < offset) {
          op1Arr.push.apply(op1Arr, _toConsumableArray(Array(offset - op1.offset).fill(0)));
        }

        if (op2.offset < offset) {
          op2Arr.push.apply(op2Arr, _toConsumableArray(Array(offset - op2.offset).fill(0)));
        }

        const length = Math.max(op1Arr.length, op2Arr.length);

        if (op1Arr.length < length) {
          op1Arr.unshift.apply(op1Arr, _toConsumableArray(Array(length - op1Arr.length).fill(0)));
        }

        if (op2Arr.length < length) {
          op2Arr.unshift.apply(op2Arr, _toConsumableArray(Array(length - op2Arr.length).fill(0)));
        }

        let overflow = [];
        let _final = [];
        overflow.unshift(0);

        for (let i = length - 1; i >= 0; i--) {
          const m = op1Arr[i] - op2Arr[i] - overflow[0];

          _final.unshift((m + base) % base);

          if (m < 0) {
            overflow.unshift(1);
          } else {
            overflow.unshift(0);
          }
        }

        const result = Number(base, _final, offset, isNegative);
        this.watcher.step("Subtraction").saveVariable('op1', op1).saveVariable('op2', op2).saveVariable('op1Arr', _toConsumableArray(op1Arr)).saveVariable('op2Arr', _toConsumableArray(op2Arr)).saveVariable('carryArr', [].concat(overflow)).saveVariable('resultArr', [].concat(_final)).saveVariable('result', result);
        return Number(base, _final, offset, isNegative);
      }
    }, {
      key: "getResult",
      value: function getResult() {
        return this.result;
      }
    }]);

    return SubtractionBaseN;
  }();

export const AdditionBaseN =
  /*#__PURE__*/
  function () {
    function AdditionBaseN(n1, n2) {
      _classCallCheck(this, AdditionBaseN);

      if (n1.base !== n2.base) {
        console.log("Addition(Number, Number): Base of n1(".concat(n1.base, ") and base of n2(").concat(n2.base, ") not compatible."));
      }

      this.watcher = null;
      this.result = this._add(n1, n2);
    }

    _createClass(AdditionBaseN, [{
      key: "_add",
      value: function _add(n1, n2) {
        this.watcher = new Algorithm();

        if (!n1.isNegative && n2.isNegative) {
          // Subtract abs(n2) from n1.
          const subtraction = new SubtractionBaseN(n1, Number(n2.base, n2.arr, n2.offset));
          this.watcher = this.watcher.step("OperatorSwitch").saveVariable("subtraction", subtraction.watcher);
          return subtraction.getResult();
        }

        if (n1.isNegative && !n2.isNegative) {
          // Subtract abs(n1) from n2.
          const _subtraction = new SubtractionBaseN(n2, Number(n1.base, n1.arr, n1.offset)).getResult();

          this.watcher = this.watcher.step("OperatorSwitch").saveVariable("subtraction", _subtraction.watcher);
          return _subtraction;
        }

        const base = n1.base; // If both n1 and n2 are negative the result must also be negative.

        const isNegative = n1.isNegative && n2.isNegative;
        this.watcher.step("GetSign").saveVariable('signN1', n1.isNegative).saveVariable('signN2', n2.isNegative).saveVariable('isNegative', isNegative);

        const n1Arr = _toConsumableArray(n1.arr);

        const n2Arr = _toConsumableArray(n2.arr);

        const offset = Math.max(n1.offset, n2.offset);

        if (n1.offset < offset) {
          n1Arr.push.apply(n1Arr, _toConsumableArray(Array(offset - n1.offset).fill(0)));
        }

        if (n2.offset < offset) {
          n2Arr.push.apply(n2Arr, _toConsumableArray(Array(offset - n2.offset).fill(0)));
        }

        const length = Math.max(n1Arr.length, n2Arr.length);

        if (n1Arr.length < length) {
          n1Arr.unshift.apply(n1Arr, _toConsumableArray(Array(length - n1Arr.length).fill(0)));
        }

        if (n2Arr.length < length) {
          n2Arr.unshift.apply(n2Arr, _toConsumableArray(Array(length - n2Arr.length).fill(0)));
        }

        let overflow = [];
        let _final = [];
        overflow.unshift(0);

        for (let i = length - 1; i >= 0; i--) {
          const m = n1Arr[i] + n2Arr[i] + overflow[0];

          _final.unshift(m % base);

          overflow.unshift(Math.floor(m / base));
        }

        if (overflow[0] > 0) {
          _final.unshift(overflow[0]);
        }

        const result = new Number(base, _final, offset, isNegative);
        this.watcher.step("Addition").saveVariable('op1', n1).saveVariable('op2', n2).saveVariable('op1Arr', _toConsumableArray(n1Arr)).saveVariable('op2Arr', _toConsumableArray(n2Arr)).saveVariable('carryArr', [].concat(overflow)).saveVariable('resultArr', [].concat(_final)).saveVariable('result', result);
        return new Number(base, _final, offset, isNegative);
      }
    }, {
      key: "getResult",
      value: function getResult() {
        return this.result;
      }
    }]);

    return AdditionBaseN;
  }();

export const MultiplicationBaseN =
  /*#__PURE__*/
  function () {
    function MultiplicationBaseN(n1, n2) {
      _classCallCheck(this, MultiplicationBaseN);

      if (n1.base !== n2.base) {
        console.log("MultiplicationBaseN(Number, Number): Base of n1(".concat(n1.base, ") and base of n2(").concat(n2.base, ") are not compatible."));
      }

      this.watcher = null;
      this.result = this._multiply(n1, n2);
    }

    _createClass(MultiplicationBaseN, [{
      key: "_multiply",
      value: function _multiply(n1, n2) {
        this.watcher = new Algorithm();
        const base = n1.base;
        const isNegative = n1.isNegative && !n2.isNegative || n2.isNegative && !n1.isNegative;
        this.watcher.step("GetSign").saveVariable('signN1', n1.isNegative).saveVariable('signN2', n2.isNegative).saveVariable('isNegative', isNegative);
        let cur = new Number(base, [0], 0, false);
        const initalOffset = n1.offset - (n2.arr.length - 1 - n2.offset);
        this.watcher.step("MultInital").saveVariable('num1', n1).saveVariable('num2', n2);

        for (let i = 0; i < n2.arr.length; i++) {
          const num = new Number(base, n1.arr, i + initalOffset, false);
          const toAdd = new MultiplicationBaseNSingleDigit(num, n2.arr[i]).getResult();
          this.watcher.step("MultStep".concat(i.toString())).saveVariable('cur', cur).saveVariable('toAdd', toAdd);
          cur = new AdditionBaseN(cur, toAdd).getResult();
        }

        this.watcher.step("MultFinal").saveVariable('cur', cur);
        const result = new Number(base, cur.arr, cur.offset, isNegative);
        this.watcher.step("Result").saveVariable('result', result);
        return result;
      }
    }, {
      key: "getResult",
      value: function getResult() {
        return this.result;
      }
    }]);

    return MultiplicationBaseN;
  }();

export const DivisionBaseN = // TODO: Zeus, zu erledigen
  /*#__PURE__*/
  function () {
    function DivisionBaseN(n1, n2) {
      _classCallCheck(this, DivisionBaseN);

      if (n1.base !== n2.base) {
        console.log("DivisionBaseN(Number, Number): Base of n1(".concat(n1.base, ") and base of n2(").concat(n2.base, ") are not compatible."));
      }

      this.watcher = null;
      this.result = this._multiply(n1, n2);
    }

    _createClass(DivisionBaseN, [{
      key: "_divide",
      value: function _divide(n1, n2) {
        this.watcher = new Algorithm();
        const base = n1.base;
        const isNegative = n1.isNegative && !n2.isNegative || n2.isNegative && !n1.isNegative;
        this.watcher.step("GetSign").saveVariable('signN1', n1.isNegative).saveVariable('signN2', n2.isNegative).saveVariable('isNegative', isNegative);
        let cur = new Number(base, [0], 0, false);
        const initalOffset = n1.offset - (n2.arr.length - 1 - n2.offset);
        this.watcher.step("DivInital").saveVariable('num1', n1).saveVariable('num2', n2);

        for (let i = 0; i < n2.arr.length; i++) {
          const num = new Number(base, n1.arr, i + initalOffset, false);
          const toAdd = new DivisionBaseNSingleDigit(num, n2.arr[i]).getResult();
          this.watcher.step("DivStep".concat(i.toString())).saveVariable('cur', cur).saveVariable('toAdd', toAdd);
          cur = new AdditionBaseN(cur, toAdd).getResult();
        }

        this.watcher.step("DivFinal").saveVariable('cur', cur);
        const result = new Number(base, cur.arr, cur.offset, isNegative);
        this.watcher.step("Result").saveVariable('result', result);
        return result;
      }
    }, {
      key: "getResult",
      value: function getResult() {
        return this.result;
      }
    }]);

    return DivisionBaseN;
  }();
