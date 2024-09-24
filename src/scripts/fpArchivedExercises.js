// Example use case to load exercise with handle 'ex2': http://localhost:8080/#/cmos?load=ex2

// Note: The exercises are declared in a function,
// to allow for automatic retranslation thru vue upon
// switches display languages.
function fpArchivedExecises(i18n) {
  // const sheetStr = i18n.t('sheet');
  return [
    {
      title: `${i18n.t('complementExample')}`,
      handle: 'complementExample',
      data: {
        fp1: '0 01110 1100100000',
        fp2: '1 01001 1001010111',
        op: 'add',
      },
    },
    {
      title: `${i18n.t('shiftZero')}`,
      handle: 'shiftZero',
      data: {
        fp1: '0 10010 0101111100',
        fp2: '1 00010 0000100011',
        op: 'add',
      },
    },
    {
      title: `${i18n.t('doubleNegative')}`,
      handle: 'doubleNegative',
      data: {
        fp1: '1 01101 0111001010',
        fp2: '1 01100 0100000010',
        op: 'add',
      },
    },
    {
      title: `${i18n.t('denormalized')}`,
      handle: 'denormalized',
      data: {
        fp1: '1 00110 0010101010',
        fp2: '1 11011 0011111100',
        op: 'div',
      },
    },
  ];
}

/**
 * @param i18n $i18n-translation object
 * @returns {[string]}
 */
export function fpGetArchivedExerciseTitles(i18n) {
  return fpArchivedExecises(i18n).map((ae) => ae.title);
}

/**
 * @param i18n $i18n-translation object
 * @param {number} index
 * @returns {{title: string, handle: string, data: {}}}
 */
export function fpLoadArchivedExercise(i18n, index) {
  return fpArchivedExecises(i18n)[index];
}

/**
 * @param i18n $i18n-translation object
 * @param {string} handle String used to identify the exercise in the load=X query
 * @returns {number} Index in the exercise array. Can be used with xxLoadArchivedExercise to retrieve the exercise data
 */
export function fpGetExerciseIndexOfHandle(i18n, handle) {
  const exercises = fpArchivedExecises(i18n);
  for (let i = 0; i < exercises.length; i += 1) {
    if (exercises[i].handle === handle) {
      return i;
    }
  }
  return -1;
}
