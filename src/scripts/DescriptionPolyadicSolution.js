/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import * as tool from './gti-tools';

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

export class DescriptionPolyadicSolution {
  constructor(imp, watcher) {
    classCallCheck(this, DescriptionPolyadicSolution);
    this.imp = imp;
    this.table = '';
    this.result = [];
    this.watcher = watcher;
  }

  // =========================================================================================
  // Addition
  getAdditionTable() {
    // set up tabular for visual the addition
    let bitString1 = this.watcher.steps.Input.data.bitString1;
    const beforeComma = this.watcher.steps.Input.data.beforeComma;
    let afterComma = this.watcher.steps.Input.data.afterComma;
    if (afterComma == null) {
      afterComma = [];
    }
    const resultString = this.watcher.steps.Result.data.bitString;

    const splittedResultString = resultString.split('.');
    const splittedBitString1 = bitString1.split('.');
    bitString1 = `${'0'.repeat(splittedResultString[0].length - splittedBitString1[0].length)}${bitString1}`;
    for (let i = beforeComma.length; i < splittedResultString[0].length; i += 1) {
      beforeComma.unshift('0');
    }
    if (Array.isArray(splittedResultString) && (splittedResultString[1] != null)) {
      if (Array.isArray(splittedBitString1) && (splittedBitString1[1] != null)) {
        bitString1 = `${bitString1}${'0'.repeat(splittedResultString[1].length - splittedBitString1[1].length)}`;
      }
      for (let i = afterComma.length; i < splittedResultString[1].length; i += 1) {
        afterComma.push('0');
      }
    }

    const row1 = ['&'];
    const row2 = ['+&'];
    const rowCarry = ['&'];
    const row3 = ['&'];
    const tabdef = `{${'c'.repeat(resultString.length)}}`;

    for (let i = 0; i < bitString1.length; i += 1) {
      row1.push(` ${bitString1[i]}`);
      row1.push('&');
    }
    console.log(this.watcher.steps);
    let carrySet = false;
    for (let i = 0; i < beforeComma.length; i += 1) {
      row2.push(` ${beforeComma[i]}`);
      if (i !== beforeComma.length - 1) {
        let carryBit = 0;
        if (this.watcher.steps.constructResult.data[`overflowBeforeComma${0}`] != null) {
          carryBit = this.watcher.steps.constructResult.data[`overflowBeforeComma${i}`];
        } else {
          carryBit = this.watcher.steps.constructResult.data[`overflowBeforeComma${i + 1}`];
        }
        if (carryBit == null) {
          carryBit = ' ';
        } else {
          carrySet = true;
        }
        rowCarry.push(`\\scriptsize{${carryBit}} &`);
      } else {
        /* eslint-disable */
        if (this.watcher.steps.constructResult.data[`overflowAfterComma${0}`] != null) {
          const carryBit = this.watcher.steps.constructResult.data[`overflowAfterComma${0}`];
          rowCarry.push(`\\scriptsize{${carryBit}} &`);
          carrySet = true;
        } else {
          rowCarry.push('&');
        }
        /* eslint-enable */
      }
      row2.push('&');
    }
    if (afterComma.length > 0) {
      row2.push(' .&');
      rowCarry.push(' &');
    }
    for (let i = 0; i < afterComma.length - 1; i += 1) {
      row2.push(` ${afterComma[i]}`);
      if (i !== beforeComma.length - 1) {
        let carryBit = this.watcher.steps.constructResult.data[`overflowAfterComma${i + 1}`];
        if (carryBit == null) {
          carryBit = ' ';
        } else {
          carrySet = true;
        }
        rowCarry.push(`\\scriptsize{${carryBit}} &`);
      } else {
        rowCarry.push('&');
      }
      row2.push('&');
    }
    row2.push(` ${afterComma[afterComma.length - 1]}`);
    rowCarry.push(' ');

    for (let i = 0; i < resultString.length; i += 1) {
      row3.push(` ${resultString[i]}`);
      row3.push('&');
    }
    row1.pop();
    row1.push(' \\\\ ');
    row2.pop();
    row2.push(' \\\\ ');
    rowCarry.pop();
    rowCarry.push(' \\\\ ');
    row3.pop();
    this.table = [
      `\\begin{array} ${tabdef}`,
      `${row1.join('')}`,
      `${row2.join('')}`,
    ];
    if (carrySet) {
      this.table.push(`${rowCarry.join('')}`);
    }
    this.table.push('\\hline');
    this.table.push(`${row3.join('')}`);
    this.table.push('\\end{array}');
    this.table = this.table.join('');
  }

