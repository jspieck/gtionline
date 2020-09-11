/* eslint-disable */

'use strict';

import {
  _classCallCheck,
  _createClass
} from "@/scripts/gti-tools_helperFunctions";

export const Step =
  /*#__PURE__*/
  function () {
    function Step(name) {
      _classCallCheck(this, Step);

      this.name = name;
      this.data = {};
      this.next = null;
    }

    _createClass(Step, [{
      key: "addDataPoint",
      value: function addDataPoint(name, value) {
        this.data[name] = value;
      }
    }]);

    return Step;
  }();
