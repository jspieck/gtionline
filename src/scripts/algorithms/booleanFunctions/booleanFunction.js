import { BooleanFunctionLiteral } from './booleanFunctionLiteral';

export const BooleanFunctionOperator_AND = '*';
export const BooleanFunctionOperator_OR = '+';
export const BooleanFunctionOperator_NOT = '~';

/**
 * Class representing a boolean function (Schaltfunktion).
 * e.g. (terms[0]) -logicOperator- (terms[1]) -logicOperator- (terms[2]) -lo...
 */
export class BooleanFunction {
  /**
     * @param {BooleanFunctionOperator_AND | BooleanFunctionOperator_OR} logicOperator logic
     *  operator concatenating the individual terms. \
     *  Either BooleanFunction.js > BooleanFunctionOperator_AND \
     *  or BooleanFunction.js > BooleanFunctionOperator_OR
     * @param {[BooleanFunction | BooleanFunctionLiteral]} terms
     */
  constructor(logicOperator, terms) {
    if (terms) {
      this._terms = terms;
    } else {
      this._terms = [];
    }
    this._logicOperator = logicOperator;
  }

  /**
     * Adds given term to the end of this functions internal
     * list of terms.
     * @param {BooleanFunction | BooleanFunctionLiteral} term
     */
  addTerm(term) {
    this._terms.push(term);
  }

  /**
   * Overwrites the term at {index} with {term}
   * @param {number} index
   * @param {BooleanFunction | BooleanFunctionLiteral} term
   */
  setTerm(index, term) {
    this._terms[index] = term;
  }

  setLogicOperator(op) {
    this._logicOperator = op;
  }

  setTerms(terms) {
    this._terms = terms;
  }

  /**
   * Moves all elements of the array starting at index {index} one to the right and inserts {term} at index {index}
   * @param {number} index
   * @param {BooleanFunction | BooleanFunctionLiteral} term
   */
  injectTermBeforeIndex(index, term) {
    this._terms.splice(index, 0, term);
  }

  /**
     * @returns {[BooleanFunction | BooleanFunctionLiteral]}
     */
  getTerms() {
    return this._terms;
  }

  spliceTerms(a, b) {
    this._terms.splice(a, b);
  }

  /**
     * @returns Returns the logical operator which concatenates
     * the indiviual terms of this BooleanFuncion.
     */
  getLogicOperator() {
    return this._logicOperator;
  }

