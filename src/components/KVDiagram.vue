<template>
  <div class="kvDiagram">
    <!-- <h3>{{$t('kvDiagram')}}</h3> -->
    <div>
      <label>{{$t('numVarInput')}}:</label>
      <FSelect :sel="selectedFormat[0]" @input="selectOp" :num=0 class="leftMargin10"
              :options="operationOptions"/>
      <button @click="setNumVar()" class="leftMargin10">{{$t('confirm')}}</button>
    </div>

    <div class="mtop">
      <label>{{$t('varNaming')}}:</label>
      <div class="divMargin"/>
      <div class="radioCounter">
        <label v-for="radio in radios" :key="radio.value" class="p-default p-round p-smooth p-pulse">
          <input name="varRadio" class="mj" ref="radios" type="radio" v-model="varNamingScheme" :value="radio.value" />
          <div class="radioSvg" v-html="toSvg(radio.name)"/>
        </label>
      </div>
      <!-- <p-radio v-for="radio in radios" name="varRadio" class="p-default p-round p-smooth p-pulse"
      :key="radio.value" color="primary" v-model="varNamingScheme" :value="radio.value">
        <p class="mj" ref="radios" v-html="toSvg(radio.name)"/>
      </p-radio> -->
    </div>

    <svg id="kvContainer" :width="svgWidth" :height="svgHeight" xmlns="http://www.w3.org/2000/svg">
      <!-- <defs>
        <style type="text/css">
          @font-face {font-family: "Cambria";}
        </style>
      </defs> -->
      <g v-for="(d, i) in diagram" v-bind:key="`cell_${i}`"
      :transform="`translate(${getX(i)}, ${getY(i)})`">
        <rect fill="transparent" stroke="#898989" :width="blockWidth" :height="blockWidth"
        @click="changeNumber(i)"/>
        <text :x="blockWidth / 2" :y="blockWidth / 2" dominant-baseline="middle"
        class="unclickable" text-anchor="middle">{{legitStates[d.number]}}</text>
        <text :x="blockWidth - 3" :y="blockWidth - 7" dominant-baseline="middle"
        class="unclickable indexNumber" font-size="13" text-anchor="end">{{indices[i].index}}</text>
      </g>
      <g v-for="bar in literalBars" v-bind:key="bar.id">
        <rect :x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height"/>
        <g :transform="`translate(${bar.textX}, ${bar.textY})`" v-html="getSVG(bar.index)"></g>
      </g>
      <rect id="unclickable" class="unclickable" fill="none" stroke="black" :x="paddingHorizontal"
        :y="paddingVertical" :width="blockWidth * cellsHorizontal"
        :height="blockWidth * cellsVertical"/>
    </svg>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { KVDiagram } from '@/scripts/gti-tools';
import FormatSelect from './FormatSelect.vue';

