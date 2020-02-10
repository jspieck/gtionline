<template>
  <div class="kvDiagram">
    <h2>KV Diagramm</h2>
    <div>
      <label>Anzahl an Variablen:</label>
      <div class="divMargin"/>
      <FSelect :sel="selectedFormat[0]" @input="selectOp" :num=0
              :options="operationOptions"/>
      <div class="divMargin"/>
      <button @click="setNumVar()">Bestätigen</button>
    </div>
    <div class="mtop">
      <label>Benennung der Variablen:</label>
      <div class="divMargin"/>
      <p-radio v-for="radio in radios" name="varRadio" class="p-default p-round p-smooth p-pulse"
      :key="radio.value" color="primary" v-model="varNamingScheme" :value="radio.value"
      @change="changeFormat">
        <p class="mj" ref="radios">{{radio.name}}</p>
      </p-radio>
    </div>
    <svg id="kvContainer" :width="svgWidth" :height="svgHeight">
      <g v-for="(d, i) in diagram" v-bind:key="`cell_${i}`"
      :transform="`translate(${getX(i)}, ${getY(i)})`">
        <rect fill="white" stroke="#898989" :width="blockWidth" :height="blockWidth"
        @click="changeNumber(i)"/>
        <text :x="blockWidth / 2" :y="blockWidth / 2" dominant-baseline="middle"
        class="unclickable" text-anchor="middle">{{legitStates[d.number]}}</text>
        <text :x="blockWidth - 3" :y="blockWidth - 7" dominant-baseline="middle"
        class="unclickable indexNumber" text-anchor="end">{{indices[i].index}}</text>
      </g>
      <g v-for="bar in literalBars" v-bind:key="bar.id">
        <rect :x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height"/>
        <text ref="literalBars" :x="bar.textX" :y="bar.textY" style="visibility:hidden">
          {{getId(bar.index)}}
        </text>
      </g>
      <rect class="unclickable" fill="transparent" stroke="black" :x="paddingHorizontal"
      :y="paddingVertical" :width="blockWidth * cellsHorizontal"
      :height="blockWidth * cellsVertical"/>
    </svg>
  </div>
</template>

<script>
import FormatSelect from './FormatSelect.vue';

