<template>
  <!--v-on:mouseenter="sliderMouseUp" v-on:mouseleave="sliderMouseUp"
  v-on:mouseup="sliderMouseUp"-->
  <div class="fp-arithmetic">
    <h4>{{$t('fpformat')}}</h4>
    <div class="bits">
      <FSelect :num="5" :sel="selectedFormat[5]" @input="selectBitRange"
               :options="bitrangeOptions">
      </FSelect>
    </div>
    <div class="formatContainer" v-on:mousemove="sliderMouseMove">
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
    <div class="pdfGen">
      <button v-on:click="downloadPdf" v-if="this.solution">{{$t('getDescription')}}</button>
    </div>
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
import * as description from './DescriptionSolution';
import * as pdf from './generatePdf';

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
      exponentBits: 5,
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
        eight: '8 bit',
        sixteen: '16 bit',
        thirtytwo: '32 bit',
        // sixtyfour: '64 bit',
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
    });
  },
  methods: {
    recalculate() {
      this.containerWidth = Math.min(500, window.innerWidth - 250);
      this.convertFormat(0);
      this.convertFormat(1);
      this.computeSolution();
      this.solDescrActive();
      this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset(); // https://github.com/mathjax/MathJax/issues/2557
        }
      });
    },
    selectBitRange(num, val) {
      this.selectedFormat[num] = val;
      console.log(this.selectedFormat[num]);
      if (val === 'eight') {
        this.numBits = 8;
        this.exponentBits = 3;
      } else if (val === 'sixteen') {
        this.numBits = 16;
        this.exponentBits = 5;
      } else if (val === 'thirtytwo') {
        this.numBits = 32;
        this.exponentBits = 8;
      }
      this.recalculate();
    },
    selectVal(num, val) {
      this.selectedFormat[num] = val;
      const nnum = num > 2 ? 1 : 0;
      this.checkAndConvertFormat(nnum);
      console.log(val);
    },
    selectOp(num, val) {
      this.selectedFormat[num] = val;
      this.recalculate();
    },
    checkFormat(format, conv) {
      let commaOccured = false;
      const convert = conv.replace(/\s/g, '');
      if (format === 'ieee' && convert.length !== this.numBits) {
        return false;
      }
      for (let i = 0; i < convert.length; i += 1) {
        if (format === 'binary') {
          if (!(['0', '1', ',', '.', '-', '+'].includes(convert[i]))) {
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
            ',', '.', '-', '+'].includes(convert[i]))) {
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
    downloadPdf() {
      this.recalculate();
      this.pdf = (new pdf.PdfDescription(this)).pdf;
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
      this.solutionSteps = (new description.DescriptionSolution(this)).description;
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
        mantisse = tool.roundArray(mantisse, numBitsMantisse);
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
      this.recalculate();
    },
    expandExponent() {
      this.exponentBits += 1;
      this.recalculate();
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
  float: right;
  position: relative;
  margin: 10px;
  font-size: 14px;
  color: white !important;
  width: 80px;
  height: 40px;
  line-height: 40px;
  background: $freshBlue;
  break-after: auto;
}

.bits .selectBox {
  border: none;
  background-color: transparent;
  color: white !important;
}

.mobile_bits {
  width: 80%;
  height: 40px;
  line-height: 40px;
  color: white;
  background: $freshBlue;
  border-right: 1px solid white;
}

.mobile_bits .selectBox {
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

.pdfGen{
  float: right;
  display: inline-flex;
  flex-direction: row;
  position: relative;
  width: 40px;
  height: 40px;
  right: 0px;
  top: 0px;
  line-height: 40px;
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
  .mobile_bits{
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
