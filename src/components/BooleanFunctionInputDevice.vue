<template>
  <div>
    <div>
      <label>{{$t('numVarInput')}}:</label>
      <FSelect :sel="this.dropDownMenuSelectedNumVars" @input="onChooseNumVars" :num=0 class="leftMargin10"
              :options="numVarOptions"/>
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
    </div>

    <button @click="this.setMethodOfInputForBooleanFunction(this.METHOD_OF_INPUT_FOR_BOOLEAN_FUNCTION_KVDIAGRAM)">Use KVDiagram</button>
    <button @click="this.setMethodOfInputForBooleanFunction(this.METHOD_OF_INPUT_FOR_BOOLEAN_FUNCTION_FUNCTION_TABLE)">Use Truth Table</button>

    <div>
      <!--KeepAlive makes the components persist, even if not shown. Removing
      this results in for example losing the KVDiagram state after switching to bftable input mode-->
      <KeepAlive>
        <KVDiagr v-if="this.methodOfInputForBooleanFunction == this.METHOD_OF_INPUT_FOR_BOOLEAN_FUNCTION_KVDIAGRAM"
                :numVariables="this.numVariables" :varNames="currentVarNames"
                @kvdiagram-modified="onKVDiagramModified($event, kvdiagram)"
                @requesting-kvdiagram-data-after-reactivation="notifyChildKVDiagramOfBF()"
                class="kvdiagram" ref="childKVDiagram" />
        <TruthTable v-else
                :numVariables="this.numVariables" :varNames="this.currentVarNames"
                @truthtable-modified="onTruthTableModified($event, kvdiagram)"
                @requesting-bf-after-reactivation="notifyChildTruthTableOfBF()"
                ref="childTruthTable" />
      </KeepAlive>
      <!-- <button v-else @click="tmpFunc()">Set smth in KVDiagram</button> -->
    </div>
  </div>
</template>

<script>
import { KVDiagram } from '@/scripts/gti-tools';
// import { onMounted } from 'vue';
import KVDiagr from './KVDiagram.vue';
import TruthTable from './TruthTable.vue';
import FormatSelect from './FormatSelect.vue';

export default {
  name: 'BooleanFunctionInputDevice',
  components: {
    KVDiagr,
    FSelect: FormatSelect,
    TruthTable,
  },
  data() {
    this.METHOD_OF_INPUT_FOR_BOOLEAN_FUNCTION_KVDIAGRAM = 'method_kvdiagram';
    this.METHOD_OF_INPUT_FOR_BOOLEAN_FUNCTION_FUNCTION_TABLE = 'method_function_table';
    this.varNames = {
      abc: ['a', 'b', 'c', 'd', 'e', 'g', 'h'],
      xyz: ['x', 'y', 'z', 'u', 'v', 'w', 'q'],
      x: ['x_0', 'x_1', 'x_2', 'x_3', 'x_4', 'x_5', 'x_6'],
      x1: ['x_1', 'x_2', 'x_3', 'x_4', 'x_5', 'x_6', 'x_7'],
    };

    this.DEFAULT_NUM_VARIABLES = 4;

    return {
      methodOfInputForBooleanFunction: this.METHOD_OF_INPUT_FOR_BOOLEAN_FUNCTION_KVDIAGRAM,

      booleanFunctionAsKVDiagram: new KVDiagram(null, this.DEFAULT_NUM_VARIABLES),

      numVariables: this.DEFAULT_NUM_VARIABLES,
      dropDownMenuSelectedNumVars: this.DEFAULT_NUM_VARIABLES,
      numVarOptions: {
        2: 2, 3: 3, 4: 4, 5: 5, 6: 6,
      },

      varNamingScheme: 'xyz',
      // currentVarNames: this.varNames.xyz,
      radios: [
        { value: 'abc', name: 'a, b, \\dots' },
        { value: 'xyz', name: 'x, y, \\dots' },
        { value: 'x', name: 'x_0, x_1, \\dots' },
        { value: 'x1', name: 'x_1, x_2, \\dots' },
      ],
    };
  },
  created() {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  },
  watch: {
    numVariables(newAmount, oldAmount) {
      if (newAmount === oldAmount || newAmount < 1) {
        return;
      }
      // set to empty bf in new size
      this.booleanFunctionAsKVDiagram = new KVDiagram(null, newAmount);
      // console.log('BFInputDevices internal watch function registered a change in numVariables! Set to bf ', this.booleanFunctionAsKVDiagram);
    },
  },
  computed: {
    currentVarNames() {
      return this.varNames[this.varNamingScheme];
    },
  },
  methods: {
    setMethodOfInputForBooleanFunction(method) {
      this.methodOfInputForBooleanFunction = method;

      console.log('set method to: ');
      console.log(method);
    },
    onChooseNumVars(num, val) {
      this.dropDownMenuSelectedNumVars = parseInt(val, 10);
    },
    setNumVar() {
      this.numVariables = this.dropDownMenuSelectedNumVars;
    },
    onKVDiagramModified(kvdiagram) {
      // update this' bf on event from child stating that kv diagram has been modified there
      this.setBooleanFunctionFromKVDiagram(kvdiagram);
    },
    onTruthTableModified(kvdiagram) {
      console.log('received: ', kvdiagram);
      this.setBooleanFunctionFromKVDiagram(kvdiagram);
    },
    /** @param {Proxy(KVDiagram)} kvdiagram */
    setBooleanFunctionFromKVDiagram(kvdiagram) {
      this.booleanFunctionAsKVDiagram = kvdiagram;
      // console.log('BooleanFunctionInputDevice.setBooleanFunctionFromKVDiagram(kvdiagram) called. Parameter kvdiagram:');
      // console.log(this.booleanFunctionAsKVDiagram);
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
    notifyChildKVDiagramOfBF() {
      this.$refs.childKVDiagram.setKVDiagram(this.getBFAsKVDiagram());
    },
    notifyChildTruthTableOfBF() {
      this.$refs.childTruthTable.setKVDiagram(this.getBFAsKVDiagram());
    },
    //
    // ### GETTER METHODS ###
    //
    getBFAsKVDiagram() {
      return this.booleanFunctionAsKVDiagram;
    },
    tmpFunc() { // only for debugging. // TODO remove
      console.log('tmpFunc() called');
      // console.log(this.$refs);
      // this.$refs.childKVDiagram.setKVDiagram(this.booleanFunctionAsKVDiagram);
      this.onKVDiagramModified(new KVDiagram([[1, 0], [0, 0]], 2));
    },
  },
};
</script>

<style lang="scss">
.mtop {
  margin-top: 20px;
}
.radioCounter {
  display: flex;
  flex-direction: row;
}
.p-default {
  margin-right: 10px;
}
</style>
