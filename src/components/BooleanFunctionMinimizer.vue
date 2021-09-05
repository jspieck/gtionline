<template>
  <div>
    <div class="tab">
      <h3>Funktionsminimierung</h3>

      <div class="boolean-function-input-container">
        <div>
          <div class="exercise-selection-container">
            <div class="exercive-selection-container-tooltip">Aufgabenarchiv:</div>
            <div>
              <FSelect :options="archivedExerciseTitles"
                @input="selectArchivedExercise"/>
              <button @click="loadArchivedExercise">Load</button>
            </div>
          </div>
          <div class="exercise-selection-container">
            <div class="exercive-selection-container-tooltip">Zufällige Aufgabe:</div>
            <div>
              <FSelect :options="randomExercisesDifficulties"
                @input="selectRandomExerciseDifficulty"/>
              <button @click="generateRandomExercise">Load</button>
            </div>
          </div>
        </div>

        <p class="boolean-function-input-container-divider">Oder interagiere direkt mit dem KV-Diagramm:</p>

        <div>
          <KVDiagr class="kvdiagram" ref="childKVDiagram" />
        </div>

        <button class="boolean-function-button-optimize" @click="optimize()">Berechnen</button>
      </div>

      <div class="horizontalbar"></div>

      <span v-if="this.showMsgKVDiagramMustNotBeEmptyOrFull === true">
        Das KV-Diagram darf nicht vollständig leer oder gefüllt sein.
      </span>
      <!-- <div v-else-if="this.someOptimizationsFinished === false"> -->
      <span v-else-if="this.someOptimizationsFinished === false">
        <!-- Klicke auf das KV-Diagram um die Einträge zu verändern und drücke dann auf Berechnen. -->
        <!-- Klicke anschließend auf Berechnen -->
      </span>

      <div v-else class="bf-main-accordion-container">
        <Accordion>
          <AccordionItem>
            <template v-slot:accordion-item-title>
              Normalformen
            </template>
            <template v-slot:accordion-item-body>
              <div> DNF: <span class="svg-text" v-html="toSvg(dnf)"></span> </div>
              <div> KNF: <span class="svg-text" v-html="toSvg(knf)"></span> </div>
            </template>
          </AccordionItem>
          <AccordionItem>
            <template v-slot:accordion-item-title>
              Normalformen (doppel Accordion)
            </template>
            <template v-slot:accordion-item-body>
              <Accordion>
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    DNF
                  </template>
                  <template v-slot:accordion-item-body>
                    <span class="svg-text" v-html="toSvg(dnf)"></span>
                  </template>
                </AccordionItem>
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    KNF
                  </template>
                  <template v-slot:accordion-item-body>
                    <span class="svg-text" v-html="toSvg(knf)"></span>
                  </template>
                </AccordionItem>
              </Accordion>
            </template>
          </AccordionItem>

          <AccordionItem>
            <template v-slot:accordion-item-title>
              Quine MC Cluskey Klassen (mit Mintermen)
            </template>
            <template v-slot:accordion-item-body>

              <!-- Quine Cluskey classes have been reversed in script section for easy access here -->
              <!-- loop through Q_X -->
              <div v-for="(qlayer, qi) in quineClassesMin" :key="`quineClassLayerMin_${qi}`">
                <!-- loop through Q_._X -->
                <div class="blurred" @mouseenter="unblurDOM" @click="unblurDOM">
                  <div v-for="(qlayerInner, qqi) in quineClassesMin[qi]" :key="`quineClassLayerInnerMin_${qqi}`"
                      class="quine-class-single-class-container">
                    <!-- Q{{quineClassesMin.length-qi-1}}_{{quineClassesMin[qi].length-qqi-1}}: { -->
                    <span class="svg-text" v-html="toSvg(`Q _{${quineClassesMin.length-qi-1}} \\_ _{${quineClassesMin[qi].length-qqi-1}}:\\{`)"></span>

                    <span class="termcollection">
                      <!-- loop through all terms in Q_x_y -->
                      <span v-for="(qterm, ti) in quineClassesMin[qi][qqi]" :key="`quineClassTermMin_${ti}`">
                        <!-- cross out term if it was absorbed -->
                        <span v-if="!quineClassesMin[qi][qqi][ti][1]" class="svg-text term" v-html="toSvg(quineClassesMin[qi][qqi][ti][0])"/>
                        <span v-if=" quineClassesMin[qi][qqi][ti][1]" class="svg-text term" v-html="toSvg('\\cancel{' + quineClassesMin[qi][qqi][ti][0] + '}')"/>

                        <span v-if="ti < quineClassesMin[qi][qqi].length - 1" v-html="toSvg(',')"/>
                      </span>
                    </span>

                    <span class="svg-text" v-html="toSvg('\\}')"></span>
                  </div>
                </div>
                <div class="horizontalbar" v-if="qi < quineClassesMin.length - 1"></div>
              </div>

            </template>
          </AccordionItem>

          <AccordionItem>
            <template v-slot:accordion-item-title>
              Primterme
            </template>
            <template v-slot:accordion-item-body>
              <div> Primimplikanten:
                <div v-for="i in primeTermsMin.length" :key="`primeTermMinID_${i}`">
                  <div class="svg-text" v-html="toSvg(primeTermsMin[i-1])"/>
                </div>
              </div>
              <div> Primimplikate:
                <div v-for="i in primeTermsMax.length" :key="`primeTermMaxID_${i}`">
                  <div class="svg-text" v-html="toSvg(primeTermsMax[i-1])"/>
                </div>
              </div>
            </template>
          </AccordionItem>

          <AccordionItem>
            <template v-slot:accordion-item-title>
              Primterme (doppel Accordion)
            </template>
            <template v-slot:accordion-item-body>
              <Accordion>
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    Primimplikanten
                  </template>
                  <template v-slot:accordion-item-body>
                    <span v-for="i in primeTermsMin.length" :key="`primeTermMinID_${i}`">
                      <!-- Term + potential comma -->
                      <span class="svg-text term" v-html="toSvg(primeTermsMin[i-1] + `${i-1 < primeTermsMin.length - 1 ? ',' : ''}`)"/>
                    </span>
                  </template>
                </AccordionItem>
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    Primimplikate
                  </template>
                  <template v-slot:accordion-item-body>
                    <span v-for="i in primeTermsMax.length" :key="`primeTermMaxID_${i}`">
                      <!-- Term + potential comma -->
                      <span class="svg-text term" v-html="toSvg(primeTermsMax[i-1] + `${i-1 < primeTermsMax.length - 1 ? ',' : ''}`)"/>
                    </span>
                  </template>
                </AccordionItem>
              </Accordion>
            </template>
          </AccordionItem>

          <AccordionItem>
            <template v-slot:accordion-item-title>
              Ueberdeckungstabelle: (mit Primimplikanten)
            </template>
            <template v-slot:accordion-item-body>
              <table class="bf-primetable">
                <!-- Top row -->
                <tr>
                  <!-- Empty cells in top left -->
                  <td></td>
                  <td :class="primeTableColorMatrixObj.matrix[0][0]" />

                  <!-- Base terms -->
                  <!-- <th v-for="(bt, col) in primeTableMin.baseTerms" :key="`primeTableMinTR_${col}`"
                     class="svg-text" v-html="toSvg(bt.toLatex(literalNames))"
                      :class="[
                        primeTableColorMatrixObj.matrix[col+1][0],
                        (primeTableColorMatrixObj.highlightedCellRow === 0 && primeTableColorMatrixObj.highlightedCellColumn === col+1) ? 'primetable-highlighted-cell' : ''
                      ]"
                  /> -->

                  <!-- Base terms -->
                  <th v-for="(bt, col) in primeTableMin.baseTerms" :key="`primeTableMinTR_${col}`"
                      :class="[
                        primeTableColorMatrixObj.matrix[col+1][0],
                        (primeTableColorMatrixObj.highlightedCellRow === 0 && primeTableColorMatrixObj.highlightedCellColumn === col+1) ? 'primetable-highlighted-cell' : ''
                      ]"
                  >
                  {{primeTableBaseTermIndices[col]}}
                  </th>

                  <!-- Cost column -->
                  <th v-html="toSvg('c_{i}')" class="svg-text"/>
                </tr>

                <!-- body of table -->
                <tr v-for="(pt, row) in primeTableMin.primeTerms" :key="`primeTableMinRow_${row}`">
                  <!-- prime term on the left -->
                  <td>{{nthLetter(row + 1)}}</td>
                  <th class="svg-text" v-html="toSvg(pt.toLatex(literalNames))"
                      :class="[
                        primeTableColorMatrixObj.matrix[0][row+1],
                        (primeTableColorMatrixObj.highlightedCellRow === row + 1 && primeTableColorMatrixObj.highlightedCellColumn === 0) ? 'primetable-highlighted-cell' : ''
                      ]"
                  />

                  <!-- Crosses -->
                  <td v-for="col in primeTableMin.coverTable.length" :key="`primeTableMinCell_${row}_${col}`"
                      :class="primeTableColorMatrixObj.matrix[col][row+1]"
                  >
                    <span v-if="primeTableMin.coverTable[col-1][row] === true"
                        :class="(primeTableColorMatrixObj.highlightedCellRow === row + 1 && primeTableColorMatrixObj.highlightedCellColumn === col) ? 'primetable-highlighted-cell' : ''">
                      X
                    </span>
                  </td>

                  <!-- Cost -->
                  <td>{{primeTableMin.primeTerms[row].getTerms().length}}</td>
                </tr>
              </table>

              <div class="bf-primetable-controls">
                <button @click='primetableStepBackward' :disabled="primetableCurrentStepIndex === 0">
                  &larr;
                </button>
                Schritt
                <span>{{primetableCurrentStepIndex}} / {{primetableStepsAmount}}</span>
                <button @click='primetableStepForward' :disabled="primetableCurrentStepIndex === primetableStepsAmount">
                  &rarr;
                </button>
              </div>
              <div v-html="primeTableCurrentExplanation"></div>
            </template>
          </AccordionItem>

          <AccordionItem>
            <template v-slot:accordion-item-title>
              Petrick Ausdruck: (mit Primimplikanten)
            </template>
            <template v-slot:accordion-item-body>
              <!-- <div>{{ petrickStatementMin.expressionDirectStr }}</div> -->
              <div><span v-html="toSvg(petrickStatementMin.expressionDirectStr + '=1')"/><span> | Absorption + Idempotenz</span></div>
              <!-- <div>{{ petrickStatementMin.expressionAbsorbedStr }}</div> -->
              <!-- <div v-html="toSvg(petrickStatementMin.expressionAbsorbedStr + '=1 \\ \\ \\text{| Ausdistribuieren}')"/> -->
              <div><span v-html="toSvg(petrickStatementMin.expressionAbsorbedStr + '=1')"/><span> | Ausdistribuieren</span></div>
              <!-- <div>{{ petrickStatementMin.expressionExpandedStr }}</div> -->
              <!-- <div v-html="toSvg(petrickStatementMin.expressionExpandedStr + '=1 \\ \\ \\text{| Absorption + Idempotenz}')"/> -->
              <div><span v-html="toSvg(petrickStatementMin.expressionExpandedStr + '=1')"/><span> | Absorption + Idempotenz</span></div>
              <!-- <div>{{ petrickStatementMin.expressionStr }}</div> -->
              <!-- <div v-html="toSvg(petrickStatementMin.expressionStr + '=1')"/> -->
              <div><span v-html="toSvg(petrickStatementMin.expressionStr + '=1')"/></div>
            </template>
          </AccordionItem>

          <AccordionItem>
            <template v-slot:accordion-item-title>
              Minimalformen
            </template>
            <template v-slot:accordion-item-body>
              <Accordion>
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    DMF
                  </template>
                  <template v-slot:accordion-item-body>
                    <span class="svg-text" v-html="toSvg(dmf)"></span>
                  </template>
                </AccordionItem>
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    KMF
                  </template>
                  <template v-slot:accordion-item-body>
                    <span class="svg-text" v-html="toSvg(kmf)"></span>
                  </template>
                </AccordionItem>
              </Accordion>
            </template>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </div>
