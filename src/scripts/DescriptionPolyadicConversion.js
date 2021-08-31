/* eslint no-useless-escape: 0  no-case-declarations: 0 */

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

export class DescriptionPolyadicConversion {
  constructor(imp, watcher) {
    classCallCheck(this, DescriptionPolyadicConversion);
    this.imp = imp;
    this.tableTenToPowerBeforeComma = '';
    this.tableTenToPowerAfterComma = '';
    this.tablePowerToTenBeforeComma = '';
    this.tablePowerToTenAfterComma = '';
    this.tableShortcut = '';
    this.result = [];
    this.watcher = watcher;
  }

  // =========================================================================================
  // Polyadic Conversion
  getTableTenToPowerBeforeComma() {
    const tabdef = '{ccccccc}';
    const table = [];
    const steps = this.watcher[1].steps.ConstructNumber.data.stepsBeforeComma;

    table.push(`\\begin{array} ${tabdef}`);
    table.push(`${this.imp.$t('numerator')}&:&${this.imp.$t('newBasis')}`);
    table.push(`&=&${this.imp.$t('quotient')}&+&${this.imp.$t('remainder')}\\\\ \\hline`); // header

    let number = this.watcher[1].steps.ConstructNumber.data.beforeCommaVal;
    const power = this.watcher[1].steps.Input.data.power;
    let div = this.watcher[1].steps.ConstructNumber.data.beforeComma0Div;
    let remain = this.watcher[1].steps.ConstructNumber.data.beforeComma0Remain;
    table.push(`${number}&:&${power}&=&${div}&+&${remain}\\\\`);
    number = div;
    for (let i = 1; i < steps; i += 1) {
      div = this.watcher[1].steps.ConstructNumber.data[`beforeComma${i}Div`];
      remain = this.watcher[1].steps.ConstructNumber.data[`beforeComma${i}Remain`];
      table.push(`${number}&:&${power}&=&${div}&+&${remain}\\\\`);
      number = div;
    }

    table.push('\\end{array}');
    this.tableTenToPowerBeforeComma = table.join('');
  }


  getTableTenToPowerAfterComma() {
    const tabdef = '{ccccccc}';
    const table = [];
    const isPeriodic = this.watcher[1].steps.ConstructNumber.data.isPeriodic;
    const periodicStart = this.watcher[1].steps.ConstructNumber.data.periodicStart;
    const periodicEnd = this.watcher[1].steps.ConstructNumber.data.periodicEnd;
    const steps = Math.min(
      this.watcher[1].steps.ConstructNumber.data.stepsAfterComma,
      periodicEnd,
    );

    table.push(`\\begin{array} ${tabdef}`);
    table.push(`${this.imp.$t('factor')}&*&${this.imp.$t('newBasis')}`);
    table.push(`&=&${this.imp.$t('quotient')}&+&${this.imp.$t('remainder')}\\\\ \\hline`); // header

    let number = this.watcher[1].steps.ConstructNumber.data.afterCommaVal;
    const power = this.watcher[1].steps.Input.data.power;
    let mul = this.watcher[1].steps.ConstructNumber.data.afterComma0Mul;
    let remain = this.watcher[1].steps.ConstructNumber.data.afterComma0Remain;
    table.push(`${number}&*&${power}&=&${mul}&+&${remain}\\\\`);
    number = mul;
    for (let i = 1; i < steps; i += 1) {
      mul = this.watcher[1].steps.ConstructNumber.data[`afterComma${i}Mul`];
      remain = this.watcher[1].steps.ConstructNumber.data[`afterComma${i}Remain`];
      if (isPeriodic && (i >= periodicStart)) {
        table.push(`${number}&*&${power}&=&${mul}&+&\\overline{${remain}}\\\\`);
      } else {
        table.push(`${number}&*&${power}&=&${mul}&+&${remain}\\\\`);
      }
      number = mul;
    }

    table.push('\\end{array}');
    this.tableTenToPowerAfterComma = table.join('');
  }


