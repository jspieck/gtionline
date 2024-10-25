// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from '@jest/globals';

/**
 * Checks a key/value-pair at a single step in an algorithm.
 * @param watcher: Algorithm()
 * @param step: name of the step as a string
 * @param key: name of the key as a string
 * @param value: expected value (single value or array like)
 */
export function checkStep(watcher, step, key, value) {
  const watcherStep = watcher.steps[step];
  if (!watcherStep) {
    throw new Error(`Calculation of Addition IEEE ended before step: ${step}`);
  }

  const keys = Object.keys(watcherStep.data);
  if (keys.indexOf(key) === -1) {
    throw new Error(`Calculation of Addition IEEE ended before step: ${step}, value: ${key}`);
  }

  const watcherValue = watcherStep.data[key];
  if (Array.isArray(watcherValue) && Array.isArray(value)) {
    expect(watcherValue.length).toBe(value.length);
    for (let i = 0; i < value.length; i += 1) {
      expect(watcherValue[i]).toBe(value[i]);
    }
  } else if (
    (Array.isArray(watcherValue) && !Array.isArray(value))
    || (!Array.isArray(watcherValue) && Array.isArray(value))
  ) {
    throw new Error(`Error Testing: Addition IEEE step: ${step}, value: ${key}: Array-like is not compatible to single value`);
  } else {
    expect(watcherValue).toBe(value);
  }
}

/**
 * Checks the IEEE array agains an expected array.
 * @param expected: expected array
 * @param object: IEEENumber to check
 */
export function checkArray(expected, object) {
  expect(object.arr.length).toBe(expected.length);

  for (let i = 0; i < expected.length; i += 1) {
    expect(object.arr[i]).toBe(expected[i]);
  }
}

/**
 * Checks a IEEE mantissa against an expected mantissa
 * @param expected: expected mantissa
 * @param object: IEEENumber to check
 */
export function checkMantissa(expected, object) {
  expect(object.mantissaBits.length).toBe(expected.length);

  console.log('object.mantissaBits', object.mantissaBits);
  console.log('expected', expected);
  for (let i = 0; i < expected.length; i += 1) {
    expect(object.mantissaBits[i]).toBe(
      expected[i],
      `Mantissa at position ${i}, [expected: ${expected[i]}] != [got: ${object.mantissaBits[i]}]`
    );
  }
}
