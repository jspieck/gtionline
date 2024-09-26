/**
 * Class representing a single Literal (e.g. \
 * a, \
 * x0, ...) \
 * that is identified by a global id. \
 * 1.: That global ID is/should be shared by every Literal
 * pointing at the 'same real world' Literal. (e.g. every
 * 'a' and 'not a' have the ID 0 and every x2 has the ID 3) \
 * 2.: The global IDs start counting at 0 with the Literal
 * being on-top/to-the-bottom of the KVDiagram i.e. the one
 * that comes into existance upon mirroring the KVDiagram
 * (of size 1x1) to the right (-> width=2, height=1).
 */
export class BooleanFunctionLiteral {
  /**
     * Creates an Instance of some Literal.
     * @param {number} id ID that identifies this literal
     * @param {boolean} negated boolean specifiying if this
     * literal is negated (-> not a) or not (-> a).
     */
  constructor(id, negated) {
    this._id = id;
    this._negated = negated;
  }

  getId() {
    return this._id;
  }

  isNegated() {
    return this._negated;
  }

  setNegated(negated) {
    this._negated = negated;
  }

  /**
  * Recursively computes and returns string representation of this BooleanFunction
  * @param {[string]} literalNames Array of names put in place of literals
  * @param {string} op_orStr String used in place of logic OR operator. Defaults to '+'
  * @param {string} op_andStr String used in place of logic AND operator. Defaults to nothing
  * @param {string} negationHeader String inserted before negated literal
  * @param {string} negationFooter String inserted right after negated literal
  * @param {string} bracketOpen String used for open brackets. Defaults to normal open brackets
  * @param {string} bracketClosed String used for closed brackets. Defaults to normal closed brackets
  */
  // eslint-disable-next-line
  computeString(literalNames, op_orStr = '+', op_andStr = '', negationHeader, negationFooter, bracketOpen = '(', bracketClosed = ')') {
    if (!this.isNegated()) {
      return literalNames[this.getId()];
    }
    return negationHeader + literalNames[this.getId()] + negationFooter;
  }

  /**
     * @returns Returns a deep cloned copy of this Literal Instance.
     */
  clone() {
    return new BooleanFunctionLiteral(this._id, this._negated);
  }

  /**
     * @param {BooleanFunctionLiteral} other
     * @returns true if given literal is equivalent in meaning and
     * negation to this literal. false if not.
     */
  equals(other) {
    if (!(other instanceof BooleanFunctionLiteral)) {
      return false;
    }
    return this.getId() === other.getId() && this.isNegated() === other.isNegated();
  }

  amountLiterals() {
    return 1;
  }

  computeOutput(inputs) {
    if (this._id >= inputs.length) {
      return false;
    }
    if (!this._negated) {
      return Number(inputs[this._id]) === 1;
    }
    return !(Number(inputs[this._id])); // The Number() call allows for strings in inputs array
  }

  getIDs(ids) {
    if (ids.find((e) => e === this._id) == null) {
      ids.push(this._id);
    }
  }

  toString() {
    return `@${this._id}`;
  }
}