export default {
  name: 'KVDiagram',
  components: {
    FSelect: FormatSelect,
  },
  data() {
    return {
      indexBaseSystem: 8,
      numVariables: 4,
      paddingBase: 27,
      blockWidth: 40,
      diagram: reactive([]),
      legitStates: ['0', '1', '-'],
      barHeight: 3,
      barDistance: 10,
      selectedFormat: [4],
      operationOptions: {
        1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6,
      },
      radios: [
        { value: 'abc', name: 'a, b, \\dots' },
        { value: 'xyz', name: 'x, y, \\dots' },
        { value: 'x', name: 'x_0, x_1, \\dots' },
        { value: 'x1', name: 'x_1, x_2, \\dots' },
      ],
      varNamingScheme: 'abc',
      varNames: {
        abc: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        xyz: ['x', 'y', 'z', 'u', 'v', 'w', 'q'],
        x: ['x_0', 'x_1', 'x_2', 'x_3', 'x_4', 'x_5', 'x_6'],
        x1: ['x_1', 'x_2', 'x_3', 'x_4', 'x_5', 'x_6', 'x_7'],
      },
    };
  },
  created() {
    for (let i = 0; i < this.cellsHorizontal * this.cellsVertical; i += 1) {
      this.diagram.push({ number: 0 });
    }
    if (window.MathJax) {
      window.MathJax.typeset();
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
          // index: parseInt(index.split('').reverse().join(''), 2),
          index: parseInt(index.split('').reverse().join(''), 2).toString(this.indexBaseSystem),
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
            textX = x + width / 2 - 5;
            textY = c.varIndex % 4 === 0 ? y - 12 : y + 10;
          } else {
            x = (c.varIndex + 1) % 4 === 0
              ? this.paddingHorizontal + this.blockWidth * this.cellsHorizontal + dist
              : this.paddingHorizontal - dist;
            y = this.paddingVertical + interval[0] * this.blockWidth;
            textX = (c.varIndex + 1) % 4 === 0 ? x + 9 : x - 13;
            textY = y + height / 2 - 5;
            // varNamingScheme using 'x_0'... and 'x_1'... need more horizontal space
            // if placed to the left of the KVDiagram
            if ((this.varNamingScheme === 'x' || this.varNamingScheme === 'x1') && (c.varIndex + 1) % 4 !== 0) {
              textX -= 7;
            }
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
    /**
     * Returns JS / KVDiagram representation of this filled diagram.
     * see gti-tools
     */
    getKVDiagram() {
      // compute js representation of KVDiagram
      const diagramFlat = [];
      for (let row = 0; row < this.cellsVertical; row += 1) {
        diagramFlat[row] = [];
        for (let col = 0; col < this.cellsHorizontal; col += 1) {
          diagramFlat[row][col] = this.legitStates[this.diagram[(row * this.cellsHorizontal) + col].number];
        }
      }
      // const kvdiagram = new KVDiagram(
      //   [
      //     ['1', '0', '1', '0'],
      //     ['1', '1', '1', '0'],
      //   ], 3,
      // );
      const kvdiagram = new KVDiagram(diagramFlat, this.numVariables);
      return kvdiagram;
    },
    setKVDiagram(kvdiagram) {
      // console.log('setting is not yet implemented in KVDiagram component');
      // change num vars
      this.selectOp(0, kvdiagram.getAmountLiterals()); // update components data
      this.setNumVar(); // -> press the accept button

      // copy values over
      const values = kvdiagram.getValues();
      for (let y = 0; y < values.length; y += 1) {
        for (let x = 0; x < values[y].length; x += 1) {
          const flatPos = y * this.cellsHorizontal + x;
          // this.$set(this.diagram[flatPos], 'number', this.legitStates.indexOf(values[y][x]));
          this.diagram[flatPos].number = this.legitStates.indexOf(values[y][x]);
        }
      }
    },
    getSelectedVarNames() {
      return this.varNames[this.varNamingScheme];
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
      // this.$set(this.diagram[i], 'number', (this.diagram[i].number + 1) % this.legitStates.length);
      this.diagram[i].number = (this.diagram[i].number + 1) % this.legitStates.length;
    },
    setNumVar() {
      // const numVarsBefore = this.numVariables;
      // const [numVar] = this.selectedFormat[0];
      const numVar = this.selectedFormat[0];
      this.numVariables = parseInt(numVar, 10);
      this.diagram = reactive([]);
      for (let i = 0; i < this.cellsHorizontal * this.cellsVertical; i += 1) {
        this.diagram.push({ number: 0 });
      }
    },
    getSVG(id) {
      const formula = this.varNames[this.varNamingScheme][id];
      const formulaSVG = window.MathJax.tex2svg(formula);
      const svgmath = formulaSVG.getElementsByTagName('svg')[0];
      return svgmath.outerHTML;
    },
    toSvg(formula) {
      const formulaSVG = window.MathJax.tex2svg(formula);
      const svgmath = formulaSVG.getElementsByTagName('svg')[0];
      return svgmath.outerHTML;
    },
  },
};
</script>

<style lang="scss">
.kvDiagram {
  max-width: -webkit-fill-available;
  overflow: auto;
}
.unclickable {
  pointer-events: none;
}
.mtop {
  margin-top: 20px;
}
.radioCounter {
  display: flex;
  flex-direction: row;
}
.indexNumber {
  font-size: 12px;
}
.divMargin {
  display: inline-block;
  width: 10px;
}
.p-default {
  margin-right: 10px;
}
.radioSvg {
  display: inline-block;
  vertical-align: 0.9em;
  svg {
    vertical-align: 0;
  }
}
#kvContainer {
  margin-top: 20px;

  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;

  cursor: pointer;
  pointer-events: bounding-box;
  // overflow: auto;
  // display: block !important;

  /* Makes KVDiagram entries unselectable */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
.pretty {
  height: 1em;
}
</style>
