<template>
  <div class="cmosContainer">
    <div class="pageContainer">
      <h3>CMOS<InfoBlob>
        <span v-html="$t('cmos_infoblob_description')"></span>
      </InfoBlob></h3>
      <div class="bodyContainer">
        <p>{{$t('enter_cmos')}}</p>
        <p>{{$t('cmos_infoblob_input_description')}}</p>
        <div class="exercise-selection-container">
          <div class="exercise-selection-container-tooltip">{{$t('generateEx')}}:</div>
          <input id="cmosInput" v-model="cmosFormula"/>
          <button @click="generateCmos(cmosFormula)">{{$t('generate')}}</button>
        </div>
        <div class="exercise-selection-container">
          <div class="exercise-selection-container-tooltip">{{$t('exerciseArchive')}}:</div>
          <div>
            <FSelect :options="archivedExerciseTitles" :sel="0"
              @input="selectArchivedExercise"/>
            <button @click="loadArchivedExercise">{{$t('load')}}</button>
          </div>
        </div>
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
import FormatSelect from './FormatSelect.vue';

export default {
  name: 'KVDiagram',
  components: {
    InfoBlob,
    FSelect: FormatSelect,
  },
  data() {
    return {
      latex: '',
      cmosFormula: '',
      cmosOutput: '',
      archivedExerciseSelectedIndex: 0,
      examples: ['(~a+c)*~(~b+c*~a)', '(~x+~r*~(~n+a))*(n+r)', '~x0*x1*(x2+x3)', '~(~a*b+a*~b)'],
    };
  },
  created() {},
  computed: {
    archivedExerciseTitles() {
      return [
        `${this.$t('example')} 1`,
        `${this.$t('example')} 2`,
        `${this.$t('wintersemester')}: ${this.$t('sheet')} 9 A1b)`,
        `${this.$t('sommersemester')}: ${this.$t('sheet')} 6 A3`,
      ];
    },
  },
  methods: {
    selectArchivedExercise(num, exerciseIndex) {
      this.archivedExerciseSelectedIndex = exerciseIndex;
    },
    loadArchivedExercise() {
      const index = this.archivedExerciseSelectedIndex;
      if (index < 0) {
        return;
      }
      this.generateCmos(this.examples[index]);
    },
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
    generateCmos(cmosFormula) {
      const builder = new CMOSBuilder();
      const expression = parseBooleanFunction(cmosFormula);
      const cmos = builder.buildCMOS(expression);
      const visBuilder = new CMOSVisualBuilder();
      const cmosVisual = visBuilder.buildHull(cmos, { channelWidth: 0.4 });
      console.log(cmosVisual);
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
            // Replace foreign objects with mathjax
            const foreignObjects = document.getElementsByTagName('foreignObject');
            for (const foreignObject of foreignObjects) {
              if (foreignObject.textContent === 'VCC' || foreignObject.textContent === 'GND') {
                foreignObject.setAttribute('font-size', '40');
                if (foreignObject.textContent === 'VCC') {
                  foreignObject.setAttribute('transform', 'translate(-50, -35)');
                } else {
                  foreignObject.setAttribute('transform', 'translate(-50 10)');
                }
              }
              if (foreignObject.children.length > 0) {
                const actualWidth = foreignObject.children[0].offsetWidth;
                console.log(foreignObject.children[0].children[0]);
                const actualHeight = foreignObject.children[0].children[0].getClientRects()[0].height;
                const staticHeight = 100;
                foreignObject.style.lineHeight = 0;
                foreignObject.setAttribute('data-actualHeight', `${actualHeight}`);
                foreignObject.setAttribute('width', `${actualWidth + 10}`);
                foreignObject.setAttribute('height', staticHeight); // `${actualHeight + 1}`);
                if (foreignObject.getAttribute('data-anchor') === 'end') {
                  foreignObject.setAttribute('transform', `translate(-${actualWidth},-${actualHeight})`);
                } else {
                  foreignObject.setAttribute('transform', `translate(0,-${actualHeight})`);
                }
              }
            }
            this.$nextTick(() => {
              let maxX = 0; let maxY = 0;
              for (const foreignObject of foreignObjects) {
                // const boundingRect = foreignObject.getBoundingClientRect();
                const xOuter = Number(foreignObject.getAttribute('x')) + Number(foreignObject.getAttribute('width'));
                const yOuter = Number(foreignObject.getAttribute('y')) + Number(foreignObject.getAttribute('height'));
                maxY = Math.max(yOuter, maxY);
                maxX = Math.max(xOuter, maxX);
              }
              // Scale to size
              const cmosOutputDom = document.getElementById('cmosOutput').children[0];
              // console.log(cmosOutputDom);
              const viewbox = cmosOutputDom.getAttribute('viewBox');
              const dimensions = viewbox.split(' ').map(s => Number(s));
              const padding = 50;
              cmosOutputDom.setAttribute('viewBox', `${-padding} ${-padding} ${maxX + padding} ${maxY + padding}`);
              cmosOutputDom.setAttribute('width', Number(cmosOutputDom.getAttribute('width')) / 2);
              cmosOutputDom.setAttribute('height', Number(cmosOutputDom.getAttribute('height')) / 2);
              console.log(viewbox);
              console.log(dimensions);
            });
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
  foreignObject {
    text-align: left;
    line-height: 0;
  }

  text {
    alignment-baseline: before-edge;
    dominant-baseline: text-before-edge;
  }

  button {
    margin-left: 10px;
  }

  .exercise-selection-container {
    display: inline-block;
    border-style: solid;
    border-width: 1px;
    border-color: rgba($lightBlue, 0.5);
    border-radius: 1.7em;
    padding: .8em;
    margin-left: .8em;
    margin-right: .8em;
    background: #ffffff47;
  }

  .exercise-selection-container {
    .exercise-selection-container-tooltip {
      margin-bottom: .8em;

      .infoblob-wrapper {
        float: left;
      }
    }

    .exercise-selection-container-subsection {
      margin-bottom: .5em;
    }
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
    overflow-x: scroll;
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
