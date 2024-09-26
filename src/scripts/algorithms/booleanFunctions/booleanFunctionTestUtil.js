// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from '@jest/globals';
import { BooleanFunction } from './BooleanFunction';

/**
 * @param {[BooleanFunction]} functions0
 * @param {[BooleanFunction]} functions1
 */
export function checkFunctionsEqual(functions0, functions1, checkOrder = false) {
  if (!functions0 || !functions1 || functions0.length != functions1.length) {
    return false;
  }

  // loop through functions
  if (checkOrder) {
    for (let f = 0; f < functions0.length; f++) {
      if (!functions0[f].equals(functions1[f])) {
        return false;
      }
    }
  } else {
    for (let f = 0; f < functions0.length; f++) {
      const querry = functions0[f];
      // check if an equivalent term can be found in -other-
      if (functions1.filter((otherFunc) => otherFunc.equals(querry)).length == 0) {
        return false;
      }
    }
  }

  return true;
}
