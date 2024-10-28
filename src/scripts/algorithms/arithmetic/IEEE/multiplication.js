import { NumberIEEE } from './numberIEEE';
import { NumberBaseNSigned } from '../baseNSigned/numberBaseNSigned';
import { MultiplicationBaseNSigned } from '../baseNSigned/multiplication';
import { Algorithm } from '../../algorithm';
import { roundArray } from '../../calcHelper';

export class MultiplicationIEEE {
  /**
   * @param {NumberIEEE} n1 - First IEEE number
   * @param {NumberIEEE} n2 - Second IEEE number
   */
  constructor(n1, n2) {
    this._validateInputs(n1, n2);
    this.producedOverflow = false;
    this.watcher = new Algorithm();
    this.result = this._multiply(n1, n2);
  }

  /**
   * Validates that input numbers are compatible for multiplication.
   * @private
   */
  _validateInputs(n1, n2) {
    if (n1.expBitNum !== n2.expBitNum) {
      throw new Error(`MultiplicationIEEE: expBitNum of n1(${n1.expBitNum}) and n2(${n2.expBitNum}) not compatible.`);
    }
    if (n1.manBitNum !== n2.manBitNum) {
      throw new Error(`MultiplicationIEEE: manBitNum of n1(${n1.manBitNum}) and n2(${n2.manBitNum}) not compatible.`);
    }
  }

  /**
   * Performs IEEE multiplication.
   * @private
   * @param {NumberIEEE} n1 - First IEEE number
   * @param {NumberIEEE} n2 - Second IEEE number
   * @returns {NumberIEEE} Result of the multiplication
   */
  _multiply(n1, n2) {
    const { expBitNum, manBitNum } = n1;
    const bitNum = 1 + expBitNum + manBitNum;
    const sign = ((n1.sign && !n2.sign) || (!n1.sign && n2.sign)) + 0;
    
    this.watcher = this.watcher.step('MulMantissa').saveVariable('sign', sign);

    const edgecaseResult = this._handleEdgecases(n1, n2, expBitNum, manBitNum, bitNum, sign);
    if (edgecaseResult) {
      this.watcher = this.watcher.step('ResultEdgecase').saveVariable('edgecase', 'handled');
      return edgecaseResult;
    }

    const { unnormalizedMantissa, shift } = this._multiplyMantissas(n1, n2);
    console.log('Debug: Unnormalized mantissa:', unnormalizedMantissa);
    console.log('Debug: Shift:', shift);

    const { normalizedMantissa, finalE } = this._normalizeMantissa(unnormalizedMantissa, shift, n1, n2, manBitNum);

    const result = this._createResult(sign, finalE, normalizedMantissa, expBitNum, manBitNum, bitNum);
    
    this.watcher = this.watcher.step('ResultEdgecase').saveVariable('edgecase', 'none');
    return result;
  }

  /**
   * Handles edge cases for multiplication.
   * @private
   */
  _handleEdgecases(n1, n2, expBitNum, manBitNum, bitNum, sign) {
    if (n1.isNaN || n2.isNaN || (n1.isInfinity && n2.isZero) || (n1.isZero && n2.isInfinity)) {
      return this._createNaNResult(expBitNum, manBitNum, bitNum);
    }

    if (n1.isInfinity || n2.isInfinity) {
      return this._createInfinityResult(sign, expBitNum, manBitNum);
    }

    if (n1.isZero || n2.isZero) {
      return this._createZeroResult(sign, expBitNum, manBitNum);
    }

    return null;
  }

  /**
   * Multiplies the mantissas of two IEEE numbers.
   * @private
   */
  _multiplyMantissas(n1, n2) {
    const op1 = new NumberBaseNSigned(2, n1.mantissaBits);
    const op2 = new NumberBaseNSigned(2, n2.mantissaBits);
    console.log('Debug: Op1:', n1.mantissaBits, op1);
    console.log('Debug: Op2:', n2.mantissaBits, op2);

    const multiplication = new MultiplicationBaseNSigned(op1, op2);
    this.watcher = this.watcher.step('Multiplication')
      .saveVariable('multiplication', multiplication.watcher);
    const multiplicationResult = multiplication.getResult();
    console.log('Debug: Multiplication result:', multiplicationResult);

    const unnormalizedMantissa = [...multiplicationResult.arr];
    this.watcher = this.watcher.step('MulMantissa')
      .saveVariable('unnormalizedMantissa', unnormalizedMantissa);

    let shift = this._calculateShift(multiplicationResult, op1.arr.length); // n1.manBitNum

    return { unnormalizedMantissa, shift };
  }