</template>


<script>
import {
  optimizeBooleanFunction, generateRandomKVDiagram, computePrimesFromKV,
  BOOLEAN_FUNCTION_PRIME_TABLES_STEP_FOUND_CORE, BOOLEAN_FUNCTION_PRIME_TABLES_STEP_CROSS_COLUMN_BC_COVERED,
  BOOLEAN_FUNCTION_PRIME_TABLES_STEP_ROW_DOMINATION, BOOLEAN_FUNCTION_PRIME_TABLES_STEP_COLUMN_DOMINATION,
  BOOLEAN_FUNCTION_PRIME_TABLES_STEP_CROSS_ROW_BC_COVERED, BOOLEAN_FUNCTION_PRIME_TABLES_STEP_HAS_CYCLIC_REST,
} from '@/scripts/gti-tools';
import { bfLoadArchivedExercise, bfGetArchivedExerciseTitles } from '@/scripts/bfArchivedExercises';
import KVDiagram from './KVDiagram.vue';
import Accordion from './EmbeddedAccordion.vue';
import AccordionItem from './EmbeddedAccordionItem.vue';
import FormatSelect from './FormatSelect.vue';

export default {
  name: 'BooleanFunctionMinimizer',
  components: {
    KVDiagr: KVDiagram,
    Accordion,
    AccordionItem,
    FSelect: FormatSelect,
  },
  data() {
    return {
      // archivedExercises: ['Blatt 5: 1d)', 'Blatt 7: 1b)', 'Blatt 8: 1a)'],
      archivedExerciseSelectedIndex: -1,

      randomExerciseDifficultySelectedIndex: 0,

      dnf: '',
      knf: '',
      quineClassesMin: [],
      quineClassesMax: [],
      primeTermsMin: '',
      primeTermsMax: '',
      primeTableMin: {},
      primeTableMax: {},
      petrickStatementMin: {},
      petrickStatementMax: {},
      dmf: '',
      kmf: '',

      literalNames: [],
      someOptimizationsFinished: false,
      showMsgKVDiagramMustNotBeEmptyOrFull: false,

      primetableStepsAmount: 0,
      primetableCurrentStepIndex: 0,
    };
  },

  computed: {
    randomExercisesDifficulties() {
      return [
        'leicht',
        'mittel',
        'schwierig',
      ];
    },
    /**
     * Computes current color matrix of the cover table. Cells of
     * the cover table reference this computed value thru vue
     */
    primeTableColorMatrixObj() {
      console.log('color Matrix is being recomputed');

      const colorMatrix = [];
      let highlightedCellRow = -1;
      let highlightedCellColumn = -1;

      const primetableObj = this.primeTableMin;

      const cellClassDefault = 'primetable-cell-default';
      const cellClassCore = 'primetable-cell-core';
      const cellClassCovered = 'primetable-cell-covered';
      const cellClassCrossedOut = 'primetable-cell-crossed-out';

      // generate default (uncolored) matrix
      for (let col = 0; col <= primetableObj.baseTerms.length; col += 1) {
        colorMatrix[col] = [];
        for (let row = 0; row <= primetableObj.primeTerms.length; row += 1) {
          colorMatrix[col][row] = cellClassDefault;
        }
      }

      // iterate through steps to get desired color scheme
      for (let s = 0; s < this.primetableCurrentStepIndex; s += 1) {
        const step = primetableObj.steps[s];
        const actionType = step.actionType;
        switch (actionType) {
          case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_FOUND_CORE:
            // // color primeterm and cross
            // colorMatrix[0][step.core + 1] = cellClassCore;
            // colorMatrix[step.column + 1][step.core + 1] = cellClassCore;
            // color row
            for (let col = 0; col < colorMatrix.length; col += 1) {
              colorMatrix[col][step.core + 1] = cellClassCore;
            }
            // color column
            for (let row = 0; row < colorMatrix[0].length; row += 1) {
              colorMatrix[step.column + 1][row] = cellClassCore;
            }
            highlightedCellRow = step.core + 1;
            highlightedCellColumn = step.column + 1;
            break;
          case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_CROSS_COLUMN_BC_COVERED:
            // color column
            for (let row = 0; row < colorMatrix[0].length; row += 1) {
              colorMatrix[step.column + 1][row] = cellClassCovered;
            }
            highlightedCellRow = step.coveredBy + 1;
            highlightedCellColumn = step.column + 1;
            break;
          case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_CROSS_ROW_BC_COVERED:
            // color row
            for (let col = 0; col < colorMatrix.length; col += 1) {
              colorMatrix[col][step.row + 1] = cellClassCovered;
            }
            highlightedCellRow = step.row + 1;
            highlightedCellColumn = 0;
            break;
          case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_ROW_DOMINATION:
            // color row
            for (let col = 0; col < colorMatrix.length; col += 1) {
              colorMatrix[col][step.dominated + 1] = cellClassCrossedOut;
            }
            highlightedCellRow = step.dominator + 1;
            highlightedCellColumn = 0;
            // console.log(`Z. ${step.dominator} dominiert Z. ${step.dominated}`);
            break;
          case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_COLUMN_DOMINATION:
            // color column
            for (let row = 0; row < colorMatrix[0].length; row += 1) {
              colorMatrix[step.dominator + 1][row] = cellClassCrossedOut;
            }
            highlightedCellRow = 0;
            highlightedCellColumn = step.dominated + 1;
            break;
          case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_HAS_CYCLIC_REST:
            highlightedCellRow = -1;
            highlightedCellColumn = -1;
            break;
          default:
            console.error(`err in cover table: specified actionType in Step object ('${actionType}') is unknown.`);
        }
      }

      return {
        matrix: colorMatrix,
        highlightedCellRow,
        highlightedCellColumn,
      };
    },
    primeTableCurrentExplanation() {
      const primetableObj = this.primeTableMin;

      if (this.primetableCurrentStepIndex === 0) {
        return '<h4>Initialer Schritt:</h4>'
          + 'Trage spaltenweise alle Basisterme(Einsstellen) und reihenweise alle Primimplikanten in die Tabelle ein.'
          + '<br>Überdeckt ein Primterm eine Einstelle, markiere jene Zelle mit einem X.'
          + '<br>Die Kosten c eines Primterms sind die Anzahl seiner Literale. Je mehr, desto teurer die Umsetzung in Hardware.'
          + '<br><br>Tipp:'
          + '<br>Ein Primimplikant(/at) überdeckt eine Einstelle(/Nullstelle) genau dann, wenn alle Literale des Primterms auch genauso im Basisterm vorkommen';
      }
      const step = primetableObj.steps[this.primetableCurrentStepIndex - 1];
      switch (step.actionType) {
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_FOUND_CORE:
          return '<h4>Kern gefunden:</h4>'
            + `Der einzige Primterm, der die Einstelle ${this.primeTableBaseTermIndices[step.column]} überdeckt, ist Term ${this.nthLetter(step.core + 1)}.`
            + '<br>Dieser Primterm muss also unbedingt in unserer Schaltfunktion vorkommen!'
            + '<br>Markiere die Zeile als Kern und streiche die Spalte heraus.';
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_CROSS_COLUMN_BC_COVERED:
          return '<h4>Spalte bereits abgedeckt:</h4>'
            + `Die Spalte ${this.primeTableBaseTermIndices[step.column]} wird bereits vom Primterm ${this.nthLetter(step.coveredBy + 1)} überdeckt.`
            + '<br>Streiche die Spalte heraus.';
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_CROSS_ROW_BC_COVERED:
          return '<h4>Reihe bereits bereits vollständig abgedeckt:</h4>'
            + `Alles X'e der Reihe ${this.nthLetter(step.coveredBy + 1)} werden bereits abgedeckt.`
            + '<br>Streiche die Reihe heraus.';
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_ROW_DOMINATION:
          return '<h4>Zeilendominanz:</h4>'
            + `Die Reihe ${this.nthLetter(step.dominator + 1)} dominiert die Zeile ${this.nthLetter(step.dominated + 1)};`
            + `<br>d.h. ${this.nthLetter(step.dominator + 1)} besitzt überall da Markierungen, wo Zeile ${this.nthLetter(step.dominated + 1)} auch welche besitzt (und vielleicht sogar mehr!).`
            + `<br>=> Streiche die dominieRTE Zeile ${this.nthLetter(step.dominated + 1)}.`
            + `<br>Beachte, dass die Zeilendominanz nur anwendbar ist, da die Zeile ${this.nthLetter(step.dominator + 1)} weniger oder genauso viel kostet wie ${this.nthLetter(step.dominated + 1)}; `
            + `bzw. weil es keine andere Zeile gibt, die die zusätzlichen Einstellen von ${this.nthLetter(step.dominator + 1)} überdeckt und weniger als ${this.nthLetter(step.dominator + 1)} - ${this.nthLetter(step.dominated + 1)} kosten.`;
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_COLUMN_DOMINATION:
          return '<h4>Spaltendominanz:</h4>'
            + `Die Spalte ${this.primeTableBaseTermIndices[step.dominator]} dominiert die Spalte ${this.primeTableBaseTermIndices[step.dominated]};`
            + `<br>d.h. ${this.primeTableBaseTermIndices[step.dominator]} besitzt überall da Markierungen, wo Spalte ${this.primeTableBaseTermIndices[step.dominated]} auch welche besitzt (und vielleicht sogar mehr!).`
            + `<br>=> Streiche die dominieRENDE Spalte ${step.dominator}`
            + '<br>Im Gegensatz zur Zeilendominanz muss bei der Spaltendominanz überhaupt nicht auf Kosten geachtet werden (/▽＼)';
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_HAS_CYCLIC_REST:
          return '<h4>Zyklischer Rest:</h4>'
            + 'Keine Regel der Überdeckungstabelle ist anwendbar. Man spricht hierbei von einem \'Zyklischem Rest\'.'
            + '<br>Um nun dennoch eine Minimalform der Schaltfunktion bestimmen zu können, bietet sich eine Aufstellung des Petrick Ausdrucks an.';
        default:
          return `actionType of Step obj unknown: '${step.actionType}'`;
      }
    },
    primeTableBaseTermIndices() {
      const baseTerms = this.primeTableMin.baseTerms;
      const indices = [];
      for (let b = 0; b < baseTerms.length; b += 1) {
        const baseTerm = baseTerms[b];
        const index = parseInt(baseTerm.getTerms().map(bfliteral => (bfliteral.isNegated() ? '0' : '1')).reverse().join(''), 2);
        indices[b] = index;
      }
      return indices;
    },
    archivedExerciseTitles() {
      return bfGetArchivedExerciseTitles();
    },
  },
  methods: {
    created() {
      if (window.MathJax) {
        window.MathJax.typeset();
      }
    },
    selectArchivedExercise(num, exerciseIndex) {
      this.archivedExerciseSelectedIndex = exerciseIndex;
    },
    selectRandomExerciseDifficulty(num, difficultyIndex) {
      this.randomExerciseDifficultySelectedIndex = difficultyIndex;
    },
    optimize() {
      const kvdiagramVue = this.$refs.childKVDiagram;
      const kvdiagram = kvdiagramVue.getKVDiagram();

      const varNames = kvdiagramVue.getSelectedVarNames();
      this.literalNames = varNames;

      let optimizations;
      try {
        optimizations = optimizeBooleanFunction(kvdiagram);
      } catch (e) {
        this.showMsgKVDiagramMustNotBeEmptyOrFull = true;
        this.someOptimizationsFinished = false;
        console.log(e);
        return;
      }
      this.showMsgKVDiagramMustNotBeEmptyOrFull = false;

      // put optimizations on screen
      this.dnf = optimizations.dnf.toLatex(varNames);
      this.knf = optimizations.knf.toLatex(varNames);

      // QuineClasses (convert terms in cells of 2d (3d) matrix to latex strings)
      this.quineClassesMin = optimizations.quineClasses['min-terms'].map(
        qLayer => qLayer.map(
          qLayerInner => qLayerInner.map(
            termTuple => [termTuple[0].toLatex(varNames), termTuple[1]],
          ),
        ).slice().reverse(),
      ).slice().reverse();
      this.quineClassesMax = optimizations.quineClasses['max-terms'].map(
        qLayer => qLayer.map(
          qLayerInner => qLayerInner.map(
            termTuple => [termTuple[0].toLatex(varNames), termTuple[1]],
          ),
        ).slice().reverse(),
      ).slice().reverse();

      // Prime terms
      this.primeTermsMin = optimizations.primes['min-terms'].map(pt => pt.toLatex(varNames));
      this.primeTermsMax = optimizations.primes['max-terms'].map(pt => pt.toLatex(varNames));

      // Prime table
      this.primeTableMin = optimizations.primeTable['min-terms'];
      this.primeTableMax = optimizations.primeTable['max-terms'];
      this.resetPrimeTable();

      // Petrick statement
      this.petrickStatementMin = optimizations.petrickStatement['min-terms'];
      this.petrickStatementMax = optimizations.petrickStatement['max-terms'];

      // minimal forms
      this.dmf = optimizations.dmf.toLatex(varNames);
      this.kmf = optimizations.kmf.toLatex(varNames);

      this.someOptimizationsFinished = true;
    },
    resetPrimeTable() {
      this.primetableCurrentStepIndex = 0;
      this.primetableStepsAmount = this.primeTableMin.steps.length;
    },
    primetableStepForward() {
      if (this.primetableCurrentStepIndex >= this.primetableStepsAmount) {
        return;
      }
      this.primetableCurrentStepIndex += 1;

      // this.primetableUpdate();
    },
    primetableStepBackward() {
      if (this.primetableCurrentStepIndex <= 0) {
        return;
      }
      this.primetableCurrentStepIndex -= 1;

      // this.primetableUpdate();
    },
    loadArchivedExercise() {
      const index = this.archivedExerciseSelectedIndex;
      if (index < 0) {
        return;
      }

      const kvdiagramVue = this.$refs.childKVDiagram;
      kvdiagramVue.setKVDiagram(
        bfLoadArchivedExercise(index).data,
      );

      this.optimize();
    },
    generateRandomExercise() {
      let primetermsMin;
      let primetermsMax;
      let numvars;

      switch (parseInt(this.randomExerciseDifficultySelectedIndex, 10)) {
        case 2:
          primetermsMin = 3;
          primetermsMax = 4;
          numvars = 4;
          break;
        case 1:
          primetermsMin = 2;
          primetermsMax = 2;
          numvars = 4;
          break;
        case 0:
        default:
          primetermsMin = 1;
          primetermsMax = 2;
          numvars = 3;
          break;
      }

      // console.log(primetermsMin, primetermsMax, numvars);
      // TODO put the entire criteria checking into the backend as well
      // generate random KVDiagrams until one fits the criteria
      let kvdiagram;
      let primesArray;
      do {
        kvdiagram = generateRandomKVDiagram(numvars, true);
        // console.log(kvdiagram);
        // console.log(computePrimesFromKV(kvdiagram));
        primesArray = computePrimesFromKV(kvdiagram)['min-terms'];
      } while (primesArray.length < primetermsMin || primesArray.length > primetermsMax);

      const kvdiagramVue = this.$refs.childKVDiagram;
      kvdiagramVue.setKVDiagram(
        kvdiagram,
      );

      this.someOptimizationsFinished = false;
    },
    unblurDOM(event) {
      event.target.classList.remove('blurred');
      // console.log(event.target)
    },
    nthLetter(n) {
      // 1 -> A
      return String.fromCharCode('A'.charCodeAt(0) + n - 1);
    },
    toSvg(formula) {
      // TODO the '/cancel{}' latex coding needs another library. It will be lazy loaded upon
      // rendering, but only after the first render fails. (expand QuineCluskeyClasses accordion to see)
      // console.log('executing to svg');
      const formulaSVG = window.MathJax.tex2svg(formula);
      const svgmath = formulaSVG.getElementsByTagName('svg')[0];
      return svgmath.outerHTML;
    },
  },
};
</script>


