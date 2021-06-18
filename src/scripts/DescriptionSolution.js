/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import * as tool from './gti-tools';
import * as convertFormat from './formatConversions';

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

export class DescriptionSolution {
  constructor(imp, exponentBits, numBits, watcher) {
    classCallCheck(this, DescriptionSolution);
    this.imp = imp;
    this.table = '';
    this.result = [];
    this.exponentBits = exponentBits;
    this.numBits = numBits;
    this.watcher = watcher;
  }

  // =========================================================================================
  // Addition
  getAdditionTable() {
    // set up tabular for visual the addition
    const mantissa1 = this.watcher.steps.AddMantissa.data.addition.steps.Addition.data.op1Arr;
    const mantissa2 = this.watcher.steps.AddMantissa.data.addition.steps.Addition.data.op2Arr;
    const carryBits = this.watcher.steps.AddMantissa.data.addition.steps.Addition.data.carryArr;
    const result = this.watcher.steps.AddMantissa.data.addition.steps.Addition.data.resultArr;
    const cols = this.watcher.steps.AddMantissa.data.binNum;
    const row1 = [];
    const row2 = [];
    const row3 = [];
    const tabdef = [];
    row1.push('&');
    row2.push('+&');
    row3.push('&');
    tabdef.push('{');
    for (let i = mantissa1.length; i <= cols; i += 1) {
      mantissa1.unshift(0);
    }
    for (let i = mantissa2.length; i <= cols; i += 1) {
      mantissa2.unshift(0);
    }
    for (let i = carryBits.length; i <= cols; i += 1) {
      carryBits.unshift(0);
    }
    for (let i = 0; i < cols; i += 1) {
      tabdef.push('c');
      row1.push(` ${mantissa1[i]}`);
      row1.push('&');
      row2.push(` ${mantissa2[i]}_{${carryBits[i]}}`);
      row2.push('&');
      row3.push(` ${result[i]}`);
      row3.push('&');
    }
    tabdef.push('}');
    row1.pop();
    row1.push('\\\\ ');
    row2.pop();
    row2.push('\\\\ ');
    row3.pop();
    this.table = [
      `\\begin{array} ${tabdef.join('')}`,
      `${row1.join('')}`,
      `${row2.join('')}`,
      '\\hline',
      `${row3.join('')}`,
      '\\end{array}',
    ].join('');
  }

