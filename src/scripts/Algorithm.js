/* eslint-disable */

'use strict';

import {
  _classCallCheck,
  _createClass
} from "@/scripts/gti-tools_helperFunctions";
import {Step} from "@/scripts/Step";

export const Algorithm =
  /*#__PURE__*/
  function () {
    function Algorithm() {
      _classCallCheck(this, Algorithm);

      this.start = null;
      this.curr = null;
    }

    _createClass(Algorithm, [{
      key: "step",
      value: function step(name) {
        if (this.curr == null) {
          this.start = new Step(name);
          this.curr = this.start;
          return this;
        }

        this.curr.next = new Step(name);
        this.curr = this.curr.next;
        return this;
      }
    }, {
      key: "saveVariable",
      value: function saveVariable(name, value) {
        this.curr.addDataPoint(name, value);
        return this;
      }
    }]);

    return Algorithm;
  }();