  /* eslint-disable */
  additionDescription(y1, y2, format) {
    this.getAdditionTable();
    // console.log(this.table);
    // console.log(this.watcher);
    this.result.push({
      name: `${this.imp.$t('addition')}`,
      text: `\\(${this.table}\\)`,
    });
  }
  /* eslint-enable */

  // =========================================================================================
  // Multiplication
  /* eslint-disable */
  getMultiplicationTable() {
    // the calculation is set up in a table
    // information, steps
    const tabdef = [];
    const watcher = this.watcher;
    if (!watcher.steps.Result.data.result.isNaN) {
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

  /* eslint-disable */
  multiplicationDescription(solution, y1, y2) {
    
  }
  /* eslint-enable */

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
    } else if (addWatcher.steps.AddMantissa.data.sign1 === 1
      && addWatcher.steps.AddMantissa.data.sign2 === 0) {
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

  /* eslint-disable */
  subtractionDescription(y1, y2, format) {
    this.getSubtractionTable();
    this.result.push({
      name: `${this.imp.$t('subtraction')}`,
      text: `\\(${this.table}\\)`,
    });
    /* this.result.push({
      name: `${this.imp.$t('subtraction')}`,
      text: `${this.imp.$t('shortcutHexToBin')}`,
      subpanels: [
        {
          name: `${this.imp.$t('doConversion')}`,
          text: `\\(${this.table}\\)`,
        },
      ],
    }); */
  }
  /* eslint-enable */

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

  /* eslint-disable */
  divisionDescription(solution, y1, y2) {
  
  }
  /* eslint-enable */

  makeDescription(num1, num2, format, operator) {
    const y1 = new tool.NumberPolyadic(format, num1);
    const y2 = new tool.NumberPolyadic(format, num2);
    switch (operator) {
      case 'add':
        if (y1.sign === '+' && y2.sign === '+') {
          this.additionDescription(y1, y2, format);
        } else if (y2.sign === '-') {
          y2.sign = '+';
          y2.arr.shift();
          this.subtractionDescription(y1, y2, format);
        } else {
          this.subtractionDescription(y1, y2, format);
        }
        break;

      case 'mul':
        this.multiplicationDescription(y1, y2, format);
        break;

      case 'sub':
        if ((y1.sign === '-') && (y2.sign === '+')) {
          this.negativeMinuendSubtrahend = true;
          y1.sign = '+';
          y1.arr.shift();
          this.additionDescription(y1, y2, format);
        } else if (y1.sign === '+' && y2.sign === '+') {
          this.subtractionDescription(y1, y2, format);
        } else {
          y2.sign = '+';
          y2.arr.shift();
          this.additionDescription(y1, y2, format);
        }
        break;

      case 'div':
        this.divisionDescription(y1, y2, format);
        break;
      default:
    }
    // result
    const resultString = this.watcher.steps.Result.data.bitString;
    const resultValue = this.watcher.steps.Result.data.value;
    this.result.push({
      name: this.imp.$t('solution'),
      text: [
        `${this.imp.$t('solution')}: `,
        `\\(${resultString}\\) `,
        `\\(\\hspace{2cm} \\)${this.imp.$t('value')} (${this.imp.$t('decimal')}): \\(${resultValue}\\)`,
      ].join(''),
    });
  }
}
