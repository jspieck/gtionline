/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import * as tool from '../scripts/gti-tools';

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

export class DescriptionSolution {
  constructor(imp) {
    classCallCheck(this, DescriptionSolution);
    this.imp = imp;
    this.description = this.makeDescription();
  }

  // =========================================================================================
  // Addition
  getAdditionTable() {
    // set up tabular for visual the addition
    const mantissa1 = this.imp.watcher.steps.AddMantissa.data.addition.steps.Addition.data.op1Arr;
    const mantissa2 = this.imp.watcher.steps.AddMantissa.data.addition.steps.Addition.data.op2Arr;
    const carryBits = this.imp.watcher.steps.AddMantissa.data.addition.steps.Addition.data.carryArr;
    const result = this.imp.watcher.steps.AddMantissa.data.addition.steps.Addition.data.resultArr;
    const cols = this.imp.watcher.steps.AddMantissa.data.binNum;
    const row1 = [];
    const row2 = [];
    const row3 = [];
    const tabdef = [];
    row1.push('&');
    row2.push('&');
    row3.push('+&');
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
    return [
      `\\( \\begin{array} ${tabdef.join('')}`,
      `${row1.join('')}`,
      `${row2.join('')}`,
      '\\hline',
      `${row3.join('')}`,
      '\\end{array} \\) ',
    ].join('');
  }

