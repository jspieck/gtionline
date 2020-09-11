/* eslint-disable */

'use strict';
import {
  _classCallCheck,
  _createClass,
  _toConsumableArray,
  numToChar
} from "@/scripts/gti-tools_helperFunctions";

export const Number =
  /*#__PURE__*/
  function () {
    function Number(base, representation) {
      const off = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      const isNegative = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      _classCallCheck(this, Number);

      this.offset = off;
      this.isNegative = isNegative;
      this.base = base;
      this.arr = null;
      this.stringRepresentation = null;

      this._checkArray(representation);

      this.arr = _toConsumableArray(representation);

      this._normalizeOffset();

      this._optimizeArray();

      this.stringRepresentation = this._constructString(this.arr);
    }

    _createClass(Number, [{
      key: "_normalizeOffset",
      value: function _normalizeOffset() {
        while (this.offset < 0) {
          this.arr.push(0);
          this.offset++;
        }
      }
    }, {
      key: "_optimizeArray",
      value: function _optimizeArray() {
        while (this.arr.length > this.offset + 1 && this.arr[0] === 0) {
          this.arr.splice(0, 1);
        }

        while (this.offset > 0 && this.arr[this.arr.length - 1] === 0) {
          this.arr.splice(this.arr.length - 1, 1);
          this.offset--;
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
          result += numToChar(arr[i]);

          if (this.offset !== 0 && arr.length - 1 - i === this.offset) {
            result += '.';
          }
        }

        if (this.isNegative) {
          result = '-' + result;
        }

        return result;
      }
    }]);

    return Number;
  }();