  /**
   * Calculates the shift for the mantissa.
   * @private
   */
  _calculateShift(multiplicationResult, op1Length) {
    let shift = multiplicationResult.arr.length - multiplicationResult.offset - op1Length;
    console.log('Debug: shift:', shift);
    console.log('Debug: op1Length:', op1Length);

    for (let i = 0; i < multiplicationResult.arr.length; i++) {
      if (multiplicationResult.arr[i] === 1) break;
      shift--;
    }
    console.log('Debug: shift:', shift);
    this.watcher = this.watcher.step('MulMantissa').saveVariable('shift', shift);
    return shift;
  }

  /**
   * Normalizes the mantissa after multiplication.
   * @private
   */
  _normalizeMantissa(unnormalizedMantissa, shift, n1, n2, manBitNum) {
    let normalizedMantissa = [];
    const toRound = unnormalizedMantissa.length <= manBitNum ? false : unnormalizedMantissa[manBitNum + 1] === 1;

    for (let i = 0; i < manBitNum; i++) {
      const access = i + Math.max(-shift, 0) + 1;
      const num = access < unnormalizedMantissa.length ? unnormalizedMantissa[access] : 0;
      normalizedMantissa.push(num);
    }

    if (toRound) {
      normalizedMantissa = roundArray(normalizedMantissa, manBitNum, toRound, n1.base);
    }

    let finalE = n1.E + n2.E - n1.bias + shift;
    
    // Handle denormalized numbers
    if (finalE <= 0) {
      normalizedMantissa = this._handleDenormalizedResult(normalizedMantissa, finalE, manBitNum);
      finalE = 0;
    }

    this.watcher = this.watcher.step('CalculateExp')
      .saveVariable('E1', n1.E)
      .saveVariable('E2', n2.E)
      .saveVariable('bias', n1.bias)
      .saveVariable('notShifted', n1.E + n2.E - n1.bias);

    this.watcher = this.watcher.step('MulMantissa')
      .saveVariable('normalizedMantissa', normalizedMantissa);

    return { normalizedMantissa, finalE };
  }

  /**
   * Handles denormalized results.
   * @private
   */
  _handleDenormalizedResult(mantissa, finalE, manBitNum) {
    const shiftRight = Math.abs(finalE) + 1;
    const result = new Array(manBitNum).fill(0);
    
    for (let i = 0; i < manBitNum - shiftRight; i++) {
      result[i + shiftRight] = mantissa[i];
    }
    
    return result;
  }

  /**
   * Creates the final result of the multiplication.
   * @private
   */
  _createResult(sign, finalE, normalizedMantissa, expBitNum, manBitNum, bitNum) {
    if (finalE >= (2 ** expBitNum) - 1) {
      return this._createInfinityResult(sign, expBitNum, manBitNum);
    }

    const exponentBits = this._getExponentBits(expBitNum, finalE);
    const resultArr = [sign, ...exponentBits, ...normalizedMantissa];
    const result = new NumberIEEE(expBitNum, manBitNum, resultArr);

    this.watcher = this.watcher.step('ResultEdgecase').saveVariable('edgecase', 'none');
    this.watcher = this.watcher.step('Result').saveVariable('result', result);
    return result;
  }

  /**
   * Creates a NaN result.
   * @private
   */
  _createNaNResult(expBitNum, manBitNum, bitNum) {
    const result = new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(1));
    this.watcher = this.watcher.step('ResultEdgecase').saveVariable('edgecase', 'nan');
    this.watcher = this.watcher.step('Result').saveVariable('result', result);
    return result;
  }

  /**
   * Creates an Infinity result.
   * @private
   */
  _createInfinityResult(sign, expBitNum, manBitNum) {
    const infArray = [sign, ...Array(expBitNum).fill(1), ...Array(manBitNum).fill(0)];
    const result = new NumberIEEE(expBitNum, manBitNum, infArray);
    this.watcher = this.watcher.step('ResultEdgecase').saveVariable('edgecase', 'inf');
    this.watcher = this.watcher.step('Result').saveVariable('result', result);
    return result;
  }

  /**
   * Creates a Zero result.
   * @private
   */
  _createZeroResult(sign, expBitNum, manBitNum) {
    const zeroArray = [sign, ...Array(expBitNum).fill(0), ...Array(manBitNum).fill(0)];
    const result = new NumberIEEE(expBitNum, manBitNum, zeroArray);
    this.watcher = this.watcher.step('ResultEdgecase').saveVariable('edgecase', 'zero');
    this.watcher = this.watcher.step('Result').saveVariable('result', result);
    return result;
  }

  /**
   * Converts an exponent to its binary representation.
   * @private
   */
  _getExponentBits(expBitNum, exponent) {
    return exponent.toString(2).padStart(expBitNum, '0').split('').map(Number);
  }

  /**
   * Returns the result of the multiplication.
   * @returns {NumberIEEE} The result of the IEEE multiplication
   */
  getResult() {
    return this.result;
  }
}
