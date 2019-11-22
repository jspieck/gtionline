<template>
  <div class="fp-exercise">
    <h4>Aufgabe Generieren</h4>
    <FSelect :sel="selectedFormat[0]" @input="selectOp" :num=0
              :options="operationOptions"/>
    <div class="divMargin"/>
    <button v-on:click="generateExercise">Generieren</button>
    <div id="exerciseField">
      <span id="exerciseText"></span>
    </div>
    <h4>Eigene Lösung</h4>
    <div class="solutionArea">
      <input id="solutionInput">
      <div class="divMargin"/>
      <button id="checkSolution">Check</button>
    </div>
    <h4>Korrekte Lösung</h4>
    <label class="attention">Bitte vorher selber versuchen, die Aufgabe zu lösen!</label>
    <Accordion :solutionDescription="solDescr"/>
  </div>
</template>

<script>
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
      selectedFormat: ['add'],
      operationOptions: {
        add: 'Addition (+)',
        sub: 'Subtraktion (-)',
        mul: 'Multiplikation (*)',
      },
      mouseDown: false,
      exponentBits: 4,
      numBits: 16,
      containerWidth: 500,
      solDescr: [
        { name: 'Schritt 1', text: 'Die Exponenten beider Zahlen müssen angeglichen werden.' },
        {
          name: 'Schritt 2',
          text: 'Die Mantissen beider Zahlen müssen multipliziert werden.',
          subpanels: [
            { name: 'Exponent beachten', text: 'Der Shift-Faktor des Exponenten muss auf die Mantissen angewendet werden.' },
            { name: 'Darstellung beachten', text: 'Die Mantisse beginnt in der Standard-Darstellung immer mit einer 1 vor dem Komma.' },
          ],
        },
        { name: 'Lösung', text: 'Die Lösung lautet <span id="solutionSpan"/>' },
      ],
    };
  },
  methods: {
    generateRandomBit() {
      return Math.round(Math.random());
    },
    generateRandomBits(n) {
      let bitString = '';
      for (let i = 0; i < n; i += 1) {
        bitString += this.generateRandomBit();
      }
      return bitString;
    },
    generateRandomIEEE() {
      return `${this.generateRandomBit()} ${this.generateRandomBits(this.exponentBits)} ${this.generateRandomBits(this.numBits - 1 - this.exponentBits)}`;
    },
    generateExercise() {
      const exerciseText = document.getElementById('exerciseText');
      const operation = this.selectedFormat[0];
      const opNames = { add: ['Addition', '+'], mul: ['Multiplikation', '\\cdot'], sub: ['Subtraktion', '-'] };
      this.fp1 = this.generateRandomIEEE();
      this.fp2 = this.generateRandomIEEE();
      exerciseText.innerText = `Es seien die Gleitkommazahlen \\( fp_1 \\) und \\( fp_2 \\) im 16 Bit Gleitkommaformat gegeben. Berechnen Sie die ${opNames[operation][0]} \\( fp_1 ${opNames[operation][1]} fp_2 \\) ohne die Binärdarstellung zu verlassen und geben Sie diese wieder als Gleitkommazahl an:
          
          \\( fp_1 = \\text{${this.fp1}} \\)\n
          \\( fp_2 = \\text{${this.fp2}} \\)`;
      this.$nextTick(() => {
        if (window.MathJax) {
          console.log('MathJax known');
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
        }
      });
      this.computeSolution(this.fp1, this.fp2);
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
    computeSolution(num1, num2) {
      if (num1 !== '' && num2 !== ''
        && num1 !== 'Falsches Format' && num2 !== 'Falsches Format') {
        const y1 = tool.getIEEEFromString(this.exponentBits, num1);
        const y2 = tool.getIEEEFromString(this.exponentBits, num2);
        console.log(y1);
        console.log(y2);
        let result = null;
        switch (this.selectedFormat[0]) {
          case 'add':
            result = new tool.AdditionIEEE(y1, y2);
            break;
          case 'mul':
            result = new tool.MultiplicationIEEE(y1, y2);
            break;
          case 'sub':
            result = new tool.SubtractionIEEE(y1, y2);
            break;
          default:
        }
        console.log(result.getResult());
        document.getElementById('solutionSpan').innerHTML = result.getResult().bitString;
      }
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
  color: $freshYellow;
  background: $freshBlue;
  border-right: 1px solid $freshYellow;
}

.exponent{
  height: 40px;
  line-height: 40px;
  background: $freshBlue;
  color: $freshYellow;
  position: relative;
  user-select: none;
  border-right: 1px solid $freshYellow;
}

.fraction{
  height: 40px;
  line-height: 40px;
  background: $freshBlue;
  color: $freshYellow;
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
  background-color: $freshYellow;
  position: absolute;
  top: 50%;
  left: 35%;
  transform: translate(-50%, -50%) rotate(225deg);
}

.arrowLeft {
  width: $arrow-size;
  height: $arrow-size;
  background-color: $freshYellow;
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
</style>
