// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, test } from '@jest/globals';
import {
  getIEEEFromString,
  DivisionIEEE,
} from '../src/scripts/gti-tools';
import {
  checkMantissa,
  checkArray,
} from '../src/testHelper';

describe('Division of two IEEE-Numbers', () => {
  test('DivisionIEEE: 5.0 / 2.0 == 2.5', () => {
    const y1 = getIEEEFromString(5, '0 10001 01000000000');
    const y2 = getIEEEFromString(5, '0 10000 00000000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('DivisionIEEE: -5.0 / 2.0 == -2.5', () => {
    const y1 = getIEEEFromString(5, '1 10001 01000000000');
    const y2 = getIEEEFromString(5, '0 10000 00000000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('DivisionIEEE: 5.5 / 0.5 == 11.0', () => {
    const y1 = getIEEEFromString(5, '0 10001 01100000000');
    const y2 = getIEEEFromString(5, '0 01110 00000000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('DivisionIEEE: 1.0 / 0.0 == Inf', () => {
    const y1 = getIEEEFromString(5, '0 01111 00000000000');
    const y2 = getIEEEFromString(5, '0 00000 00000000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
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

  test('DivisionIEEE: 0.0 / 0.0 == NaN', () => {
    const y1 = getIEEEFromString(5, '0 00000 00000000000');
    const y2 = getIEEEFromString(5, '0 00000 00000000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
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

  test('DivisionIEEE: 0.0 / 1.0 == 0.0', () => {
    const y1 = getIEEEFromString(5, '0 00000 00000000000');
    const y2 = getIEEEFromString(5, '0 01111 00000000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
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

  test('DivisionIEEE: 100 / NaN == NaN', () => {
    const y1 = getIEEEFromString(5, '0 10101 10010000000');
    const y2 = getIEEEFromString(5, '0 11111 11111111111');
    const result = (new DivisionIEEE(y1, y2)).getResult();
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

  test('DivisionIEEE: NaN / 100 == NaN', () => {
    const y1 = getIEEEFromString(5, '0 11111 11111111111');
    const y2 = getIEEEFromString(5, '0 10101 10010000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
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

  test('DivisionIEEE: 65500 / 0.5 == Inf', () => {
    const y1 = getIEEEFromString(5, '0 11110 11111111111');
    const y2 = getIEEEFromString(5, '0 01110 00000000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
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

  test('DivisionIEEE: -Inf / 0.5 == -Inf', () => {
    const y1 = getIEEEFromString(5, '1 11111 00000000000');
    const y2 = getIEEEFromString(5, '0 01110 00000000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
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

  test('DivisionIEEE: 0.5 / Inf == Zero', () => {
    const y1 = getIEEEFromString(5, '0 01110 00000000000');
    const y2 = getIEEEFromString(5, '0 11111 00000000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
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

  test('DivisionIEEE: Inf / Inf == NaN', () => {
    const y1 = getIEEEFromString(5, '0 11111 00000000000');
    const y2 = getIEEEFromString(5, '0 11111 00000000000');
    const result = (new DivisionIEEE(y1, y2)).getResult();
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

  test('DivisionIEEE: 12.0 / 3.4 == 3.53', () => {
    const y1 = getIEEEFromString(5, '0 10010 1000000000');
    const y2 = getIEEEFromString(5, '0 10000 1011001101');
    const result = (new DivisionIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(10);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1];
    checkMantissa(expectedMantissa, result);
  });

  test('2.DivisionIEEE: 12.0 / 3.4 == 3.53', () => {
    const value1 = [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0].join('');
    const y1 = getIEEEFromString(5, value1);
    const value2 = [0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0].join('');
    const y2 = getIEEEFromString(5, value2);
    const result = (new DivisionIEEE(y1, y2)).getResult();
    expect(result.manBitNum).toBe(10);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray2 = [0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0];
    checkArray(expectedArray2, result);
    const expectedMantissa = [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });
});
