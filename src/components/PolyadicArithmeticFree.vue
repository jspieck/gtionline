<template>
  <!--v-on:mouseenter="sliderMouseUp" v-on:mouseleave="sliderMouseUp"
  v-on:mouseup="sliderMouseUp"-->
  <div class="fp-arithmetic">
    <div id="fpOperationTable" class="fpOperationTable">
      <div class="container">
        <table>
          <tr>
            <td>
              <div class="solutionInput">
              <p>{{$t('input')}} 1</p>
              <input id="InputNumber1" v-model="inputNums[0]" :placeholder="this.$t('inputNumber') "
                     @input="selectVal(0, $event.target.value)" :class="backFormat"/>
              </div>
            </td>
            <td>
              <div class="solutionInput">
              <p>{{$t('input')}} 2</p>
              <input id="InputNumber2" v-model="inputNums[1]" :placeholder="this.$t('inputNumber') "
                     @input="selectVal(1, $event.target.value)" :class="backFormat"/>
              </div>
            </td>
            <td>
              <p>{{$t('firstFormat')}}</p>
              <FSelect :num="0" :sel="selectedFormat" @input="selectFormat"
                       :options="formatOptions"/>
            </td>
            <td>
              <p>{{$t('operand')}}</p>
              <FSelect :sel="operator" @input="selectOperator"
                :options="operationOptions"/>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="solutionArea">
      <div class="divMargin"/>
      <div class="solutionInput">
        <p>{{$t('ownSolution')}}</p>
        <input id="propSol" :class="backSol" v-model="propSol">
      </div>
      <div class="divMargin"/>
      <button id="checkSolution" @click="checkSolution">{{$t('check')}}</button>
    </div>
    <h4>{{$t('correctSolution')}}</h4>
    <div style="position: relative">
      <div>
        <label class="attention">{{$t('attSolve')}}</label>
      </div>
      <!--<div class="pdfGen">
        <button v-on:click="downloadPdf" v-if="this.solution">{{$t('getDescription')}}</button>
      </div>
      <div class="mobile_pdfGen">
        <button v-on:click="downloadPdf" v-if="this.solution">{{$t('getDescription')}}</button>
      </div>-->
    </div>
    <div id="solution">
      <Accordion :solutionDescription="solDescr">
        <p v-for="(panel, index) in solDescr" :slot="'slot'+index" v-bind:key="panel.name">
          {{panel.text}}
          <span v-if="index === solDescr.length - 1">{{solution}}</span>
        </p>
      </Accordion>
    </div>
    <div id="jaxHelper"></div>
  </div>
</template>

<script>
/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import FormatSelect from './FormatSelect.vue';
import SolutionAccordion from './SolutionAccordion.vue';
import * as description from '../scripts/DescriptionPolyadicSolution';
import * as pdf from '../scripts/generatePdfPolyadicConversion';
import * as solution from '../scripts/polyadicSolution';
import { formatToPower } from '../scripts/polyadicUtil';