  /**
     * @param {BooleanFunction} other
     * @param {Boolean} checkOrder Whether to also want the
     * subsequent terms to be in the same order. defaults to false.
     * @param {Boolean} checkOrderOfSubSubTerms Whether
     * all subterms of subterms (of subterms...) must also be in
     * the same order
     * @returns true if given BooleanFunction is equivalent to
     * this BooleanFunction. Also checks all subsequent terms
     * recursively.
     */
  equals(other, checkOrder = false, checkOrderOfSubSubTerms = false) {
    if (!(other instanceof BooleanFunction)) {
      return false;
    }

    if (this.getLogicOperator() !== other.getLogicOperator()
            || this.getTerms().length !== other.getTerms().length) {
      return false;
    }

    // check if subterms are equivalent
    if (checkOrder) {
      for (let t = 0; t < this.getTerms().length; t += 1) {
        if (!this.getTerms()[t].equals(other.getTerms()[t], checkOrderOfSubSubTerms, checkOrderOfSubSubTerms)) {
          return false;
        }
      }
    } else {
      for (let t = 0; t < this.getTerms().length; t += 1) {
        const querry = this.getTerms()[t];
        // check if an equivalent term can be found in -other-
        if (other.getTerms().filter(
          (otherTerm) => otherTerm.equals(querry, checkOrderOfSubSubTerms, checkOrderOfSubSubTerms),
        ).length === 0) {
          return false;
        }
      }
      for (let t = 0; t < other.getTerms().length; t += 1) {
        const querry = other.getTerms()[t];
        // check if an equivalent term can be found in -other-
        if (this.getTerms().filter(
          (thisTerm) => thisTerm.equals(querry, checkOrderOfSubSubTerms, checkOrderOfSubSubTerms),
        ).length === 0) {
          return false;
        }
      }
    }

    return true;
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
  computeString(literalNames, op_orStr = '+', op_andStr = '', negationHeader, negationFooter, bracketOpen = '(', bracketClosed = ')', reverseOrder = true) {
    let str = '';

    if (this._logicOperator === BooleanFunctionOperator_NOT) {
      return `\\overline{${this._terms[0].computeString(literalNames, op_orStr, op_andStr, negationHeader, negationFooter, bracketOpen, bracketClosed, reverseOrder)}}`;
    }

    const amountTerms = this.getTerms().length;
    const useBrackets = amountTerms > 1 && this.getLogicOperator() !== BooleanFunctionOperator_OR;

    for (let t = reverseOrder ? amountTerms - 1 : 0; reverseOrder ? t >= 0 : t < amountTerms; t += reverseOrder ? -1 : 1) {
      const subTerm = this.getTerms()[t];
      const subTermIsLiteral = subTerm instanceof BooleanFunctionLiteral;

      // open bracket
      if (useBrackets && !subTermIsLiteral) {
        str += bracketOpen;
      }

      // Literal / Subterm
      str += subTerm.computeString(literalNames, op_orStr, op_andStr, negationHeader, negationFooter, bracketOpen, bracketClosed, reverseOrder);

      // closed bracket
      if (useBrackets && !subTermIsLiteral) {
        str += bracketClosed;
      }

      // OP
      if (!reverseOrder) {
        if (t < amountTerms - 1/* && this.getLogicOperator() === BooleanFunctionOperator_OR */) {
          str += this.getLogicOperator() === BooleanFunctionOperator_OR ? op_orStr : op_andStr;
        }
      } else if (t > 0 /* && this.getLogicOperator() === BooleanFunctionOperator_OR */) {
        str += this.getLogicOperator() === BooleanFunctionOperator_OR ? op_orStr : op_andStr;
      }
    }
    return str;
  }

  /**
  * Recursively computes and returns basic latex represenation of this BooleanFunction. \
  * Latex shortcut to BooleanFunction.computeString(..)
  * @param {[string]} literalNames Array of names put in place of literals
  */
  toLatex(literalNames = ['x0', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7'], reverseOrder = true) {
    return this.computeString(literalNames, '+', '', '\\bar{', '}', '\\left(', '\\right)', reverseOrder);
  }

  /**
     * @returns Returns deep cloned version of this BooleanFunction.
     * Recursively calls .clone() on all subsequent terms and literals.
     */
  clone() {
    const termsCloned = [];
    for (let i = 0; i < this._terms.length; i += 1) {
      termsCloned[i] = this._terms[i].clone();
    }
    return new BooleanFunction(this._logicOperator, termsCloned);
  }

  /**
     * @returns Recursively computes amount of BooleanFunctionLiterals
     * in this and all subsequent terms.
     */
  amountLiterals() {
    return this._terms.reduce((sum, term) => sum + term.amountLiterals(), 0);
  }

  computeOutput(inputs) {
    console.log('output', this._logicOperator, inputs);
    if (this._logicOperator === BooleanFunctionOperator_NOT) {
      return !(this._terms[0].computeOutput(inputs));
    }
    if (this._logicOperator === BooleanFunctionOperator_AND) {
      for (const term of this._terms) {
        if (term.computeOutput(inputs) === false) {
          return false;
        }
      }
      return true;
    }
    if (this._logicOperator === BooleanFunctionOperator_OR) {
      for (const term of this._terms) {
        if (term.computeOutput(inputs) === true) {
          return true;
        }
      }
      return false;
    }
    throw new Error(`Unknown BooleanFunctionOperator: ${this._logicOperator}`);
  }

  getIDs(ids = []) {
    for (const term of this._terms) {
      term.getIDs(ids);
    }
    return ids;
  }

  findHighestID() {
    let max = -1;
    for (const term of this._terms) {
      let tmp;
      if (term instanceof BooleanFunctionLiteral) {
        tmp = term.getId();
      } else {
        tmp = term.findHighestID();
      }
      if (tmp > max) {
        max = tmp;
      }
    }
    return max;
  }

  toString() {
    if (this._logicOperator === BooleanFunctionOperator_NOT) {
      if (this._terms[0] instanceof BooleanFunctionLiteral) {
        return `~${this._terms[0].toString()}`;
      }
      return `~(${this._terms[0].toString()})`;
    }
    let str = '';
    for (let s = 0; s < this._terms.length; s += 1) {
      let appendix = '';
      if (s < this._terms.length - 1) {
        appendix = this._logicOperator === BooleanFunctionOperator_AND ? '*' : '+';
      }
      if (this._terms[s] instanceof BooleanFunctionLiteral) {
        str += this._terms[s].toString() + appendix;
      } else {
        str += `(${this._terms[s].toString()})${appendix}`;
      }
    }
    return str;
  }
}
