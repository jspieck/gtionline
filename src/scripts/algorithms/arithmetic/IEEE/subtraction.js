import { NumberIEEE } from './numberIEEE';
import { AdditionIEEE } from './addition';
import { Algorithm } from '../../algorithm';

export class SubtractionIEEE {
  /**
   * @param {NumberIEEE} n1 - First IEEE number
   * @param {NumberIEEE} n2 - Second IEEE number
   */
  constructor(n1, n2) {
    this._validateInputs(n1, n2);
    this.producedOverflow = false;
    this.watcher = new Algorithm();
    this.result = this._subtract(n1, n2);
  }

  /**
   * Validates that input numbers are compatible for subtraction.
   * @private
   */
  _validateInputs(n1, n2) {
    if (n1.expBitNum !== n2.expBitNum) {
      throw new Error(`SubtractionIEEE: expBitNum of n1(${n1.expBitNum}) and n2(${n2.expBitNum}) not compatible.`);
    }
    if (n1.manBitNum !== n2.manBitNum) {
      throw new Error(`SubtractionIEEE: manBitNum of n1(${n1.manBitNum}) and n2(${n2.manBitNum}) not compatible.`);
    }
  }

  /**
   * Performs IEEE subtraction.
   * @private
   * @param {NumberIEEE} n1 - First IEEE number
   * @param {NumberIEEE} n2 - Second IEEE number
   * @returns {NumberIEEE} Result of the subtraction
   */
  _subtract(n1, n2) {
    this.watcher = this.watcher.step('Input')
      .saveVariable('n1Sign', n1.sign)
      .saveVariable('n1Exponent', n1.exponentBits)
      .saveVariable('n1Mantissa', n1.mantissaBits)
      .saveVariable('n2Sign', n2.sign)
      .saveVariable('n2Exponent', n2.exponentBits)
      .saveVariable('n2Mantissa', n2.mantissaBits);

    const flipedArr2 = this._flipSign(n2.arr);
    const op1 = new NumberIEEE(n1.expBitNum, n1.manBitNum, n1.arr);
    const op2 = new NumberIEEE(n2.expBitNum, n2.manBitNum, flipedArr2);

    // a - b = a + (-b)
    const addition = new AdditionIEEE(op1, op2);
    this.watcher = this.watcher.step('Addition')
      .saveVariable('addition', addition.watcher);
    
    return addition.getResult();
  }

  /**
   * Flips the sign bit of the given array.
   * @private
   * @param {number[]} arr - Array representing the IEEE number
   * @returns {number[]} Array with flipped sign bit
   */
  _flipSign(arr) {
    const flippedArr = [...arr];
    flippedArr[0] = flippedArr[0] === 0 ? 1 : 0;
    return flippedArr;
  }

  /**
   * Returns the result of the subtraction.
   * @returns {NumberIEEE} The result of the IEEE subtraction
   */
  getResult() {
    return this.result;
  }
}