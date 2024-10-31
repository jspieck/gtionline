// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, test } from '@jest/globals';
import { DivisionIEEE } from '../src/scripts/algorithms/arithmetic/IEEE/division';
import { getIEEEFromString, NumberIEEE } from '../src/scripts/algorithms/arithmetic/IEEE/numberIEEE';
import { checkMantissa, checkArray } from '../src/testHelper';

function createIEEE(precision: number, bits: string): NumberIEEE {
  const number = getIEEEFromString(precision, bits);
  if (!number) {
      throw new Error(`Failed to create IEEE number from: ${bits}`);
  }
  return number;
}

describe('Division of two IEEE-Numbers', () => {
  test('DivisionIEEE: 5.0 / 2.0 == 2.5', () => {
    const y1 = createIEEE(5, '0 10001 0100000000');
    const y2 = createIEEE(5, '0 10000 0000000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(10);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    console.log('Expected', expectedArray, result.arr);
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });
});