  additionDescription(steps, solution, y1, y2) {
    let mantissaString1 = y1.mantissaBits.join('');
    mantissaString1 = `1,${mantissaString1.substring(1)}`;
    let mantissaString2 = y2.mantissaBits.join('');
    mantissaString2 = `1,${mantissaString2.substring(1)}`;
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    const watcher = this.imp.watcher;
    steps.push({
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
    if (watcher.steps.CalculateDeltaE.data.deltaE === 0) {
      steps.push({
        name: `${this.imp.$t('step')} 1`,
        text: `${this.imp.$t('adjunstExponents')} \\( (${expString1} = ${expString2} \\Rightarrow i.O.) \\)`,
      });
    } else {
      const left = watcher.steps.CalculateDeltaE.data.switched ? '<' : '>';
      steps.push({
        name: `${this.imp.$t('step')} 1`,
        text: `${this.imp.$t('adjunstExponents')} \\( (${expString1} \\neq ${expString2}) \\)`,
        subpanels: [
          {
            name: `${this.imp.$t('diffExponent')}`,
            text: [
              `${this.imp.$t('smallerExponent')} `,
              `\\( ( [ ${watcher.steps.CalculateDeltaE.data.expN1Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN1} ${left}
                      [ ${watcher.steps.CalculateDeltaE.data.expN2Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN2}) \\) `,
              `${this.imp.$t('resDiffExponent')}: `,
              this.imp.watcher.steps.CalculateDeltaE.data.deltaE,
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
      steps.push({
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
              this.getAdditionTable(),
            ].join(''),
          },
          {
            name: `${this.imp.$t('considerRepresentation')}`,
            text: `${this.imp.$t('consider1comma')}`,
            subsubpanels: [
              {
                name: `${this.imp.$t('mantissaFloat')}`,
                text: `${this.imp.$t('mantissa1float')}: ${this.imp.watcher.steps.AddMantissa.data.normalizedMantissa.join('')}`,
              },
            ],
          },
        ],
      });
    } else {
      steps.push({
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
    steps.push({
      name: this.imp.$t('solution'),
      text: [
        `${this.imp.$t('correctSolution')}: `,
        this.imp.watcher.steps.Result.data.result.sign, ' ',
        this.imp.watcher.steps.Result.data.result.exponentBits.join(''), ' ',
        this.imp.watcher.steps.Result.data.result.mantissaBits.join('').substring(1),
      ].join(''),
      subpanels: [
        {
          name: `${this.imp.$t('sign')}: `,
          text: this.imp.watcher.steps.Result.data.result.sign,
        },
        {
          name: `${this.imp.$t('exponent')}: `,
          text: this.imp.watcher.steps.Result.data.result.exponentBits.join(''),
        },
        {
          name: `${this.imp.$t('mantissa')}: `,
          text: this.imp.watcher.steps.Result.data.result.mantissaBits.join(''),
        },
      ],
    });
  }

  // =========================================================================================
  // Multiplication
  multiplicationDescription(steps, solution, y1, y2) {
    let mantissaString1 = y1.mantissaBits.join('');
    mantissaString1 = `1,${mantissaString1.substring(1)}`;
    let mantissaString2 = y2.mantissaBits.join('');
    mantissaString2 = `1,${mantissaString2.substring(1)}`;
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    // const watcher = this.imp.watcher;
    steps.push({
      name: `${this.imp.$t('values')}`,
      text: `${this.imp.$t('givenValues')}`,
      subpanels: [
        {
          name: `${this.imp.$t('leftValue')}: `,
          text: [
            `${this.imp.$t('value')}: `, y1.valueString,
            `, ${this.imp.$t('sign')}: `, (y1.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString1,
            `, ${this.imp.$t('exponent')}: `, expString1,
          ].join(''),
        },
        {
          name: `${this.imp.$t('rightValue')}: `,
          text: [
            `${this.imp.$t('value')}: `, y2.valueString,
            `, ${this.imp.$t('sign')}: `, (y2.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString2,
            `, ${this.imp.$t('exponent')}: `, expString2,
          ].join(''),
        },
      ],
    });
    steps.push({
      name: `${this.imp.$t('step')} 1`,
      text: [
        `${this.imp.$t('addExponents')}. (${this.imp.$t('newExponent')}: `,
        this.imp.binToDec(expString1) + this.imp.binToDec(expString2),
        ')',
      ].join(''),
    });
    steps.push({
      name: `${this.imp.$t('step')} 2`,
      text: [
        `${this.imp.$t('mulMantissa')}`,
      ].join(''),
      subpanels: [
        {
          name: `${this.imp.$t('considerExponent')}`,
          text: `${this.imp.$t('shiftExpMant')} (${this.imp.$t('shift')}: ${this.imp.binToDec(expString1) - this.imp.binToDec(expString2)} )`,
        },
        {
          name: `${this.imp.$t('considerRepresentation')}`,
          text: `${this.imp.$t('consider1comma')}`,
        },
        {
          name: `${this.imp.$t('newMantissa')}`,
          text: `${this.imp.$t('newMantissaIs')}: ${solution.mantissaBits.join('')}`,
        },
      ],
    });
    steps.push({
      name: this.imp.$t('solution'),
      text: [
        `${this.imp.$t('correctSolution')}: `,
        this.imp.watcher.steps.Result.data.result.sign, ' ',
        this.imp.watcher.steps.Result.data.result.exponentBits.join(''), ' ',
        this.imp.watcher.steps.Result.data.result.mantissaBits.join('').substring(1),
      ].join(''),
      subpanels: [
        {
          name: `${this.imp.$t('sign')}: `,
          text: this.imp.watcher.steps.Result.data.result.sign,
        },
        {
          name: `${this.imp.$t('exponent')}: `,
          text: this.imp.watcher.steps.Result.data.result.exponentBits.join(''),
        },
        {
          name: `${this.imp.$t('mantissa')}: `,
          text: this.imp.watcher.steps.Result.data.result.mantissaBits.join(''),
        },
      ],
    });
  }

  // =========================================================================================
  // Subtraction
  getSubtractionTable() {
    // set up tabular for visual the addition
    const addWatcher = this.imp.watcher.steps.Addition.data.addition;
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

    return [
      `\\( \\begin{array} ${tabdef.join('')}`,
      `${row1.join('')}`,
      `${row2.join('')}`,
      '\\hline_\{Complement\}',
      `${row3.join('')}`,
      `${row4.join('')}`,
      '\\hline',
      `${row5.join('')}`,
      '\\end{array} \\) ',
    ].join('');
  }

  subtractionDescription(steps, solution, y1, y2) {
    let mantissaString1 = y1.mantissaBits.join('');
    mantissaString1 = `1,${mantissaString1.substring(1)}`;
    let mantissaString2 = y2.mantissaBits.join('');
    mantissaString2 = `1,${mantissaString2.substring(1)}`;
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    const watcher = this.imp.watcher;
    steps.push({
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
          name: `${this.imp.$t('subrahend')}: `,
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
    console.log(addWatcher.steps.AddMantissa.data);
    if (addWatcher.steps.CalculateDeltaE.data.deltaE === 0) {
      steps.push({
        name: `${this.imp.$t('step')} 1`,
        text: `${this.imp.$t('adjunstExponents')} \\( (${expString1} = ${expString2} \\Rightarrow i.O.) \\)`,
      });
    } else {
      const left = addWatcher.steps.CalculateDeltaE.data.switched ? '<' : '>';
      steps.push({
        name: `${this.imp.$t('step')} 1`,
        text: `${this.imp.$t('adjunstExponents')} \\( (${expString1} \\neq ${expString2}) \\)`,
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
      if (addWatcher.steps.AddMantissa.data.sign1 === 0
        && addWatcher.steps.AddMantissa.data.sign2 === 1) {
        steps.push({
          name: `${this.imp.$t('step')} 2`,
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
      } else if (addWatcher.steps.AddMantissa.data.sign1 === 1
        && addWatcher.steps.AddMantissa.data.sign2 === 0) {
        steps.push({
          name: `${this.imp.$t('step')} 2`,
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
      } else {
        steps.push({
          name: `${this.imp.$t('step')} 2`,
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
      steps.push({
        name: `${this.imp.$t('step')} 3`,
        text: `${this.imp.$t('addMantissa')}`,
        subpanels: [
          {
            name: `${this.imp.$t('newMantissa')}`,
            text: [
              `${this.imp.$t('newMantissaIs')}`,
              ': \<br\> \<br\>',
              this.getSubtractionTable(),
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
      steps.push({
        name: this.imp.$t('solution'),
        text: [
          `${this.imp.$t('correctSolution')}: `,
          addWatcher.steps.Result.data.result.sign, ' ',
          addWatcher.steps.Result.data.result.exponentBits.join(''), ' ',
          addWatcher.steps.Result.data.result.mantissaBits.join('').substring(1),
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
      console.log(addWatcher.steps.AddMantissa.data);
      steps.push({
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
      steps.push({
        name: this.imp.$t('solution'),
        text: [
          `${this.imp.$t('correctSolution')}: `,
          addWatcher.steps.Result.data.result.sign, ' ',
          addWatcher.steps.Result.data.result.exponentBits.join(''), ' ',
          addWatcher.steps.Result.data.result.mantissaBits.join('').substring(1),
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
    }
  }

  // =========================================================================================
  // Division
  getDivisionTable() {
    // the calculation is set up in a table
    // information, steps
    const tabdef = [];
    const divWatcher = this.imp.watcher.steps.Division.data.division;
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

    return [
      `\\( \\begin{array} ${tabdef.join('')}`,
      rows.join(''),
      '\\end{array} \\) ',
    ].join('');
  }

  divisionDescription(steps, solution, y1, y2) {
    let mantissaString1 = y1.mantissaBits.join('');
    mantissaString1 = `1,${mantissaString1.substring(1)}`;
    let mantissaString2 = y2.mantissaBits.join('');
    mantissaString2 = `1,${mantissaString2.substring(1)}`;
    const expString1 = y1.exponentBits.join('');
    const expString2 = y2.exponentBits.join('');
    const watcher = this.imp.watcher;
    steps.push({
      name: `${this.imp.$t('values')}`,
      text: `${this.imp.$t('givenValues')}`,
      subpanels: [
        {
          name: `${this.imp.$t('leftValue')}: `,
          text: [
            `${this.imp.$t('value')}: `, y1.valueString,
            `, ${this.imp.$t('sign')}: `, (y1.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString1,
            `, ${this.imp.$t('exponent')}: `, expString1,
          ].join(''),
        },
        {
          name: `${this.imp.$t('rightValue')}: `,
          text: [
            `${this.imp.$t('value')}: `, y2.valueString,
            `, ${this.imp.$t('sign')}: `, (y2.sign === 0 ? '+' : '-'),
            `, ${this.imp.$t('mantissa')}: `, mantissaString2,
            `, ${this.imp.$t('exponent')}: `, expString2,
          ].join(''),
        },
      ],
    });
    steps.push({
      name: `${this.imp.$t('step')} 1`,
      text: [
        `${this.imp.$t('subtExponents')} (${this.imp.$t('newExponent')}: \\(`,
        this.imp.binToDec(expString1) - this.imp.binToDec(expString2),
        '\\) )',
      ].join(''),
    });
    if (!watcher.steps.Division.data.equalMantissa) { // case not equal mantissa
      steps.push({
        name: `${this.imp.$t('step')} 2`,
        text: `${this.imp.$t('divMantissa')}`,
        subpanels: [
          {
            name: `${this.imp.$t('doDivision')}`,
            text: this.getDivisionTable(),
          },
          {
            name: `${this.imp.$t('considerRepresentation')}`,
            text: `${this.imp.$t('consider1comma')}`,
          },
          {
            name: `${this.imp.$t('newMantissa')}`,
            text: `${this.imp.$t('newMantissaIs')}: ${solution.mantissaBits.join('')}`,
          },
        ],
      });
    } else { // case equal mantissa
      steps.push({
        name: `${this.imp.$t('step')} 2`,
        text: `${this.imp.$t('divMantissa')}`,
        subpanels: [
          {
            name: `${this.imp.$t('doDivision')}`,
            text: `${this.imp.$t('equalMantissaDiv')}`,
          },
          {
            name: `${this.imp.$t('newMantissa')}`,
            text: `${this.imp.$t('newMantissaIs')}: ${solution.mantissaBits.join('')}`,
          },
        ],
      });
    }
    steps.push({
      name: this.imp.$t('solution'),
      text: [
        `${this.imp.$t('correctSolution')}: `,
        this.imp.watcher.steps.Result.data.result.sign, ' ',
        this.imp.watcher.steps.Result.data.result.exponentBits.join(''), ' ',
        this.imp.watcher.steps.Result.data.result.mantissaBits.join('').substring(1),
      ].join(''),
      subpanels: [
        {
          name: `${this.imp.$t('sign')}: `,
          text: this.imp.watcher.steps.Result.data.result.sign,
        },
        {
          name: `${this.imp.$t('exponent')}: `,
          text: this.imp.watcher.steps.Result.data.result.exponentBits.join(''),
        },
        {
          name: `${this.imp.$t('mantissa')}: `,
          text: this.imp.watcher.steps.Result.data.result.mantissaBits.join(''),
        },
      ],
    });
  }

  makeDescription() {
    const num1 = this.imp.nums[0];
    const num2 = this.imp.nums[1];
    if (num1 !== '' && num2 !== '' && num1 !== 'Falsches Format' && num2 !== 'Falsches Format') {
      const solution = tool.getIEEEFromString(this.imp.exponentBits, this.imp.solution);
      const y1 = tool.getIEEEFromString(this.imp.exponentBits, num1);
      const y2 = tool.getIEEEFromString(this.imp.exponentBits, num2);
      const steps = [];
      switch (this.imp.selectedFormat[2]) {
        case 'add':
          this.additionDescription(steps, solution, y1, y2);
          break;

        case 'mul':
          this.multiplicationDescription(steps, solution, y1, y2);
          break;

        case 'sub':
          this.subtractionDescription(steps, solution, y1, y2);
          break;

        case 'div':
          this.divisionDescription(steps, solution, y1, y2);
          break;
        default:
      }
      return steps;
    }
    return null;
  }
}
