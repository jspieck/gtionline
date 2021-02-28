// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, test } from '@jest/globals';
import {
  getIEEEFromString as getIEEE,
} from '../src/scripts/gti-tools';
import {
  checkMantissa,
  checkArray,
} from '../src/testHelper';

describe('Conversion to IEEE', () => {
  test('getIEEEFromString: Convert 0 0111 0000 0000 000 == 1.0', () => {
    const result = getIEEE(4, '0 0111 00000000000');
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('getIEEEFromString: Convert 1 1010 0111 0000 000 == -11.5', () => {
    const result = getIEEE(4, '1 1010 01110000000');
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('getIEEEFromString: Convert 0 0000 0000 0000 000 == 0.0', () => {
    const result = getIEEE(4, '0 0000 00000000000');
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(true);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('getIEEEFromString: Convert 1 0000 0000 0000 000 == -0.0', () => {
    const result = getIEEE(4, '1 0000 00000000000');
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(true);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('getIEEEFromString: Convert 0 1111 0000 0000 000 == inf', () => {
    const result = getIEEE(4, '0 1111 00000000000');
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(true);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('getIEEEFromString: Convert 1 1111 0000 0000 000 == -inf', () => {
    const result = getIEEE(4, '1 1111 00000000000');
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(true);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('getIEEEFromString: Convert 0 1111 0000 0000 001 == NaN', () => {
    const result = getIEEE(4, '0 1111 00000000001');
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(true);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    checkMantissa(expectedMantissa, result);
  });

  // tests build from the tutorials
  // values from lecture GTI, tutorial 4
  test('getIEEEFromString: Convert 0 1001 1001 0000 1001 1001 0000 0000 000 == 69.615.616', () => {
    const result = getIEEE(8, '0 10011001 00001001100100000000000');
    expect(result.manBitNum).toBe(23);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [
      0, // sign bit
      1, 0, 0, 1, // exp
      1, 0, 0, 1,
      0, 0, 0, 0, // man
      1, 0, 0, 1,
      1, 0, 0, 1,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0,
    ];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('getIEEEFromString: Convert 0 1001 1001 1111 1111 0000 0000 0000 000 == 1.33955584E8', () => {
    const result = getIEEE(8, '0 10011001 11111111000000000000000');
    expect(result.manBitNum).toBe(23);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [
      0, // sign bit
      1, 0, 0, 1, // exp
      1, 0, 0, 1,
      1, 1, 1, 1, // man
      1, 1, 1, 1,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0,
    ];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('getIEEEFromString: Convert 1 1001 0100 0011 0110 0000 0000 0000 000 == -2539520.0', () => {
    const result = getIEEE(8, '1 10010100 00110110000000000000000');
    expect(result.manBitNum).toBe(23);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [
      1, // sign bit
      1, 0, 0, 1, // exp
      0, 1, 0, 0,
      0, 0, 1, 1, // man
      0, 1, 1, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0,
    ];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });

  test('getIEEEFromString: Convert 0 1001 000 1001 1011', () => {
    const result = getIEEE(7, '0 1001000 10011011');
    expect(result.manBitNum).toBe(8);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [
      0, // sign bit
      1, 0, 0, 1, // exp
      0, 0, 0,
      1, 0, 0, 1, // man
      1, 0, 1, 1,
    ];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 1, 0, 0, 1, 1, 0, 1, 1];
    checkMantissa(expectedMantissa, result);
  });

  test('getIEEEFromString: Convert 1 1001 010 1110 1000', () => {
    const result = getIEEE(7, '1 1001010 11101000');
    expect(result.manBitNum).toBe(8);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(false);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [
      1, // sign bit
      1, 0, 0, 1, // exp
      0, 1, 0,
      1, 1, 1, 0, // man
      1, 0, 0, 0,
    ];
    checkArray(expectedArray, result);
    const expectedMantissa = [1, 1, 1, 1, 0, 1, 0, 0, 0];
    checkMantissa(expectedMantissa, result);
  });
});
