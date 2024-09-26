import { NumberIEEE } from './numberIEEE';
import { NumberBaseNSigned } from '../baseNSigned/numberBaseNSigned';
import { MultiplicationBaseNSigned } from '../baseNSigned/multiplication';
import { Algorithm } from '../../algorithm';
import { roundArray } from '../../calcHelper';

export class MultiplicationIEEE {
  constructor(n1, n2) {
    if (n1.expBitNum !== n2.expBitNum) {
      console.log(`MultiplicationIEEE(Number, Number): expBitNum of n1(${n1.expBitNum})
        and expBitNum of n2(${n2.expBitNum}) not compatible.`);
    }

    if (n1.manBitNum !== n2.manBitNum) {
      console.log(`MultiplicationIEEE(Number, Number): manBitNum of n1(${n1.manBitNum})
        and manBitNum of n2(${n2.manBitNum}) not compatible.`);
    }

    this.producedOverflow = false;
    this.result = this._multiply(n1, n2);
  }

  _multiply(n1, n2) {
    this.watcher = new Algorithm();
    const expBitNum = n1.expBitNum;
    const manBitNum = n1.manBitNum;
    const bitNum = n1.bitNum;
    const sign = ((n1.sign && !n2.sign) || (!n1.sign && n2.sign)) + 0;
    this.watcher = this.watcher.step('MulMantissa')
      .saveVariable('sign', sign);

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

    if (n1.isInfinity || n2.isInfinity) {
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

    if (n1.isZero || n2.isZero) {
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

    const op1 = new NumberBaseNSigned(2, n1.mantissaBits);
    const op2 = new NumberBaseNSigned(2, n2.mantissaBits);

    const multiplication = new MultiplicationBaseNSigned(op1, op2);
    this.watcher = this.watcher.step('Multiplication')
      .saveVariable('multiplication', multiplication.watcher);
    const multiplicationResult = multiplication.getResult();

    const digitNum = multiplicationResult.digitNum;

    // Adds zeros if unnormalized mantissa is to short
    const unnormalizedMantissa = [...multiplicationResult.arr];
    this.watcher = this.watcher.step('MulMantissa')
      .saveVariable('unnormalizedMantissa', unnormalizedMantissa);
    for (
      let i = unnormalizedMantissa.length;
      i < Math.max(n1.mantissaBits.length, n2.mantissaBits.length);
      i += 1
    ) {
      unnormalizedMantissa.push(0);
    }
    // deletes zeros at the front of the mantissa
    let cDigits = digitNum;
    while (cDigits > 1 && unnormalizedMantissa[0] === 0) {
      unnormalizedMantissa.splice(0, 1);
      cDigits -= 1;
    }

    // Calculate shift
    // Positive: Rightshift | Negative: Leftshift
    let shift = multiplicationResult.arr.length - multiplicationResult.offset - op1.arr.length;
    if (cDigits >= 1) {
      shift = cDigits - 1;
    } else {
      for (let i = 0; i < unnormalizedMantissa.length; i += 1) {
        if (unnormalizedMantissa[i] === 1) {
          break;
        }
        shift -= 1;
      }
    }
    this.watcher = this.watcher.step('MulMantissa')
      .saveVariable('shift', shift);

    // Check if newly calculated ieee is equal to zero
    if (shift === unnormalizedMantissa.length - 1 && unnormalizedMantissa[0] === 0) {
      const result = new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(0));
      this.watcher = this.watcher.step('ResultEdgecase')
        .saveVariable('edgecase', 'zero');
      this.watcher = this.watcher.step('Result')
        .saveVariable('result', result);
      return result;
    }

    // normalizes the mantissa
    let normalizedMantissa = [];
    // const toRound = unnormalizedMantissa[manBitNum] === 1;
    const toRound = unnormalizedMantissa.length <= manBitNum ? false : unnormalizedMantissa[manBitNum + 1] === 1;
    for (let i = 0; i < manBitNum; i += 1) {
      const access = i + Math.max(-shift, 0) + 1;
      const num = access < unnormalizedMantissa.length ? unnormalizedMantissa[access] : 0;
      normalizedMantissa.push(num);
    }
    if (toRound) {
      normalizedMantissa = roundArray(normalizedMantissa, manBitNum, toRound, n1.base);
    }

    this.watcher = this.watcher.step('CalculateExp').saveVariable('E1', n1.E)
      .saveVariable('E2', n2.E)
      .saveVariable('bias', n1.bias)
      .saveVariable('notShifted', n1.E + n2.E - n1.bias);
    this.watcher = this.watcher.step('MulMantissa')
      .saveVariable('normalizedMantissa', normalizedMantissa);

    let finalE = n1.E + n2.E - n1.bias + shift;
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
    // Check if denormalization has to take place
    /* if (finalE < 0) {
      const denormArray = [sign];
      // Exponent of ZERO indicates the denormalized representation
      denormArray.push(...Array(expBitNum).fill(0));
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

    // caluclates the exponent bits
    let curE = finalE;
    const exponentBits = [];
    for (let i = 0; i < expBitNum; i += 1) {
      exponentBits.unshift(curE % 2);
      curE = Math.floor(curE / 2);
    }

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
    const resultArr = [sign];
    resultArr.push(...exponentBits);
    resultArr.push(...normalizedMantissa);
    const result = new NumberIEEE(expBitNum, manBitNum, resultArr);
    this.watcher = this.watcher.step('Result')
      .saveVariable('result', result);
    return result;
  }

  getResult() {
    return this.result;
  }
}
