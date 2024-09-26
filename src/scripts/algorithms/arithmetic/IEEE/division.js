import { NumberIEEE } from './numberIEEE';
import { NumberBaseNSigned } from '../baseNSigned/numberBaseNSigned';
import { DivisionBaseNSigned } from '../baseNSigned/division';
import { Algorithm } from '../../algorithm';
import { roundArray } from '../../calcHelper';

export class DivisionIEEE {
  constructor(n1, n2) {
    if (n1.expBitNum !== n2.expBitNum) {
      console.log('DivisionIEEE(Number, Number): expBitNum of n1('.concat(n1.expBitNum, ') and expBitNum of n2(')
        .concat(n2.expBitNum, ') not compatible.'));
    }

    if (n1.manBitNum !== n2.manBitNum) {
      console.log('DivisionIEEE(Number, Number): manBitNum of n1('.concat(n1.manBitNum, ') and manBitNum of n2(')
        .concat(n2.manBitNum, ') not compatible.'));
    }

    this.producedOverflow = false;
    this.result = this._divide(n1, n2);
  }

  _divide(n1, n2) {
    this.watcher = new Algorithm();
    const expBitNum = n1.expBitNum;
    const manBitNum = n1.manBitNum;
    const bitNum = n1.bitNum;
    const sign = ((n1.sign && !n2.sign) || (!n1.sign && n2.sign)) + 0;

    // Edgecases:
    if (n1.isNaN || n2.isNaN || (n1.isInfinity && n2.isZero) || (n1.isZero && n2.isInfinity)) {
      // Return NaN
      const result = new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(1));
      this.watcher = this.watcher.step('ResultEdgecase')
        .saveVariable('edgecase', 'nan');
      this.watcher = this.watcher.step('Result')
        .saveVariable('result', result);
      return result;
    }

