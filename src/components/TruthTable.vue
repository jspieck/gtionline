<template>
  <div class="truthTable">
    <!-- <button @click="$emit('truthtable-modified', getKVDiagram())">Throw modified event</button> -->
    <svg class="truthtableContainer" :width="svgWidth()" :height="svgHeight()" xmlns="http://www.w3.org/2000/svg">
      <!-- <g v-html="toSvg('Alle Enten Tanzen')" /> -->
      <!-- <span class="svg-text" v-html="toSvg(knf)"/> -->
      <!-- Header -->
      <g>
        <!-- Input Variable Names -->
        <g v-for="i in numVariables" v-bind:key="`inputvariablename_cell_${i}`"
            :transform="`translate(${getInputCellSVGX(i-1)}, ${0})`">
          <!-- This is very eklig but I did not a way to get    -->
          <g :transform="`translate(${cell_width * 0.2}, ${cell_height * (isSmallCharacter(varNames[i-1]) ? 0.2 : 0.4)})`" dominant-baseline="bottom"
            class="unclickable entry header_entry" text-anchor="bottom" v-html="toSvg(varNames[i-1])" />

          <!-- <g v-html="toSvg(varNames[i-1])" /> -->
          <!-- v-html="toSvg(varNames[i-1])" -->
        </g>
        <!-- 'f' above the Result Column -->
        <g :transform="`translate(${getResultCellSVGX()}, ${0})`">
            <g :transform="`translate(${cell_width * 0.2}, ${cell_height * 0.2})`" dominant-baseline="middle"
            class="unclickable entry header_entry" text-anchor="middle" v-html="toSvg('f')" />
        </g>
      </g>

      <!-- Row Index Cells left -->
      <g v-for="r in (inputCellsVertical + 1)" v-bind:key="`indexcell_${r}`"
        :transform="`translate(${getIndexCellSVGX()}, ${getIndexCellSVGY(r-1)})`">
        <!-- <text :x="cell_width / 2" :y="cell_height / 2" dominant-baseline="middle"
        class="unclickable entry" text-anchor="middle">{{r-1}}</text> -->
        <g :transform="`translate(${cell_width * 0.2}, ${cell_height * 0.15})`" dominant-baseline="middle"
            class="unclickable entry index_entry" text-anchor="middle" v-html="toSvg(num2indexHexString(r-1))" />

      </g>

      <!-- Vertical divider Left (of inputs) -->
      <rect :x="getVerticalBarLeftSVGX()" :y="getVerticalBarLeftSVGY()" :width="1" :height="svgHeight()"/>

      <!-- Input Number table -->
      <g v-for="(rowArray, r) in table_inputs" v-bind:key="`rowArray_${r}`">
        <g v-for="(state, c) in rowArray" v-bind:key="`cell_${c}`"
          :transform="`translate(${getInputCellSVGX(c)}, ${getInputCellSVGY(r)})`">
          <text :x="cell_width / 2" :y="cell_height / 2" dominant-baseline="middle"
          class="unclickable entry" text-anchor="middle">{{stateToString(state)}}</text>
        </g>
      </g>

      <!-- Vertical divider Right (of inputs) -->
      <rect :x="getVerticalBarRightSVGX()" :y="getVerticalBarRightSVGY()" :width="1" :height="svgHeight()"/>

      <!-- Result Number table -->
      <g v-for="(output, r) in table_outputs" v-bind:key="`outputcell_${r}`"
        :transform="`translate(${getResultCellSVGX()}, ${getResultCellSVGY(r)})`">
        <text :x="cell_width / 2" :y="cell_height / 2" dominant-baseline="middle"
        class="unclickable entry result_entry_number" text-anchor="middle">{{stateToString(output)}}</text>
        <rect fill="transparent" :width="cell_width" :height="cell_height" class="result_entry_iteractable"
        @click="onClickResult(r)" @mousedown="onMouseDown(r)"/>
      </g>

    </svg>
  </div>
</template>

<script>
import { reactive } from 'vue';


