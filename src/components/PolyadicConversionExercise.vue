<template>
  <div class="fp-exercise">
    <h4>{{$t('generateEx')}}</h4>
    <div class="divMargin"/>
    <button v-on:click="generateExercise">{{$t('generate')}}</button>
    <div id="exerciseField" v-html="exerciseText"></div>
    <h4>{{$t('ownSolution')}}</h4>
    <div class="solutionArea">
      <div class="solutionInput">
        <p>{{$t('signBit')}}</p>
        <input id="prop" :class="back" v-model="prop">
      </div>
      <button id="checkSolution" @click="checkSolution">{{$t('check')}}</button>
    </div>
    <h4>{{$t('correctSolution')}}</h4>
    <div style="position: relative">
      <div>
        <label class="attention">{{$t('attSolve')}}</label>
      </div>
      <div class="pdfGen">
        <button v-on:click="downloadPdf" v-if="this.solution">{{$t('getDescription')}}</button>
      </div>
    </div><div id="solution">
    <Accordion :solutionDescription="solDescr">
      <p v-for="(panel, index) in solDescr" :slot="'slot'+index" v-bind:key="panel.name">
        {{panel.text}}
        <span v-if="index === solDescr.length - 1">{{solution}}</span>
      </p>
    </Accordion>
  </div>
  </div>
</template>

<script>
/* eslint no-useless-escape: 0  no-case-declarations: 0 */
import SolutionAccordion from './SolutionAccordion.vue';
import * as solution from '../scripts/polyadicSolution';
import * as description from '../scripts/DescriptionPolyadicConversion';
import * as pdf from '../scripts/generatePdfPolyadicConversion';