    if ((n1.isInfinity && n2.isInfinity) || (n1.isZero && n2.isZero)) {
      // Return NaN, the second
      const result = new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(1));
      this.watcher = this.watcher.step('ResultEdgecase')
        .saveVariable('edgecase', 'nan');
      this.watcher = this.watcher.step('Result')
        .saveVariable('result', result);
      return result;
    }

    if ((n1.isInfinity && !n2.isInfinity) || (!n1.isZero && n2.isZero)) {
      // Return Infinty
      const infArray = [sign];
      infArray.push(...Array(expBitNum).fill(1));
      infArray.push(...Array(manBitNum).fill(0));
      const result = new NumberIEEE(expBitNum, manBitNum, infArray);
      this.watcher = this.watcher.step('ResultEdgecase')
        .saveVariable('edgecase', 'inf');
      this.watcher = this.watcher.step('Result')
        .saveVariable('result', result);
      return result;
    }

    if ((!n1.isInfinity && n2.isInfinity) || n1.isZero) {
      // Return Zero
      const infArray = [sign];
      infArray.push(...Array(expBitNum).fill(0));
      infArray.push(...Array(manBitNum).fill(0));
      const result = new NumberIEEE(expBitNum, manBitNum, infArray);
      this.watcher = this.watcher.step('ResultEdgecase')
        .saveVariable('edgecase', 'zero');
      this.watcher = this.watcher.step('Result')
        .saveVariable('result', result);
      return result;
    }

    // check if mantissas are equal
    let k = 0;
    let similar = true;
    while (k < n1.mantissaBits.length && similar === true) {
      if (n1.mantissaBits[k] !== n2.mantissaBits[k]) {
        similar = false;
      }
      k += 1;
    }

    let unnormalizedMantissa = [];
    const normalizedMantissa = [];
    let shift = 0;

    this.watcher = this.watcher.step('Division')
      .saveVariable('equalMantissa', similar);

    if (similar === false) {
      // case mantissa not equal
      const op1 = new NumberBaseNSigned(2, n1.mantissaBits, n1.offset, false);
      const op2 = new NumberBaseNSigned(2, n2.mantissaBits, n2.offset, false);
      const operation = new DivisionBaseNSigned(
        op1,
        op2,
        Math.max(n1.manBitNum + 1, n2.manBitNum + 1),
      );
      this.watcher = this.watcher.step('Division')
        .saveVariable('division', operation.watcher);
      const divisionResult = operation.getResult();
      unnormalizedMantissa = [...divisionResult.arr];

      // cut unnormalized matissa if to long
      const digitNum = operation.manBitNum;

      this.watcher = this.watcher.step('Division')
        .saveVariable('divMantissa', [...unnormalizedMantissa]);
      unnormalizedMantissa = roundArray(unnormalizedMantissa, digitNum);

      // Calculate shift
      // Positive: Rightshift | Negative: Leftshift
      let i = 0;
      while (i < unnormalizedMantissa.length) {
        if (unnormalizedMantissa[i] === 1) {
          break;
        }
        i += 1;
        shift -= 1;
      }

      if (operation.firstNegativeStep) {
        shift -= 1;
      }
      if (shift === unnormalizedMantissa.length - 1 && unnormalizedMantissa[0] === 0) {
        // Return zero
        const result = new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(0));
        this.watcher = this.watcher.step('ResultEdgecase')
          .saveVariable('edgecase', 'zero');
        this.watcher = this.watcher.step('Result')
          .saveVariable('result', result);
        return result;
      }
      for (let j = 1; j <= manBitNum; j += 1) {
        const num = j < unnormalizedMantissa.length ? unnormalizedMantissa[j] : 0;
        normalizedMantissa.push(num);
      }
    } else {
      // equal mantissas => mantissa = 1.0
      for (let i = 0; i < manBitNum; i += 1) {
        normalizedMantissa.push(0);
      }
    }

    let finalE = n1.E - n2.E + n1.bias + shift;
    if (finalE <= 0) {
      // Shift the leading 1 into the mantissa
      normalizedMantissa.unshift(1);
      normalizedMantissa.pop();
      // shift the 1 to express the finalE
      for (let i = 0; i < Math.abs(finalE); i += 1) {
        normalizedMantissa.unshift(0);
        normalizedMantissa.pop();
      }
      finalE = 0;
    }
    let curE = finalE;
    const exponentBits = [];
    for (let i = 0; i < expBitNum; i += 1) {
      exponentBits.unshift(curE % 2);
      curE = Math.floor(curE / 2);
    }

    this.watcher = this.watcher.step('Exponent')
      .saveVariable('E1', n1.E)
      .saveVariable('E2', n2.E)
      .saveVariable('Bias', n1.bias)
      .saveVariable('Shift', shift)
      .saveVariable('EUnshifted', n1.E - n2.E + n1.bias)
      .saveVariable('FinalE', finalE);

    this.watcher = this.watcher.step('Mantissa')
      .saveVariable('unnormalizedMantissa', [...unnormalizedMantissa])
      .saveVariable('normalizedMantissa', [...normalizedMantissa]);

    /* Check if denormalization has to take place
    if (finalE < 0) {
      const denormArray = [sign];
      // Exponent of ZERO indicates the denormalized representation
      denormArray.push(...Array(expBitNum).fill(0));
      // Unshift the leading 1 into the mantissa
      normalizedMantissa.unshift(1);
      // Now shift the mantissa by the extra amount
      for (let i = 0; i < Math.abs(finalE); i += 1)  {
        normalizedMantissa.unshift(0);
      }
      normalizedMantissa.splice(manBitNum, (normalizedMantissa.length - manBitNum));
      denormArray.push(...normalizedMantissa);
      const result = new NumberIEEE(expBitNum, manBitNum, denormArray);

      this.watcher = this.watcher.step('ResultEdgecase')
        .saveVariable('edgecase', 'denormalized');
      this.watcher = this.watcher.step('Result')
        .saveVariable('result', result);
      return result;
    } */

    // Check if newly calculated ieee is equal to inf
    if (finalE >= (2 ** expBitNum) - 1) {
      const infArray = [sign];
      infArray.push(...Array(expBitNum).fill(1));
      infArray.push(...Array(manBitNum).fill(0));
      const result = new NumberIEEE(expBitNum, manBitNum, infArray);
      this.watcher = this.watcher.step('ResultEdgecase')
        .saveVariable('edgecase', 'inf');
      this.watcher = this.watcher.step('Result')
        .saveVariable('result', result);
      return result;
    }

    // normal case result
    this.watcher = this.watcher.step('ResultEdgecase')
      .saveVariable('edgecase', 'none');
    const resultArray = [sign];
    resultArray.push(...exponentBits);
    resultArray.push(...normalizedMantissa);

    const result = new NumberIEEE(expBitNum, manBitNum, resultArray);
    this.watcher = this.watcher.step('Result')
      .saveVariable('edgecase', 'none')
      .saveVariable('result', result);
    return result;
  }

  getResult() {
    return this.result;
  }
}
