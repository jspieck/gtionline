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
  const wachterStep = watcher.steps[step];
  if (!wachterStep) {
    console.log(`Calculation of Addition IEEE ended before step: ${step}`);
    process.exit(1);
  }

  const keys = Object.keys(wachterStep.data);
  if (keys.indexOf(key) === -1) {
    console.log(`Calculation of Addition IEEE ended before step: ${step}, value: ${key}`);
    process.exit(1);
  }

  const watcherValue = wachterStep.data[key];
  if (Array.isArray(watcherValue) && Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      expect(
        watcherValue[i],
        `At step ${step}, with key: ${key}, at position ${i}: [expected: ${value[i]}] != [got: ${watcherValue[i]}]`,
      ).toBe(value[i]);
    }
  } else if (
    (Array.isArray(watcherValue) && !Array.isArray(value)) ||
    (!Array.isArray(watcherValue) && Array.isArray(value))
  ) {
    console.log(`Error Testing: Addition IEEE step: ${step}, value: ${key}:
    Array-like is not compatible to single value`);
    process.exit(1);
  } else {
    expect(
      watcherValue,
      `At step ${step}, with key: ${key}: [expected: ${value}] != [got: ${watcherValue}]`,
    )
      .toBe(value);
  }
}

/**
 * Checks the IEEE array agains an expected array.
 * @param expected: expected array
 * @param object: IEEENumber to check
 */
export function checkArray(expected, object) {
  expect(
    object.arr.length,
    `Array length: [expected: ${expected.length}] != [got: ${object.arr.length}]`,
  ).toBe(expected.length);
  for (let i = 0; i < expected.length; i += 1) {
    expect(
      object.arr[i],
      `Array at position ${i}, [expected: ${expected[i]}] != [got: ${object.arr[i]}]`,
    ).toBe(expected[i]);
  }
}

/**
 * Checks a IEEE mantissa agains an expected mantissa
 * @param expected: expected mantissa
 * @param object: IEEENumber to check
 */
export function checkMantissa(expected, object) {
  expect(
    object.mantissaBits.length,
    `Mantissa length: [expected: ${expected.length}] != [got: ${object.mantissaBits.length}]`,
  ).toBe(expected.length);
  for (let i = 0; i < expected.length; i += 1) {
    expect(
      object.mantissaBits[i],
      `Mantissa at position ${i}, [expected: ${expected[i]}] != [got: ${object.mantissaBits[i]}]`,
    ).toBe(expected[i]);
  }
}