export default {
  name: 'PolyadicConversionExercise',
  components: {
    Accordion: SolutionAccordion,
  },
  data() {
    return {
      selectedFormat: ['decimal', 'binary'], // 0: in format, 1: out format
      power: [10, 10],
      mouseDown: false,
      solution: '',
      generated: false,
      solutionObject: '',
      solutionSteps: [],
      falseFormatOutput: 'Falsches Format!',
      containerWidth: 500,
      exerciseText: '',
      watcher: '',
      prop: '',
      back: '',
      inputNum: '',
      modus: '',
    };
  },
  computed: {
    solDescr() {
      return this.solutionSteps;
    },
    formatOptions() {
      return {
        decimal: `${this.$t('decimal')} (92,14)`,
        binary: `${this.$t('binary')} (1,0011)`,
        ternary: `${this.$t('ternary')} (2122,01)`,
        quaternary: `${this.$t('quaternary')} (2132,03)`,
        quinary: `${this.$t('quinary')} (4322,41)`,
        senary: `${this.$t('senary')} (2523,04)`,
        septary: `${this.$t('septenary')} (6162,51)`,
        octal: `${this.$t('octal')} (6373,01)`,
        novenary: `${this.$t('novenary')} (8823,65)`,
        hex: `${this.$t('hexadecimal')} (A53F0,08)`,
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.containerWidth = Math.min(500, window.innerWidth - 250);
      });
      window.addEventListener('unload', () => {
        this.containerWidth = Math.min(500, window.innerWidth - 250);
      });
      if (this.default) {
        this.recalculate();
        this.drawExercise();
        this.generated = true;
      }
    });
  },
  methods: {
    recalculate() {
      this.computeSolution();
      this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset(); // https://github.com/mathjax/MathJax/issues/2557
        }
      });
    },
    drawExercise() {
      this.exerciseText = `${this.$t('polyadicExercise1')} ${this.inputNum} ${this.$t('polyadicExercise2')} ${this.formatOptions[this.selectedFormat[0]]} ${this.$t('polyadicExercise3')} "${this.formatOptions[this.selectedFormat[1]]}".`;
      this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset();
        }
      });
    },
    generateExercise() {
      // choose formats
      const formats = Object.keys(this.formatOptions);
      const format1 = formats[Math.floor(Math.random() * formats.length)];
      const indexFormat1 = formats.indexOf(format1);
      if (indexFormat1 > -1) {
        formats.splice(indexFormat1, 1);
      }
      const format2 = formats[Math.floor(Math.random() * formats.length)];
      this.selectedFormat = [format1, format2];
      // generate input number
      let number = '';
      const digitsBeforeComma = Math.floor(Math.random() * 8);
      const digitsAfterComma = Math.floor(Math.random() * 8);
      let digitValues = [];
      switch (format1) {
        case 'binary':
          this.power[0] = 2;
          digitValues = ['0', '1'];
          break;
        case 'ternary':
          this.power[0] = 3;
          digitValues = ['0', '1', '2'];
          break;
        case 'quaternary':
          this.power[0] = 4;
          digitValues = ['0', '1', '2', '3'];
          break;
        case 'quinary':
          this.power[0] = 5;
          digitValues = ['0', '1', '2', '3', '4'];
          break;
        case 'senary':
          this.power[0] = 6;
          digitValues = ['0', '1', '2', '3', '4', '5'];
          break;
        case 'septenary':
          this.power[0] = 7;
          digitValues = ['0', '1', '2', '3', '4', '5', '6'];
          break;
        case 'octal':
          this.power[0] = 8;
          digitValues = ['0', '1', '2', '3', '4', '5', '6', '7'];
          break;
        case 'novenary':
          this.power[0] = 9;
          digitValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
          break;
        case 'decimal':
          this.power[0] = 10;
          digitValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
          break;
        case 'hex':
          this.power[0] = 16;
          digitValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
          break;
        default:
      }
      switch (format2) {
        case 'binary':
          this.power[1] = 2;
          break;
        case 'ternary':
          this.power[1] = 3;
          break;
        case 'quaternary':
          this.power[1] = 4;
          break;
        case 'quinary':
          this.power[1] = 5;
          break;
        case 'senary':
          this.power[1] = 6;
          break;
        case 'septenary':
          this.power[1] = 7;
          break;
        case 'octal':
          this.power[1] = 8;
          break;
        case 'novenary':
          this.power[1] = 9;
          break;
        case 'decimal':
          this.power[1] = 10;
          break;
        case 'hex':
          this.power[1] = 16;
          break;
        default:
      }

      if (digitsBeforeComma > 0) {
        for (let i = 0; i < digitsBeforeComma; i += 1) {
          number += digitValues[Math.floor(Math.random() * digitValues.length)];
        }
      } else {
        number = '0';
      }
      if (digitsAfterComma > 0) {
        number += '.';
        for (let i = 0; i < digitsAfterComma; i += 1) {
          number += digitValues[Math.floor(Math.random() * digitValues.length)];
        }
      }

      if (((digitsBeforeComma > 0) || (digitsAfterComma > 0)) && (Math.random() < 0.5)) {
        number = `-${number}`;
      }
      this.inputNum = number;
      this.generated = true;
      this.recalculate();
      this.drawExercise();
      this.saveVals();
    },
    downloadPdf() {
      this.recalculate();
      const descr = new pdf.PdfDescription(this, this.watcher);
      descr.generatePdf();
    },
    computeSolution() {
      // calc solution
      const polyadicSolution = new solution.PolyadicSolution();
      polyadicSolution.convertFormat(this.inputNum, this.power[0], this.power[1]);
      this.watcher = JSON.parse(JSON.stringify(polyadicSolution.watcher));
      this.solution = polyadicSolution.result;
      // construct description
      const descr = new description.DescriptionPolyadicConversion(this, this.watcher);
      descr.makeDescription(polyadicSolution.modus, this.selectedFormat);
      this.solutionSteps = descr.result;
      this.solutionObject = polyadicSolution.resultObject;
      this.modus = polyadicSolution.modus;
    },
    checkSolution() {
      if (this.solutionObject.bitStrint === this.propSol) {
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
  },
};
</script>

<style scoped lang="scss">
$arrow-size: 12px;

#exerciseField {
  width: 663px;
  display: block;
  margin: 15px auto;
  text-align: justify;
  background: $transparentWhite;
  padding: 10px 15px;
  border-radius: 10px;
  white-space: pre-line;
}

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
.bits::v-deep select {
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

.mobile_bits::v-deep select {
  color: white;
  background: #0d336f;
}

.mobile_bits selectBox {
  width: 60% !important;
  border: none;
  background-color: transparent;
  color: white !important;
}

.fraction{
  height: 40px;
  line-height: 40px;
  background: $freshBlue;
  color: white;
  position: relative;
  user-select: none;
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
  .slider{
    display: none;
  };
  .bits{
    display: none;
  };
  .sign{
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
  .mobile_slider{
    display: none;
  };
  .mobile_bits{
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
