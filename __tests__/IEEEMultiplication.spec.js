// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, test } from '@jest/globals';
import {
  getIEEEFromString,
  MultiplicationIEEE,
} from '../src/scripts/gti-tools';

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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
  });
});
