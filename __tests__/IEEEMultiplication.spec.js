// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, test } from '@jest/globals';
import {
  getIEEEFromString,
  MultiplicationIEEE,
} from '../src/scripts/gti-tools';
import {
  checkMantissa,
  checkArray,
  checkStep,
} from '../src/testHelper';

describe('Multiplication of two IEEE-Numbers', () => {
  test('MultiplicationIEEE: 5.0 * 2.0 == 10.0', () => {
    const y1 = getIEEEFromString(5, '0 10001 01000000000');
    const y2 = getIEEEFromString(5, '0 10000 00000000000');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: -5.0 * 2.0 == -10.0', () => {
    const y1 = getIEEEFromString(5, '1 10001 01000000000');
    const y2 = getIEEEFromString(5, '0 10000 00000000000');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: 5.0 * -2.0 == -10.0', () => {
    const y1 = getIEEEFromString(5, '0 10001 01000000000');
    const y2 = getIEEEFromString(5, '1 10000 00000000000');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: -5.0 * -2.0 == 10.0', () => {
    const y1 = getIEEEFromString(5, '1 10001 01000000000');
    const y2 = getIEEEFromString(5, '1 10000 00000000000');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: 5.0 * 1.0 == 5.0', () => {
    const y1 = getIEEEFromString(5, '0 10001 01000000000');
    const y2 = getIEEEFromString(5, '0 01111 00000000000');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: 5.5 * 0.5 == 2.25', () => {
    const y1 = getIEEEFromString(5, '0 10001 01100000000');
    const y2 = getIEEEFromString(5, '0 01110 00000000000');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: 2 * 65500 == Inf', () => {
    const y1 = getIEEEFromString(5, '0 10000 00000000000');
    const y2 = getIEEEFromString(5, '0 11110 11111111111');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(true);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: -2 * 65500 == -Inf', () => {
    const y1 = getIEEEFromString(5, '1 10000 00000000000');
    const y2 = getIEEEFromString(5, '0 11110 11111111111');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(true);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: 100 * 0 == Zero', () => {
    const y1 = getIEEEFromString(5, '0 10101 10010000000');
    const y2 = getIEEEFromString(5, '0 00000 00000000000');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(true);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: 100 * NaN == NaN', () => {
    const y1 = getIEEEFromString(5, '0 10101 10010000000');
    const y2 = getIEEEFromString(5, '1 11111 11111111111');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(true);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: NaN * 100 == NaN', () => {
    const y1 = getIEEEFromString(5, '1 11111 11111111111');
    const y2 = getIEEEFromString(5, '0 10101 10010000000');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(true);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: Inf * 100 == Inf', () => {
    const y1 = getIEEEFromString(5, '0 11111 00000000000');
    const y2 = getIEEEFromString(5, '0 10101 10010000000');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(true);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('MultiplicationIEEE: 100 * -Inf == -Inf', () => {
    const y1 = getIEEEFromString(5, '0 10101 10010000000');
    const y2 = getIEEEFromString(5, '1 11111 00000000000');
    const result = (new MultiplicationIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(true);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  // tests build from the tutorials
  // values from lecture GTI, tutorial 4
  test('MultiplicationIEEE: x * -y == z', () => {
    const y1 = getIEEEFromString(7, '0 1001000 10011011');
    const y2 = getIEEEFromString(7, '1 1001010 11101000');
    const multiplication = new MultiplicationIEEE(y1, y2);
    const result = multiplication.getResult();
    expect(result.manBitNum).toBe(8);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [
      1, // sign
      1, 0, 1, 0, // exp
      1, 0, 0,
      1, 0, 0, 0, // man
      1, 0, 0, 0,
    ];
    checkArray(expectedArray, result);
    const expectedMantissa = [
      1, // leading 1
      1, 0, 0, 0,
      1, 0, 0, 0,
    ];
    checkMantissa(expectedMantissa, result);
    // check intermediate steps
    const watcher = multiplication.watcher;
    checkStep(watcher, 'CalculateExp', 'notShifted', 83);
    checkStep(watcher, 'MulMantissa', 'shift', 1);
    checkStep(watcher, 'MulMantissa', 'sign', 1);
    checkStep(watcher, 'MulMantissa', 'unnormalizedMantissa', [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1]);
    checkStep(watcher, 'MulMantissa', 'normalizedMantissa', [1, 0, 0, 0, 1, 0, 0, 0]);
    checkStep(watcher, 'ResultEdgecase', 'edgecase', 'none');
  });
});