export default {
  name: 'KVDiagram',
  components: {
    FSelect: FormatSelect,
  },
  data() {
    return {
      numVariables: 4,
      paddingBase: 25,
      blockWidth: 40,
      diagram: [],
      legitStates: ['0', '1', '-'],
      barHeight: 3,
      barDistance: 10,
      selectedFormat: [4],
      operationOptions: {
        1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7,
      },
      radios: [
        { value: 'abc', name: '\\(a, b, \\dots\\)' },
        { value: 'xyz', name: '\\(x, y, \\dots\\)' },
        { value: 'x', name: '\\(x_0, x_1, \\dots\\)' },
      ],
      varNamingScheme: 'abc',
      varNames: {
        abc: ['\\(a\\)', '\\(b\\)', '\\(c\\)', '\\(d\\)', '\\(e\\)', '\\(f\\)', '\\(g\\)'],
        xyz: ['\\(x\\)', '\\(y\\)', '\\(z\\)', '\\(u\\)', '\\(v\\)', '\\(w\\)', '\\(q\\)'],
        x: ['\\(x_0\\)', '\\(x_1\\)', '\\(x_2\\)', '\\(x_3\\)', '\\(x_4\\)', '\\(x_5\\)', '\\(x_6\\)'],
      },
      temporaryElements: [],
    };
  },
  created() {
    for (let i = 0; i < this.cellsHorizontal * this.cellsVertical; i += 1) {
      this.diagram.push({ number: 0 });
    }
  },
  mounted() {
    if (window.MathJax) {
      window.MathJax.Hub.Config({
        skipStartupTypeset: true,
      });
      for (const radio of this.$refs.radios) {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, radio]);
      }
      this.renderMathJaxInSvg();
    }
  },
  computed: {
    cellsHorizontal() {
      return (2 ** Math.floor((this.numVariables + 1) / 2));
    },
    cellsVertical() {
      return (2 ** Math.floor(this.numVariables / 2));
    },
    paddingHorizontal() {
      return 10 + this.paddingBase * (Math.floor(Math.abs(this.numVariables - 2) / 4) + 1);
    },
    paddingVertical() {
      return 7 + this.paddingBase * (Math.floor(Math.abs(this.numVariables - 1) / 4) + 1);
    },
    svgWidth() {
      return this.paddingHorizontal * 2 + this.cellsHorizontal * this.blockWidth;
    },
    svgHeight() {
      return this.paddingVertical * 2 + this.cellsVertical * this.blockWidth;
    },
    coveredAreaPerVariable() {
      const coveredRows = [];
      for (let i = 0; i < this.numVariables; i += 1) {
        const order = Math.floor(i / 2);
        const index = 2 ** order;
        const coveredVar = [];
        for (let j = index; j < 2 * index; j += 1) {
          coveredVar.push(j);
        }
        // mirror all the covered cells before
        for (let j = i - 2; j >= 0; j -= 2) {
          const covered = coveredRows[j];
          const coveredLength = covered.length;
          for (let k = 0; k < coveredLength; k += 1) {
            covered[2 * coveredLength - 1 - k] = (2 * index - 1 - covered[k]);
          }
          coveredRows[j] = covered;
        }
        coveredRows.push(coveredVar);
      }
      const coveredAreaPerVar = [];
      for (let i = 0; i < this.numVariables; i += 1) {
        coveredAreaPerVar.push({
          isVertical: i % 2 === 0,
          varIndex: i,
          coveredRows: coveredRows[i],
        });
      }
      return coveredAreaPerVar;
    },
    indices() {
      const arr = [];
      for (let i = 0; i < this.cellsHorizontal * this.cellsVertical; i += 1) {
        const x = (i % this.cellsHorizontal);
        const y = Math.floor(i / this.cellsHorizontal);
        let index = '';
        for (const c of this.coveredAreaPerVariable) {
          if (c.isVertical) {
            index += c.coveredRows.includes(x) ? '1' : '0';
          } else {
            index += c.coveredRows.includes(y) ? '1' : '0';
          }
        }
        arr.push({
          binary: index,
          index: parseInt(index.split('').reverse().join(''), 2),
        });
      }
      return arr;
    },
    literalBars() {
      const bars = [];
      for (const c of this.coveredAreaPerVariable) {
        let startIndex = c.coveredRows[0];
        let endIndex = c.coveredRows[0];
        const intervals = [];
        for (let i = 1; i < c.coveredRows.length; i += 1) {
          if (c.coveredRows[i] === endIndex + 1) {
            endIndex += 1;
          } else {
            intervals.push([startIndex, endIndex]);
            startIndex = c.coveredRows[i];
            endIndex = c.coveredRows[i];
          }
        }
        intervals.push([startIndex, endIndex]);
        for (const [i, interval] of intervals.entries()) {
          const intervalLength = (interval[1] - interval[0] + 1) * this.blockWidth;
          const width = c.isVertical ? intervalLength : this.barHeight;
          const height = c.isVertical ? this.barHeight : intervalLength;
          const index = c.varIndex;
          // String.fromCharCode(97 + c.varIndex);
          const id = `bar${c.varIndex}_${i}`;
          const level = Math.floor(c.varIndex / 4);
          const dist = this.barDistance + this.paddingBase * level;
          let x = 0;
          let y = 0;
          let textX = 0;
          let textY = 0;
          if (c.isVertical) {
            x = this.paddingHorizontal + interval[0] * this.blockWidth;
            y = c.varIndex % 4 === 0
              ? this.paddingVertical - dist
              : this.paddingVertical + this.blockWidth * this.cellsVertical + dist;
            textX = x + width / 2;
            textY = c.varIndex % 4 === 0 ? y - 8 : y + 16;
          } else {
            x = (c.varIndex + 1) % 4 === 0
              ? this.paddingHorizontal + this.blockWidth * this.cellsHorizontal + dist
              : this.paddingHorizontal - dist;
            y = this.paddingVertical + interval[0] * this.blockWidth;
            textX = (c.varIndex + 1) % 4 === 0 ? x + 16 : x - 10;
            textY = y + height / 2;
          }
          bars.push({
            x, y, width, height, textX, textY, index, id,
          });
        }
      }
      return bars;
    },
  },
  methods: {
    getId(i) {
      console.log(this.varNames[this.varNamingScheme][i]);
      return this.varNames[this.varNamingScheme][i];
    },
    selectOp(num, val) {
      this.selectedFormat[num] = val;
    },
    getX(i) {
      return this.paddingHorizontal + (i % this.cellsHorizontal) * this.blockWidth;
    },
    getY(i) {
      return this.paddingVertical + Math.floor(i / this.cellsHorizontal) * this.blockWidth;
    },
    changeNumber(i) {
      this.$set(this.diagram[i], 'number', (this.diagram[i].number + 1) % this.legitStates.length);
    },
    setNumVar() {
      // const numVarsBefore = this.numVariables;
      const [numVar] = this.selectedFormat[0];
      this.numVariables = parseInt(numVar, 10);
      this.diagram = [];
      for (let i = 0; i < this.cellsHorizontal * this.cellsVertical; i += 1) {
        this.diagram.push({ number: 0 });
      }
      this.$nextTick(() => {
        this.renderMathJaxInSvg();
      });
    },
    changeFormat() {
      for (const el of this.temporaryElements) {
        el.parentNode.removeChild(el);
      }
      this.temporaryElements = [];
      this.$nextTick(() => {
        this.renderMathJaxInSvg();
      });
    },
    renderMathJaxInSvg() {
      // const scale = 0.0016;
      const scale = 0.02;
      const escapeClip = false;
      const items = [];
      for (const el of this.temporaryElements) {
        el.parentNode.removeChild(el);
      }
      this.temporaryElements = [];
      // Move the raw MathJax items to a temporary element
      const mathbucket = document.createElement('div');
      mathbucket.setAttribute('id', 'mathjaxSvgBucket');
      document.body.appendChild(mathbucket);
      // start (^): first arbitrary number of spaces, then zero or one time: l, r or c
      // then \( any chars \) or $ any chars $, finally any spaces, end ($)
      const re = /^\s*([LlRrCc]?)(\\\(.*\\\)|\$.*\$)\s*$/;
      for (const lit of this.$refs.literalBars) {
        const m = lit.textContent.match(re);
        console.log('LIT ', lit, m);
        if (m) {
          const d = document.createElement('div');
          mathbucket.appendChild(d);
          const mathmarkup = m[2].replace(/^\$(.*)\$$/,'\\($1\\)'); // eslint-disable-line
          d.appendChild(document.createTextNode(mathmarkup));
          // lit.textContent = '';
          items.push([lit, d, m[1]]);
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, d]);
        } else {
          // already rendered
          items.push([lit, lit, '']);
        }
      }
      window.MathJax.Hub.Queue(() => {
        for (let i = 0; i < items.length; i += 1) {
          const svgdest = items[i][0];
          const mathjaxdiv = items[i][1];
          // l, r or c
          const justification = items[i][2];
          // break if typesetting not yet active (vue dynamic elements)
          const svgmath = mathjaxdiv.getElementsByClassName('MathJax_SVG')[0]
            .getElementsByTagName('svg')[0];
          const svgmathinfo = {
            width: svgmath.viewBox.baseVal.width,
            height: svgmath.viewBox.baseVal.height,
          };
          // get graphics nodes
          const gnodes = svgmath.getElementsByTagName('g')[0].cloneNode(true);
          // const fontsize = svgdest.getAttribute('font-size');
          // const appliedScale = 0.02; // scale * fontsize;
          const appliedScale = scale;
          // single '+' converts to int
          const x = +svgdest.getAttribute('x');
          const y = +svgdest.getAttribute('y');

          const x0 = x;
          const y0 = y;
          let x1;
          switch (justification.toUpperCase()) {
            case 'L':
              x1 = 0;
              break;
            case 'R':
              x1 = -svgmathinfo.width;
              break;
            case 'C': // default to center
            default:
              x1 = -svgmathinfo.width * 0.5;
              break;
          }
          const y1 = svgmathinfo.height * 0;
          gnodes.setAttribute('transform', `translate(${x0} ${y0})
            scale(${appliedScale}) translate(${x1} ${y1})
            matrix(1 0 0 -1 0 0)`);
          if (escapeClip) {
            svgdest.parentNode.removeAttribute('clip-path');
          }
          // svgdest.parentNode.replaceChild(gnodes, svgdest);
          svgdest.parentNode.appendChild(gnodes);
          this.temporaryElements.push(gnodes);
        }
        const mathb = document.getElementById('mathjaxSvgBucket');
        mathb.parentNode.removeChild(mathbucket);
        mathb.style.visibility = 'hidden';
      });
    },
  },
};
</script>

<style lang="scss">
.unclickable {
  pointer-events: none;
}
.mtop {
  margin-top: 20px;
}
.mj {
  margin: 0;
  margin-left: -10px;
  display: inline-block;
}
.mj .MathJax_SVG_Display {
  margin: 0;
}
.indexNumber {
  font-size: 12px;
}
.divMargin {
  display: inline-block;
  width: 10px;
}
#kvContainer {
  margin-top: 20px;
}
.pretty {
  height: 1em;
}
</style>
