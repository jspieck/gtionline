<template>
  <div class="fp-exercise">
    <h4>{{$t('generateEx')}}</h4>
    <FSelect :sel="selectedFormat[0]" @input="selectOp" :num=0
              :options="operationOptions"/>
    <div class="divMargin"/>
    <button v-on:click="generateExercise">{{$t('generate')}}</button>
    <div id="exerciseField" v-html="exerciseText"></div>
    <h4>{{$t('ownSolution')}}</h4>
    <label class="attention">{{$t('attRound')}}</label>
    <div class="solutionArea">
      <div class="solutionInput">
        <p>{{$t('signBit')}}</p>
        <input id="propVB" :class="backVB" v-model="propVB">
      </div>
      <div class="divMargin"/>
      <div class="solutionInput">
        <p>{{$t('exponentBits')}}</p>
        <input id="propE" :class="backE" v-model="propE">
      </div>
      <div class="divMargin"/>
      <div class="solutionInput">
        <p>{{$t('fractionBits')}}</p>
        <input id="propM" :class="backM" v-model="propM">
      </div>
      <div class="divMargin"/>
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
    </div>
    <div id="solution">
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
import * as randomIEEE from '../scripts/randomIEEE';
import FormatSelect from './FormatSelect.vue';
import SolutionAccordion from './SolutionAccordion.vue';
import * as solution from '../scripts/ieeeSolution';
import * as checker from '../scripts/checkSolution';
import * as description from '../scripts/DescriptionSolution';
import * as pdf from '../scripts/generatePdf';

export default {
  name: 'FloatingPointArithmetic',
  components: {
    FSelect: FormatSelect,
    Accordion: SolutionAccordion,
  },
  data() {
    return {
      selectedFormat: ['add'],
      mouseDown: false,
      exponentBits: 4,
      numBits: 16,
      exerciseText: '',
      propVB: '',
      backVB: '',
      propE: '',
      backE: '',
      propM: '',
      backM: '',
      solution: '',
      result: { sign: 0, exponentBits: [], mantissaBits: [] },
      containerWidth: 500,
      watcher: '',
      solutionSteps: [],
      fp1: '',
      fp2: '',
    };
  },
  computed: {
    operationOptions() {
      return {
        add: `${this.$t('addition')} (+)`,
        sub: `${this.$t('subtraction')} (-)`,
        mul: `${this.$t('multiplication')} (*)`,
        div: `${this.$t('division')} (/)`,
      };
    },
    solDescr() {
      return this.solutionSteps;
    },
  },
  methods: {
    downloadPdf() {
      this.computeSolution();
      const descr = new pdf.PdfDescription(
        this,
        this.exponentBits,
        this.numBits,
        this.watcher,
      );
      descr.generatePdf(this.fp1, this.fp2, this.solution, this.selectedFormat[0], 'ieee', 'ieee');
    },
    checkSolution() {
      const checkSolution = new checker.CheckSolution(this.exponentBits);
      checkSolution.checkSolution(this.result, this.propVB, this.propE, this.propM);
      this.backVB = checkSolution.backVB;
      this.backE = checkSolution.backE;
      this.backM = checkSolution.backM;
    },
    generateExercise() {
      const operation = this.selectedFormat[0];
      const opNames = {
        add: [this.$t('addition'), '+'],
        mul: [this.$t('multiplication'), '\\cdot'],
        sub: [this.$t('subtraction'), '-'],
        div: [this.$t('division'), '/'],
      };
      const random = new randomIEEE.RandomIEEE(this.exponentBits, this.numBits);
      random.generateRandomIEEE();
      this.fp1 = random.result;
      random.generateRandomIEEE();
      this.fp2 = random.result;
      this.exerciseText = `Es seien die Gleitkommazahlen \\( fp_1 \\) und \\( fp_2 \\) im 16 Bit Gleitkommaformat gegeben. Berechnen Sie die ${opNames[operation][0]} \\( fp_1 ${opNames[operation][1]} fp_2 \\) ohne die Binärdarstellung zu verlassen und geben Sie diese wieder als Gleitkommazahl an:

          \\( fp_1 = \\text{${this.fp1}} \\)\n
          \\( fp_2 = \\text{${this.fp2}} \\)`;
      this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset();
        }
      });
      this.computeSolution();
      this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset();
        }
      });
    },
    selectVal(num, val) {
      this.selectedFormat[num] = val;
      const nnum = num > 2 ? 1 : 0;
      this.checkAndConvertFormat(nnum);
      console.log(val);
    },
    selectOp(num, val) {
      this.selectedFormat[num] = val;
    },
    computeSolution() {
      const ieeeSolution = new solution.IEEESolution(this.exponentBits, this.numBits);
      ieeeSolution.computeSolution(this.fp1, this.fp2, this.selectedFormat[0]);
      const watcher = ieeeSolution.watcher;
      this.watcher = watcher;
      this.solution = ieeeSolution.result;
      this.result = ieeeSolution.resultObject;

      const descr = new description.DescriptionSolution(
        this,
        this.exponentBits,
        this.numBits,
        watcher,
      );
      descr.makeDescription(this.fp1, this.fp2, this.solution, this.selectedFormat[0]);
      this.solutionSteps = descr.result;
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

.fpOperationTable{
  margin: auto;
  margin-top: 20px;
}

.divMargin{
  display: inline-block;
  width: 10px;
}

.operand{
  position: relative;
  display: inline-block;
  margin: 10px;
}

.floatingPointInput{
  margin: 10px;
  display: inline-block;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d8d8d8;
  position: relative;
}

.formatContainer {
  display: inline-flex;
  flex-direction: row;
  margin: 10px;
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

.sign {
  width: 40px;
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

.fraction{
  height: 40px;
  line-height: 40px;
  background: $freshBlue;
  color: white;
  position: relative;
  user-select: none;
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

@media screen and (max-width: 815px) {
  #exerciseField {
    width: 90%;
  }
}
</style>
