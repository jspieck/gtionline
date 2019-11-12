<template>
  <!--v-on:mouseenter="sliderMouseUp" v-on:mouseleave="sliderMouseUp"
  v-on:mouseup="sliderMouseUp"-->
  <div class="fp-arithmetic">
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
      containerWidth: 750,
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
$arrow-size: 15px;
$freshBlue: #0f213e;
$freshYellow: #f1c40f;
$freshRed: #fd4136;
$lightGreen: #1abc9c;
$darkGreen: #2c3e50;

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
}
.expandFraction{
    position: absolute;
    width: 40px;
    height: 40px;
    display: block;
    left: 0px;
    top: 0px;
    line-height: 40px;
}
.expandExponent:hover{
  cursor: pointer;
}
.expandFraction:hover{
  cursor: pointer;
}
.arrowRight {
  width: $arrow-size;
  height: $arrow-size;
  background-color: $freshYellow;
  position: absolute;
  top: 50%;
  left: 35%;
  transform: translate(-50%, -50%) rotate(225deg);
  animation: paintArrow 10s ease-in-out infinite;
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
  animation: paint 10s ease-in-out infinite,
             flip 10s ease-in-out infinite;
}
.arrowLeft {
  width: $arrow-size;
  height: $arrow-size;
  background-color: $freshYellow;
  position: absolute;
  top: 50%;
  left: 65%;
  transform: translate(-50%, -50%) rotate(45deg);
  animation: paintArrow 10s ease-in-out infinite;
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
  animation: paint 10s ease-in-out infinite,
             flip 10s ease-in-out infinite;
}
</style>
