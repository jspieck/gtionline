import {
  getIEEEFromString as getIEEE,
} from '../src/scripts/gti-tools';

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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
  });

  test('getIEEEFromString: Convert 0 1111 0000 0000 000 == infinity', () => {
    const result = getIEEE(4, '0 1111 00000000000');
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(true);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(0);
    expect(result.sign).toBe(0);
    const expectedArray = [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
  });

  test('getIEEEFromString: Convert 1 1111 0000 0000 000 == -infinity', () => {
    const result = getIEEE(4, '1 1111 00000000000');
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
    expect(result.isInfinity).toBe(true);
    expect(result.isNaN).toBe(false);
    expect(result.arr[0]).toBe(1);
    expect(result.sign).toBe(1);
    const expectedArray = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
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
    for (let i = 0; i < expectedArray.length; i += 1) {
      expect(result.arr[i]).toBe(expectedArray[i]);
    }
    const expectedMantissa = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    for (let i = 0; i < expectedMantissa.length; i += 1) {
      expect(result.mantissaBits[i]).toBe(expectedMantissa[i]);
    }
  });
});