<style scoped lang="scss">
  @media screen and (max-width: 1400px) {
    .tab {
      width: 95% !important;
    }
    .bf-main-accordion-container {
      width: 100% !important;
    }
  }
  .tab {
    margin: auto;
    // width: 1240px;
    padding: 8px;
    padding-bottom: 1.5em;
    background: $transparentWhite;
  }

  .boolean-function-input-container {
    // .boolean-function-input-container-divider {
    //   // margin: 5px 0 5px 0;
    // }

    .kvdiagram, .exercise-selection-container {
      display: inline-block;
      border-style: solid;
      border-width: 1px;
      border-color: rgba($lightBlue, 0.5);
      border-radius: 1.7em;
      padding: .8em;
      margin-left: .8em;
      margin-right: .8em;
    }

    .exercise-selection-container {
      .exercive-selection-container-tooltip {
        margin-bottom: .5em;
      }
    }

    .boolean-function-button-optimize {
      margin: 1.5em 0 0 0;
    }
  }

  .bf-main-accordion-container {
    width: 60%;
    margin:auto;
  }
  // .optimizationsContainer {
  //   font-size: 1.2em;
  // }
  .svg-text {
    font-size: 1.3em;
  }
  .term {
    margin-left: .5em;
  }
  .termcollection {
    padding-right: .5em;
  }
  .bf-primetable {
    margin-left: auto;
    margin-right: auto;
    border-style: solid;
    border-width: 2px;
    border-collapse: collapse;
    border-color: black;

    th, td {
      border-style: solid;
      border-width: 1px;
      // padding: 2px 3px 2px 3px;
      width: 1.1em;
    }

    .primetable-cell-core {
      background-color: lightgreen;
    }
    .primetable-cell-covered {
      background-color: darkgray;
    }
    .primetable-cell-crossed-out {
      background-color: red;
    }
    .primetable-cell-default {
      background-color: white;
    }

    .primetable-highlighted-cell {
      color: red;
      font-weight: bold;
    }
  }
  .bf-primetable-controls {
    margin-top: 4px;
    button {
      margin: 0 4px 0 4px;
    }
    button:disabled {
      background-color: $lightBlue;
    }
  }

  .blurred {
    filter: blur(1em);
    -webkit-filter: blur(1em);
  }

  .quine-class-single-class-container {
    text-align: left;
  }

  .horizontalbar {
    width: 90%;
    margin: 1.5em auto 1.5em auto;
    height: 1px;
    background-color: rgba($lightBlue, 0.5);
  }
</style>