  getTablePowerToTenBeforeComma() {
    this.tablePowerToTenBeforeComma = '';
  }


  getTablePowerToTenAfterComma() {
    this.tablePowerToTenAfterComma = '';
  }

  getTableShortcut2ToHex() {
    this.tableShortcut = '';
  }

  getTableShortcutHexTo2() {
    this.tableShortcut = '';
  }

  // eslint-disable-next-line no-unused-vars
  makeDescription(modus, format) {
    let solution;
    let number;
    if (Array.isArray(this.watcher)) {
      if (modus === 'PowerToTen') {
        solution = this.watcher[0].steps.Result.data.resultNumber;
        number = this.watcher[0].steps.Input.data.number;
      } else {
        solution = this.watcher[1].steps.Result.data.resultNumber;
        number = this.watcher[1].steps.Input.data.number;
      }
    } else {
      solution = this.watcher.steps.Result.data.resultNumber;
      number = this.watcher.steps.Input.data.number;
    }
    console.log(`Solution Value: ${solution.value}`);
    console.log(`Modus: ${modus}`);
    console.log(`Input: ${number}`);


    this.result.push({
      name: `${this.imp.$t('values')}`,
      text: `${this.imp.$t('input')}`,
      subpanels: [
        {
          name: `${this.imp.$t('number')}: `,
          text: [
            `${this.imp.$t('representation')}: `, number.value,
          ].join(''),
        },
        {
          name: `${this.imp.$t('modus')}: `,
          text: [
            `${this.imp.$t('firstFormat')}: "${this.imp.$t(format[0])}" `,
            `${this.imp.$t('to')} `,
            `${this.imp.$t('secondFormat')} "${this.imp.$t(format[1])}"`,
          ].join(''),
        },
      ],
    });
    if (modus === 'ShortcutHexToBin') {
      this.getTableShortcutHexTo2();
      this.result.push({
        name: `${this.imp.$t('conversion')}`,
        text: `${this.imp.$t('shortcutHexToBin')}`,
        subpanels: [
          {
            name: `${this.imp.$t('doConversion')}`,
            text: `\\(${this.tableShortcut}\\)`,
          },
        ],
      });
    } else if (modus === 'ShortcutHexToBin') {
      this.getTableShortcutHexTo2();
      this.result.push({
        name: `${this.imp.$t('conversion')}`,
        text: `${this.imp.$t('shortcutBinToHex')}`,
        subpanels: [
          {
            name: `${this.imp.$t('doConversion')}`,
            text: `\\(${this.tableShortcut}\\)`,
          },
        ],
      });
    } else if (modus === 'PowerToTen') {
      this.getTablePowerToTenBeforeComma();
      this.getTablePowerToTenAfterComma();
    } else if (modus === 'TenToPower') {
      this.getTableTenToPowerBeforeComma();
      this.getTableTenToPowerAfterComma();
      this.result.push({
        name: `${this.imp.$t('conversion')}`,
        text: `${this.imp.$t('TenToPower')}`,
        subpanels: [
          {
            name: `${this.imp.$t('divisionAlgorithm')}`,
            text: `\\(${this.tableTenToPowerBeforeComma}\\)`,
          },
          {
            name: `${this.imp.$t('multiplicationAlgorithm')}`,
            text: `\\(${this.tableTenToPowerAfterComma}\\)`,
          },
        ],
      });
    } else if (modus === 'PowerToPower') {
      this.getTablePowerToTenBeforeComma();
      this.getTablePowerToTenAfterComma();
      this.getTableTenToPowerBeforeComma();
      this.getTableTenToPowerAfterComma();
    } else {
      console.log('FAILURE: Not implemented Modus!');
    }
    this.result.push({
      name: this.imp.$t('solution'),
      text: [
        `${this.imp.$t('correctSolution')}: `,
        solution.sign, ' ',
        solution.bitString, ' ',
        `${this.imp.$t('value')}: ${solution.value}`,
      ].join(''),
    });
  }
}
