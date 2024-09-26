import { AdditionBaseNComplement } from '../baseNComplement/addition';
import { NumberBaseNComplement } from '../baseNComplement/numberBaseNComplement';
import { NumberBaseNSigned } from './numberBaseNSigned';
import { Algorithm } from '../../algorithm';

export class DivisionBaseNSigned {
  constructor(n1, n2, manBitNum) {
    if (manBitNum !== undefined) {
      this.manBitNum = manBitNum;
    } else {
      this.manBitNum = null;
    }

    if (n1.base !== n2.base) {
      console.log('DivisonBaseNComplement(Number, Number): Base of n1('
        .concat(n1.base, ') and base of n2(')
        .concat(n2.base, ') are not compatible.'));
    }

    if (n1.digitNum !== n2.digitNum) {
      console.log('DivisonBaseNComplement(Number, Number): DigitNum of n1('
        .concat(n1.digitNum, ') and digitNum of n2(')
        .concat(n2.digitNum, ') are not compatible.'));
    }

    this.watcher = null;
    this.producedOverflow = false;
    this.firstNegativeStep = false;
    this.result = this._divide(n1, n2);
  }

  _divide(n1, n2) {
    this.watcher = new Algorithm();
    const offset = Math.max(n1.offset, n2.offset);
    const digitsToTake = n1.arr.length + offset + 1;

    this.watcher.step('DivisionInput')
      .saveVariable('n1Arr', [...n1.arr])
      .saveVariable('n2Arr', [...n2.arr]);

    this.watcher.step('DetermineSize')
      .saveVariable('n1Offset', n1.offset)
      .saveVariable('n2Offset', n2.offset)
      .saveVariable('digitNum', n1.digitNum)
      .saveVariable('offset', offset)
      .saveVariable('digitsToTake', digitsToTake);

    const n1copy = [...n1.arr];
    let op2arr = [...n2.arr];
    // fill left op with 0 if smaller than right op
    for (let k = 0; k < n2.arr.length - n1.arr.length; k += 1) {
      n1copy.push(0);
    }
    // drop if both ops have 0 on the right
    while ((n1copy[n1copy.length - 1] === 0) && (op2arr[op2arr.length - 1] === 0)) {
      n1copy.splice(-1, 1);
      op2arr.splice(-1, 1);
    }

    let op1arr = [...n1copy];

    const arr = []; // unnormalised result
    let remain = true;
    let i = op2arr.length - 1; // iterator while loop, until mantice length
    let posOp1arr = op2arr.length; // position in left op
    let countSteps = 0;

    // binary division related to long division in binary
    while ((i <= this.manBitNum * 2) && remain) {
      if (op1arr.length > op2arr.length) {
        op2arr = op2arr.concat(Array(op1arr.length - op2arr.length)
          .fill(0, 0)); // Pad right
      }
      const op1 = new NumberBaseNComplement(n1.base, op1arr.length, op1arr, offset, false);
      const op2 = new NumberBaseNComplement(n2.base, op2arr.length, op2arr, offset, true);
      const operation = new AdditionBaseNComplement(op1, op2);
      const subtractionResult = operation.getResult();
      if (countSteps === 0 && operation.negativeResult) {
        this.firstNegativeStep = true;
      }
      this.watcher.step('DivisionSteps')
        .saveVariable(`Step${countSteps}_Sub1`, [...op1arr])
        .saveVariable(`Step${countSteps}_Sub2`, [...op2arr])
        .saveVariable(`Step${countSteps}_SubRes`, [...subtractionResult.arr])
        .saveVariable(`Step${countSteps}_SubRes_isNegative`, operation.negativeResult);
      const subarray = [...subtractionResult.arr];
      if (!(subarray.every((a) => a === 0))) { // subt. not zero
        if (operation.negativeResult === false) { // subt. positive result
          this.watcher.step('DivisionSteps')
            .saveVariable(`Step${countSteps}_SubRes_isZero`, false);
          arr.push(1);
          op1arr = [...subtractionResult.arr];
        } else {
          arr.push(0);
        }
        if (posOp1arr >= n1copy.length) { // add 0 to op1arr
          op1arr.push(0);
        } else { // add the value at the actual position of the dividend
          op1arr.push(n1copy[posOp1arr - 1]);
          posOp1arr += 1;
        }
        if (op1arr.length > op2arr.length) { // corrects array length
          op2arr.unshift(0);
        }
      } else {
        arr.push(1);
        this.watcher.step('DivisionSteps')
          .saveVariable(`Step${countSteps}_SubRes_isZero`, true);
        remain = false; // subt. result is zero => no remain
      }
      this.watcher.step('DivisionSteps')
        .saveVariable(`Step${countSteps}_ActRes`, [...arr]);
      i += 1;
      countSteps += 1;
    }

    this.watcher.step('DivisionSteps')
      .saveVariable('countSteps', countSteps);

    const finalResult = new NumberBaseNSigned(
      n1.base,
      [...arr],
      offset,
      n1.isNegative !== n2.isNegative,
    );
    this.watcher.step('Result')
      .saveVariable('digitsToTake', digitsToTake)
      .saveVariable('result', finalResult)
      .saveVariable('resultArr', [...arr]);
    return finalResult;
  }

  getResult() {
    return this.result;
  }
}
