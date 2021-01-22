<template>
  <!--v-on:mouseenter="sliderMouseUp" v-on:mouseleave="sliderMouseUp"
  v-on:mouseup="sliderMouseUp"-->
  <div class="fp-arithmetic">
    <h4>{{$t('fpformat')}}</h4>
    <div class="formatContainer" v-on:mousemove="sliderMouseMove">
      <div class="bits">
        <FSelect :num="5" :sel="selectedFormat[5]" @input="selectBitRange"
                     :options="bitrangeOptions">
        </FSelect>
      </div>
      <div class="sign">VB</div>
      <div class="exponent" :style="{ width:
        (60 + this.exponentBits * (this.containerWidth / (this.numBits - 1)))+ 'px' }">
        <div v-on:click="expandFraction" class="expandExponent">
          <div class="arrowLeft">
            <div class='arrowMask'></div>
          </div>
        </div>
        E({{exponentBits}})
        <div v-on:mousedown="sliderMouseDown" class="slider"/>
      </div>
      <div class="fraction" :style="{ width: (60 + (this.numBits - this.exponentBits - 1) *
        (this.containerWidth / (this.numBits - 1))) + 'px' }">
        <div v-on:click="expandExponent" class="expandFraction">
          <div class="arrowRight">
            <div class="arrowMask"></div>
          </div>
        </div>
        M({{(numBits - exponentBits - 1)}})
      </div>
    </div>
    <div class="mobile_formatContainer" v-on:mousemove="sliderMouseMove">
      <div class="mobile_sign">Sign(1)</div>
      <div v-on:click="expandExponent" class="mobile_exponent">
        Exponent({{exponentBits}}) &uarr;
      </div>
      <div v-on:click="expandFraction" class="mobile_fraction">
        Mantisse({{(numBits - exponentBits - 1)}}) &darr;
      </div>
    </div>
    <h4>{{$t('operationSelect')}}</h4>
    <div id="fpOperationTable" class="fpOperationTable">
      <div class="container">
        <div>{{$t('firstFloatingPoint')}}</div>
        <table id="fpfTable1" class="floatingPointInput">
          <tr>
            <td>
              <input id="fpfInput0" v-model="inputNums[0]" :placeholder="this.$t('inputNumber')"
                @input="checkAndConvertFormat(0)"/>
            </td>
            <td><FSelect :num="0" :sel="selectedFormat[0]" @input="selectVal"
              :options="formatOptions"/></td>
          </tr>
          <tr>
            <td><input id="fpfInput1" v-model="nums[0]" disabled></td>
            <td><FSelect :num="1" :sel="selectedFormat[1]" @input="selectVal" :isDisabled="true"
              :options="formatOptions"/></td>
          </tr>
        </table>
      </div>
      <div class="container">
        <div>{{$t('operand')}}</div>
        <div class="operand">
          <FSelect :num="2" :sel="selectedFormat[2]" @input="selectOp"
            :options="operationOptions"/>
        </div>
      </div>
      <div class="container">
        <div>{{$t('secondFloatingPoint')}}</div>
        <table id="fpfTable2" class="floatingPointInput">
          <tr>
            <td><input id="fpfInput2" v-model="inputNums[1]" :placeholder="this.$t('inputNumber')"
              @input="checkAndConvertFormat(1)"></td>
            <td><FSelect :num="3" :sel="selectedFormat[3]" @input="selectVal"
              :options="formatOptions"/></td>
          </tr>
          <tr>
            <td><input id="fpfInput3" v-model="nums[1]" disabled></td>
            <td><FSelect :num="4" :sel="selectedFormat[4]" @input="selectVal" :isDisabled="true"
              :options="formatOptions"/></td>
          </tr>
        </table>
      </div>
    </div>

    <h4>{{$t('correctSolution')}}</h4>
    <label class="attention">{{$t('attSolve')}}</label>
    <Accordion :solutionDescription="solDescr">
      <p v-for="(panel, index) in solDescr" :slot="'slot'+index" v-bind:key="panel.name">
        {{panel.text}}
        <span v-if="index === solDescr.length - 1">{{solution}}</span>
      </p>
    </Accordion>
  </div>
