import { NumberIEEE } from './numberIEEE';
import { NumberBaseNComplement } from '../baseNComplement/numberBaseNComplement';
import { AdditionBaseNComplement } from '../baseNComplement/addition';
import { Algorithm } from '../../algorithm';
import { roundArray } from '../../calcHelper';

export class AdditionIEEE {
  constructor(n1, n2) {
    if (n1.expBitNum !== n2.expBitNum) {
      console.log(`AdditionIEEE(Number, Number): expBitNum of n1(${n1.expBitNum})
        and expBitNum of n2(${n2.expBitNum}) not compatible.`);
      process.exit(1);
    }

    if (n1.manBitNum !== n2.manBitNum) {
      console.log(`AdditionIEEE(Number, Number): manBitNum of n1(${n1.manBitNum})
        and manBitNum of n2(${n2.manBitNum}) not compatible.`);
      process.exit(1);
    }

    this.producedOverflow = false;
    this.watcher = null;
    this.result = this._add(n1, n2);
  }

  _add(n1, n2) {
    this.watcher = new Algorithm();
    this.watcher = this.watcher.step('Edgecases');

    const expBitNum = n1.expBitNum;
    const manBitNum = n1.manBitNum;
    console.log(n1);
    console.log(n2);
    const bitNum = n1.bitNum;

    // Edgecases:
    if (n1.isZero) {
      // Return n2
      const result = new NumberIEEE(expBitNum, manBitNum, [...n2.arr]);
      this.watcher = this.watcher.step('ResultEdgecase')
        .saveVariable('edgecase', 'n2zero');
      this.watcher = this.watcher.step('Result')
        .saveVariable('result', result);
      return result;
    }
    if (n2.isZero) {
      // Return n1
      const result = new NumberIEEE(expBitNum, manBitNum, [...n1.arr]);
      this.watcher = this.watcher.step('ResultEdgecase')
        .saveVariable('edgecase', 'none');
      this.watcher = this.watcher.step('Result')
        .saveVariable('result', result);
      return result;
    }
    if (n1.isNaN || n2.isNaN || (n1.isInfinity && n2.isInfinity && n1.sign !== n2.sign)) {
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
      const sign = n1.isInfinity ? n1.sign : n2.sign;
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

    // Get unnormalized exponent
    let exponent1;
    let exponent2;
    let mantissa1;
    let mantissa2;
    let sign1;
    let sign2;
    let switched;
    if (n1.exponent >= n2.exponent) {
      exponent1 = n1.exponent;
      exponent2 = n2.exponent;
      mantissa1 = [...n1.mantissaBits];
      mantissa2 = [...n2.mantissaBits];
      sign1 = n1.sign;
      sign2 = n2.sign;
    } else {
      switched = true;
      exponent1 = n2.exponent;
      exponent2 = n1.exponent;
      mantissa1 = [...n2.mantissaBits];
      mantissa2 = [...n1.mantissaBits];
      sign1 = n2.sign;
      sign2 = n1.sign;
    }
    // difference between both exponents
    const deltaE = this._getDeltaExponent(exponent1, exponent2);
    this.watcher = this.watcher.step('CalculateDeltaE')
      .saveVariable('switched', switched)
      .saveVariable('expN1', n1.exponent)
      .saveVariable('expN2', n2.exponent)
      .saveVariable('expN1Bits', [...n1.exponentBits])
      .saveVariable('expN2Bits', [...n2.exponentBits])
      .saveVariable('deltaE', deltaE)
      .saveVariable('preShift', [...mantissa2]);

    // Shift smaller mantissa (mantissa2) to bigger mantissa (add 0s at start, remove last bits)
    if (deltaE > 0) {
      for (let i = 0; i < Math.abs(deltaE); i += 1) {
        mantissa2.unshift(0);
        mantissa2.pop();
      }
    }

    const additionData = this._addMantissa(
      mantissa1,
      mantissa2,
      sign1,
      sign2,
      mantissa2.length,
      deltaE,
      n1.isDenormalized || n2.isDenormalized,
    );

    const sign = additionData.sign ? 1 : 0;
    const normalizedMantissa = additionData.normalizedMantissa;
    const shift = additionData.shift;

    // Check if newly calculated mantissa is equal to 0
    if (
      additionData.isZero
      || (shift === normalizedMantissa.length - 1 && normalizedMantissa[0] === 0)
    ) {
      const result = new NumberIEEE(expBitNum, manBitNum, Array(bitNum).fill(0));
      this.watcher = this.watcher.step('ResultEdgecase')
        .saveVariable('edgecase', 'zero');
      this.watcher = this.watcher.step('Result')
        .saveVariable('result', result);
      return result;
    }

    // Calculate bits of the final Exponent
    let finalE = exponent1 + n1.bias + shift;
    // If we have a denormalized number, move the mantissa right again
    // console.log(finalE, normalizedMantissa);
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
    const exponentBits = this._getExponentBits(expBitNum, finalE);
    // console.log(finalE, normalizedMantissa);

    this.watcher = this.watcher.step('Normalize')
      .saveVariable('normalizedMantissa', [...normalizedMantissa])
      .saveVariable('shift', shift)
      .saveVariable('n1ExpBits', [...n1.exponentBits])
      .saveVariable('finalExpBits', [...exponentBits]);

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
    console.log(expBitNum, manBitNum, resultArray);
    const result = new NumberIEEE(expBitNum, manBitNum, resultArray);
    console.log(result);
    this.watcher = this.watcher.step('Result')
      .saveVariable('result', result);
    return result;
  }

  _getDeltaExponent(exp1, exp2) {
    return exp1 - exp2;
  }

  _addMantissa(mantissa1, mantissa2, sign1, sign2, binNum, deltaE, originallyDenormalized) {
    this.watcher = this.watcher.step('AddMantissa')
      .saveVariable('mantissa1', mantissa1)
      .saveVariable('mantissa2', mantissa2)
      .saveVariable('sign1', sign1)
      .saveVariable('sign2', sign2)
      .saveVariable('binNum', binNum);

    const isEqual = !originallyDenormalized && mantissa1.length === mantissa2.length
      && mantissa1.every((value, index) => value === mantissa2[index]);
    this.watcher = this.watcher.step('AddMantissa')
      .saveVariable('equalMantissa', isEqual);
    // x + x = 2x
    if (isEqual && sign1 === sign2) {
      const normalizedMantissa = [...mantissa1];
      normalizedMantissa.shift();
      normalizedMantissa.push(0);
      const shift = 1;
      const sign = sign1;
      this.watcher = this.watcher.step('AddMantissa')
        .saveVariable('addition', 'none')
        .saveVariable('shift', 0)
        .saveVariable('sign', sign)
        .saveVariable('unnormalizedMantissa', [...mantissa1])
        .saveVariable('normalizedMantissa', [...normalizedMantissa]);
      return {
        sign,
        normalizedMantissa,
        shift,
      };
    }
    // x + (-x) = 0
    if (isEqual && sign1 !== sign2) {
      const normalizedMantissa = [];
      for (let i = 0; i < mantissa1.length; i += 1) {
        normalizedMantissa.push(0);
      }
      const shift = 0;
      const sign = sign1;
      this.watcher = this.watcher.step('AddMantissa')
        .saveVariable('addition', 'none')
        .saveVariable('shift', 0)
        .saveVariable('sign', sign)
        .saveVariable('unnormalizedMantissa', [...normalizedMantissa])
        .saveVariable('normalizedMantissa', [...normalizedMantissa]);
      return {
        sign,
        normalizedMantissa,
        shift,
        isZero: true,
      };
    }

    let op1;
    let op2;
    // if deltaE > 0 then the sign of the first summand leads the result sign
    if (deltaE > 0) {
      op1 = new NumberBaseNComplement(
        2,
        binNum,
        mantissa1,
        binNum,
        false,
      );
      // ! Special case: mantissa2 is completely zero => VB = 0
      const hasSign = sign1 !== sign2 && !(mantissa2.every((item) => item === 0));
      op2 = new NumberBaseNComplement(
        2,
        binNum,
        mantissa2,
        binNum,
        hasSign,
      );
    } else {
      op1 = new NumberBaseNComplement(
        2,
        binNum,
        mantissa1,
        binNum,
        sign1 === 1,
      );
      op2 = new NumberBaseNComplement(
        2,
        binNum,
        mantissa2,
        binNum,
        sign2 === 1,
      );
    }
    this.watcher = this.watcher.step('AddMantissa')
      .saveVariable('complement1', JSON.parse(JSON.stringify(op1.watcher)));
    this.watcher = this.watcher.step('AddMantissa')
      .saveVariable('complement2', JSON.parse(JSON.stringify(op2.watcher)));

    console.log(op1, op2);
    const addition = new AdditionBaseNComplement(op1, op2);
    this.watcher = this.watcher.step('AddMantissa')
      .saveVariable('addition', JSON.parse(JSON.stringify(addition.watcher)));

    let additionResult = (addition).getResult();
    let sign = sign1 === 1;
    // case respects to a possible changed sign if the summands have the same exponent
    if (deltaE === 0) {
      additionResult = new NumberBaseNComplement(
        2,
        additionResult.arr.length,
        [...additionResult.arr],
        binNum,
        addition.negativeResult,
      );
      sign = addition.negativeResult;
    }
    const unnormalizedMantissa = [...additionResult.arr];
    this.watcher = this.watcher.step('AddMantissa')
      .saveVariable('unnormalizedMantissa', [...unnormalizedMantissa]);

    let shift = 0;
    // shift for overflowed addition
    if (unnormalizedMantissa.length > mantissa1.length) {
      shift = unnormalizedMantissa.length - mantissa1.length;
    }
    if (addition.carryOutSet) {
      shift = 1;
    } else {
      // shift right until a leading 1 is found
      while (Math.abs(shift) <= unnormalizedMantissa.length && unnormalizedMantissa[0] === 0) {
        unnormalizedMantissa.shift();
        unnormalizedMantissa.push(0);
        shift -= 1;
      }
    }

    // shift is bigger than mantissa length => 0
    if (shift === -unnormalizedMantissa.length) {
      const normalizedMantissa = [...unnormalizedMantissa];
      this.watcher = this.watcher.step('AddMantissa')
        .saveVariable('shift', shift)
        .saveVariable('sign', sign)
        .saveVariable('unnormalizedMantissa', [...normalizedMantissa]);
      return {
        sign,
        normalizedMantissa,
        shift,
        isZero: true,
      };
    }

    // remove leading 1
    unnormalizedMantissa.shift();
    unnormalizedMantissa.push(0);

    // round resulting array
    const normalizedMantissa = roundArray(unnormalizedMantissa, mantissa1.length - 1);
    this.watcher = this.watcher.step('AddMantissa')
      .saveVariable('shift', shift)
      .saveVariable('sign', sign)
      .saveVariable('normalizedMantissa', [...normalizedMantissa]);
    return {
      sign,
      normalizedMantissa,
      shift,
      isZero: false,
    };
  }

  _calculateShift(unnormalizedMantissa, cDigits) {
    if (cDigits >= 1) {
      return cDigits - 1;
    }

    let shift = 0;
    for (let i = 1; i < unnormalizedMantissa.length; i += 1) {
      shift -= 1;
      if (unnormalizedMantissa[i] === 1) {
        break;
      }
    }
    return shift;
  }

  _getNormalizedMantissa(manBitNum, unnormalizedMantissa, shift) {
    const normalizedMantissa = [];
    for (let i = 0; i < manBitNum; i += 1) {
      const access = i + Math.max(-shift, 0) + 1;
      const num = access < unnormalizedMantissa.length ? unnormalizedMantissa[access] : 0;
      normalizedMantissa.push(num);
    }

    return normalizedMantissa;
  }

  _getExponentBits(expBitNum, finalE) {
    let curE = finalE;
    const exponentBits = [];
    for (let i = 0; i < expBitNum; i += 1) {
      exponentBits.unshift(curE % 2);
      curE = Math.floor(curE / 2);
    }

    return exponentBits;
  }

  getResult() {
    return this.result;
  }
}
