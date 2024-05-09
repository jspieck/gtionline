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
          <div v-if="cmosError != null" class="exercise-selection-container-subsection">
            <span class="errormessage">
              <span v-html="$t('cmos_error_at_symbol') + ' '"/>
              <span> '{{cmosError.found}}' </span>
              <span v-html="$t('at_position') + ' '"/>
              <span> {{ cmosError.location.start.column }}</span>
            </span>
          </div>
          <div v-if="cmosErrorFormulaTooSimple != null" class="exercise-selection-container-subsection">
            <span class="errormessage">
              <span> {{$t('cmos_enter_more_than_one_variable')}} </span>
            </span>
          </div>
        </div>
        <div class="exercise-selection-container">
          <div class="exercise-selection-container-tooltip">{{$t('exerciseArchive')}}:</div>
          <div>
            <FSelect :options="archivedExerciseTitles" :sel="0"
              @input="selectArchivedExercise" ref="archivedExercisesCMOSDropDownMenu"/>
            <button @click="loadArchivedExercise">{{$t('load')}}</button>
          </div>
        </div>
        <h4 id="displayedFormula" v-if="renderedFormula" v-html="$t('formula') + ': ' + renderedFormula"/>
      </div>
    </div>
    <div id="cmosOutput" v-html="cmosOutput" class="blurred" @mousedown="unblurDOM" ref="cmosOutput"></div>
    <h3 v-if="latex">Tikz Code</h3>
    <div class="codeContainer">
      <div class="copyButton">
        <button @click="copyToClipboard"><font-awesome-icon icon="copy"/></button>
        <span class="tooltip" ref="tooltip">Copied</span>
      </div>
      <!-- <highlightjs lang="tex" :code="latex"/> -->
      <pre><code><span v-for="(line, lineNumber) in latex" v-bind:key="lineNumber" v-html="line" class="codeLine"/></code></pre>
    </div>
  </div>
</template>