</template>

<script>
/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import * as tool from '../scripts/gti-tools';
import FormatSelect from './FormatSelect.vue';
import SolutionAccordion from './SolutionAccordion.vue';

export default {
  name: 'FloatingPointArithmetic',
  components: {
    FSelect: FormatSelect,
    Accordion: SolutionAccordion,
  },
  data() {
    return {
      selectedFormat: ['decimal', 'ieee', 'add', 'decimal', 'ieee', 'sixteen'], // 0: input left, 1: converted left, 2: operand, 3: input right, 4: converted right, 5: bit range
      mouseDown: false,
      solution: '',
      inputNums: { 0: '', 1: '' },
      nums: { 0: '', 1: '' },
      exponentBits: 4,
      numBits: 16,
      falseFormatOutput: 'Falsches Format!',
      containerWidth: 500,
      solutionSteps: [],
    };
  },
  computed: {
    solDescr() {
      return this.solutionSteps;
    },
    operationOptions() {
      return {
        add: `${this.$t('addition')} (+)`,
        sub: `${this.$t('subtraction')} (-)`,
        mul: `${this.$t('multiplication')} (*)`,
        div: `${this.$t('division')} (/)`,
      };
    },
    formatOptions() {
      return {
        decimal: `${this.$t('decimal')} (42,14)`,
        binary: `${this.$t('binary')}  (1,0011)`,
        ieee: 'IEEE (1 0101 1101)',
      };
    },
    bitrangeOptions() {
      return {
        sixteen: '16 bit',
        thirtytwo: '32 bit',
        sixtyfour: '64 bit',
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.containerWidth = Math.min(500, window.innerWidth - 250);
      });
      window.addEventListener('SelectionChanged', () => {
        this.containerWidth = Math.min(500, window.innerWidth - 250);
        this.computeSolution();
        this.solDescrActive();
      });
    });
  },
  methods: {
    selectBitRange(num, val) {
      this.selectedFormat[num] = val;
      console.log(this.selectedFormat[num]);
      if (val === 'sixteen') {
        this.numBits = 16;
      } else if (val === 'thirtytwo') {
        this.numBits = 32;
      } else if (val === 'sixtyfour') {
        this.numBits = 64;
      }
      this.computeSolution();
      this.solDescrActive();
    },
    selectVal(num, val) {
      this.selectedFormat[num] = val;
      const nnum = num > 2 ? 1 : 0;
      this.checkAndConvertFormat(nnum);
      console.log(val);
    },
    selectOp(num, val) {
      this.selectedFormat[num] = val;
      this.computeSolution();
      this.solDescrActive();
    },
    checkFormat(format, conv) {
      let commaOccured = false;
      const convert = conv.replace(/\s/g, '');
      if (format === 'ieee' && convert.length !== this.numBits) {
        return false;
      }
      for (let i = 0; i < convert.length; i += 1) {
        if (format === 'binary') {
          if (!(['0', '1', ',', '-', '+'].includes(convert[i]))) {
            return false;
          }
        }
        if (format === 'ieee') {
          if (convert[i] !== '0' && convert[i] !== '1') {
            return false;
          }
        }
        if (format === 'decimal') {
          if (!(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            ',', '-', '+'].includes(convert[i]))) {
            return false;
          }
        }
        if (format === 'binary' || format === 'decimal') {
          if ((convert[i] === '+' || convert[i] === '-') && i > 1) {
            return false;
          }
        }
        if (convert[i] === ',') {
          if (commaOccured) {
            return false;
          }
          commaOccured = true;
        }
      }
      return true;
    },
    checkAndConvertFormat(num) {
      const firstFormat = this.selectedFormat[num * 3];
      const toConvert = this.inputNums[num];
      if (!this.checkFormat(firstFormat, toConvert)) {
        this.nums[num] = this.falseFormatOutput;
        return;
      }
      this.convertFormat(num);
      this.computeSolution();
      this.solDescrActive();
      this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset();
        }
      });
    },
    convertFormat(num) {
      const firstFormat = this.selectedFormat[num * 3];
      const secondFormat = this.selectedFormat[num * 3 + 1];
      const toConvert = this.inputNums[num];
      if (toConvert.length === 0) {
        return;
      }
      let converted = toConvert;
      if (firstFormat === 'binary') {
        if (secondFormat === 'decimal') { // dead code
          converted = this.binToDec(toConvert);
        } else if (secondFormat === 'ieee') {
          converted = this.binToIEEE(toConvert);
        }
      } else if (firstFormat === 'decimal') {
        if (secondFormat === 'binary') { // dead code
          converted = this.decToBin(toConvert);
        } else if (secondFormat === 'ieee') {
          converted = this.binToIEEE(this.decToBin(toConvert));
        }
      } else if (firstFormat === 'ieee') {
        if (secondFormat === 'binary') { // dead code
          converted = this.ieeeToBin(toConvert);
        } else if (secondFormat === 'decimal') { // dead code
          converted = this.binToDec(this.ieeeToBin(toConvert));
        }
      }
      this.nums[num] = converted;
    },
    computeSolution() {
      const num1 = this.nums[0];
      const num2 = this.nums[1];
      if (num1 !== '' && num2 !== ''
        && num1 !== this.falseFormatOutput && num2 !== this.falseFormatOutput) {
        const y1 = tool.getIEEEFromString(this.exponentBits, num1);
        const y2 = tool.getIEEEFromString(this.exponentBits, num2);
        console.log(y1);
        console.log(y2);
        let result = null;
        switch (this.selectedFormat[2]) {
          case 'add':
            result = new tool.AdditionIEEE(y1, y2);
            break;
          case 'mul':
            result = new tool.MultiplicationIEEE(y1, y2);
            break;
          case 'sub':
            result = new tool.SubtractionIEEE(y1, y2);
            break;
          case 'div':
            result = new tool.DivisionIEEE(y1, y2);
            break;
          default:
        }
        console.log(result.getResult());
        this.watcher = result.watcher;
        let solution = '';
        solution = result.getResult().bitString;
        if (result.getResult().isNaN) solution += ' is Nan';
        if (result.getResult().isZero) solution += ' is Zero';
        if (result.getResult().isInfinity) solution += ' is Inf';
        this.solution = solution;
      }
    },
    solDescrActive() {
      const num1 = this.nums[0];
      const num2 = this.nums[1];
      if (num1 !== '' && num2 !== '' && num1 !== 'Falsches Format' && num2 !== 'Falsches Format') {
        const solution = tool.getIEEEFromString(this.exponentBits, this.solution);
        const y1 = tool.getIEEEFromString(this.exponentBits, num1);
        const y2 = tool.getIEEEFromString(this.exponentBits, num2);
        let mantissaString1 = y1.mantissaBits.join('');
        mantissaString1 = `1,${mantissaString1.substring(1)}`;
        let mantissaString2 = y2.mantissaBits.join('');
        mantissaString2 = `1,${mantissaString2.substring(1)}`;
        const expString1 = y1.exponentBits.join('');
        const expString2 = y2.exponentBits.join('');
        const solMantissa = this.watcher.steps.Result.data.result.mantissaBits.join('').substring(1);
        const steps = [];
        switch (this.selectedFormat[2]) {
          case 'add':
            steps.push({
              name: `${this.$t('values')}`,
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
            if (this.watcher.steps.CalculateDeltaE.data.deltaE === 0) {
              steps.push({
                name: `${this.$t('step')} 1`,
                text: ['Die Exponenten beider Zahlen müssen angeglichen werden. \\( (', expString1, ' = ', expString2, ' \\Rightarrow i.O.) \\)'].join(''),
              });
            } else {
              const left = this.watcher.steps.CalculateDeltaE.data.switched ? '<' : '>';
              steps.push({
                name: `${this.$t('step')} 1`,
                text: ['Die Exponenten beider Zahlen müssen angeglichen werden. \\( (', expString1, ' \\neq ', expString2, ') \\)'].join(''),
                subpanels: [
                  {
                    name: 'Differenz Exponent',
                    text: [
                      'Es wird immer der kleinere vom größeren Exponenten subtrahiert ',
                      `\\( ( [ ${this.watcher.steps.CalculateDeltaE.data.expN1Bits.join('')} ] :=  ${this.watcher.steps.CalculateDeltaE.data.expN1} ${left}
                      [ ${this.watcher.steps.CalculateDeltaE.data.expN2Bits.join('')} ] :=  ${this.watcher.steps.CalculateDeltaE.data.expN2}) \\) `,
                      'daher ergibt sich eine Differenz von: ',
                      this.watcher.steps.CalculateDeltaE.data.deltaE,
                    ].join(''),
                    subsubpanels: [
                      {
                        name: 'Anpassen der kleineren Mantisse',
                        text: [
                          ' Shiften der kleineren Mantisse: \\( ',
                          this.watcher.steps.CalculateDeltaE.data.preShift.join(''),
                          `\\overset{\\text{Shift: ${this.watcher.steps.CalculateDeltaE.data.deltaE} }}{\\rightarrow}`,
                          this.watcher.steps.AddMantissa.data.mantissa2.join(''),
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
            const mantissa1 = this.watcher.steps.AddMantissa.data.addition.steps.Addition.data
              .op1Arr;
            const mantissa2 = this.watcher.steps.AddMantissa.data.addition.steps.Addition.data
              .op2Arr;
            const carryBits = this.watcher.steps.AddMantissa.data.addition.steps.Addition.data
              .carryArr;
            const result = this.watcher.steps.AddMantissa.data.addition.steps.Addition.data
              .resultArr;
            const cols = this.watcher.steps.AddMantissa.data.binNum;
            const row1 = [];
            const row2 = [];
            const row3 = [];
            const tabdef = ['{'];
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

            const tabular = [
              `\\( \\begin{array} ${tabdef.join('')}`,
              `${row1.join('')}`,
              `${row2.join('')}`,
              '\\hline',
              `${row3.join('')}`,
              '\\end{array} \\) ',
            ].join('');

            steps.push({
              name: `${this.$t('step')} 2`,
              text: [
                'Die Mantissen beider Zahlen müssen addiert werden.',
              ].join(''),
              subpanels: [
                { name: 'Hinweis', text: 'Die größere Zahl mit dem größeren Exponenten wird links angezeigt' },
                {
                  name: 'Neue Mantisse',
                  text: [
                    'Die neue Mantisse ist somit: \<br\> \<br\>',
                    tabular,
                  ].join(''),
                },
                {
                  name: 'Darstellung beachten',
                  text: 'Die Mantisse beginnt in der Standard-Darstellung immer mit einer 1 vor dem Komma.',
                  subsubpanels: [
                    {
                      name: 'Mantisse im Float',
                      text: ['Im Float wird die führende 1 nicht angezeigt: ', this.watcher.steps.AddMantissa.data.normalizedMantissa.join('')].join(''),
                    },
                  ],
                },
              ],
            });
            break;
          case 'mul':
            steps.push({
              name: `${this.$t('values')}`,
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
              name: `${this.$t('step')} 1`,
              text: [
                'Die Exponenten beider Zahlen müssen addiert werden. (neuer Exponent: ',
                this.binToDec(expString1) + this.binToDec(expString2),
                ')',
              ].join(''),
            });
            steps.push({
              name: `${this.$t('step')} 2`,
              text: [
                'Die Mantissen beider Zahlen müssen multipliziert werden.',
              ].join(''),
              subpanels: [
                { name: 'Exponent beachten', text: ['Der Shift-Faktor des Exponenten muss auf die Mantissen angewendet werden. (Shift: ', this.binToDec(expString1) - this.binToDec(expString2), ')'].join('') },
                { name: 'Darstellung beachten', text: 'Die Mantisse beginnt in der Standard-Darstellung immer mit einer 1 vor dem Komma.' },
                { name: 'Neue Mantisse', text: ['Die neue Mantisse ist somit: ', solution.mantissaBits.join('')].join('') },
              ],
            });
            break;
          case 'sub':
            break;
          case 'div':
            steps.push({
              name: `${this.$t('values')}`,
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
              name: `${this.$t('step')} 1`,
              text: [
                'Die Exponenten beider Zahlen müssen subtrahiert werden. (neuer Exponent: ',
                this.binToDec(expString1) - this.binToDec(expString2),
                ')',
              ].join(''),
            });
            steps.push({
              name: `${this.$t('step')} 2`,
              text: [
                'Die Mantissen beider Zahlen müssen dividiert werden.',
              ].join(''),
              subpanels: [
                { name: 'Exponent beachten', text: ['Der Shift-Faktor des Exponenten muss auf die Mantissen angewendet werden. (Shift: ', this.binToDec(expString2) - this.binToDec(expString1), ')'].join('') },
                { name: 'Darstellung beachten', text: 'Die Mantisse beginnt in der Standard-Darstellung immer mit einer 1 vor dem Komma.' },
                { name: 'Neue Mantisse', text: ['Die neue Mantisse ist somit: ', solution.mantissaBits.join('')].join('') },
              ],
            });
            break;
          default:
        }
        steps.push({
          name: this.$t('solution'),
          text: [
            'Die Lösung lautet: ',
            this.watcher.steps.Result.data.result.sign, ' ',
            this.watcher.steps.Result.data.result.exponentBits.join(''), ' ',
            solMantissa,
          ].join(''),
          subpanels: [
            {
              name: 'Vorzeichen: ',
              text: this.watcher.steps.Result.data.result.sign,
            },
            {
              name: 'Exponent: ',
              text: this.watcher.steps.Result.data.result.exponentBits.join(''),
            },
            {
              name: 'Mantisse: ',
              text: this.watcher.steps.Result.data.result.mantissaBits.join(''),
            },
          ],
        });
        this.solutionSteps = steps;
      }
    },
    decToBin(num) {
      const fRep = parseFloat(num.replace(',', '.'));
      return fRep.toString(2);
    },
    binToDec(num) {
      const fRep = num.replace(',', '.');
      const fParts = fRep.split('.');
      let devVal = parseInt(fParts[0], 2);
      if (fParts[1] != null && fParts[1].lastIndexOf('1') !== -1) {
        const stripZeros = fParts[1].substring(0, fParts[1].lastIndexOf('1') + 1);
        const decimalPart = parseInt(stripZeros, 2) / (2 ** stripZeros.length);
        if (devVal < 0) {
          devVal -= decimalPart;
        } else {
          devVal += decimalPart;
        }
      }
      return devVal;
    },
    getBias() {
      return (2 ** (this.exponentBits - 1)) - 1;
    },
    binToIEEE(num) {
      const bias = this.getBias();
      const fRep = num.replace(',', '.');
      const fParts = fRep.split('.');
      // extract sign
      let sign = 0;
      if (fParts[0][0] === '-') {
        sign = 1;
        fParts[0] = fParts[0].substring(1);
      }
      // trim leading zeroes
      const preDecimal = fParts[0].replace(/^0+/, '');
      // transform to 1,xxx format
      let mantisse = preDecimal.substring(1);
      const shiftNumber = mantisse.length;
      const numBitsMantisse = this.numBits - this.exponentBits - 1;
      if (fParts[1] != null) {
        mantisse += fParts[1];
      }
      if (mantisse.length > numBitsMantisse) {
        mantisse = mantisse.substring(0, numBitsMantisse);
      }
      if (mantisse.length < numBitsMantisse) {
        mantisse += '0'.repeat(numBitsMantisse - mantisse.length);
      }
      let exponent = (shiftNumber + bias).toString(2);
      // fill with leading zeroes
      if (exponent.length > this.exponentBits) {
        // TODO Number is too big and cannot be displayed
        exponent = exponent.substring(exponent.length - this.exponentBits);
      }
      exponent = '0'.repeat(this.exponentBits - exponent.length) + exponent;
      return `${sign} ${exponent} ${mantisse}`;
    },
    ieeeToBin(num) {
      const ieeeWithoutSpace = num.replace(/\s/g, '');
      if (ieeeWithoutSpace.length !== this.numBits) {
        return 0;
      }
      const sign = ieeeWithoutSpace[0] === 0 ? '' : '-';
      let exponent = ieeeWithoutSpace.substring(1, 1 + this.exponentBits);
      const mantisse = ieeeWithoutSpace.substring(1 + this.exponentBits, this.numBits);
      const bias = this.getBias();
      exponent -= bias;
      let preDecimal = 1;
      let decimal = mantisse;
      if (exponent < 0) {
        preDecimal = 0;
        decimal = `${'0'.repeat(exponent - 1)}1${mantisse}`;
      } else {
        preDecimal = `1${mantisse.substring(0, Math.min(exponent, mantisse.length))}
          ${'0'.repeat(Math.max(0, exponent - mantisse.length))}`;
        decimal = mantisse.substring(exponent);
      }
      if (decimal === '') {
        return `${sign}${preDecimal}`;
      }
      return `${sign}${preDecimal},${decimal}`;
    },
    preventGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'none';
    },
    restoreGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'auto';
    },
    mouseupListener(e) {
      this.restoreGlobalMouseEvents();
      document.removeEventListener('mouseup', this.mouseupListener, { capture: true });
      document.removeEventListener('mousemove', this.sliderMouseMove, { capture: true });
      e.stopPropagation();
      this.mouseDown = false;
    },
    captureMouseEvents(e) {
      this.preventGlobalMouseEvents();
      document.addEventListener('mouseup', this.mouseupListener, { capture: true });
      document.addEventListener('mousemove', this.sliderMouseMove, { capture: true });
      e.preventDefault();
      e.stopPropagation();
    },
    sliderMouseDown(e) {
      this.mouseDown = true;
      this.xCoord = e.pageX;
      this.captureMouseEvents(e);
    },
    sliderMouseMove(e) {
      if (this.mouseDown) {
        const blockSize = (this.containerWidth / (this.numBits - 1));
        if (e.pageX - this.xCoord > blockSize) {
          this.xCoord += blockSize;
          if (this.exponentBits + 1 < this.numBits - 1) {
            this.exponentBits += 1;
            if (this.nums[0] !== this.falseFormatOutput) {
              this.convertFormat(0);
            }
            if (this.nums[1] !== this.falseFormatOutput) {
              this.convertFormat(1);
            }
            this.computeSolution();
          }
        }
        if (this.xCoord - e.pageX > blockSize) {
          this.xCoord -= blockSize;
          if (this.exponentBits > 1) {
            this.exponentBits -= 1;
            if (this.nums[0] !== this.falseFormatOutput) {
              this.convertFormat(0);
            }
            if (this.nums[1] !== this.falseFormatOutput) {
              this.convertFormat(1);
            }
            this.computeSolution();
          }
        }
      }
    },
    expandFraction() {
      this.exponentBits -= 1;
      this.checkAndConvertFormat(0);
      this.checkAndConvertFormat(1);
    },
    expandExponent() {
      this.exponentBits += 1;
      this.checkAndConvertFormat(0);
      this.checkAndConvertFormat(1);
    },
  },
};
</script>

<style scoped lang="scss">
$arrow-size: 12px;

.container {
  display: flex;
  vertical-align: top;
  flex-direction: column;
  flex-grow: 1;
}

.fpOperationTable{
  margin: auto;
  margin-top: 20px;
  display: inline-flex;
  flex-flow: row wrap;
  align-items: stretch;
}

.divMargin{
  display: inline-block;
  width: 10px;
}

.operand{
  position: relative;
  margin: 10px;
  justify-content: center;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-positive: 1;
  flex-grow: 1;
}

.floatingPointInput{
  margin: 10px;
  display: inline-block;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: $transparentWhite;
  position: relative;
}

.formatContainer {
  display: inline-flex;
  flex-direction: row;
  margin: 10px;
  font-size: 14px;
  color: white;
}

.mobile_formatContainer {
  position: relative;
  right: -10%;
  width: 100%;
  display: inline-flex;
  flex-direction: column;
  font-size: 14px;
}

.slider{
  display: block;
  position: absolute;
  right: -6px;
  top: 0px;
  width: 12px;
  height: 100%;
  z-index: 1;
  background: none;
  cursor: ew-resize;
}

.bits {
  width: 80px;
  height: 40px;
  line-height: 40px;
  color: white;
  background: $freshBlue;
  border-right: 1px solid white;
}

.bits .selectBox {
  border: none;
  background-color: transparent;
  color: white;
}

.bits .selectBox .select {
  border: none;
  background-color: transparent;
  color: white;
}

.bits .selectBox .fpfSelect{
  border: none;
  background-color: transparent;
  color: white;
}

.mobile_bits {
  width: 80%;
  height: 40px;
  line-height: 40px;
  color: white;
  background: $freshBlue;
  border-right: 1px solid white;
}

.sign {
  width: 40px;
  height: 40px;
  line-height: 40px;
  color: white;
  background: $freshBlue;
  border-right: 1px solid white;
}

.mobile_sign {
  width: 80%;
  height: 40px;
  line-height: 40px;
  color: white;
  background: $freshBlue;
  border-right: 1px solid white;
}

.exponent{
  height: 40px;
  line-height: 40px;
  background: $freshBlue;
  color: white;
  position: relative;
  user-select: none;
  border-right: 1px solid white;
}

.mobile_exponent{
  height: 40px;
  width: 80%;
  line-height: 40px;
  background: $freshBlue;
  color: white;
  position: relative;
  user-select: none;
  border-right: 1px solid white;
}

.fraction{
  height: 40px;
  line-height: 40px;
  background: $freshBlue;
  color: white;
  position: relative;
  user-select: none;
}

.mobile_fraction{
  height: 40px;
  width: 80%;
  line-height: 40px;
  background: $freshBlue;
  color: white;
  position: relative;
  user-select: none;
  border-right: 1px solid white;
}

.expandExponent{
  position: absolute;
  width: 40px;
  height: 40px;
  display: block;
  right: 0px;
  top: 0px;
  line-height: 40px;
  &:hover{
    cursor: pointer;
  }
}

.mobile_expandExponent{
  height: 40px;
  width: 80%;
  line-height: 40px;
  background: $freshBlue;
  color: white;
  position: relative;
  user-select: none;
  border-right: 1px solid white;
  &:hover{
    cursor: pointer;
  }
}

.expandFraction{
  position: absolute;
  width: 40px;
  height: 40px;
  display: block;
  left: 0px;
  top: 0px;
  line-height: 40px;
  &:hover{
    cursor: pointer;
  }
}

.mobile_expandFraction{
  height: 40px;
  width: 80%;
  line-height: 40px;
  background: $freshBlue;
  color: white;
  position: relative;
  user-select: none;
  border-right: 1px solid white;
  &:hover{
    cursor: pointer;
  }
}

.arrowRight {
  width: $arrow-size;
  height: $arrow-size;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 35%;
  transform: translate(-50%, -50%) rotate(225deg);
}

.arrowLeft {
  width: $arrow-size;
  height: $arrow-size;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 65%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.arrowMask {
  width: 100%;
  height: 100%;
  background-color: $freshBlue;
  position: absolute;
  left: 15%;
  top: -15%;
  right: 0%;
  bottom: 0%;
}

@media(max-width: 750px){
  .formatContainer{
    display: none;
  };
  .slider{
    display: none;
  };
  .sign{
    display: none;
  };
  .exponent{
    display: none;
  };
  .fraction{
    display: none;
  };
  .expandExponent{
    display: none;
  };
  .expandFraction{
    display: none;
  };
  .arrowMask{
    display: none;
  }
}
@media(min-width: 751px){
  .mobile_formatContainer{
    display: none;
  };
  .mobile_slider{
    display: none;
  };
  .mobile_sign{
    display: none;
  };
  .mobile_exponent{
    display: none;
  };
  .mobile_fraction{
    display: none;
  };
  .mobile_expandExponent{
    display: none;
  };
  .mobile_expandFraction{
    display: none;
  };
}

@media(max-width: 1000px){
  tr{
    display: inline;
  }
  td{
    display: block;
    margin: 10px 0;
  }
  .selectBox{
    width: 100%;
  }
}

@media(max-width: 650px){
  .fpOperationTable {
    display: block;
  }
  tr{
    display: inline-block;
  }
  td{
    display: inline-block;
  }
  .selectBox{
    width: 100%;
  }
  .container{
    display: inline-block;
  }
}
</style>
