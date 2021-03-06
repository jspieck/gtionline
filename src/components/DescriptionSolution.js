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

  makeDescription() {
    const num1 = this.imp.nums[0];
    const num2 = this.imp.nums[1];
    if (num1 !== '' && num2 !== '' && num1 !== 'Falsches Format' && num2 !== 'Falsches Format') {
      const solution = tool.getIEEEFromString(this.imp.exponentBits, this.imp.solution);
      const y1 = tool.getIEEEFromString(this.imp.exponentBits, num1);
      const y2 = tool.getIEEEFromString(this.imp.exponentBits, num2);
      let mantissaString1 = y1.mantissaBits.join('');
      mantissaString1 = `1,${mantissaString1.substring(1)}`;
      let mantissaString2 = y2.mantissaBits.join('');
      mantissaString2 = `1,${mantissaString2.substring(1)}`;
      const expString1 = y1.exponentBits.join('');
      const expString2 = y2.exponentBits.join('');
      const watcher = this.imp.watcher;
      const steps = [];
      let originalMantissa1;
      let originalMantissa2;
      let mantissa1;
      let mantissa2;
      let carryBits;
      let result;
      let cols;
      const row1 = [];
      const row2 = [];
      const row3 = [];
      const row4 = [];
      const row5 = [];
      const tabdef = [];
      switch (this.imp.selectedFormat[2]) {
        // =========================================================================================
        // Addition
        case 'add':
          steps.push({
            name: `${this.imp.$t('values')}`,
            text: 'Werte der übertragenen Zahlen',
            subpanels: [
              {
                name: '1. Summand: ',
                text: [
                  'Wert: ', y1.valueString,
                  ', Vorzeichen: ', (y1.sign === 0 ? '+' : '-'),
                  ', Mantisse: ', mantissaString1,
                  ', Exponent: ', expString1,
                ].join(''),
              },
              {
                name: '2. Summand: ',
                text: [
                  'Wert: ', y2.valueString,
                  ', Vorzeichen: ', (y2.sign === 0 ? '+' : '-'),
                  ', Mantisse: ', mantissaString2,
                  ', Exponent: ', expString2,
                ].join(''),
              },
            ],
          });
          if (watcher.steps.CalculateDeltaE.data.deltaE === 0) {
            steps.push({
              name: `${this.imp.$t('step')} 1`,
              text: ['Die Exponenten beider Zahlen müssen angeglichen werden. \\( (', expString1, ' = ', expString2, ' \\Rightarrow i.O.) \\)'].join(''),
            });
          } else {
            const left = watcher.steps.CalculateDeltaE.data.switched ? '<' : '>';
            steps.push({
              name: `${this.imp.$t('step')} 1`,
              text: ['Die Exponenten beider Zahlen müssen angeglichen werden. \\( (', expString1, ' \\neq ', expString2, ') \\)'].join(''),
              subpanels: [
                {
                  name: 'Differenz Exponent',
                  text: [
                    'Es wird immer der kleinere vom größeren Exponenten subtrahiert ',
                    `\\( ( [ ${watcher.steps.CalculateDeltaE.data.expN1Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN1} ${left}
                      [ ${watcher.steps.CalculateDeltaE.data.expN2Bits.join('')} ] :=  ${watcher.steps.CalculateDeltaE.data.expN2}) \\) `,
                    'daher ergibt sich eine Differenz von: ',
                    this.imp.watcher.steps.CalculateDeltaE.data.deltaE,
                  ].join(''),
                  subsubpanels: [
                    {
                      name: 'Anpassen der kleineren Mantisse',
                      text: [
                        ' Shiften der kleineren Mantisse: \\( ',
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
          // TODO: Version if the mantissas are equal
          // set up tabular for visual the addition
          mantissa1 = watcher.steps.AddMantissa.data.addition.steps.Addition.data.op1Arr;
          mantissa2 = watcher.steps.AddMantissa.data.addition.steps.Addition.data.op2Arr;
          carryBits = watcher.steps.AddMantissa.data.addition.steps.Addition.data.carryArr;
          result = watcher.steps.AddMantissa.data.addition.steps.Addition.data.resultArr;
          cols = watcher.steps.AddMantissa.data.binNum;
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

          const additionMantissaTabular = [
            `\\( \\begin{array} ${tabdef.join('')}`,
            `${row1.join('')}`,
            `${row2.join('')}`,
            '\\hline',
            `${row3.join('')}`,
            '\\end{array} \\) ',
          ].join('');

          steps.push({
            name: `${this.imp.$t('step')} 2`,
            text: [
              'Die Mantissen beider Zahlen müssen addiert werden.',
            ].join(''),
            subpanels: [
              {
                name: 'Neue Mantisse',
                text: [
                  'Die neue Mantisse ist somit: \<br\> \<br\>',
                  additionMantissaTabular,
                ].join(''),
              },
              {
                name: 'Darstellung beachten',
                text: 'Die Mantisse beginnt in der Standard-Darstellung immer mit einer 1 vor dem Komma.',
                subsubpanels: [
                  {
                    name: 'Mantisse im Float',
                    text: ['Im Float wird die führende 1 nicht angezeigt: ', this.imp.watcher.steps.AddMantissa.data.normalizedMantissa.join('')].join(''),
                  },
                ],
              },
            ],
          });
          steps.push({
            name: this.imp.$t('solution'),
            text: [
              'Die Lösung lautet: ',
              this.imp.watcher.steps.Result.data.result.sign, ' ',
              this.imp.watcher.steps.Result.data.result.exponentBits.join(''), ' ',
              this.imp.watcher.steps.Result.data.result.mantissaBits.join('').substring(1),
            ].join(''),
            subpanels: [
              {
                name: 'Vorzeichen: ',
                text: this.imp.watcher.steps.Result.data.result.sign,
              },
              {
                name: 'Exponent: ',
                text: this.imp.watcher.steps.Result.data.result.exponentBits.join(''),
              },
              {
                name: 'Mantisse: ',
                text: this.imp.watcher.steps.Result.data.result.mantissaBits.join(''),
              },
            ],
          });
          break;

        // =========================================================================================
        // Multiplication
        case 'mul':
          steps.push({
            name: `${this.imp.$t('values')}`,
            text: 'Werte der übertragenen Zahlen',
            subpanels: [
              {
                name: 'Zahl links: ',
                text: [
                  'Wert: ', y1.valueString,
                  ', Vorzeichen: ', (y1.sign === 0 ? '+' : '-'),
                  ', Mantisse: ', mantissaString1,
                  ', Exponent: ', expString1,
                ].join(''),
              },
              {
                name: 'Zahl rechts: ',
                text: [
                  'Wert: ', y2.valueString,
                  ', Vorzeichen: ', (y2.sign === 0 ? '+' : '-'),
                  ', Mantisse: ', mantissaString2,
                  ', Exponent: ', expString2,
                ].join(''),
              },
            ],
          });
          steps.push({
            name: `${this.imp.$t('step')} 1`,
            text: [
              'Die Exponenten beider Zahlen müssen addiert werden. (neuer Exponent: ',
              this.imp.binToDec(expString1) + this.imp.binToDec(expString2),
              ')',
            ].join(''),
          });
          steps.push({
            name: `${this.imp.$t('step')} 2`,
            text: [
              'Die Mantissen beider Zahlen müssen multipliziert werden.',
            ].join(''),
            subpanels: [
              {
                name: 'Exponent beachten',
                text: ['Der Shift-Faktor des Exponenten muss auf die Mantissen angewendet werden. (Shift: ', this.imp.binToDec(expString1) - this.imp.binToDec(expString2), ')'].join(''),
              },
              {
                name: 'Darstellung beachten',
                text: 'Die Mantisse beginnt in der Standard-Darstellung immer mit einer 1 vor dem Komma.',
              },
              {
                name: 'Neue Mantisse',
                text: ['Die neue Mantisse ist somit: ', solution.mantissaBits.join('')].join(''),
              },
            ],
          });
          steps.push({
            name: this.imp.$t('solution'),
            text: [
              'Die Lösung lautet: ',
              this.imp.watcher.steps.Result.data.result.sign, ' ',
              this.imp.watcher.steps.Result.data.result.exponentBits.join(''), ' ',
              this.imp.watcher.steps.Result.data.result.mantissaBits.join('').substring(1),
            ].join(''),
            subpanels: [
              {
                name: 'Vorzeichen: ',
                text: this.imp.watcher.steps.Result.data.result.sign,
              },
              {
                name: 'Exponent: ',
                text: this.imp.watcher.steps.Result.data.result.exponentBits.join(''),
              },
              {
                name: 'Mantisse: ',
                text: this.imp.watcher.steps.Result.data.result.mantissaBits.join(''),
              },
            ],
          });
          break;

        // =========================================================================================
        // Subtraction
        case 'sub':
          steps.push({
            name: `${this.imp.$t('values')}`,
            text: 'Werte der übertragenen Zahlen',
            subpanels: [
              {
                name: 'Minuend: ',
                text: [
                  'Wert: ', y1.valueString,
                  ', Vorzeichen: ', (y1.sign === 0 ? '+' : '-'),
                  ', Mantisse: ', mantissaString1,
                  ', Exponent: ', expString1,
                ].join(''),
              },
              {
                name: 'Subtrahend: ',
                text: [
                  'Wert: ', y2.valueString,
                  ', Vorzeichen: ', (y2.sign === 0 ? '+' : '-'),
                  ', Mantisse: ', mantissaString2,
                  ', Exponent: ', expString2,
                ].join(''),
              },
            ],
          });
          const addWatcher = watcher.steps.Addition.data.addition;
          if (addWatcher.steps.CalculateDeltaE.data.deltaE === 0) {
            steps.push({
              name: `${this.imp.$t('step')} 1`,
              text: ['Die Exponenten beider Zahlen müssen angeglichen werden. \\( (', expString1, ' = ', expString2, ' \\Rightarrow i.O.) \\)'].join(''),
            });
          } else {
            const left = addWatcher.steps.CalculateDeltaE.data.switched ? '<' : '>';
            steps.push({
              name: `${this.imp.$t('step')} 1`,
              text: ['Die Exponenten beider Zahlen müssen angeglichen werden. \\( (', expString1, ' \\neq ', expString2, ') \\)'].join(''),
              subpanels: [
                {
                  name: 'Differenz Exponent',
                  text: [
                    'Es wird immer der kleinere vom größeren Exponenten subtrahiert ',
                    `\\( ( [ ${addWatcher.steps.CalculateDeltaE.data.expN1Bits.join('')} ] :=  ${addWatcher.steps.CalculateDeltaE.data.expN1} ${left}
                      [ ${addWatcher.steps.CalculateDeltaE.data.expN2Bits.join('')} ] :=  ${addWatcher.steps.CalculateDeltaE.data.expN2}) \\) `,
                    'daher ergibt sich eine Differenz von: ',
                    addWatcher.steps.CalculateDeltaE.data.deltaE,
                  ].join(''),
                  subsubpanels: [
                    {
                      name: 'Anpassen der kleineren Mantisse',
                      text: [
                        ' Shiften der kleineren Mantisse: \\( ',
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
          if (addWatcher.steps.AddMantissa.data.sign1 === 0
            && addWatcher.steps.AddMantissa.data.sign2 === 1) {
            steps.push({
              name: `${this.imp.$t('step')} 2`,
              text: 'Subtraktion entspricht der Addition mit dem Zweierkomplement',
              subpanels:
                [
                  {
                    name: [
                      'Bildung Zweierkomplement aus Mantisse: \\(',
                      addWatcher.steps.AddMantissa.data.mantissa2.join(''),
                      '\\)',
                    ].join(''),
                    text: 'Schritte',
                    subsubpanels: [
                      {
                        name: 'Bits umkehren',
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
                        name: '1 addieren',
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
                        name: 'Normalisieren',
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
              text: 'Subtraktion entspricht der Addition mit dem Zweierkomplement',
              subpanels:
                [
                  {
                    name: [
                      'Bildung Zweierkomplement aus Mantisse: \\(',
                      addWatcher.steps.AddMantissa.data.mantissa1.join(''),
                      '\\)',
                    ].join(''),
                    text: 'Schritte',
                    subsubpanels: [
                      {
                        name: 'Bits umkehren',
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
                        name: '1 addieren',
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
                        name: 'Normalisieren',
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
              text: 'Subtraktion entspricht der Addition mit dem Zweierkomplement',
              subpanels:
                [
                  {
                    name: [
                      'Bildung Zweierkomplement aus Mantisse: \\(',
                      addWatcher.steps.AddMantissa.data.mantissa1.join(''),
                      '\\)',
                    ].join(''),
                    text: 'Schritte',
                    subsubpanels: [
                      {
                        name: 'Bits umkehren',
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
                        name: '1 addieren',
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
                        name: 'Normalisieren',
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
                      'Bildung Zweierkomplement aus Mantisse: \\(',
                      addWatcher.steps.AddMantissa.data.mantissa2.join(''),
                      '\\)',
                    ].join(''),
                    text: 'Schritte',
                    subsubpanels: [
                      {
                        name: 'Bits umkehren',
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
                        name: '1 addieren',
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
                        name: 'Normalisieren',
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
          // TODO: Version if the mantissas are equal
          // set up tabular for visual the addition
          originalMantissa1 = addWatcher.steps.AddMantissa.data.mantissa1;
          originalMantissa2 = addWatcher.steps.AddMantissa.data.mantissa2;
          mantissa1 = addWatcher.steps.AddMantissa.data.addition.steps.Addition.data.op1Arr;
          mantissa2 = addWatcher.steps.AddMantissa.data.addition.steps.Addition.data.op2Arr;
          carryBits = addWatcher.steps.AddMantissa.data.addition.steps.Addition.data.carryArr;
          result = addWatcher.steps.AddMantissa.data.addition.steps.Addition.data.resultArr;
          cols = addWatcher.steps.AddMantissa.data.binNum;
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

          const subtractionMantissaTabular = [
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

          steps.push({
            name: `${this.imp.$t('step')} 3`,
            text: [
              'Die Mantissen beider Zahlen müssen addiert werden.',
            ].join(''),
            subpanels: [
              {
                name: 'Neue Mantisse',
                text: [
                  'Die neue Mantisse ist somit: \<br\> \<br\>',
                  subtractionMantissaTabular,
                ].join(''),
              },
              {
                name: 'Darstellung beachten',
                text: 'Die Mantisse beginnt in der Standard-Darstellung immer mit einer 1 vor dem Komma.',
                subsubpanels: [
                  {
                    name: 'Mantisse im Float',
                    text: ['Im Float wird die führende 1 nicht angezeigt: ', addWatcher.steps.AddMantissa.data.normalizedMantissa.join('')].join(''),
                  },
                ],
              },
            ],
          });
          steps.push({
            name: this.imp.$t('solution'),
            text: [
              'Die Lösung lautet: ',
              addWatcher.steps.Result.data.result.sign, ' ',
              addWatcher.steps.Result.data.result.exponentBits.join(''), ' ',
              addWatcher.steps.Result.data.result.mantissaBits.join('').substring(1),
            ].join(''),
            subpanels: [
              {
                name: 'Vorzeichen: ',
                text: addWatcher.steps.Result.data.result.sign,
              },
              {
                name: 'Exponent: ',
                text: addWatcher.steps.Result.data.result.exponentBits.join(''),
              },
              {
                name: 'Mantisse: ',
                text: addWatcher.steps.Result.data.result.mantissaBits.join(''),
              },
            ],
          });
          break;

        // =========================================================================================
        // Division
        case 'div':
          const divWatcher = watcher.steps.Division.data.division;
          steps.push({
            name: `${this.imp.$t('values')}`,
            text: 'Werte der übertragenen Zahlen',
            subpanels: [
              {
                name: 'Zahl links: ',
                text: [
                  'Wert: ', y1.valueString,
                  ', Vorzeichen: ', (y1.sign === 0 ? '+' : '-'),
                  ', Mantisse: ', mantissaString1,
                  ', Exponent: ', expString1,
                ].join(''),
              },
              {
                name: 'Zahl rechts: ',
                text: [
                  'Wert: ', y2.valueString,
                  ', Vorzeichen: ', (y2.sign === 0 ? '+' : '-'),
                  ', Mantisse: ', mantissaString2,
                  ', Exponent: ', expString2,
                ].join(''),
              },
            ],
          });
          steps.push({
            name: `${this.imp.$t('step')} 1`,
            text: [
              'Die Exponenten beider Zahlen müssen subtrahiert werden. (neuer Exponent: \\(',
              this.imp.binToDec(expString1) - this.imp.binToDec(expString2),
              '\\) )',
            ].join(''),
          });
          // the calculation is set up in a table
          // information, steps
          const divSteps = divWatcher.steps.DivisionSteps.data; // steps
          const countSteps = divSteps.countSteps; // count of steps until result
          const n1Arr = divWatcher.steps.DivisionInput.data.n1Arr; // divisor
          const n2Arr = divSteps.Step0_Sub2; // dividend
          const n2len = n2Arr.length;
          const divRes = divWatcher.steps.Result.data.result; // result of division
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
              rows[rows.length - 2] += '&\\underline\{0\}';
              for (let j = divSteps[`Step${i - 1}_Sub1`].length + 1; j < arrLen; j += 1) {
                rows[rows.length - 2] += '&';
              }
              if (i > 0) {
                rows[rows.length - 2] += '\\Sigma < 0 \\rightarrow 0';
              }
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
              rows[rows.length - 1] += '\\hookrightarrow \{\\scriptstyle wiederhole\\ Minuend\}';
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
          rows[rows.length - 1] += divRes.arr.join('&');
          for (let j = divRes.arr.length; j < divSteps.Step0_Sub1.length; j += 1) {
            rows[rows.length - 1] += '& 0';
          }

          steps.push({
            name: `${this.imp.$t('step')} 2`,
            text: [
              'Die Mantissen beider Zahlen müssen dividiert werden.',
            ].join(''),
            subpanels: [
              {
                name: 'Divison durchführen',
                text: [
                  `\\( \\begin{array} ${tabdef.join('')}`,
                  rows.join(''),
                  '\\end{array} \\) ',
                ].join(''),
              },
              {
                name: 'Darstellung beachten',
                text: 'Die Mantisse beginnt in der Standard-Darstellung immer mit einer 1 vor dem Komma.',
              },
              {
                name: 'Neue Mantisse',
                text: ['Die neue Mantisse ist somit: ', solution.mantissaBits.join('')].join(''),
              },
            ],
          });
          steps.push({
            name: this.imp.$t('solution'),
            text: [
              'Die Lösung lautet: ',
              this.imp.watcher.steps.Result.data.result.sign, ' ',
              this.imp.watcher.steps.Result.data.result.exponentBits.join(''), ' ',
              this.imp.watcher.steps.Result.data.result.mantissaBits.join('').substring(1),
            ].join(''),
            subpanels: [
              {
                name: 'Vorzeichen: ',
                text: this.imp.watcher.steps.Result.data.result.sign,
              },
              {
                name: 'Exponent: ',
                text: this.imp.watcher.steps.Result.data.result.exponentBits.join(''),
              },
              {
                name: 'Mantisse: ',
                text: this.imp.watcher.steps.Result.data.result.mantissaBits.join(''),
              },
            ],
          });
          break;
        default:
      }
      return steps;
    }
    return null;
  }
}