  additionDescription(solution, _y1, _y2) {
    let y1;
    let y2;
    if (_y1.exponent >= _y2.exponent && _y1.sign === 0) {
      y1 = JSON.parse(JSON.stringify(_y1));
      y2 = JSON.parse(JSON.stringify(_y2));
    } else {
      y1 = JSON.parse(JSON.stringify(_y2));
      y2 = JSON.parse(JSON.stringify(_y1));
    }
    let mantissaString1 = y1.mantissaBits.join('');
    mantissaString1 = `1,${mantissaString1.substring(1)}`;
    let mantissaString2 = y2.mantissaBits.join('');
    mantissaString2 = `1,${mantissaString2.substring(1)}`;
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    const watcher = this.watcher;
    this.result.push({
      name: `${this.imp.$t('values')}`,
      text: `${this.imp.$t('givenValues')}`,
      subpanels: [
        {
          name: `${this.imp.$t('firstSummand')}: `,
          text: [
            `${this.imp.$t('value')}: `, y1.valueString,
            `, ${this.imp.$t('sign')}: `, (y1.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString1,
            `, ${this.imp.$t('exponent')}: `, expString1,
          ].join(''),
        },
        {
          name: `${this.imp.$t('secondSummand')}: `,
          text: [
            `${this.imp.$t('value')}: `, y2.valueString,
            `, ${this.imp.$t('sign')}: `, (y2.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString2,
            `, ${this.imp.$t('exponent')}: `, expString2,
          ].join(''),
        },
      ],
    });
    if (y1.isZero || y2.isZero) {
      this.result.push({
        name: `${this.imp.$t('step')} 1`,
        text: [
          `${this.imp.$t('addWithZero')}`,
        ].join(''),
      });
    } else {
      if (watcher.steps.CalculateDeltaE.data.deltaE === 0) {
        this.result.push({
          name: `${this.imp.$t('step')} 1`,
          text: `${this.imp.$t('adjustExponents')} \\( (${expString1} = ${expString2} \\Rightarrow i.O.) \\)`,
        });
      } else {
        const left = watcher.steps.CalculateDeltaE.data.switched ? '<' : '>';
        this.result.push({
          name: `${this.imp.$t('step')} 1`,
          text: `${this.imp.$t('adjustExponents')} \\( (${expString1} \\neq ${expString2}) \\)`,
          subpanels: [
            {
              name: `${this.imp.$t('diffExponent')}`,
              text: [
                `${this.imp.$t('smallerExponent')} `,
                `\\( ( [ ${watcher.steps.CalculateDeltaE.data.expN1Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN1} ${left}
                      [ ${watcher.steps.CalculateDeltaE.data.expN2Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN2}) \\) `,
                `${this.imp.$t('resDiffExponent')}: `,
                this.watcher.steps.CalculateDeltaE.data.deltaE,
              ].join(''),
              subsubpanels: [
                {
                  name: `${this.imp.$t('adjustSmallerMantissa')}`,
                  text: [
                    ` ${this.imp.$t('shiftMantissa')}: \\( `,
                    watcher.steps.CalculateDeltaE.data.preShift.join(''),
                    `\\overset{\\text{Shift: ${watcher.steps.CalculateDeltaE.data.deltaE} }}{\\rightarrow}`,
                    watcher.steps.AddMantissa.data.mantissa2.join(''),
                    '\\)',
                  ].join(''),
                },
              ],
            },
          ],
        });
      }
      if (!watcher.steps.AddMantissa.data.equalMantissa) {
        this.getAdditionTable();
        this.result.push({
          name: `${this.imp.$t('step')} 2`,
          text: [
            `${this.imp.$t('addMantissa')}`,
          ].join(''),
          subpanels: [
            {
              name: `${this.imp.$t('newMantissa')}`,
              text: [
                `${this.imp.$t('newMantissaIs')}`,
                ': \<br\> \<br\>',
                '\\(',
                this.table,
                '\\)',
              ].join(''),
            },
            {
              name: `${this.imp.$t('considerRepresentation')}`,
              text: `${this.imp.$t('consider1comma')}`,
              subsubpanels: [
                {
                  name: `${this.imp.$t('mantissaFloat')}`,
                  text: `${this.imp.$t('mantissa1float')}: ${this.watcher.steps.AddMantissa.data.normalizedMantissa.join('')}`,
                },
              ],
            },
          ],
        });
      } else {
        this.result.push({
          name: `${this.imp.$t('step')} 2`,
          text: `${this.imp.$t('addMantissa')}`,
          subpanels: [
            {
              name: `${this.imp.$t('newMantissa')}`,
              text: `${this.imp.$t('equalMantissa')}`,
            },
          ],
        });
      }
    }
    const converter = new convertFormat.FormatConversions(this.exponentBits, this.numBits);
    converter.ieeeToDec([
      this.watcher.steps.Result.data.result.sign, ' ',
      this.watcher.steps.Result.data.result.exponentBits.join(''),
      this.watcher.steps.Result.data.result.mantissaBits.join('').substring(1),
    ].join(''));
    const decSol = converter.result;
    this.result.push({
      name: this.imp.$t('solution'),
      text: [
        `${this.imp.$t('correctSolution')}: `,
        this.watcher.steps.Result.data.result.sign, ' ',
        this.watcher.steps.Result.data.result.exponentBits.join(''), ' ',
        this.watcher.steps.Result.data.result.mantissaBits.join('').substring(1), ' ',
        '\\( \\implies \\)',
        ` ${this.imp.$t('decimal')}: ${decSol}`,
      ].join(''),
      subpanels: [
        {
          name: `${this.imp.$t('sign')}: `,
          text: this.watcher.steps.Result.data.result.sign,
        },
        {
          name: `${this.imp.$t('exponent')}: `,
          text: this.watcher.steps.Result.data.result.exponentBits.join(''),
        },
        {
          name: `${this.imp.$t('mantissa')}: `,
          text: this.watcher.steps.Result.data.result.mantissaBits.join(''),
        },
      ],
    });
  }

  // =========================================================================================
  // Multiplication
  /* eslint-disable */
  getMultiplicationTable() {
    // the calculation is set up in a table
    // information, steps
    const tabdef = [];
    const watcher = this.watcher;
    if (!watcher.steps.Result.data.result.isNaN) {
      const mulWatcher = watcher.steps.Multiplication.data.multiplication;
      const mulSteps = mulWatcher.steps.MultiplicationSteps.data; // steps
      const n1Arr = mulWatcher.steps.MultiplicationInput.data.leftArr; // first factor
      const n2Arr = mulWatcher.steps.MultiplicationInput.data.rightArr; // second factor
      while (n1Arr[n1Arr.length - 1] === 0) {
        n1Arr.pop();
      }
      const n1len = n1Arr.length;
      while (n2Arr[n2Arr.length - 1] === 0) {
        n2Arr.pop();
      }
      const n2len = n2Arr.length;
      const countSteps = Math.min(mulSteps.countSteps, n2len); // count of steps until result
      const mulRes = mulWatcher.steps.Result.data.resultArr; // result of multiplication
      const stepLength = mulSteps.Step0_toAdd.arr.length;
      let arrLen = Math.max(n1len + countSteps, n1len + n2len, n2len + countSteps) + 3; // columns
      // table definition
      tabdef.push('{');
      tabdef.push('c|');
      for (let i = 0; i < arrLen; i += 1) {
        tabdef.push('c');
      }
      tabdef.push('c');
      tabdef.push('}');
      // build top row
      const rows = [ // rows of the result table
        `&&${n1Arr.join('&')}`,
      ];
      rows[0] += '&\\times&';
      rows[0] += n2Arr.join('&');
      for (let i = n1Arr.length + n2Arr.length + 1; i < arrLen; i += 1) {
        rows[0] += '&';
      }
      let converter = new convertFormat.FormatConversions(
        this.exponentBits,
        this.numBits,
      );
      converter.binToDec(n1Arr.join(''));
      const leftVal = converter.result;
      converter.binToDec(n2Arr.join(''));
      const rightVal = converter.result;
      rows[0] += `\\ (${leftVal}_\{10\} * ${rightVal}_\{10\})\\\\`;
      rows[0] += '\\hline';

      // inner rows
      for (let i = 0; i < countSteps; i += 1) {
        rows.push(`${i}&+`);
        let stepsToAdd = mulSteps[`Step${i}_toAdd`].arr;
        const isZero = stepsToAdd.every(a => a === 0);
        if (!isZero) {
          stepsToAdd = n1Arr;
        }
        if (stepLength - stepsToAdd.length > 0) {
          stepsToAdd = stepsToAdd.concat(Array(stepLength - stepsToAdd.length)
            .fill(0, 0)); // Pad right
        }
        for (let j = 0; j < i; j += 1) {
          rows[rows.length - 1] += '&';
        }
        rows[rows.length - 1] = rows[rows.length - 1];
        rows[rows.length - 1] += '&';

        rows[rows.length - 1] += stepsToAdd.join('&');
        for (let j = stepsToAdd.length + i; j < arrLen; j += 1) {
          rows[rows.length - 1] += '&';
        }

        const padding = mulRes.length - stepsToAdd.length - 1;
        if (padding > 0) {
          stepsToAdd = stepsToAdd.concat(Array(padding)
            .fill(0, 0)); // Pad right
        }
        converter = new convertFormat.FormatConversions(
          this.exponentBits,
          this.numBits,
        );
        converter.binToDec(stepsToAdd.join(''));
        const add = converter.result * 2 ** -i;
        rows[rows.length - 1] += `\\ (${add}_\{10\})`;

        rows[rows.length - 1] += '\\\\ ';
      } // end for

      // Last row
      rows.push('\\hline');
      rows.push('\\mathcal\{L\}&');
      let actCols = 1;
      for (let j = mulRes.length; j <= stepLength; j += 1) {
        rows.push('&');
        actCols += 1;
      }
      rows[rows.length - 1] += `${mulRes.join('&')}`;
      actCols += mulRes.length;
      for (let k = actCols; k <= arrLen; k += 1) {
        rows[rows.length - 1] += '&';
      }
      converter = new convertFormat.FormatConversions(
        this.exponentBits,
        this.numBits,
      );
      converter.binToDec(mulRes.join(''));
      const add = converter.result;
      rows[rows.length - 1] += `&\\ (${add}_\{10\})`;

      this.table = [
        `\\begin{array} ${tabdef.join('')}`,
        rows.join(''),
        '\\end{array}',
      ].join('');
    } else {
      this.table = `\\text{${this.imp.$t('solutionIsNan')}}`;
    }
  }
  /* eslint-enable */

  multiplicationDescription(solution, y1, y2) {
    let mantissaString1 = y1.mantissaBits.join('');
    mantissaString1 = `1,${mantissaString1.substring(1)}`;
    let mantissaString2 = y2.mantissaBits.join('');
    mantissaString2 = `1,${mantissaString2.substring(1)}`;
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    const watcher = this.watcher;
    this.result.push({
      name: `${this.imp.$t('values')}`,
      text: `${this.imp.$t('givenValues')}`,
      subpanels: [
        {
          name: `${this.imp.$t('firstFactor')}: `,
          text: [
            `${this.imp.$t('value')}: `, y1.valueString,
            `, ${this.imp.$t('sign')}: `, (y1.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString1,
            `, ${this.imp.$t('exponent')}: `, expString1,
          ].join(''),
        },
        {
          name: `${this.imp.$t('secondFactor')}: `,
          text: [
            `${this.imp.$t('value')}: `, y2.valueString,
            `, ${this.imp.$t('sign')}: `, (y2.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString2,
            `, ${this.imp.$t('exponent')}: `, expString2,
          ].join(''),
        },
      ],
    });
    if (y1.isZero || y2.isZero) {
      this.result.push({
        name: `${this.imp.$t('step')} 1`,
        text: [
          `${this.imp.$t('mulWithZero')}`,
        ].join(''),
      });
    } else {
      const converter = new convertFormat.FormatConversions(
        this.exponentBits,
        this.numBits,
      );
      converter.binToDec(expString1);
      const leftVal = converter.result;
      converter.binToDec(expString2);
      const rightVal = converter.result;
      this.result.push({
        name: `${this.imp.$t('step')} 1`,
        text: [
          `${this.imp.$t('addExponents')}. (${this.imp.$t('newExponent')}: `,
          leftVal + rightVal,
          ')',
        ].join(''),
      });
      this.getMultiplicationTable();
      this.result.push({
        name: `${this.imp.$t('step')} 2`,
        text: [
          `${this.imp.$t('mulMantissa')}`,
        ].join(''),
        subpanels: [
          {
            name: `${this.imp.$t('doMultiplication')}`,
            text: `\\(${this.table}\\)`,
          },
          {
            name: `${this.imp.$t('considerRepresentation')}`,
            text: `${this.imp.$t('consider1comma')}`,
          },
          {
            name: `${this.imp.$t('newMantissa')}`,
            text: `${this.imp.$t('newMantissaIs')}: ${solution.mantissaBits.join('')
              .substring(1)}`,
          },
        ],
      });
    }
    const converter = new convertFormat.FormatConversions(this.exponentBits, this.numBits);
    converter.ieeeToDec([
      watcher.steps.Result.data.result.sign, ' ',
      watcher.steps.Result.data.result.exponentBits.join(''),
      watcher.steps.Result.data.result.mantissaBits.join('').substring(1),
    ].join(''));
    const decSol = converter.result;
    this.result.push({
      name: this.imp.$t('solution'),
      text: [
        `${this.imp.$t('correctSolution')}: `,
        watcher.steps.Result.data.result.sign, ' ',
        watcher.steps.Result.data.result.exponentBits.join(''), ' ',
        watcher.steps.Result.data.result.mantissaBits.join('').substring(1), ' ',
        '\\( \\implies \\)',
        ` ${this.imp.$t('decimal')}: ${decSol}`,
      ].join(''),
      subpanels: [
        {
          name: `${this.imp.$t('sign')}: `,
          text: watcher.steps.Result.data.result.sign,
        },
        {
          name: `${this.imp.$t('exponent')}: `,
          text: watcher.steps.Result.data.result.exponentBits.join(''),
        },
        {
          name: `${this.imp.$t('mantissa')}: `,
          text: watcher.steps.Result.data.result.mantissaBits.join(''),
        },
      ],
    });
  }

  // =========================================================================================
  // Subtraction
  getSubtractionTable() {
    // set up tabular for visual the addition
    const addWatcher = this.watcher.steps.Addition.data.addition;
    const originalMantissa1 = addWatcher.steps.AddMantissa.data.mantissa1;
    const originalMantissa2 = addWatcher.steps.AddMantissa.data.mantissa2;
    const mantissa1 = addWatcher.steps.AddMantissa.data.addition.steps.Addition.data.op1Arr;
    const mantissa2 = addWatcher.steps.AddMantissa.data.addition.steps.Addition.data.op2Arr;
    const carryBits = addWatcher.steps.AddMantissa.data.addition.steps.Addition.data.carryArr;
    const result = addWatcher.steps.AddMantissa.data.addition.steps.Addition.data.resultArr;
    const cols = addWatcher.steps.AddMantissa.data.binNum;
    const row1 = [];
    const row2 = [];
    const row3 = [];
    const row4 = [];
    const row5 = [];
    const tabdef = [];
    if (addWatcher.steps.AddMantissa.data.sign1 === 0
      && addWatcher.steps.AddMantissa.data.sign2 === 1) {
      row1.push('&');
      row2.push('-&');
    } else if (addWatcher.steps.AddMantissa.data.sign1 === 0
      && addWatcher.steps.AddMantissa.data.sign2 === 1) {
      row1.push('-&');
      row2.push('+&');
    } else {
      row1.push('-&');
      row2.push('-&');
    }
    row3.push('&');
    row4.push('+&');
    row5.push('=&');
    tabdef.push('{');
    for (let i = originalMantissa1.length; i <= cols; i += 1) {
      originalMantissa1.unshift(0);
    }
    for (let i = originalMantissa2.length; i <= cols; i += 1) {
      originalMantissa2.unshift(0);
    }
    for (let i = mantissa1.length; i <= cols; i += 1) {
      mantissa1.unshift(0);
    }
    for (let i = mantissa2.length; i <= cols; i += 1) {
      mantissa2.unshift(0);
    }
    for (let i = carryBits.length; i <= cols; i += 1) {
      carryBits.unshift(0);
    }
    for (let i = 0; i < cols; i += 1) {
      tabdef.push('c');
      row1.push(` ${originalMantissa1[i]}`);
      row1.push('&');
      row2.push(` ${originalMantissa2[i]}`);
      row2.push('&');
      row3.push(` ${mantissa1[i]}`);
      row3.push('&');
      row4.push(` ${mantissa2[i]}_{${carryBits[i]}}`);
      row4.push('&');
      row5.push(` ${result[i]}`);
      row5.push('&');
    }
    tabdef.push('}');
    row1.pop();
    row1.push('\\\\ ');
    row2.pop();
    row2.push('\\\\ ');
    row3.pop();
    row3.push('\\\\ ');
    row4.pop();
    row4.push('\\\\ ');
    row5.pop();

    this.table = [
      `\\begin{array} ${tabdef.join('')}`,
      `${row1.join('')}`,
      `${row2.join('')}`,
      '\\hline_\{Complement\}',
      `${row3.join('')}`,
      `${row4.join('')}`,
      '\\hline',
      `${row5.join('')}`,
      '\\end{array}',
    ].join('');
  }

  subtractionDescription(solution, _y1, _y2) {
    let y1;
    let y2;
    if (_y1.exponent >= _y2.exponent) {
      y1 = JSON.parse(JSON.stringify(_y1));
      y2 = JSON.parse(JSON.stringify(_y2));
    } else {
      y1 = JSON.parse(JSON.stringify(_y2));
      y2 = JSON.parse(JSON.stringify(_y1));
    }
    let mantissaString1 = y1.mantissaBits.join('');
    mantissaString1 = `1,${mantissaString1.substring(1)}`;
    let mantissaString2 = y2.mantissaBits.join('');
    mantissaString2 = `1,${mantissaString2.substring(1)}`;
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    const watcher = this.watcher;
    let actStep = 1;
    this.result.push({
      name: `${this.imp.$t('values')}`,
      text: 'Werte der übertragenen Zahlen',
      subpanels: [
        {
          name: `${this.imp.$t('minuend')}: `,
          text: [
            `${this.imp.$t('value')}: `, y1.valueString,
            `, ${this.imp.$t('sign')}: `, (y1.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString1,
            `, ${this.imp.$t('exponent')}: `, expString1,
          ].join(''),
        },
        {
          name: `${this.imp.$t('subtrahend')}: `,
          text: [
            `${this.imp.$t('value')}: `, y2.valueString,
            `, ${this.imp.$t('sign')}: `, (y2.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString2,
            `, ${this.imp.$t('exponent')}: `, expString2,
          ].join(''),
        },
      ],
    });
    const addWatcher = watcher.steps.Addition.data.addition;
    if (y1.isZero || y2.isZero) {
      this.result.push({
        name: `${this.imp.$t('step')} ${actStep}`,
        text: [
          `${this.imp.$t('subWithZero')}`,
        ].join(''),
      });
      const converter = new convertFormat.FormatConversions(
        this.exponentBits,
        this.numBits,
      );
      converter.ieeeToDec([
        addWatcher.steps.Result.data.result.sign, ' ',
        addWatcher.steps.Result.data.result.exponentBits.join(''),
        addWatcher.steps.Result.data.result.mantissaBits.join('').substring(1),
      ].join(''));
      const decSol = converter.result;
      this.result.push({
        name: this.imp.$t('solution'),
        text: [
          `${this.imp.$t('correctSolution')}: `,
          addWatcher.steps.Result.data.result.sign, ' ',
          addWatcher.steps.Result.data.result.exponentBits.join(''), ' ',
          addWatcher.steps.Result.data.result.mantissaBits.join('').substring(1), ' ',
          '\\( \\implies \\)',
          ` ${this.imp.$t('decimal')}: ${decSol}`,
        ].join(''),
        subpanels: [
          {
            name: `${this.imp.$t('sign')}: `,
            text: addWatcher.steps.Result.data.result.sign,
          },
          {
            name: `${this.imp.$t('exponent')}: `,
            text: addWatcher.steps.Result.data.result.exponentBits.join(''),
          },
          {
            name: `${this.imp.$t('mantissa')}: `,
            text: addWatcher.steps.Result.data.result.mantissaBits.join(''),
          },
        ],
      });
    } else {
      if (addWatcher.steps.CalculateDeltaE.data.deltaE === 0) {
        this.result.push({
          name: `${this.imp.$t('step')} ${actStep}`,
          text: `${this.imp.$t('adjustExponents')} \\( (${expString1} = ${expString2} \\Rightarrow i.O.) \\)`,
        });
      } else {
        const left = addWatcher.steps.CalculateDeltaE.data.switched ? '<' : '>';
        this.result.push({
          name: `${this.imp.$t('step')} ${actStep}`,
          text: `${this.imp.$t('adjustExponents')} \\( (${expString1} \\neq ${expString2}) \\)`,
          subpanels: [
            {
              name: `${this.imp.$t('diffExponent')}`,
              text: [
                `${this.imp.$t('smallerExponent')} `,
                `\\( ( [ ${addWatcher.steps.CalculateDeltaE.data.expN1Bits.join('')} ] :=  ${addWatcher.steps.CalculateDeltaE.data.expN1} ${left}
                        [ ${addWatcher.steps.CalculateDeltaE.data.expN2Bits.join('')} ] :=  ${addWatcher.steps.CalculateDeltaE.data.expN2}) \\) `,
                `${this.imp.$t('resDiffExponent')}: `,
                addWatcher.steps.CalculateDeltaE.data.deltaE,
              ].join(''),
              subsubpanels: [
                {
                  name: `${this.imp.$t('adjustSmallerMantissa')}`,
                  text: [
                    ` ${this.imp.$t('shiftMantissa')}: \\( `,
                    addWatcher.steps.CalculateDeltaE.data.preShift.join(''),
                    `\\overset{\\text{Shift: ${addWatcher.steps.CalculateDeltaE.data.deltaE} }}{\\rightarrow}`,
                    addWatcher.steps.AddMantissa.data.mantissa2.join(''),
                    '\\)',
                  ].join(''),
                },
              ],
            },
          ],
        });
      }
      if (!addWatcher.steps.AddMantissa.data.equalMantissa) { // case: not equal mantissa
        if (addWatcher.steps.AddMantissa.data.complement1.steps.Complement.data.negate) {
          actStep += 1;
          this.result.push({
            name: `${this.imp.$t('step')} ${actStep}`,
            text: `${this.imp.$t('subtTwosComplement')}`,
            subpanels:
              [
                {
                  name: [
                    `${this.imp.$t('mantissaTwosComplement')}: \\(`,
                    addWatcher.steps.AddMantissa.data.mantissa1.join(''),
                    '\\)',
                  ].join(''),
                  text: `${this.imp.$t('steps')}`,
                  subsubpanels: [
                    {
                      name: `${this.imp.$t('switchBits')}`,
                      text: [
                        '\\(',
                        addWatcher.steps.AddMantissa.data.mantissa1.join(''),
                        '\\rightarrow',
                        addWatcher.steps.AddMantissa.data.complement1.steps.Complement.data
                          .flippedArray.join(''),
                        '\\)',
                      ].join(''),
                    },
                    {
                      name: `${this.imp.$t('add1')}`,
                      text: [
                        '\\(',
                        addWatcher.steps.AddMantissa.data.complement1.steps.Complement.data
                          .flippedArray.join(''),
                        '\\rightarrow',
                        addWatcher.steps.AddMantissa.data.complement1.steps.Complement.data
                          .oneAdded.join(''),
                        '\\)',
                      ].join(''),
                    },
                    {
                      name: `${this.imp.$t('normalize')}`,
                      text: [
                        '\\(',
                        addWatcher.steps.AddMantissa.data.complement1.steps.Complement.data
                          .oneAdded.join(''),
                        '\\rightarrow',
                        addWatcher.steps.AddMantissa.data.complement1.steps.Complement.data
                          .normalizedArray.join(''),
                        '\\)',
                      ].join(''),
                    },
                  ],
                },
              ],
          });
        }
        if (addWatcher.steps.AddMantissa.data.complement2.steps.Complement.data.negate) {
          actStep += 1;
          this.result.push({
            name: `${this.imp.$t('step')} ${actStep}`,
            text: `${this.imp.$t('subtTwosComplement')}`,
            subpanels:
              [
                {
                  name: [
                    `${this.imp.$t('mantissaTwosComplement')}: \\(`,
                    addWatcher.steps.AddMantissa.data.mantissa2.join(''),
                    '\\)',
                  ].join(''),
                  text: `${this.imp.$t('steps')}`,
                  subsubpanels: [
                    {
                      name: `${this.imp.$t('switchBits')}`,
                      text: [
                        '\\(',
                        addWatcher.steps.AddMantissa.data.mantissa2.join(''),
                        '\\rightarrow',
                        addWatcher.steps.AddMantissa.data.complement2.steps.Complement.data
                          .flippedArray.join(''),
                        '\\)',
                      ].join(''),
                    },
                    {
                      name: `${this.imp.$t('add1')}`,
                      text: [
                        '\\(',
                        addWatcher.steps.AddMantissa.data.complement2.steps.Complement.data
                          .flippedArray.join(''),
                        '\\rightarrow',
                        addWatcher.steps.AddMantissa.data.complement2.steps.Complement.data
                          .oneAdded.join(''),
                        '\\)',
                      ].join(''),
                    },
                    {
                      name: `${this.imp.$t('normalize')}`,
                      text: [
                        '\\(',
                        addWatcher.steps.AddMantissa.data.complement2.steps.Complement.data
                          .oneAdded.join(''),
                        '\\rightarrow',
                        addWatcher.steps.AddMantissa.data.complement2.steps.Complement.data
                          .normalizedArray.join(''),
                        '\\)',
                      ].join(''),
                    },
                  ],
                },
              ],
          });
        }
        this.getSubtractionTable();
        actStep += 1;
        this.result.push({
          name: `${this.imp.$t('step')} ${actStep}`,
          text: `${this.imp.$t('addMantissa')}`,
          subpanels: [
            {
              name: `${this.imp.$t('newMantissa')}`,
              text: [
                `${this.imp.$t('newMantissaIs')}`,
                ': \<br\> \<br\>',
                '\\(',
                this.table,
                '\\)',
              ].join(''),
            },
            {
              name: `${this.imp.$t('considerRepresentation')}`,
              text: `${this.imp.$t('consider1comma')}`,
              subsubpanels: [
                {
                  name: `${this.imp.$t('mantissaFloat')}`,
                  text: `${this.imp.$t('mantissa1float')}: ${addWatcher.steps.AddMantissa.data.normalizedMantissa.join('')}`,
                },
              ],
            },
          ],
        });
        const converter = new convertFormat.FormatConversions(
          this.exponentBits,
          this.numBits,
        );
        converter.ieeeToDec([
          addWatcher.steps.Result.data.result.sign, ' ',
          addWatcher.steps.Result.data.result.exponentBits.join(''),
          addWatcher.steps.Result.data.result.mantissaBits.join('')
            .substring(1),
        ].join(''));
        const decSol = converter.result;
        this.result.push({
          name: this.imp.$t('solution'),
          text: [
            `${this.imp.$t('correctSolution')}: `,
            addWatcher.steps.Result.data.result.sign, ' ',
            addWatcher.steps.Result.data.result.exponentBits.join(''), ' ',
            addWatcher.steps.Result.data.result.mantissaBits.join('')
              .substring(1), ' ',
            '\\( \\implies \\)',
            ` ${this.imp.$t('decimal')}: ${decSol}`,
          ].join(''),
          subpanels: [
            {
              name: `${this.imp.$t('sign')}: `,
              text: addWatcher.steps.Result.data.result.sign,
            },
            {
              name: `${this.imp.$t('exponent')}: `,
              text: addWatcher.steps.Result.data.result.exponentBits.join(''),
            },
            {
              name: `${this.imp.$t('mantissa')}: `,
              text: addWatcher.steps.Result.data.result.mantissaBits.join(''),
            },
          ],
        });
      } else { // case: equal mantissa
        this.result.push({
          name: `${this.imp.$t('step')} 2`,
          text: [
            'Die Mantissen beider Zahlen müssen addiert werden.',
          ].join(''),
          subpanels: [
            {
              name: `${this.imp.$t('newMantissa')}`,
              text: `${this.imp.$t('zeroMantissa')}`,
            },
            {
              name: `${this.imp.$t('considerRepresentation')}`,
              text: `${this.imp.$t('consider1comma')}`,
              subsubpanels: [
                {
                  name: `${this.imp.$t('mantissaFloat')}`,
                  text: `${this.imp.$t('mantissa1float')}: ${addWatcher.steps.AddMantissa.data.normalizedMantissa.join('')}`,
                },
              ],
            },
          ],
        });
      }
    }
  }

  // =========================================================================================
  // Division
  getDivisionTable() {
    // the calculation is set up in a table
    // information, steps
    const tabdef = [];
    if (!this.watcher.steps.Result.data.result.isNaN) {
      const divWatcher = this.watcher.steps.Division.data.division;
      const divSteps = divWatcher.steps.DivisionSteps.data; // steps
      const countSteps = divSteps.countSteps; // count of steps until result
      const n1Arr = divWatcher.steps.DivisionInput.data.n1Arr; // divisor
      const n2Arr = divSteps.Step0_Sub2; // dividend
      const n2len = n2Arr.length;
      const divRes = divWatcher.steps.Result.data.resultArr; // result of division
      let arrLen = Math.max(
        divSteps[`Step${countSteps - 1}_SubRes`].length - 2,
        divSteps.Step0_Sub1.length + divSteps.Step0_Sub2.length,
      ); // columns
      arrLen = arrLen + n2len + 2;
      // table definition
      tabdef.push('{');
      tabdef.push('c|');
      for (let i = 0; i < arrLen; i += 1) {
        tabdef.push('c');
      }
      tabdef.push('|c');
      tabdef.push('}');
      // build top row
      const rows = [ // rows of the result table
        `&&${divSteps.Step0_Sub1.join('&')}`,
      ];
      rows[0] += '&:&';
      rows[0] += n2Arr.join('&');
      for (let i = n1Arr.length + n2Arr.length + 1; i < arrLen; i += 1) {
        rows[0] += '&';
      }
      rows[0] += '\\\\';

      // inner rows
      let wasNeg = 0; // repeat last subtrahend
      for (let i = 0; i < countSteps; i += 1) {
        rows.push('&&');
        rows.push(`${i}&&`);

        if (wasNeg !== 0) {
          // first value, minuend
          const stepsToAdd = divSteps[`Step${i - 1}_Sub1`];
          for (let j = 0; j < i - 1; j += 1) {
            stepsToAdd[j] = ' ';
          }
          rows[rows.length - 2] += stepsToAdd.join('&');
          rows[rows.length - 2] += '& 0';
          for (let j = divSteps[`Step${i - 1}_Sub1`].length + 1; j < arrLen; j += 1) {
            rows[rows.length - 2] += '&';
          }
          if (i > 0) {
            rows[rows.length - 2] += '\\Sigma < 0 \\rightarrow 0';
          }
          rows[rows.length - 3] = rows[rows.length - 3].replace('-', '<');
        } else {
          const stepsToAdd = divSteps[`Step${i}_Sub1`];
          for (let j = 0; j < i - wasNeg; j += 1) { // remove leading 0
            stepsToAdd[j] = ' ';
          }
          rows[rows.length - 2] += stepsToAdd.join('&');
          for (let j = divSteps[`Step${i}_Sub1`].length; j < arrLen; j += 1) {
            rows[rows.length - 2] += '&';
          }
          if (i > 0) {
            rows[rows.length - 2] += '\\Sigma > 0 \\rightarrow 1';
          }
        }

        // second value, subtrahend
        for (let j = 0; j < i; j += 1) {
          rows[rows.length - 1] += '&';
        }
        rows[rows.length - 1] = rows[rows.length - 1].slice(0, -1);
        rows[rows.length - 1] += '-&';

        rows[rows.length - 1] += n2Arr.join('&');
        for (let j = n2len + i; j < arrLen; j += 1) {
          rows[rows.length - 1] += '&';
        }
        if (wasNeg !== 0) {
          rows[rows.length - 1] += `\\hookrightarrow \{\\scriptstyle ${this.imp.$t('repeatMinuend')}\}`;
        }

        rows[rows.length - 2] += '\\\\ ';
        rows[rows.length - 1] += '\\\\ ';
        rows[rows.length - 1] += '\\hline';

        if (divSteps[`Step${i}_SubRes_isNegative`]) {
          wasNeg += 1;
        } else {
          wasNeg = 0;
        }
      } // end for

      // Last row
      rows.push('\\mathcal\{L\}&&');
      rows[rows.length - 1] += `${divRes[0]},& ${divRes.slice(1, divRes.length)
        .join('&')}`;
      rows[rows.length - 1] += '&';
      for (let k = divRes.length; k < arrLen - 2; k += 1) {
        rows[rows.length - 1] += '&';
      }
      if (wasNeg !== 0) {
        rows[rows.length - 1] += '&\\Sigma < 0 \\rightarrow 0';
        rows[rows.length - 2] = rows[rows.length - 2].replace('-', '<');
      } else {
        rows[rows.length - 1] += '&\\Sigma > 0 \\rightarrow 1';
      }

      this.table = [
        `\\begin{array} ${tabdef.join('')}`,
        rows.join(''),
        '\\end{array}',
      ].join('');
    } else {
      this.table = `${this.imp.$t('solutionIsNan')}`;
    }
  }

  divisionDescription(solution, y1, y2) {
    let mantissaString1 = y1.mantissaBits.join('');
    mantissaString1 = `1,${mantissaString1.substring(1)}`;
    let mantissaString2 = y2.mantissaBits.join('');
    mantissaString2 = `1,${mantissaString2.substring(1)}`;
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    const watcher = this.watcher;
    this.result.push({
      name: `${this.imp.$t('values')}`,
      text: `${this.imp.$t('givenValues')}`,
      subpanels: [
        {
          name: `${this.imp.$t('numerator')}: `,
          text: [
            `${this.imp.$t('value')}: `, y1.valueString,
            `, ${this.imp.$t('sign')}: `, (y1.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString1,
            `, ${this.imp.$t('exponent')}: `, expString1,
          ].join(''),
        },
        {
          name: `${this.imp.$t('denominator')}: `,
          text: [
            `${this.imp.$t('value')}: `, y2.valueString,
            `, ${this.imp.$t('sign')}: `, (y2.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString2,
            `, ${this.imp.$t('exponent')}: `, expString2,
          ].join(''),
        },
      ],
    });
    if (y1.isZero) {
      this.result.push({
        name: `${this.imp.$t('step')} 1`,
        text: [
          `${this.imp.$t('divWithZero')}`,
        ].join(''),
      });
    } else {
      const converter = new convertFormat.FormatConversions(
        this.exponentBits,
        this.numBits,
      );
      converter.binToDec(expString1);
      const leftVal = converter.result;
      converter.binToDec(expString2);
      const rightVal = converter.result;
      this.result.push({
        name: `${this.imp.$t('step')} 1`,
        text: [
          `${this.imp.$t('subtExponents')} (${this.imp.$t('newExponent')}: \\(`,
          leftVal - rightVal,
          '\\) )',
        ].join(''),
      });
      if (!watcher.steps.Division.data.equalMantissa) { // case not equal mantissa
        this.getDivisionTable();
        this.result.push({
          name: `${this.imp.$t('step')} 2`,
          text: `${this.imp.$t('divMantissa')}`,
          subpanels: [
            {
              name: `${this.imp.$t('doDivision')}`,
              text: `\\(${this.table}\\)`,
            },
            {
              name: `${this.imp.$t('considerRepresentation')}`,
              text: `${this.imp.$t('consider1comma')}`,
            },
            {
              name: `${this.imp.$t('newMantissa')}`,
              text: `${this.imp.$t('newMantissaIs')}: ${solution.mantissaBits.join('')
                .substring(1)}`,
            },
          ],
        });
      } else { // case equal mantissa
        this.result.push({
          name: `${this.imp.$t('step')} 2`,
          text: `${this.imp.$t('divMantissa')}`,
          subpanels: [
            {
              name: `${this.imp.$t('doDivision')}`,
              text: `${this.imp.$t('equalMantissaDiv')}`,
            },
            {
              name: `${this.imp.$t('newMantissa')}`,
              text: `${this.imp.$t('newMantissaIs')}: ${solution.mantissaBits.join('')
                .substring(1)}`,
            },
          ],
        });
      }
    }
    const converter = new convertFormat.FormatConversions(this.exponentBits, this.numBits);
    converter.ieeeToDec([
      watcher.steps.Result.data.result.sign, ' ',
      watcher.steps.Result.data.result.exponentBits.join(''),
      watcher.steps.Result.data.result.mantissaBits.join('').substring(1),
    ].join(''));
    const decSol = converter.result;
    this.result.push({
      name: this.imp.$t('solution'),
      text: [
        `${this.imp.$t('correctSolution')}: `,
        watcher.steps.Result.data.result.sign, ' ',
        watcher.steps.Result.data.result.exponentBits.join(''), ' ',
        watcher.steps.Result.data.result.mantissaBits.join('').substring(1), ' ',
        '\\( \\implies \\)',
        ` ${this.imp.$t('decimal')}: ${decSol}`,
      ].join(''),
      subpanels: [
        {
          name: `${this.imp.$t('sign')}: `,
          text: watcher.steps.Result.data.result.sign,
        },
        {
          name: `${this.imp.$t('exponent')}: `,
          text: watcher.steps.Result.data.result.exponentBits.join(''),
        },
        {
          name: `${this.imp.$t('mantissa')}: `,
          text: watcher.steps.Result.data.result.mantissaBits.join(''),
        },
      ],
    });
  }

  makeDescription(num1, num2, solutionString, operator) {
    if (num1 !== '' && num2 !== '' && num1 !== 'Falsches Format' && num2 !== 'Falsches Format') {
      const solution = tool.getIEEEFromString(this.exponentBits, solutionString);
      const y1 = tool.getIEEEFromString(this.exponentBits, num1);
      const y2 = tool.getIEEEFromString(this.exponentBits, num2);
      switch (operator) {
        case 'add':
          if (y1.sign === 0 && y2.sign === 0) {
            this.additionDescription(solution, y1, y2);
          } else if (y2.sign === 1) {
            y2.sign = 0;
            y2.arr[0] = 0;
            this.subtractionDescription(solution, y1, y2);
          } else {
            this.subtractionDescription(solution, y1, y2);
          }
          break;

        case 'mul':
          this.multiplicationDescription(solution, y1, y2);
          break;

        case 'sub':
          if (y2.sign === 0) {
            this.subtractionDescription(solution, y1, y2);
          } else if (y1.sign === 1 && y2.sign === 1) {
            this.subtractionDescription(solution, y1, y2);
          } else {
            y2.sign = 0;
            y2.arr[0] = 0;
            this.additionDescription(solution, y1, y2);
          }
          break;

        case 'div':
          this.divisionDescription(solution, y1, y2);
          break;
        default:
      }
    } else {
      this.result = null;
    }
  }
}
