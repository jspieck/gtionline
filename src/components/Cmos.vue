<template>
  <div class="cmosContainer">
    <div class="pageContainer">
      <h3>CMOS<InfoBlob>
        <span v-html="$t('cmos_infoblob_description')"></span>
      </InfoBlob></h3>
      <div class="bodyContainer">
        <p>{{$t('enter_cmos')}}</p>
        <p>{{$t('cmos_infoblob_input_description')}}</p>
        <input id="cmosInput" v-model="cmosFormula"/>
        <button @click="generateCmos()">{{$t('generate')}}</button>
      </div>
    </div>
    <div id="cmosOutput" v-html="cmosOutput"></div>
    <h3>Tikz Code</h3>
    <div class="codeContainer">
      <highlightjs lang="tex" :code="latex"/>
    </div>
  </div>
</template>

<script>
import {
  CMOSBuilder, parseBooleanFunction, SVGGenerator, CMOSVisualBuilder, toLaTeX, LatexGenerator,
} from '@/scripts/gti-tools';
import InfoBlob from './InfoBlob.vue';

export default {
  name: 'KVDiagram',
  components: {
    InfoBlob,
  },
  data() {
    return {
      latex: '',
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
      const latexGenerator = new LatexGenerator();
      const scale = 100;
      window.MathJax.options.ignoreHtmlClass = 'tex2jax_ignore';
      this.latex = latexGenerator.buildLatex(cmosVisual, toLaTeX).trim();
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

<style lang="scss">
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

  .codeContainer {
    background: #fafafa;
    font-size: 20px;
    text-align: left;
    padding: 15px;
    width: 1000px;
    margin: auto;
    line-height: 30px;
    border-left: 3px solid $freshBlue;
  }

  pre {
    margin: 0;
    counter-reset: line;
  }

  /* pre span {
    display: block;
    counter-increment: line;
  }

  pre span:before {
    counter-increment: line;
    content: counter(line);
    display: inline-block;
    border-right: 1px solid #ddd;
    padding: 0 .5em;
    margin-right: .5em;
    color: #888
  } */
</style>
