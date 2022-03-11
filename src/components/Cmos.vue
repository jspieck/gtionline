<template>
  <div class="cmosContainer bodyContainer">
    <InfoBlob>
        <span v-html="$t('cmos_infoblob_description')"></span>
    </InfoBlob>
    <p>Bitte geben Sie ihren CMOS-Eintrag ein.
        <InfoBlob>
            <span v-html="$t('cmos_infoblob_input_description')"></span>
        </InfoBlob>
    </p>
    <input id="cmosInput" v-model="cmosFormula"/>
    <button @click="generateCmos()">Generiere</button>
    <div id="cmosOutput" v-html="cmosOutput"></div>
  </div>
</template>

<script>
import {
  CMOSBuilder, parseBooleanFunction, SVGGenerator, CMOSVisualBuilder, toLaTeX,
} from '@/scripts/gti-tools';

export default {
  name: 'KVDiagram',
  data() {
    return {
      cmosFormula: '',
      cmosOutput: '',
    };
  },
  created() {},
  computed: {},
  methods: {
    toMathJax(inputStr) {
      // Replaces latex indicator $...$ by \\(...\\)
      const solutionChars = [];
      let beginning = true;
      for (const char of inputStr) {
        if (char === '$') {
          if (beginning) {
            solutionChars.push('\\(');
          } else {
            solutionChars.push('\\)');
          }
          beginning = !beginning;
        } else {
          solutionChars.push(char);
        }
      }
      return solutionChars.join('');
    },
    generateCmos() {
      const builder = new CMOSBuilder();
      const expression = parseBooleanFunction(this.cmosFormula);
      const cmos = builder.buildCMOS(expression);
      const visBuilder = new CMOSVisualBuilder();
      const cmosVisual = visBuilder.buildHull(cmos, { channelWidth: 0.4 });
      const codeGenerator = new SVGGenerator();
      const scale = 100;
      this.cmosOutput = this.toMathJax(codeGenerator.buildSVG(cmosVisual, toLaTeX, scale));
      this.cmosOutput = this.cmosOutput.replaceAll('text', 'foreignobject');
      this.cmosOutput = this.cmosOutput.replaceAll('<foreignobject', '<foreignobject width=400 height=80 transform="translate(-25, -25)"');
      console.log(this.cmosOutput);
      this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset();
        }
      });
    },
  },
};
</script>

<style>
  foreignObject {
    text-align: left;
  }
  .cmosContainer {
    width: 100% !important;
    box-sizing: border-box;
  }
  #cmosOutput {
    width: 100%;
    overflow-x: auto;
  }
</style>