export default {
  name: 'PolyadicConversionFree',
  components: {
    FSelect: FormatSelect,
    Accordion: SolutionAccordion,
  },
  data() {
    let hasdefault = false;
    let format = 'decimal';
    if (window.sessionStorage.getItem('PAF_format')) {
      format = window.sessionStorage.getItem('PAF_format');
      hasdefault = true;
    }
    let input1 = '';
    if (window.sessionStorage.getItem('PAF_inputNums1')) {
      input1 = window.sessionStorage.getItem('PAF_inputNums2');
      hasdefault = true;
    }
    let input2 = '';
    if (window.sessionStorage.getItem('PAF_inputNums2')) {
      input2 = window.sessionStorage.getItem('PAF_inputNums2');
      hasdefault = true;
    }
    let op = 'add';
    if (window.sessionStorage.getItem('PAF_operator')) {
      op = window.sessionStorage.getItem('PAF_operator');
      hasdefault = true;
    }
    return {
      selectedFormat: format,
      operator: op,
      // power: 10,
      mouseDown: false,
      solution: '',
      solutionObject: '',
      inputNums: [input1, input2],
      falseFormatOutput: 'Falsches Format!',
      solutionSteps: [],
      default: hasdefault,
      watcher: '',
      propSol: '',
      backSol: '',
      backFormat: ['', ''],
      modus: '',
    };
  },
  computed: {
    power() {
      return formatToPower(this.selectedFormat);
    },
    solDescr() {
      return this.solutionSteps;
    },
    operationOptions() {
      return {
        add: `${this.$t('addition')} (+)`,
        // sub: `${this.$t('subtraction')} (-)`,
        // mul: `${this.$t('multiplication')} (*)`,
        // div: `${this.$t('division')} (/)`,
      };
    },
    formatOptions() {
      return {
        decimal: `${this.$t('decimal')} (Basis 10)`,
        binary: `${this.$t('binary')} (Basis 2)`,
        ternary: `${this.$t('ternary')} (Basis 3)`,
        quaternary: `${this.$t('quaternary')} (Basis 4)`,
        quinary: `${this.$t('quinary')} (Basis 5)`,
        senary: `${this.$t('senary')} (Basis 6)`,
        septenary: `${this.$t('septenary')} (Basis 7)`,
        octal: `${this.$t('octal')} (Basis 8)`,
        novenary: `${this.$t('novenary')} (Basis 9)`,
        hex: `${this.$t('hexadecimal')} (Basis 10)`,
      };
    },
  },
  mounted() {
    if (this.default) {
      this.recalculate();
    }
  },
  watch: {
    input() {
      this.saveVals();
    },
  },
  methods: {
    saveVals() {
      window.sessionStorage.setItem('PAF_format', this.selectedFormat);
      window.sessionStorage.setItem('PAF_inputNums1', this.inputNums[0]);
      window.sessionStorage.setItem('PAF_inputNums2', this.inputNums[1]);
      window.sessionStorage.setItem('PAF_operator', this.operator);
    },
    recalculate() {
      this.saveVals();
      this.computeSolution();
      this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset(); // https://github.com/mathjax/MathJax/issues/2557
        }
      });
    },
    // eslint-disable-next-line no-unused-vars
    selectOperator(num, val) {
      this.operator = val;
      this.recalculate();
    },

    // eslint-disable-next-line no-unused-vars
    selectFormat(num, val) {
      this.selectedFormat = val;
      if (this.checkFormat(this.inputNums[0]) && this.checkFormat(this.inputNums[1])) {
        this.recalculate();
      }
    },
    selectVal(num, val) {
      this.inputNums[num] = val;
      if (this.checkFormat(this.inputNums[num])) {
        this.recalculate();
      }
    },
    checkFormat(conv) {
      this.backFormat = '';
      const format = this.selectedFormat;
      const convert = conv.replace(/\s/g, '');
      let commaFound = false;
      for (let i = 0; i < convert.length; i += 1) {
        switch (format) {
          case 'binary':
            if (!(['0', '1', ',', '.', '-', '+'].includes(convert[i]))) {
              this.backFormat = 'incorrectInput';
              return false;
            }
            break;
          case 'ternary':
            if (!(['0', '1', '2', ',', '.', '-', '+'].includes(convert[i]))) {
              this.backFormat = 'incorrectInput';
              return false;
            }
            break;
          case 'quaternary':
            if (!(['0', '1', '2', '3', ',', '.', '-', '+'].includes(convert[i]))) {
              this.backFormat = 'incorrectInput';
              return false;
            }
            break;
          case 'quinary':
            if (!(['0', '1', '2', '3', '4', ',', '.', '-', '+'].includes(convert[i]))) {
              this.backFormat = 'incorrectInput';
              return false;
            }
            break;
          case 'senary':
            if (!(['0', '1', '2', '3', '4', '5', ',', '.', '-', '+'].includes(convert[i]))) {
              this.backFormat = 'incorrectInput';
              return false;
            }
            break;
          case 'septenary':
            if (!(['0', '1', '2', '3', '4', '5', '6', ',', '.', '-',
              '+'].includes(convert[i]))) {
              this.backFormat = 'incorrectInput';
              return false;
            }
            break;
          case 'octal':
            if (!(['0', '1', '2', '3', '4', '5', '6', '7', ',', '.', '-',
              '+'].includes(convert[i]))) {
              this.backFormat = 'incorrectInput';
              return false;
            }
            break;
          case 'novenary':
            if (!(['0', '1', '2', '3', '4', '5', '6', '7', '8',
              ',', '.', '-', '+'].includes(convert[i]))) {
              this.backFormat = 'incorrectInput';
              return false;
            }
            break;
          case 'decimal':
            if (!(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
              ',', '.', '-', '+'].includes(convert[i]))) {
              this.backFormat = 'incorrectInput';
              return false;
            }
            break;
          case 'hex':
            if (!(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
              ',', '.', '-', '+'].includes(convert[i]))) {
              this.backFormat = 'incorrectInput';
              return false;
            }
            break;
          default:
        }
        if (convert[i] === '-') {
          // TODO only placeholder until subtraction works
          this.backFormat = 'incorrectInput';
          return false;
        }
        if ((convert[i] === '+' || convert[i] === '-') && i > 1) {
          this.backFormat = 'incorrectInput';
          return false;
        }
        if (convert[i] === '.' || convert[i] === ',') {
          if (commaFound === false) {
            commaFound = true;
          } else {
            this.backFormat = 'incorrectInput';
            return false;
          }
        }
      }
      return true;
    },
    downloadPdf() {
      this.recalculate();
      const descr = new pdf.PdfDescription(this, this.watcher);
      descr.generatePdf();
    },
    computeSolution() {
      // calc solution
      const polyadicSolution = new solution.PolyadicSolution();
      polyadicSolution.calcArithmeticSolution(
        this.inputNums[0].replace(',', '.'),
        this.inputNums[1].replace(',', '.'),
        this.power,
        this.operator,
      );
      this.watcher = JSON.parse(JSON.stringify(polyadicSolution.watcher));
      this.solution = polyadicSolution.result;
      // construct description
      const descr = new description.DescriptionPolyadicSolution(this, this.watcher);
      descr.makeDescription(
        this.inputNums[0].replace(',', '.'),
        this.inputNums[1].replace(',', '.'),
        this.power,
        this.operator,
      );
      this.solutionSteps = descr.result;
      this.solutionObject = polyadicSolution.resultObject;
      this.modus = polyadicSolution.modus;
      this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset(); // https://github.com/mathjax/MathJax/issues/2557
        }
      });
    },
    checkSolution() {
      if (this.solution === this.propSol) {
        this.backSol = 'correctInput';
      } else {
        this.backSol = 'incorrectInput';
      }
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

.numberInput{
  line-height: 2;
  margin: 10px;
  display: inline-block;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: $transparentWhite;
  position: relative;
}

.numberInput tr td{
  padding: 5px 7.5px;
  line-height: 2;
  margin: 10px;
  display: inline-block;
  border-radius: 10px;
  border: none;
  background: $transparentWhite;
  position: relative;
}

.numberInput tr td:first-child {
  padding-left: 0;
}

.numberInput tr td:last-child {
  padding-right: 0;
}

.formatContainer {
  display: inline-flex;
  flex-direction: row;
  margin: 10px;
  font-size: 14px;
  color: white !important;
}

.mobile_formatContainer {
  position: relative;
  right: -10%;
  width: 100%;
  display: inline-flex;
  flex-direction: column;
  font-size: 14px;
}

.bits {
  position: relative;
  margin: 10px;
  font-size: 14px;
  color: white;
  width: 80px;
  height: 40px;
  line-height: 40px;
  background: $freshBlue;
  break-after: auto;
}
.bits :deep(select) {
  color: white;
  background: #0d336f;
}

.bits selectBox {
  width: 80% !important;
  border: none;
  background-color: transparent;
}

.mobile_bits {
  height: 40px;
  line-height: 40px;
  color: white;
  background: $freshBlue;
  border-right: 1px solid white;
}

.mobile_bits :deep(select) {
  color: white;
  background: #0d336f;
}

.mobile_bits selectBox {
  width: 60% !important;
  border: none;
  background-color: transparent;
  color: white !important;
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

.pdfGen{
  margin-left: 0;
  display: inline-flex;
  flex-direction: row;
  position: absolute;
  width: 40px;
  height: 40px;
  right: 180px;
  top: 0px;
  line-height: 40px;
}

.mobile_pdfGen{
  margin-left: 0;
  text-align:center;
  position: relative;
  width: 40px;
  height: 40px;
  top: 0px;
  line-height: 40px;
}

#jaxHelper {
  visibility: hidden;
}

.solutionInput {
  display: inline-block;
}

.correctInput {
  background: $lightAzure;
}

.incorrectInput {
  background: $lightRed;
}

#solutionInput {
  width: 200px;
}

@media(max-width: 750px){
  .formatContainer{
    display: none;
  };
  .pdfGen {
    display: none;
  }
}
@media(min-width: 751px){
  .mobile_formatContainer{
    display: none;
  };
  .mobile_pdfGen{
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
