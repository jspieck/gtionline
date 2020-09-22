/* eslint-disable */

import './gti-tools_helperFunctions';
import {Number} from '@/scripts/Number';
import {
  _classCallCheck,
  _createClass
} from "@/scripts/gti-tools_helperFunctions";

export const MultiplicationBaseNSingleDigit =
  /*#__PURE__*/
  function () {
    function MultiplicationBaseNSingleDigit(n, d) {
      _classCallCheck(this, MultiplicationBaseNSingleDigit);

      if (d < 0 || d >= n.base) {
        console.log("MultiplicationBaseNSingleDigit(Number, Digit): Base of n(".concat(n.base, ") and d(").concat(d, ") are not compatible."));
      }

      this.result = this._multiply(n, d);
    }

    _createClass(MultiplicationBaseNSingleDigit, [{
      key: "_multiply",
      value: function _multiply(n, d) {
        const offset = n.offset;
        const base = n.base;
        const isNegative = n.isNegative;
        let overflow = [0];
        let _final = [];

        for (let i = n.arr.length - 1; i >= 0; i--) {
          const m = d * n.arr[i] + overflow[0];

          _final.unshift(m % base);

          overflow.unshift(Math.floor(m / base));
        }

        _final.unshift(overflow[0]);

        return new Number(base, _final, offset, isNegative);
      }
    }, {
      key: "getResult",
      value: function getResult() {
        return this.result;
      }
    }]);

    return MultiplicationBaseNSingleDigit;
  }();