<script>
import {
  CMOSBuilder, parseBooleanFunction, SVGGenerator, CMOSVisualBuilder, toLaTeX, LatexGenerator,
} from '@/scripts/gti-tools';
import { cmosLoadArchivedExercise, cmosGetArchivedExerciseTitles, cmosGetExerciseIndexOfHandle } from '@/scripts/cmosArchivedExercises';
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
      latexText: '',
      cmosFormula: '',
      lastCmosFormula: '',
      cmosOutput: '',
      cmosError: null,
      cmosErrorFormulaTooSimple: null,
      renderedFormula: '',
      archivedExerciseSelectedIndex: 0,
      examples: ['(~a+c)*~(~b+c*~a)', '(~x+~r*~(~n+a))*(n+r)', 'x0*~x1*(~x2+~x3)', '~(~a*b+a*~b)'],
    };
  },
  created() {},
  mounted() {
    // Load Exercise statet in URL parameters (...?load=)
    this.loadExerciseFromURL();
  },
  computed: {
    archivedExerciseTitles() {
      return cmosGetArchivedExerciseTitles(this.$i18n);
      // return [
      //   `${this.$t('example')} 1`,
      //   `${this.$t('example')} 2`,
      //   `${this.$t('wintersemester')}: ${this.$t('sheet')} 9 A1b)`,
      //   `${this.$t('sommersemester')}: ${this.$t('sheet')} 6 A3`,
      // ];
    },
  },
  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.latexText).then(() => {
        console.log('Copying to clipboard was successful!');
        this.$refs.tooltip.classList.add('appear');
        setTimeout(() => {
          this.$refs.tooltip.classList.remove('appear');
        }, 1000);
      }, (err) => {
        console.error('Failed to copy: ', err);
      });
    },
    selectArchivedExercise(num, exerciseIndex) {
      this.archivedExerciseSelectedIndex = exerciseIndex;
    },
    loadArchivedExercise() {
      const index = this.archivedExerciseSelectedIndex;
      if (index < 0) {
        return;
      }
      this.generateCmos(
        cmosLoadArchivedExercise(this.$i18n, index).data,
      );
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
      let expression;
      try {
        expression = parseBooleanFunction(cmosFormula);
      } catch (e) {
        this.cmosError = e;
        // console.log(e);
        return;
      }
      this.cmosError = null;
      const cmos = builder.buildCMOS(expression);
      const visBuilder = new CMOSVisualBuilder();
      let cmosVisual;
      try {
        cmosVisual = visBuilder.buildHull(cmos, { channelWidth: 0.4 });
      } catch (e) {
        this.cmosErrorFormulaTooSimple = e;
        return;
      }
      this.cmosErrorFormulaTooSimple = null;
      // console.log(expression);
      this.renderedFormula = `\\(${toLaTeX(expression.expression)}\\)`;
      const codeGenerator = new SVGGenerator();
      const latexGenerator = new LatexGenerator();
      const scale = 100;
      window.MathJax.options.ignoreHtmlClass = 'tex2jax_ignore';
      const latex = latexGenerator.buildLatex(cmosVisual, toLaTeX).trim();
      this.latexText = latex;
      this.latex = hljs.highlight(latex, { language: 'tex' }).value.split('\n');
      this.cmosOutput = this.toMathJax(codeGenerator.buildSVG(cmosVisual, toLaTeX, scale));
      // console.log(this.cmosOutput);
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
                // console.log(foreignObject.children[0].children[0]);
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
              // eslint-disable-next-line no-unused-vars
              const dimensions = viewbox.split(' ').map(s => Number(s));
              const padding = 50;
              cmosOutputDom.setAttribute('viewBox', `${-padding} ${-padding} ${maxX + padding} ${maxY + padding}`);
              if (this.lastCmosFormula !== cmosFormula) {
                cmosOutputDom.setAttribute('width', Number(cmosOutputDom.getAttribute('width')) / 2);
                cmosOutputDom.setAttribute('height', Number(cmosOutputDom.getAttribute('height')) / 2);
              }
              // console.log(viewbox);
              // console.log(dimensions);
              this.lastCmosFormula = cmosFormula;
            });
          });
        }
      });
      this.reblurCMOS();
    },
    unblurDOM(event) {
      if (!event || !event.target || !event.target.classList) {
        return;
      }
      if (event.target.classList.contains('blurred')) {
        event.target.classList.remove('blurred');
        return;
      }
      // console.log(event);
      /* works its way up the element tree and removes the 'blurred' class from the first one it finds */
      let baseElement = event.target.parentNode;
      // eslint-disable-next-line no-cond-assign
      do {
        // console.log(baseElement);
        if (baseElement.classList.contains('blurred')) {
          baseElement.classList.remove('blurred');
          return;
        }
      } while ((baseElement = baseElement.parentNode) != null && baseElement.classList);
    },
    reblurCMOS() {
      const cmosOutput = this.$refs.cmosOutput;
      if (!cmosOutput.classList.contains('blurred')) {
        cmosOutput.classList.add('blurred');
      }
    },
    loadExerciseFromURL() {
      if (!this.$route.query) {
        return;
      }
      // Load Exercise statet in URL parameters (...?load=)
      const exerciseHandle = this.$route.query.load;
      if (!exerciseHandle) {
        return;
      }
      // retrieve archived exercise data
      const exerciseIndex = cmosGetExerciseIndexOfHandle(this.$i18n, exerciseHandle);
      if (exerciseIndex === -1) {
        console.error('Unknown CMOS-exercise handle: ', exerciseHandle);
        return;
      }
      this.selectArchivedExercise(0, exerciseIndex);
      this.loadArchivedExercise();

      // Select the loaded exercise in the drop-down menu
      this.$nextTick(() => {
        this.$refs.archivedExercisesCMOSDropDownMenu.setSelected(exerciseIndex);
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

  .copyButton {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .copy {
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    opacity: .6;
    transition: all .1s ease;
    &:hover {
      transform: translateY(-4px);
      opacity: 1;
    }
  }

  .tooltip {
    position: absolute;
    top: 30px;
    left: -30px;
    background: #373737;
    padding: 10px 15px;
    display: flex;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    letter-spacing: 1px;
    opacity: 0;

    &.appear {
      animation: appear 1s ease;
    }
  }

  @keyframes appear {
    0%{opacity:0}
    20%{ transform: translateY(10px); opacity:1}
    80%{transform: translateY(0px); opacity:1}
    100%{opacity:0}}

  #displayedFormula {
    margin-top: 5px;
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
    vertical-align: top;

    .exercise-selection-container-tooltip {
      margin-bottom: .8em;

      .infoblob-wrapper {
        float: left;
      }
    }

    .exercise-selection-container-subsection {
      margin-bottom: .5em;
      margin-top: .5em;
    }

    .errormessage {
        background-color: #ff96008f;
        border-radius: 0.6em;
        font-style:italic;
        padding: .3em;
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

  .blurred {
    filter: blur(.4em);
    -webkit-filter: blur(.4em);
  }

  #cmosOutput {
    /*width: 100%;*/
    overflow-x: auto;
  }

  .codeContainer {
    background: #fafafa;
    font-size: 20px;
    text-align: left;
    position: relative;
    /* padding: 15px 0; */
    width: 1000px;
    margin: auto;
    line-height: 30px;
    overflow-x: auto;
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
