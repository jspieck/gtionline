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
      <!-- <highlightjs lang="tex" :code="latex"/> -->
      <pre><code><span v-for="(line, lineNumber) in latex" v-bind:key="lineNumber" v-html="line" class="codeLine"/></code></pre>
    </div>
  </div>
</template>

<script>
import {
  CMOSBuilder, parseBooleanFunction, SVGGenerator, CMOSVisualBuilder, toLaTeX, LatexGenerator,
} from '@/scripts/gti-tools';
import hljs from 'highlight.js/lib/common';
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
      const latex = latexGenerator.buildLatex(cmosVisual, toLaTeX).trim();
      this.latex = hljs.highlight(latex, { language: 'tex' }).value.split('\n');
      this.cmosOutput = this.toMathJax(codeGenerator.buildSVG(cmosVisual, toLaTeX, scale));
      console.log(this.cmosOutput);
      this.cmosOutput = this.cmosOutput.replaceAll('text-anchor', 'data-anchor');
      this.cmosOutput = this.cmosOutput.replaceAll('text', 'foreignobject');
      this.cmosOutput = this.cmosOutput.replaceAll('<foreignobject', '<foreignobject width=400 height=80 transform="translate(0, -25)"');
      // console.log(this.cmosOutput);
      this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset();
          this.$nextTick(() => {
            const foreignObjects = document.getElementsByTagName('foreignObject');
            for (const foreignObject of foreignObjects) {
              if (foreignObject.textContent === 'VCC' || foreignObject.textContent === 'GND') {
                foreignObject.setAttribute('font-size', '40');
              }
              if (foreignObject.children.length > 0) {
                const actualWidth = foreignObject.children[0].offsetWidth;
                const actualHeight = foreignObject.children[0].offsetHeight;
                foreignObject.setAttribute('width', `${actualWidth + 10}`);
                foreignObject.setAttribute('height', 100); // `${actualHeight + 1}`);
                if (foreignObject.getAttribute('data-anchor') === 'end') {
                  foreignObject.setAttribute('transform', `translate(-${actualWidth},-${actualHeight / 2 - 10})`);
                } else {
                  foreignObject.setAttribute('transform', `translate(0,-${actualHeight / 2 - 10})`);
                }
              }
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
  foreignObject {
    text-align: left;
    dominant-baseline: central;
  }

  text {
    alignment-baseline: before-edge;
    dominant-baseline: text-before-edge;
  }

  foreignObject body {
    all: unset;
    display: block;
  }

  .cmosContainer {
    width: 100% !important;
    box-sizing: border-box;
    overflow: hidden;
  }

  #cmosOutput {
    /*width: 100%;*/
    overflow-x: auto;
  }

  .codeContainer {
    background: #fafafa;
    font-size: 20px;
    text-align: left;
    /* padding: 15px 0; */
    width: 1000px;
    margin: auto;
    line-height: 30px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    /* border-left: 3px solid $freshBlue; */
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

  span.codeLine::before {
    content: counter(codeLine);
    display: inline-block;
    color: #5079d4;
    text-align: right;
    width: 2em;
    padding-right: 0.5em;
    border-right: 2px solid $freshBlue;
    margin-right: 1em;
    background: #f2f2f2;
  }
  span.codeLine {
    counter-increment: codeLine;
    display: block;
  }
  span.codeLine:first-child::before  {
    padding-top: 10px;
  }
   span.codeLine:last-child::before  {
    padding-bottom: 10px;
  }
</style>
