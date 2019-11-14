<template>
  <!--v-on:mouseenter="sliderMouseUp" v-on:mouseleave="sliderMouseUp"
  v-on:mouseup="sliderMouseUp"-->
  <div class="fp-arithmetic">
    <h4>Floating Point Format</h4>
    <div class="formatContainer" v-on:mousemove="sliderMouseMove">
      <div class="sign">VB</div>
      <div class="exponent" :style="{ width:
        (60 + this.exponentBits * (containerWidth/numBits))+ 'px' }">
        <div v-on:click="expandFraction" class="expandExponent">
          <div class="arrowLeft">
            <div class='arrowRightMask '></div>
          </div>
        </div>
        E({{exponentBits}})
        <div v-on:mousedown="sliderMouseDown" class="slider"/>
      </div>
      <div class="fraction" :style="{ width: (60 + (numBits - exponentBits) *
        (containerWidth/numBits)) + 'px' }">
        <div v-on:click="expandExponent" class="expandFraction">
          <div class="arrowRight">
            <div class="arrowLeftMask"></div>
          </div>
        </div>
        M({{(numBits - exponentBits)}})
      </div>
    </div>
    <h4>Operationsauswahl</h4>
    <table id="fpOperationTable" class="fpOperationTable">
      <tr>
        <td>Erste Gleitkommazahl</td>
        <td>Operand</td>
        <td>Zweite Gleitkommazahl</td>
      </tr>
      <tr>
        <td>
          <table id="fpfTable1" class="floatingPointInput">
            <tr>
              <td>
                <input id="fpfInput0" placeholder="3" @input="convertFormat(0)"/>
              </td>
              <td><FSelect :num="0" :sel="selectedFormat[0]" @input="selectVal"
                :options="formatOptions"/></td>
            </tr>
            <tr>
              <td><input id="fpfInput1" disabled placeholder="0 1000 10000000000"></td>
              <td><FSelect :num="1" :sel="selectedFormat[1]" @input="selectVal"
                :options="formatOptions"/></td>
            </tr>
          </table>
        </td>
        <td>
          <div class="operand">
            <FSelect :num="2" :sel="selectedFormat[2]" :options="operationOptions"/>
          </div>
        </td>
        <td>
          <table id="fpfTable2" class="floatingPointInput">
            <tr>
              <td><input id="fpfInput2" placeholder="3" @input="convertFormat(1)"></td>
              <td><FSelect :num="3" :sel="selectedFormat[3]" @input="selectVal"
                :options="formatOptions"/></td>
            </tr>
            <tr>
              <td><input id="fpfInput3" disabled placeholder="0 1000 10000000000"></td>
              <td><FSelect :num="4" :sel="selectedFormat[4]" @input="selectVal"
                :options="formatOptions"/></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <h4>Lösung</h4>
    <div class="solutionArea">
      <input id="solutionInput">
      <div class="divMargin"/>
      <button id="checkSolution">Check</button>
    </div>
  </div>
</template>

<script>
// import GtiTools from '../scripts/gti-tools';
import FormatSelect from './FormatSelect.vue';

export default {
  name: 'FloatingPointArithmetic',
  components: {
    FSelect: FormatSelect,
  },
  data() {
    return {
      selectedFormat: ['decimal', 'ieee', 'add', 'decimal', 'ieee'],
      formatOptions: {
        decimal: 'Dezimalzahl (42,14)',
        binary: 'Binärzahl (1,0011)',
        ieee: 'IEEE (1 0101 1101)',
      },
      operationOptions: {
        add: 'Addition (+)',
        sub: 'Subtraktion (-)',
        mul: 'Multiplikation (*)',
      },
      mouseDown: false,
      exponentBits: 4,
      numBits: 16,
      containerWidth: 500,
    };
  },
  methods: {
    selectVal(num, val) {
      this.selectedFormat[num] = val;
      const nnum = num > 2 ? 1 : 0;
      this.convertFormat(nnum);
      console.log(val);
    },
    convertFormat(num) {
      const firstFormat = this.selectedFormat[num * 3];
      const secondFormat = this.selectedFormat[num * 3 + 1];
      const toConvert = document.getElementById(`fpfInput${num * 2}`).value;
      let converted = toConvert;
      if (firstFormat === 'binary') {
        if (secondFormat === 'decimal') {
          converted = this.binToDec(toConvert);
        } else if (secondFormat === 'ieee') {
          converted = this.binToIEEE(toConvert);
        }
      } else if (firstFormat === 'decimal') {
        if (secondFormat === 'binary') {
          converted = this.decToBin(toConvert);
        } else if (secondFormat === 'ieee') {
          converted = this.binToIEEE(this.decToBin(toConvert));
        }
      } else if (firstFormat === 'ieee') {
        if (secondFormat === 'binary') {
          converted = this.ieeeToBin(toConvert);
        } else if (secondFormat === 'decimal') {
          converted = this.binToDec(this.ieeeToBin(toConvert));
        }
      }
      document.getElementById(`fpfInput${num * 2 + 1}`).value = converted;
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
      exponent = '0'.repeat(this.exponentBits - exponent.length) + exponent;
      return `${sign} ${exponent} ${mantisse}`;
    },
    ieeeToBin(num) {
      const ieeeWithoutSpace = num.replace(' ', '');
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
        const blockSize = (this.containerWidth / this.numBits);
        if (e.pageX - this.xCoord > blockSize) {
          this.xCoord += blockSize;
          if (this.exponentBits + 1 < this.numBits) {
            this.exponentBits += 1;
          }
        }
        if (this.xCoord - e.pageX > blockSize) {
          this.xCoord -= blockSize;
          if (this.exponentBits > 1) {
            this.exponentBits -= 1;
          }
        }
      }
    },
    expandFraction() {
      this.exponentBits -= 1;
    },
    expandExponent() {
      this.exponentBits += 1;
    },
  },
};
</script>

<style scoped lang="scss">
$arrow-size: 12px;

.fpOperationTable{
  margin: auto;
  margin-top: 20px;
}

button{
  height: 36px;
  width: 70px;
  background: $freshBlue;
  border-radius: 6px;
  color: white;
  border: none;
  line-height: 28px;
  position: relative;
  cursor: pointer;

  &:hover{
    background: white;
    color: $freshBlue;
    border: 1px solid $freshBlue;
  }
}

input{
  font-size: 16px !important;
  background: white;
  border-radius: 6px;
  border: 1px solid #DFE1E5;
  color: #70757A!important;
  font-size: 14px !important;
  height: 36px;
  line-height: 28px;
  padding: 0 0 0 12px;

  &:disabled{
    background: transparent;
  }

  &::placeholder {
    color: #aaa;
  }
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

.arrowRightMask {
  width: 100%;
  height: 100%;
  background-color: $freshBlue;
  position: absolute;
  left: 15%;
  top: -15%;
  right: 0%;
  bottom: 0%;
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

.arrowLeftMask {
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
