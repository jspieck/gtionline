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
              <td><input id="fpfInput1" placeholder="3,25"/></td>
              <td>
                <div class="selectBox">
                  <select id="fpfSelect1" class="fpfSelect">
                    <option>Dezimalzahl (42,14)</option>
                    <option>Binärzahl (1,0011)</option>
                    <option>IEEE (1 0101 1101)</option>
                  </select>
                  <img class="selectIcon" src="http://cdn.onlinewebfonts.com/svg/img_295694.svg">
                </div>
              </td>
            </tr>
            <tr>
              <td><input id="fpfInput2" disabled placeholder="11,01"></td>
              <td>
                <div class="selectBox">
                  <select id="fpfSelect2" class="fpfSelect">
                    <option>Binärzahl (1,0011)</option>
                    <option>IEEE (1 0101 1101)</option>
                    <option>Dezimalzahl (42,14)</option>
                  </select>
                  <img class="selectIcon" src="http://cdn.onlinewebfonts.com/svg/img_295694.svg">
                </div>
              </td>
            </tr>
          </table>
        </td>
        <td>
          <div class="operand">
            <div class="selectBox">
              <select id="operandSelect" class="operandSelect">
                <option>Addition (+)</option>
                <option>Subtraktion (-)</option>
                <option>Multiplikation (*)</option>
              </select>
              <img class="selectIcon" src="http://cdn.onlinewebfonts.com/svg/img_295694.svg">
            </div>
          </div>
        </td>
        <td>
          <table id="fpfTable2" class="floatingPointInput">
            <tr>
              <td><input id="fpfInput3" placeholder="3,25"/></td>
              <td>
                <div class="selectBox">
                  <select id="fpfSelect3" class="fpfSelect">
                    <option>Dezimalzahl (42,14)</option>
                    <option>Binärzahl (1,0011)</option>
                    <option>IEEE (1 0101 1101)</option>
                  </select>
                  <img class="selectIcon" src="http://cdn.onlinewebfonts.com/svg/img_295694.svg">
                </div>
              </td>
            </tr>
            <tr>
              <td><input id="fpfInput4" disabled placeholder="11,01"></td>
              <td>
                <div class="selectBox">
                  <select id="fpfSelect4" class="fpfSelect">
                    <option>Binärzahl (1,0011)</option>
                    <option>IEEE (1 0101 1101)</option>
                    <option>Dezimalzahl (42,14)</option>
                  </select>
                  <img class="selectIcon" src="http://cdn.onlinewebfonts.com/svg/img_295694.svg">
                </div>
              </td>
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
export default {
  name: 'FloatingPointArithmetic',
  data() {
    return {
      mouseDown: false,
      exponentBits: 4,
      numBits: 32,
      containerWidth: 500,
    };
  },
  methods: {
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

select{
  -webkit-appearance: button;
  border: none;
  font-size: 13px;
  list-style: none;
  outline: none;
  overflow: hidden;
  text-align: left;
  text-decoration: none;
  vertical-align: middle;
  width: 175px;
  background-color: transparent;
  color: #202124!important;
  height: 36px;
  padding-left: 8px;
  background-image: none;
}

.floatingPointInput{
  margin: 10px;
  display: inline-block;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #d8d8d8;
  position: relative;
}

.selectBox{
  position: relative;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #DFE1E5;
}

.selectIcon{
  position:absolute;
  right: 10px;
  top: 11px;
  width: 15px;
  height: 15px;
  pointer-events: none;
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