export default {
  emits: [
    'truthtable-modified',
    'requesting-bf-after-reactivation',
  ],
  props: {
    numVariables: Number,
    varNames: Array, // [String]
  },
  watch: {
    numVariables(newAmount, oldAmount) {
      if (newAmount === oldAmount || newAmount < 1) {
        return;
      }
      this.reconstruct();
      console.log('KVDiagrams internal watch function registered a change in numVariables! Set to ', newAmount);
    },
  },
  data() {
    return {
      table_inputs: reactive([]),
      table_outputs: reactive([]),

      cell_height: 30,
      cell_width: 25,
      header_height: 30,
      // vertical_bar_left: {
      //   x: 60,
      //   x_margin: 3,
      //   y_top_padding: 5,
      //   y_bottom_padding: 5,
      // },
      // vertical_bar_right: {
      //   x: 60,
      //   x_margin: 3,
      //   y_top_padding: 5,
      //   y_bottom_padding: 5,
      // },
    };
  },
  created() {
    this.clearTable();
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  },
  computed: {
    inputCellsHorizontal() {
      return this.numVariables;
    },
    inputCellsVertical() {
      return 2 ** this.numVariables;
    },

    // svgWidth() {
    //   if (!this.numVariables) {
    //     console.error('numVariables was not passed to TruthTable\n');
    //   }
    //   return this.cell_width * (1 + 1 + this.numVariables + 1 + 1);
    // },
    // svgHeight() {
    //   console.log('v: ', this.inputCellsVertical);
    //   return this.header_height + this.inputCellsVertical * this.cell_height;
    // },
  },
  methods: {
    clearTable() {
      this.table_inputs = reactive([]);
      this.table_outputs = reactive([]);
      for (let r = 0; r < this.inputCellsVertical; r += 1) {
        this.table_outputs[r] = 0;
        this.table_inputs[r] = [];
        const rowStringRepres = r.toString(2).padStart(this.numVariables, '0');
        for (let c = 0; c < this.inputCellsHorizontal; c += 1) {
          this.table_inputs[r].push(rowStringRepres[c] === '0' ? 0 : 1);
        }
      }
      console.log(this.table_inputs);
    },
    reconstruct() {
      this.clearTable();
    },
    onClickResult(r) {
      console.log('registered click at: ', r);
      this.table_outputs[r] = this.toggleState(this.table_outputs[r]);
    },
    onMouseDown(r) {
      console.log('on mouse down: ', r);
    },
    toggleState(state) {
      if (state === 0) return 1;
      if (state === 1) return -1;
      return 0;
    },
    getKVDiagram() {

    },
    toSvg(formula) {
      const formulaSVG = window.MathJax.tex2svg(formula);
      const svgmath = formulaSVG.getElementsByTagName('svg')[0];
      console.log('input: ', formula, '\n output: ', svgmath.outerHTML);
      return svgmath.outerHTML;
    },
    // >>>>>>> SVG computations
    svgWidth() {
      if (!this.numVariables) {
        console.error('numVariables was not passed to TruthTable\n');
      }
      return this.getResultCellSVGX() + this.cell_width * 1.1;
      // return this.cell_width * (1 + 1 + this.numVariables + 1 + 1);
    },
    svgHeight() {
      console.log('v: ', this.inputCellsVertical);
      return this.header_height + this.inputCellsVertical * this.cell_height;
    },
    getIndexCellSVGX() {
      return 0;
    },
    getIndexCellSVGY(r) {
      return this.header_height + r * this.cell_height;
    },
    getIndexColumnWidth() {
      const charsPerIndex = 2 /*= '0x' */ + Math.floor((Math.log(this.inputCellsVertical - 1) - 1) / Math.log(16)) + 1/*= index itself */ + 1;
      return charsPerIndex * this.cell_width / 2;
    },
    getVerticalBarLeftSVGX() {
      return this.getIndexColumnWidth() + this.cell_width / 4;
    },
    getVerticalBarLeftSVGY() {
      return 0;
    },
    getInputCellSVGX(c) {
      return this.getVerticalBarLeftSVGX() + this.cell_width / 4 + (c * this.cell_width);
    },
    getInputCellSVGY(r) {
      return this.getIndexCellSVGY(r);
    },
    getVerticalBarRightSVGX() {
      return this.getInputCellSVGX(this.numVariables - 1) + this.cell_width * 1.5;
    },
    getVerticalBarRightSVGY() {
      return 0;
    },
    getResultCellSVGX() {
      return this.getVerticalBarRightSVGX() + this.cell_width / 4;
    },
    getResultCellSVGY(r) {
      return this.getInputCellSVGY(r);
    },
    isSmallCharacter(char) {
      return !(char !== 'b' && char !== 'd');
    },
    stateToString(state) {
      if (state === 0) return '0';
      if (state === 1) return '1';
      return '-';
    },
    num2indexHexString(i) {
      let num = i.toString(16).toUpperCase();
      const numLenTarget = Math.floor((Math.log(this.inputCellsVertical - 1) - 1) / Math.log(16)) + 1;
      for (let numLen = num.length; numLen < numLenTarget; numLen += 1) {
        num = `0${num}`;
      }
      return `0x${num}`;
    },
  },
};
</script>

<style lang="scss">
.unclickable {
  pointer-events: none;
}
.entry {
  font-size: 1.3em;
}
.header_entry {
  font-size: 1.1em;
}
.index_entry {
  font-size: 0.9em;
}
.result_entry_number {
  /* Makes entries unselectable */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
  pointer-events: none;
}
.result_entry_iteractable {
  cursor: pointer;
  pointer-events: bounding-box;

  transform: translate(0em, -0.1em);
  stroke: #89898960;

  // overflow: auto;
  // display: block !important;
}
.truthTable {
  font-size: 1.2em;
  .truthtableContainer {
    // border-style: solid;
    margin-top: 10px
  }
}
</style>
