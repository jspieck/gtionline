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
    this.firstPositiveStep = false;
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

    // Find first 1 in both numbers
    const firstOne1 = n1.arr.findIndex(bit => bit === 1);
    const firstOne2 = n2.arr.findIndex(bit => bit === 1);
    
    // Prepare arrays for division
    const n1copy = [...n1.arr];
    let op2arr = [...n2.arr];

    // Align divisor with dividend based on first 1s
    if (firstOne1 !== -1 && firstOne2 !== -1) {
        // TODO: what happens if firstOne1 is greater than firstOne2?
        const alignShift = firstOne2 - firstOne1;
        console.log('Debug: Align shift:', alignShift);
        if (alignShift > 0) {
            op2arr = [...op2arr, ...Array(alignShift).fill(0)];
            op2arr.splice(0, alignShift);
        }
    }

    let op1arr = [...n1copy];
    
    const arr = []; // unnormalised result
    let remain = true;
    let i = 0;
    let posOp1arr = op2arr.length;
    let countSteps = 0;
 
    // Changed loop condition to match required precision
    let maxIterations = this.manBitNum !== null ? this.manBitNum + 1 : Math.max(0, firstOne2 - firstOne1); // + 1 to get the overflow bit
    while (i < maxIterations && remain) {
      if (op1arr.length > op2arr.length) {
        op2arr = op2arr.concat(Array(op1arr.length - op2arr.length).fill(0));
      }
      const op1 = new NumberBaseNComplement(n1.base, op1arr.length, op1arr, offset, false);
      const op2 = new NumberBaseNComplement(n2.base, op2arr.length, op2arr, offset, true);
      const operation = new AdditionBaseNComplement(op1, op2);
      const subtractionResult = operation.getResult();
      console.log('Debug: Op1arr:', op1.arr, "/", op2.arr, "=", subtractionResult.arr);
      if (countSteps === 0 && !operation.negativeResult) {
        console.log('Debug: First step positive, do one more subtraction');
        // First negative step means, that the comma is one position further, do one more subtraction
        this.firstPositiveStep = true;
        if (this.manBitNum !== null) {
          maxIterations += 1;
        }
      }

      this.watcher.step('DivisionSteps')
        .saveVariable(`Step${countSteps}_Sub1`, [...op1arr])
        .saveVariable(`Step${countSteps}_Sub2`, [...op2arr])
        .saveVariable(`Step${countSteps}_SubRes`, [...subtractionResult.arr])
        .saveVariable(`Step${countSteps}_SubRes_isNegative`, operation.negativeResult);

      if (operation.negativeResult === false) {
        this.watcher.step('DivisionSteps')
          .saveVariable(`Step${countSteps}_SubRes_isZero`, false);
        arr.push(1);
        op1arr = [...subtractionResult.arr];
      } else {
        arr.push(0);
      }

      if (posOp1arr >= n1copy.length) {
        op1arr.push(0);
      } else {
        op1arr.push(n1copy[posOp1arr - 1]);
        posOp1arr += 1;
      }

      if (op1arr.length > op2arr.length) { // corrects array length
        op2arr.unshift(0);
      }

      this.watcher.step('DivisionSteps')
        .saveVariable(`Step${countSteps}_ActRes`, [...arr]);
      i += 1;
      countSteps += 1;
    }
    // expand to mantissa length
    // arr.unshift(...Array(this.manBitNum - arr.length).fill(0));

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
