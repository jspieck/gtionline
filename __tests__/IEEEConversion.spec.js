import {
  getIEEEFromString as getIEEE,
} from '../src/scripts/gti-tools';

describe("Conversion to IEEE", () => {
  test('getIEEEFromString: Convert 0 0111 0000 0000 000 == 1.0', () => {
    const result = getIEEE(4, '0 0111 00000000000');
    expect(result.manBitNum).toBe(11);
    expect(result.isZero).toBe(false);
  });
});
