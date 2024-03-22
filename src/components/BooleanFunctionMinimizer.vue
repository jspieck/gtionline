<template>
  <div>
    <div class="mainarea">
      <h3>{{$t('functionMin')}}<InfoBlob>
        <span v-html="$t('bf_infoblob_functionMin')"></span>
      </InfoBlob></h3>
      <div class="boolean-function-input-container">
        <div>
          <div class="exercise-selection-container">
            <div class="exercise-selection-container-tooltip">{{$t('exerciseArchive')}}:</div>
            <div>
              <FSelect :options="archivedExerciseTitles" :sel="0"
                @input="selectArchivedExercise"/>
              <button @click="loadArchivedExercise">{{$t('load')}}</button>
            </div>
          </div>
          <div class="exercise-selection-container">
            <div class="exercise-selection-container-tooltip">
              {{$t('randomExercise')}}:
              <span class="infoblob-wrapper">
                <InfoBlob>
                  <span v-html="$t('bf_infoblob_random_exercise_selection')"></span>
                </InfoBlob>
              </span>
            </div>
            <div class="exercise-selection-container-subsection">
              <span>{{$t('goal')}}:</span>
              <FSelect :options="randomExercisesGoalsTitles" class="leftMargin10" :sel="0"
                @input="selectRandomExerciseGoal"/>
            </div>
            <div>
              <span>{{$t('difficultyUC')}}:</span>
              <FSelect :options="randomExercisesDifficulties" :sel="0" class="leftMargin10"
                @input="selectRandomExerciseDifficulty"/>
              <button @click="generateRandomExercise">{{$t('load')}}</button>
            </div>
          </div>
        </div>

        <p class="boolean-function-input-container-divider">{{$t('bf_infotext_or_interact_with_kv')}}:</p>

        <div>
          <BooleanFunctionInputDevice class='bfInputDevice' ref="childBooleanFunctionInputDevice"/>
        </div>
        <!--
        <button @click="this.setMethodOfInputForBooleanFunction(this.METHOD_OF_INPUT_FOR_BOOLEAN_FUNCTION_KVDIAGRAM)">Use KVDiagram</button>
        <button @click="this.setMethodOfInputForBooleanFunction(this.METHOD_OF_INPUT_FOR_BOOLEAN_FUNCTION_FUNCTION_TABLE)">Use Function Table</button>

        <div>
          <KVDiagr class="kvdiagram" ref="childKVDiagram" />
        </div>
        -->

        <button class="boolean-function-button-optimize" @click="optimize()">{{$t('doCalculation')}}</button>

        <!--<button class="boolean-function-button-optimize" @click="downloadSymSVG()">{{$t('downloadSvg')}}</button>-->

        <button class="boolean-function-button-optimize" @click="downloadSymPNG()">{{$t('downloadPng')}}</button>
      </div>

      <div class="horizontalbar"></div>

      <span v-if="this.showMsgKVDiagramMustNotBeEmptyOrFull === true">
        {{$t('bf_infotext_kv_must_not_be_empty')}}
      </span>
      <!-- <div v-else-if="this.someOptimizationsFinished === false"> -->
      <span v-else-if="this.someOptimizationsFinished === false">
        <!-- Klicke auf das KV-Diagram um die Einträge zu verändern und drücke dann auf Berechnen. -->
        <!-- Klicke anschließend auf Berechnen -->
      </span>

      <div v-else class="bf-main-accordion-container">
        <span style="padding-top:3px; padding-right:10px;">
          {{$t('minterms')}}
        </span>
        <ToggleSwitch v-on:toggle="toggleMinMaxTerms" checkedDefault=false />
        <span style="padding-top:3px; padding-left:10px;">
          {{$t('maxterms')}}
        </span>

        <Accordion>
          <AccordionItem>
            <template v-slot:accordion-item-title>
              {{$t('bf_normal_forms')}}
            </template>
            <template v-slot:accordion-item-body>
              <Accordion class="emptyAccordionParentBody">
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    {{$t('bf_disjunctiveNormalForm')}} (DNF)
                  </template>
                  <template v-slot:accordion-item-body>
                    <span>{{$t('bf_disjunctiveNormalForm_explanation')}}</span>
                    <div class="overflowXContainer">
                      <span class="svg-text" v-html="toSvg(dnf)"></span>
                    </div>
                  </template>
                </AccordionItem>
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    {{$t('bf_conjunctiveNormalForm')}} (KNF)
                  </template>
                  <template v-slot:accordion-item-body>
                    <span>{{$t('bf_conjunctiveNormalForm_explanation')}}</span>
                    <div class="overflowXContainer">
                      <span class="svg-text" v-html="toSvg(knf)"/>
                    </div>
                  </template>
                </AccordionItem>
              </Accordion>
            </template>
          </AccordionItem>

          <AccordionItem>
            <template v-slot:accordion-item-title>
              {{$t('bf_quineMCCluskeyClasses')}}
            </template>
            <template v-slot:accordion-item-body>
              <span style="text-align: left">{{$t('bf_quineMCCluskeyClasses_explanation')}}</span>
              <div class="quine-classes-toggle-switch-container">
                <div>
                  <ToggleSwitch v-on:toggle="changeQuineClassesDisplayStyle" checkedDefault=true />
                  <span>{{$t('colorCoding')}}
                    <InfoBlob>
                        <span v-html="$t('bf_infoblob_quineMCCluskeyClasses_colorCoding')"></span>
                    </InfoBlob>
                  </span>
                </div>

                <div>
                  <ToggleSwitch v-on:toggle="changeQuineClassesBinaryDisplayStyle" checkedDefault=false />
                  <span>01-0
                    <InfoBlob>
                        <span v-html="$t('bf_infoblob_quineMCCluskeyClasses_01')"></span>
                    </InfoBlob>
                  </span>
                </div>
              </div>
              <div class="smallTopBottomMargin">{{$t('bf_infotest_click_on_hidden_areas_to_make_visible')}}:</div>
              <!-- Quine Cluskey classes have been reversed in script section for easy access here -->
              <!-- loop through Q_X -->
              <div v-for="(qlayer, qi) in quineClassesCurrent" :key="`quineClassLayerMin_${qi}`">
                <!-- loop through Q_._X -->
                <div v-if="qi < quineClassesCurrent.length - 1" class="blurred" @mousedown="unblurDOM"> <!-- @mouseenter="unblurDOM" -->
                  <div v-for="(qlayerInner, qqi) in quineClassesCurrent[qi]" :key="`quineClassLayerInnerMin_${qqi}`"
                      class="quine-class-single-class-container">
                    <!-- Q{{quineClassesCurrent.length-qi-1}}_{{quineClassesCurrent[qi].length-qqi-1}}: { -->
                    <span class="svg-text" v-html="toSvg(`Q _{${quineClassesCurrent.length-qi-1},\\ ${quineClassesCurrent[qi].length-qqi-1}}:\\{`)"></span>

                    <span class="termcollection">
                      <!-- loop through all terms in Q_x_y -->
                      <span v-for="(qterm, ti) in quineClassesCurrent[qi][qqi]" :key="`quineClassTermMin_${ti}`">
                        <!-- non-reduced term -->
                        <template v-if="!quineClassesCurrent[qi][qqi][ti][1]">
                          <span class="svg-text term" v-html="toSvg(quineClassesCurrent[qi][qqi][ti][
                            quineClassesBinaryDisplayStyle ? 2 : 0
                          ])"/>
                        </template>
                        <!-- reduced term -->
                        <template v-else>
                          <span v-if="!quineClassesColorfulDisplayStyle" class="svg-text term .quine-classes-reduced-term-crossed" v-html="toSvg('\\cancel{' + quineClassesCurrent[qi][qqi][ti][quineClassesBinaryDisplayStyle ? 2 : 0] + '}')"/>
                          <!-- <span v-if="!quineClassesColorfulDisplayStyle" class="svg-text term quine-classes-reduced-term-crossed" v-html="toSvg(quineClassesCurrent[qi][qqi][ti][0])"/> -->
                          <span v-else class="svg-text term quine-classes-reduced-term-colored" v-html="toSvg(quineClassesCurrent[qi][qqi][ti][quineClassesBinaryDisplayStyle ? 2 : 0])"/>
                        </template>

                        <span v-if="ti < quineClassesCurrent[qi][qqi].length - 1" v-html="toSvg(',')"/>
                      </span>
                    </span>

                    <span class="svg-text" v-html="toSvg('\\}')"></span>
                  </div>
                </div>
                <div class="horizontalbarfull" v-if="qi < quineClassesCurrent.length - 2"></div>
              </div>

            </template>
          </AccordionItem>

          <!-- <AccordionItem>
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
          </AccordionItem> -->

          <AccordionItem>
            <template v-slot:accordion-item-title>
              {{$t('bf_primeTerms')}}
            </template>
            <template v-slot:accordion-item-body>
              {{$t('bf_primeTerms_explanation')}}
              <Accordion>
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    {{$t('bf_primeImplicants')}}
                  </template>
                  <template v-slot:accordion-item-body>
                    {{$t('bf_bf_primeImplicants_explanation')}} <br>
                    <div class="overflowXContainer">
                      <span v-for="i in primeTermsMin.length" :key="`primeTermMinID_${i}`">
                        <!-- Term + potential comma -->
                        <span class="svg-text term" v-html="toSvg(primeTermsMin[i-1] + `${i-1 < primeTermsMin.length - 1 ? ',' : ''}`)"/>
                      </span>
                    </div>
                  </template>
                </AccordionItem>
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    {{$t('bf_primeImplicates')}}
                  </template>
                  <template v-slot:accordion-item-body>
                      {{$t('bf_primeImplicates_explanation')}} <br>
                      <div class="overflowXContainer">
                        <span v-for="i in primeTermsMax.length" :key="`primeTermMaxID_${i}`">
                          <!-- Term + potential comma -->
                          <span class="svg-text term" v-html="toSvg(primeTermsMax[i-1] + `${i-1 < primeTermsMax.length - 1 ? ',' : ''}`)"/>
                        </span>
                      </div>
                  </template>
                </AccordionItem>
              </Accordion>
            </template>
          </AccordionItem>

          <AccordionItem>
            <template v-slot:accordion-item-title>
              {{$t('bf_primeCoverTable')}}
            </template>
            <template v-slot:accordion-item-body>
              <div class="primeTableContainer">
                <table class="bf-primetable">
                  <!-- Top row -->
                  <tr>
                    <!-- Empty cells in top left -->
                    <td></td>
                    <td :class="primeTableColorMatrixObj.matrix[0][0]"> PI </td>
                    <!-- Base terms -->
                    <th v-for="(bt, col) in primeTableCurrent.baseTerms" :key="`primeTableCurrentTR_${col}`"
                        :class="[
                          primeTableColorMatrixObj.matrix[col+1][0],
                          (primeTableColorMatrixObj.highlightedCellRow === 0
                          && primeTableColorMatrixObj.highlightedCellColumn === col+1)
                          ? 'primetable-highlighted-cell' : ''
                        ]"
                    >
                    {{primeTableBaseTermIndices[col]}}
                    </th>

                    <!-- Cost column -->
                    <th v-html="toSvg('c_{i}')" class="svg-text"/>
                  </tr>

                  <!-- body of table -->
                  <tr v-for="(pt, row) in primeTableCurrent.primeTerms" :key="`primeTableCurrentRow_${row}`">
                    <!-- prime term on the left -->
                    <td>{{nthLetter(row + 1)}}</td>
                    <th class="svg-text" v-html="toSvg(pt.toLatex(literalNames))"
                        :class="[
                          primeTableColorMatrixObj.matrix[0][row+1],
                          (primeTableColorMatrixObj.highlightedCellRow === row + 1 && primeTableColorMatrixObj.highlightedCellColumn === 0) ? 'primetable-highlighted-cell' : ''
                        ]"
                    />

                    <!-- Crosses -->
                    <td v-for="col in primeTableCurrent.coverTable.length" :key="`primeTableCurrentCell_${row}_${col}`"
                        :class="primeTableColorMatrixObj.matrix[col][row+1]"
                    >
                      <span v-if="primeTableCurrent.coverTable[col-1][row] === true"
                          :class="(primeTableColorMatrixObj.highlightedCellRow === row + 1 && primeTableColorMatrixObj.highlightedCellColumn === col) ? 'primetable-highlighted-cell' : ''">
                        X
                      </span>
                    </td>

                    <!-- Cost -->
                    <td>{{primeTableCurrent.primeTerms[row].getTerms().length}}</td>
                  </tr>
                </table>
              </div>

              <div class="bf-primetable-controls">
                <button @click='primetableStepBackward' :disabled="primetableCurrentStepIndex === 0">
                  &larr;
                </button>
                <span class="control-text">{{$t('step')}}
                  <span>{{primetableCurrentStepIndex}} / {{primetableStepsAmount}}</span>
                </span>
                <button @click='primetableStepForward' :disabled="primetableCurrentStepIndex === primetableStepsAmount">
                  &rarr;
                </button>
              </div>
              <div class="explanation-text">
                <div class="hiddenLongText" v-html="this.$t('bf_covertable_step_description_initial', {
                   ifMinTermsEinstelleElseNullstelle: this.$t('bf_einstelle'),
                    ifMinTermsEinstellenElseNullstellen: this.$t('bf_einstelle'),
                    ifMinTermsNullstelleElseEinstelle: this.$t('bf_einstelle'),
                    ifMinTermsNullstellenElseEinstellen: this.$t('bf_einstelle'),
                })"></div>
                <div class="bf-primetable-step-explanation" v-html="primeTableCurrentExplanation"></div>
              </div>
            </template>
          </AccordionItem>

          <AccordionItem :expandableSideways="true">
            <template v-slot:accordion-item-title>
              {{$t('bf_petrickExpression')}}
            </template>
            <template v-slot:accordion-item-body>
              <!-- <div><span v-html="toSvg(petrickStatementCurrent.expressionDirectStr + '=1')"/><span> | Absorption + Idempotenz</span></div>
              <div><span v-html="toSvg(petrickStatementCurrent.expressionAbsorbedStr + '=1')"/><span> | {{$t('mathDistribution')}}</span></div>
              <div><span v-html="toSvg(petrickStatementCurrent.expressionExpandedStr + '=1')"/><span> | Absorption + Idempotenz</span></div>
              <div><span v-html="toSvg(petrickStatementCurrent.expressionStr + '=1')"/></div> -->
              <div class="bf-petrick-statement-container">
                <span v-if="petrickStatementCurrent.steps.length > 4" class="infoblob-wrapper">
                  <InfoBlob>
                    <span v-html="$t('bf_infoblob_petrick_statement')" class="petrick-statement-infoblob-ol"></span>
                  </InfoBlob>
                </span>
                <div v-for="(step, s) in petrickStatementCurrent.steps" :key="s" class="bf-petrick-statement-subcontainer">
                  <span v-html="toSvg(step.bf.toLatex('ABCDEFGHIJKLMNOPQRSTUVPXYZ'.split(''), false) + ' = 1')"></span>
                  <span v-if="s < petrickStatementCurrent.steps.length - 1">
                    | {{ getTextFromPetrickStatementActionType(petrickStatementCurrent.steps[s+1].actionType) }}
                  </span>

                  <!-- Math explanations also rendered as svg: -->
                  <!-- <span v-html="toSvg(step.bf.toLatex('ABCDEFGHIJKLMNOPQRSTUVPXYZ'.split(''), false) + ' = 1')"></span>
                  <span v-if="s < petrickStatementCurrent.steps.length - 1" v-html="toSvg(' | ' + getTextFromPetrickStatementActionType(petrickStatementCurrent.steps[s+1].actionType) )" /> -->
                </div>
              </div>
            </template>
          </AccordionItem>

          <AccordionItem>
            <template v-slot:accordion-item-title>
              {{$t('bf_minimalForms')}}
            </template>
            <template v-slot:accordion-item-body>
              <Accordion class="emptyAccordionParentBody">
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    {{$t('bf_disjunctiveMinimalForm')}} (DMF)
                  </template>
                  <template v-slot:accordion-item-body>
                    {{$t('bf_disjunctiveMinimalForm_explanation')}} <br>
                    <div class="overflowXContainer">
                      <span class="svg-text" v-html="toSvg(dmf)"></span>
                    </div>
                  </template>
                </AccordionItem>
                <AccordionItem>
                  <template v-slot:accordion-item-title>
                    {{$t('bf_conjunctiveMinimalForm')}} (KMF)
                  </template>
                  <template v-slot:accordion-item-body>
                    {{$t('bf_conjunctiveMinimalForm_explanation')}} <br>
                    <div class="overflowXContainer">
                      <span class="svg-text" v-html="toSvg(kmf)"></span>
                    </div>
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
  optimizeBooleanFunction, generateRandomKVDiagram, BooleanFunctionUtil, // computePrimesFromKV,
  BOOLEAN_FUNCTION_PRIME_TABLES_STEP_FOUND_CORE, BOOLEAN_FUNCTION_PRIME_TABLES_STEP_CROSS_COLUMN_BC_COVERED,
  BOOLEAN_FUNCTION_PRIME_TABLES_STEP_ROW_DOMINATION, BOOLEAN_FUNCTION_PRIME_TABLES_STEP_COLUMN_DOMINATION,
  BOOLEAN_FUNCTION_PRIME_TABLES_STEP_CROSS_ROW_BC_COVERED, BOOLEAN_FUNCTION_PRIME_TABLES_STEP_HAS_CYCLIC_REST,
  BOOLEAN_FUNCTION_PETRICK_STATEMENT_STEP_INITIAL, BOOLEAN_FUNCTION_PETRICK_STATEMENT_STEP_DISTRIBUTION,
  BOOLEAN_FUNCTION_PETRICK_STATEMENT_STEP_IDEMPOTENCE, BOOLEAN_FUNCTION_PETRICK_STATEMENT_STEP_ABSORPTION,
  BOOLEAN_FUNCTION_PETRICK_STATEMENT_STEP_SORTING,
} from '@/scripts/gti-tools';
import { bfLoadArchivedExercise, bfGetArchivedExerciseTitles } from '@/scripts/bfArchivedExercises';
import BooleanFunctionInputDevice from './BooleanFunctionInputDevice.vue';
// import KVDiagram from './KVDiagram.vue';
import Accordion from './EmbeddedAccordion.vue';
import AccordionItem from './EmbeddedAccordionItem.vue';
import FormatSelect from './FormatSelect.vue';
import ToggleSwitch from './ToggleSwitch.vue';
import InfoBlob from './InfoBlob.vue';

export default {
  name: 'BooleanFunctionMinimizer',
  components: {
    // KVDiagr: KVDiagram,
    Accordion,
    AccordionItem,
    FSelect: FormatSelect,
    ToggleSwitch,
    InfoBlob,
    BooleanFunctionInputDevice,
  },
  data() {
    return {
      // archivedExercises: ['Blatt 5: 1d)', 'Blatt 7: 1b)', 'Blatt 8: 1a)'],
      archivedExerciseSelectedIndex: 0,

      randomExerciseDifficultySelectedIndex: 0,
      randomExerciseGoalSelectedIndex: 0,

      indexBaseSystem: 8,

      useMinNotMaxTermDisplayStyle: true,

      dnf: '',
      knf: '',
      quineClassesCurrent: [], // responsive
      quineClassesMin: [],
      quineClassesMax: [],
      primeTermsCurrent: '', // responsive
      primeTermsMin: '',
      primeTermsMax: '',
      primeTableCurrent: {}, // responsive
      primeTableMin: {},
      primeTableMax: {},
      petrickStatementCurrent: {}, // responsive
      petrickStatementMin: {},
      petrickStatementMax: {},
      dmf: '',
      kmf: '',

      literalNames: [],
      someOptimizationsFinished: false,
      showMsgKVDiagramMustNotBeEmptyOrFull: false,

      quineClassesColorfulDisplayStyle: false,
      quineClassesBinaryDisplayStyle: false,

      primetableStepsAmount: 0,
      primetableCurrentStepIndex: 0,
    };
  },
  created() {
    this.methodOfInputForBooleanFunction = this.METHOD_OF_INPUT_FOR_BOOLEAN_FUNCTION_KVDIAGRAM;
    if (window.MathJax) {
      window.MathJax.typeset();
    }
    if (window.MathJax) {
      // console.log('loading library');
      // Loading a library that is needed only in this component:
      // Telling Mathjax to load this library before loading the MathJax
      // script globally did not work, perhaps the current implementation
      // could also be indeterministic in regards to Vue components executing
      // MathJax commands, before the MathJax script has been downloaded.
      // Perhaps adding another library to download at the beginning
      // made for a too big delay, such only initializing MathJax after vue
      // had started rendering components.
      // But honestly this solution is pretty sleek and this lazy loading is cool.
      try {
        this.toSvg('(\\require{cancel})');
      } catch (_) {} // eslint-disable-line no-empty
    } else {
      console.error('Upon created() call of BooleanFunctionMinimizer comp. MathJax was not yet initialized.');
    }
  },
  computed: {
    randomExercisesDifficulties() {
      return [
        this.$t('easy'),
        this.$t('difficultyMiddle'),
        this.$t('difficultyHard'),
      ];
    },
    randomExercisesGoalsMetrics() {
      // TODO: translation
      return [
        {
          title: this.$t('bf_goal_determine_DNF'),
          difficulties: [
            {
              numVarsMin: 2,
              numVarsMax: 3,
              numMintermsMin: 2,
              numMintermsMax: 4,
            },
            {
              numVarsMin: 3,
              numVarsMax: 4,
              numMintermsMin: 4,
              numMintermsMax: 7,
            },
            {
              numVarsMin: 4,
              numVarsMax: 5,
              numMintermsMin: 6,
            },
          ],
        },
        {
          title: this.$t('bf_goal_determine_KNF'),
          difficulties: [
            {
              numVarsMin: 2,
              numVarsMax: 3,
              numMaxtermsMin: 2,
              numMaxtermsMax: 4,
            },
            {
              numVarsMin: 3,
              numVarsMax: 4,
              numMaxtermsMin: 4,
              numMaxtermsMax: 7,
            },
            {
              numVarsMin: 4,
              numVarsMax: 5,
              numMaxtermsMin: 6,
            },
          ],
        },
        {
          title: this.$t('bf_goal_determine_prime_implicants'),
          difficulties: [
            {
              numVarsMin: 2,
              numVarsMax: 3,
              numPrimeimplicantsMin: 1,
              numPrimeimplicantsMax: 2,
            },
            {
              numVarsMin: 3,
              numVarsMax: 4,
              numPrimeimplicantsMin: 2,
              numPrimeimplicantsMax: 4,
            },
            {
              numVarsMin: 4,
              numVarsMax: 5,
              numMintermsMin: 7,
              numPrimeimplicantsMin: 3,
            },
          ],
        },
        {
          title: this.$t('bf_goal_determine_prime_implicates'),
          difficulties: [
            {
              numVarsMin: 2,
              numVarsMax: 3,
              numPrimeimplicatesMin: 1,
              numPrimeimplicatesMax: 2,
            },
            {
              numVarsMin: 3,
              numVarsMax: 4,
              numPrimeimplicatesMin: 2,
              numPrimeimplicatesMax: 4,
            },
            {
              numVarsMin: 4,
              numVarsMax: 5,
              numMaxtermsMin: 7,
              numPrimeimplicatesMin: 3,
            },
          ],
        },
      ];
    },
    randomExercisesGoalsTitles() {
      return this.randomExercisesGoalsMetrics.map(goal => goal.title);
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

      const primetableObj = this.primeTableCurrent;

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
      const primetableObj = this.primeTableCurrent;

      if (this.primetableCurrentStepIndex === 0) {
        // return '<h4>Initialer Schritt:</h4>'
        //   + 'Trage spaltenweise alle Basisterme (Einsstellen) und reihenweise alle Primimplikanten (PI) in die Tabelle ein. '
        //   + 'Überdeckt ein Primterm eine Einstelle, markiere jene Zelle mit einem X. '
        //   + 'Die Kosten c eines Primterms sind die Anzahl seiner Literale. Je höher, desto aufwändiger (teurer) die Umsetzung in Hardware. '
        //   + '<br>Tipp:<br>'
        //   + 'Ein Primimplikant überdeckt eine Einstelle genau dann, wenn alle Literale des Primterms auch genauso im Basisterm vorkommen';
        return this.$t('bf_covertable_step_description_initial', {
          ifMinTermsEinstelleElseNullstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstelle') : this.$t('bf_nullstelle'),
          ifMinTermsEinstellenElseNullstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstellen') : this.$t('bf_nullstellen'),
          ifMinTermsNullstelleElseEinstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstelle') : this.$t('bf_einstelle'),
          ifMinTermsNullstellenElseEinstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstellen') : this.$t('bf_einstellen'),
        });
      }
      const step = primetableObj.steps[this.primetableCurrentStepIndex - 1];
      switch (step.actionType) {
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_FOUND_CORE:
          // return '<h4>Kern gefunden:</h4>'
          //   + `Der einzige Primterm, der die Einstelle ${this.primeTableBaseTermIndices[step.column]} überdeckt, ist Term ${this.nthLetter(step.core + 1)}. `
          //   + 'Dieser Primterm muss also unbedingt in unserer Schaltfunktion vorkommen! '
          //   + 'Markiere die Zeile als Kern und streiche die Spalte heraus.';

          return this.$t('bf_covertable_step_description_core_found', {
            columnName: this.primeTableBaseTermIndices[step.column],
            rowName: this.nthLetter(step.core + 1),
            ifMinTermsEinstelleElseNullstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstelle') : this.$t('bf_nullstelle'),
            ifMinTermsEinstellenElseNullstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstellen') : this.$t('bf_nullstellen'),
            ifMinTermsNullstelleElseEinstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstelle') : this.$t('bf_einstelle'),
            ifMinTermsNullstellenElseEinstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstellen') : this.$t('bf_einstellen'),
          });
          // return this.$t('bf_covertable_step_description_core_found').replace('$$$COLUMN_NAME$$$', this.primeTableBaseTermIndices[step.column]);
          // //   columnName: this.primeTableBaseTermIndices[step.column],
          // //   rowName: this.nthLetter(step.core + 1),
          // // });
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_CROSS_COLUMN_BC_COVERED:
          // return '<h4>Spalte bereits abgedeckt:</h4>'
          //   + `Die Spalte ${this.primeTableBaseTermIndices[step.column]} wird bereits vom Primterm ${this.nthLetter(step.coveredBy + 1)} überdeckt. `
          //   + 'Streiche die Spalte heraus.';
          return this.$t('bf_covertable_step_description_cross_column_bc_covered', {
            columnName: this.primeTableBaseTermIndices[step.column],
            rowName: this.nthLetter(step.coveredBy + 1),
            ifMinTermsEinstelleElseNullstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstelle') : this.$t('bf_nullstelle'),
            ifMinTermsEinstellenElseNullstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstellen') : this.$t('bf_nullstellen'),
            ifMinTermsNullstelleElseEinstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstelle') : this.$t('bf_einstelle'),
            ifMinTermsNullstellenElseEinstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstellen') : this.$t('bf_einstellen'),
          });
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_CROSS_ROW_BC_COVERED:
          // return '<h4>Reihe bereits bereits vollständig abgedeckt:</h4>'
          //   + `Alles X'e der Reihe ${this.nthLetter(step.row + 1)} werden bereits abgedeckt. `
          //   + 'Streiche die Reihe heraus.';
          return this.$t('bf_covertable_step_description_cross_row_bc_covered', {
            rowName: this.nthLetter(step.row + 1),
            ifMinTermsEinstelleElseNullstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstelle') : this.$t('bf_nullstelle'),
            ifMinTermsEinstellenElseNullstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstellen') : this.$t('bf_nullstellen'),
            ifMinTermsNullstelleElseEinstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstelle') : this.$t('bf_einstelle'),
            ifMinTermsNullstellenElseEinstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstellen') : this.$t('bf_einstellen'),
          });
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_ROW_DOMINATION:
          // return '<h4>Zeilendominanz:</h4>'
          //   + `Die Reihe ${this.nthLetter(step.dominator + 1)} dominiert die Zeile ${this.nthLetter(step.dominated + 1)}; `
          //   + `d.h. ${this.nthLetter(step.dominator + 1)} besitzt überall da Markierungen, wo Zeile ${this.nthLetter(step.dominated + 1)} auch welche besitzt (und vielleicht sogar mehr!). `
          //   + `=> Streiche die dominieRTE Zeile ${this.nthLetter(step.dominated + 1)}. `
          //   + `<br>Beachte, dass die Zeilendominanz nur anwendbar ist, da die Zeile ${this.nthLetter(step.dominator + 1)} weniger oder genauso viel kostet wie ${this.nthLetter(step.dominated + 1)}; `
          //   + `bzw. weil es keine andere Zeile gibt, die die zusätzlichen Einstellen von ${this.nthLetter(step.dominator + 1)} überdeckt und weniger als ${this.nthLetter(step.dominator + 1)} - ${this.nthLetter(step.dominated + 1)} kostet.`;
          return this.$t('bf_covertable_step_description_row_domination', {
            dominatorName: this.nthLetter(step.dominator + 1),
            dominatedName: this.nthLetter(step.dominated + 1),
            ifMinTermsEinstelleElseNullstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstelle') : this.$t('bf_nullstelle'),
            ifMinTermsEinstellenElseNullstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstellen') : this.$t('bf_nullstellen'),
            ifMinTermsNullstelleElseEinstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstelle') : this.$t('bf_einstelle'),
            ifMinTermsNullstellenElseEinstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstellen') : this.$t('bf_einstellen'),
          });
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_COLUMN_DOMINATION:
          // return '<h4>Spaltendominanz:</h4>'
          //   + `Die Spalte ${this.primeTableBaseTermIndices[step.dominator]} dominiert die Spalte ${this.primeTableBaseTermIndices[step.dominated]}; `
          //   + `d.h. ${this.primeTableBaseTermIndices[step.dominator]} besitzt überall da Markierungen, wo Spalte ${this.primeTableBaseTermIndices[step.dominated]} auch welche besitzt (und vielleicht sogar mehr!). `
          //   + `=> Streiche die dominieRENDE Spalte ${this.primeTableBaseTermIndices[step.dominator]}`
          //   + '<br>Im Gegensatz zur Zeilendominanz muss bei der Spaltendominanz überhaupt nicht auf Kosten geachtet werden (/▽＼)';
          return this.$t('bf_covertable_step_description_column_domination', {
            dominatorName: this.primeTableBaseTermIndices[step.dominator],
            dominatedName: this.primeTableBaseTermIndices[step.dominated],
            ifMinTermsEinstelleElseNullstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstelle') : this.$t('bf_nullstelle'),
            ifMinTermsEinstellenElseNullstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstellen') : this.$t('bf_nullstellen'),
            ifMinTermsNullstelleElseEinstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstelle') : this.$t('bf_einstelle'),
            ifMinTermsNullstellenElseEinstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstellen') : this.$t('bf_einstellen'),
          });
        case BOOLEAN_FUNCTION_PRIME_TABLES_STEP_HAS_CYCLIC_REST:
          // return '<h4>Zyklischer Rest:</h4>'
          //   + 'Keine Regel der Überdeckungstabelle ist anwendbar. Man spricht hierbei von einem \'Zyklischem Rest\'.'
          //   + '<br>Um nun dennoch eine Minimalform der Schaltfunktion bestimmen zu können, bietet sich eine Aufstellung des Petrick Ausdrucks an.';
          return this.$t('bf_covertable_step_description_cyclic_rest', {
            ifMinTermsEinstelleElseNullstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstelle') : this.$t('bf_nullstelle'),
            ifMinTermsEinstellenElseNullstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_einstellen') : this.$t('bf_nullstellen'),
            ifMinTermsNullstelleElseEinstelle: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstelle') : this.$t('bf_einstelle'),
            ifMinTermsNullstellenElseEinstellen: this.useMinNotMaxTermDisplayStyle ? this.$t('bf_nullstellen') : this.$t('bf_einstellen'),
          });
        default:
          return `ERROR: CoverTable: actionType of Step obj unknown: '${step.actionType}'`;
      }
    },
    primeTableBaseTermIndices() {
      const baseTerms = this.primeTableCurrent.baseTerms;
      const indices = [];
      for (let b = 0; b < baseTerms.length; b += 1) {
        const baseTerm = baseTerms[b];
        const index = parseInt(baseTerm.getTerms().map(bfliteral => (bfliteral.isNegated() ? '0' : '1')).reverse().join(''), 2);
        // Convert index to base format of symmetry diagram
        const indexBase = index.toString(this.indexBaseSystem);
        indices[b] = indexBase;
      }
      return indices;
    },
    archivedExerciseTitles() {
      return bfGetArchivedExerciseTitles(this.$t('sheet'), this.$t('bf_tableWithCyclicRest'));
    },
  },
  methods: {
    downloadSymSVG() {
      const svg = document.getElementById('kvContainer');
      const blob = new Blob([svg.outerHTML.toString()]);
      const element = document.createElement('a');
      element.download = 'sym.svg';
      element.href = window.URL.createObjectURL(blob);
      element.click();
      element.remove();
    },
    downloadSymPNG() { // TODO repair. seems to be broken rn
      const svg = document.getElementById('kvContainer');
      const can = document.createElement('canvas');
      const ctx = can.getContext('2d');
      const loader = new Image();
      const scalingFactor = 3;
      can.width = parseInt(svg.getAttribute('width'), 10) * scalingFactor;
      loader.width = can.width;
      can.height = parseInt(svg.getAttribute('height'), 10) * scalingFactor;
      loader.height = can.height;
      console.log(can.width);
      console.log(can.height);
      loader.onload = () => {
        ctx.drawImage(loader, 0, 0, loader.width, loader.height);
        const exportImg = can.toDataURL();
        const aDownloadLink = document.createElement('a');
        aDownloadLink.download = 'sym.png';
        aDownloadLink.href = exportImg;
        aDownloadLink.click();
      };
      const svgAsXML = (new XMLSerializer()).serializeToString(svg);
      loader.src = `data:image/svg+xml,${encodeURIComponent(svgAsXML)}`;
    },
    selectArchivedExercise(num, exerciseIndex) {
      this.archivedExerciseSelectedIndex = exerciseIndex;
    },
    selectRandomExerciseDifficulty(num, difficultyIndex) {
      this.randomExerciseDifficultySelectedIndex = difficultyIndex;
    },
    selectRandomExerciseGoal(num, goalIndex) {
      this.randomExerciseGoalSelectedIndex = goalIndex;
    },
    optimize() {
      // const kvdiagramVue = this.$refs.childKVDiagram;
      // const kvdiagram = kvdiagramVue.getKVDiagram();

      const bfInputDevice = this.$refs.childBooleanFunctionInputDevice;
      const kvdiagram = bfInputDevice.getBFAsKVDiagram();

      // const varNames = kvdiagramVue.getSelectedVarNames();
      const varNames = bfInputDevice.currentVarNames;
      console.log('compute(): retrieved currentVarNames as attribute from bfInputDevice:');
      console.log(varNames);
      this.literalNames = varNames;

      const numVars = kvdiagram.getAmountLiterals();
      const util = new BooleanFunctionUtil();

      let optimizations;
      try {
        optimizations = optimizeBooleanFunction(kvdiagram);
      } catch (e) {
        this.showMsgKVDiagramMustNotBeEmptyOrFull = true;
        this.someOptimizationsFinished = false;
        // console.log(e);
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
            termTuple => [
              termTuple[0].toLatex(varNames),
              termTuple[1],
              `\\text{${util.computeBinaryStringRepresentationOfBaseTerm(termTuple[0], numVars)}}`,
            ],
          ),
        ).slice().reverse(),
      ).slice().reverse();
      this.quineClassesMax = optimizations.quineClasses['max-terms'].map(
        qLayer => qLayer.map(
          qLayerInner => qLayerInner.map(
            termTuple => [
              termTuple[0].toLatex(varNames),
              termTuple[1],
              `\\text{${util.computeBinaryStringRepresentationOfBaseTerm(termTuple[0], numVars)}}`,
            ],
          ),
        ).slice().reverse(),
      ).slice().reverse();

      console.log(this.quineClassesMin[1][1][0]);

      // Prime terms
      this.primeTermsMin = optimizations.primes['min-terms'].map(pt => pt.toLatex(varNames));
      this.primeTermsMax = optimizations.primes['max-terms'].map(pt => pt.toLatex(varNames));

      // Prime table
      this.primeTableMin = optimizations.primeTable['min-terms'];
      this.primeTableMax = optimizations.primeTable['max-terms'];

      // Petrick statement
      this.petrickStatementMin = optimizations.petrickStatement['min-terms'];
      this.petrickStatementMax = optimizations.petrickStatement['max-terms'];

      // minimal forms
      this.dmf = optimizations.dmf.toLatex(varNames);
      this.kmf = optimizations.kmf.toLatex(varNames);

      this.updateMinMaxDisplayStyle();

      this.resetPrimeTable();
      this.someOptimizationsFinished = true;
    },
    changeQuineClassesDisplayStyle(isToggleSwitchChecked) {
      this.quineClassesColorfulDisplayStyle = isToggleSwitchChecked;
    },
    changeQuineClassesBinaryDisplayStyle(isToggleSwitchChecked) {
      this.quineClassesBinaryDisplayStyle = isToggleSwitchChecked;
    },
    toggleMinMaxTerms(isToggleSwitchChecked) {
      this.useMinNotMaxTermDisplayStyle = !isToggleSwitchChecked;
      this.updateMinMaxDisplayStyle();

      this.resetPrimeTable();
    },
    updateMinMaxDisplayStyle() {
      if (!this.useMinNotMaxTermDisplayStyle) {
        this.quineClassesCurrent = this.quineClassesMax;
        this.primeTermsCurrent = this.primeTermsMax;
        this.primeTableCurrent = this.primeTableMax;
        this.petrickStatementCurrent = this.petrickStatementMax;
      } else {
        this.quineClassesCurrent = this.quineClassesMin;
        this.primeTermsCurrent = this.primeTermsMin;
        this.primeTableCurrent = this.primeTableMin;
        this.petrickStatementCurrent = this.petrickStatementMin;
      }
    },
    resetPrimeTable() {
      this.primetableCurrentStepIndex = 0;
      this.primetableStepsAmount = this.primeTableCurrent.steps.length;
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

      console.log(this.$t('sheet'), this.$t('bf_tableWithCyclicRest'), index);
      // const kvdiagramVue = this.$refs.childKVDiagram;
      const bfInputDevice = this.$refs.childBooleanFunctionInputDevice;

      bfInputDevice.overwriteBFFromKVDiagram(
        bfLoadArchivedExercise(this.$t('sheet'), this.$t('bf_tableWithCyclicRest'), index).data,
      );

      this.someOptimizationsFinished = false;
      // this.optimize();
    },
    generateRandomExercise() {
      // let primetermsMin;
      // let primetermsMax;
      // let numvars;

      // switch (parseInt(this.randomExerciseDifficultySelectedIndex, 10)) {
      //   case 2:
      //     primetermsMin = 3;
      //     primetermsMax = 4;
      //     numvars = 5;
      //     break;
      //   case 1:
      //     primetermsMin = 2;
      //     primetermsMax = 2;
      //     numvars = 4;
      //     break;
      //   case 0:
      //   default:
      //     primetermsMin = 1;
      //     primetermsMax = 2;
      //     numvars = 3;
      //     break;
      // }
      function kvdiagramFitsRequirements(kvdiagram, requirements, bfOptimization) {
        // Minterms amount
        if (requirements.numMinterms !== undefined
            && bfOptimization.dnf.getTerms().length !== requirements.numMinterms) {
          return false;
        }
        // console.log('numMintermsMin: ', requirements.numMintermsMin);
        if (requirements.numMintermsMin !== undefined
            && bfOptimization.dnf.getTerms().length < requirements.numMintermsMin) {
          return false;
        }
        if (requirements.numMintermsMax !== undefined
            && bfOptimization.dnf.getTerms().length > requirements.numMintermsMax) {
          return false;
        }

        // Maxterms amount
        if (requirements.numMaxterms !== undefined
            && bfOptimization.knf.getTerms().length !== requirements.numMaxterms) {
          return false;
        }
        if (requirements.numMaxtermsMin !== undefined
            && bfOptimization.knf.getTerms().length < requirements.numMaxtermsMin) {
          return false;
        }
        if (requirements.numMaxtermsMax !== undefined
            && bfOptimization.knf.getTerms().length > requirements.numMaxtermsMax) {
          return false;
        }

        // Primeimplicants amount
        if (requirements.numPrimeimplicants !== undefined
            && bfOptimization.primes['min-terms'].length !== requirements.numPrimeimplicants) {
          return false;
        }
        // console.log('numMintermsMin: ', requirements.numMintermsMin);
        if (requirements.numPrimeimplicantsMin !== undefined
            && bfOptimization.primes['min-terms'].length < requirements.numPrimeimplicantsMin) {
          return false;
        }
        if (requirements.numPrimeimplicantsMax !== undefined
            && bfOptimization.primes['min-terms'].length > requirements.numPrimeimplicantsMax) {
          return false;
        }

        // Primeimplicates amount
        if (requirements.numPrimeimplicates !== undefined
            && bfOptimization.primes['max-terms'].length !== requirements.numPrimeimplicates) {
          return false;
        }
        if (requirements.numPrimeimplicatesMin !== undefined
            && bfOptimization.primes['max-terms'].length < requirements.numPrimeimplicatesMin) {
          return false;
        }
        if (requirements.numPrimeimplicatesMax !== undefined
            && bfOptimization.primes['max-terms'].length > requirements.numPrimeimplicatesMax) {
          return false;
        }

        return true;
      }

      const selectedGoalIndex = parseInt(this.randomExerciseGoalSelectedIndex, 10);
      const selectedDifficultyIndex = parseInt(this.randomExerciseDifficultySelectedIndex, 10);
      const requirements = this.randomExercisesGoalsMetrics[selectedGoalIndex].difficulties[selectedDifficultyIndex];

      let numVars = requirements.numVars;
      if (numVars === undefined) {
        const numVarsMin = requirements.numVarsMin || 1;
        const numVarsMax = requirements.numVarsMax || 6;
        // console.log(numVarsMin, numVarsMax, (Math.random() * (numVarsMax - numVarsMin + 1)));
        numVars = Math.floor((Math.random() * (numVarsMax - numVarsMin + 1))) + numVarsMin;
      }

      // TODO clean up this mess
      // console.log('numVars:', numVars);
      // setTimeout(() => {
      // console.log(primetermsMin, primetermsMax, numvars);
      // TODO put the entire criteria checking into the backend as well
      // generate random KVDiagrams until one fits the criteria
      let kvdiagram;
      let doesKVDiagramFitRequirements;
      // let primesArray;
      do {
        // NOTE: sometimes it seems as backend bf optimizations get stuck somewhere
        // freezing the entire site.
        // console.log('generating random kv');
        kvdiagram = generateRandomKVDiagram(numVars, true);
        // console.log(kvdiagram);
        // console.log(computePrimesFromKV(kvdiagram));
        // primesArray = computePrimesFromKV(kvdiagram)['min-terms'];
        // } while (primesArray.length < primetermsMin || primesArray.length > primetermsMax);
        // console.log('optimizing bf');
        const optimizations = optimizeBooleanFunction(kvdiagram);
        // console.log('checking requirements');
        doesKVDiagramFitRequirements = kvdiagramFitsRequirements(kvdiagram, requirements, optimizations);
        // console.log(doesKVDiagramFitRequirements);
      } while (!doesKVDiagramFitRequirements);

      const kvdiagramVue = this.$refs.childKVDiagram;
      kvdiagramVue.setKVDiagram(
        kvdiagram,
      );

      this.updateMinMaxDisplayStyle();
      this.someOptimizationsFinished = false;
    },
    getTextFromPetrickStatementActionType(actionType) {
      switch (actionType) {
        case BOOLEAN_FUNCTION_PETRICK_STATEMENT_STEP_INITIAL:
          return '';
        case BOOLEAN_FUNCTION_PETRICK_STATEMENT_STEP_DISTRIBUTION:
          return this.$t('bf_distributionUC');
        case BOOLEAN_FUNCTION_PETRICK_STATEMENT_STEP_ABSORPTION:
          return this.$t('bf_absorptionUC');
        case BOOLEAN_FUNCTION_PETRICK_STATEMENT_STEP_IDEMPOTENCE:
          return this.$t('bf_idempotenceUC');
        case BOOLEAN_FUNCTION_PETRICK_STATEMENT_STEP_SORTING:
          return this.$t('bf_sortingUC');
        default:
          console.log('unrecognized actionType of Petrick statement step:');
          console.log(actionType);
          return actionType;
      }
    },
    unblurDOM(event) {
      // console.log(event.target);
      if (event.target.classList.contains('blurred')) {
        event.target.classList.remove('blurred');
      }
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
    .mainarea {
      width: 95% !important;
    }
    .bf-main-accordion-container {
      width: 100% !important;
    }
  }


  .mainarea {
    margin: auto;
    // width: 1240px;
    padding: 8px;
    padding-bottom: 1.5em;
  }

  .boolean-function-input-container {
    margin-top: 20px;
    // .boolean-function-input-container-divider {
    //   // margin: 5px 0 5px 0;
    // }

    .bfInputDevice, .exercise-selection-container {
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

    .boolean-function-button-optimize {
      margin: 1.5em 0.5em 0 0;
    }
  }

  .bf-main-accordion-container {
    width: 1000px;
    margin: auto;
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
  .quine-classes-toggle-switch-container {
    text-align: left;
    /* font-size: 0.8em; */

    div {
      padding-top: 3px;
    }
    span {
      margin-left: 10px;
    }
  }
  .quine-classes-reduced-term-colored {
    color: rgba(gray, .8);
  }
  .bf-primetable {
    margin-bottom: 1em;
    margin-left: 0;
    text-align: center;
    border-spacing: 0;
    border-left: none;
    border-collapse: collapse;
    background: #ffffffd4;
    border-radius: 10px;

    tr:first-child {
      border-bottom: 1px solid black;
    }

    th, td {
      // padding: 2px 3px 2px 3px;
      width: 1.1em;
      font-size: 1.2em;
      padding: 10px;
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
      background-color: transparent;
    }

    .primetable-highlighted-cell {
      color: red;
      font-weight: bold;
    }
  }
  .bf-primetable-controls {
    margin-top: 4px;
    button:disabled {
      background-color: $lightBlue;
    }
    .control-text {
      margin-left: 10px;
      margin-right: 10px;
    }
  }

  .explanation-text {
    position: relative;
  }

  .hiddenLongText {
    visibility: hidden;
    padding-top: 1.33em;
  }

  .bf-primetable-step-explanation {
    position: absolute;
    text-align: justify;
    top: 0;
    left: 0;
  }

  .bf-petrick-statement-container {
    // NOTE: holds all Petrick statement alg. lines
    white-space: nowrap; // forces svg + mathematical expl. int the same line
    font-size: 1.1em;

    .infoblob-wrapper {
      display: block;
      text-align: left;

      .petrick-statement-infoblob-ol {
        text-align: left;
        margin-block-end: 0;
        li {
            margin-bottom: .5em;
        }
      }
    }
  }

  .primeTableContainer {
    overflow-x: scroll;
  }

  .selectBox {
    margin-right: 10px;
  }

  .bf-petrick-statement-subcontainer {
    // NOTE: holds a single petrick expression line + math expl.
    margin: .4em;
  }

  .blurred {
    filter: blur(1em);
    -webkit-filter: blur(1em);
  }

  .quine-class-single-class-container {
    text-align: left;
    pointer-events: none;
  }

  .horizontalbar {
    width: 1000px;
    margin: 1.5em auto 1.5em auto;
    height: 1px;
    background-color: rgba($lightBlue, 0.5);
  }
  @media(max-width: 1060px){
    .horizontalbar {
      width: 50%;
    }
  }

  .horizontalbarfull {
    margin: 1.5em auto 1.5em auto;
    height: 1px;
    background-color: rgba($lightBlue, 0.5);
  }

  .small-info-text {
    text-align: left;
    font-size: 0.9em;
    font-family: Arial, Helvetica, sans-serif;
    padding: .3em;
    padding-bottom: .5em;
    color: rgba(gray, .9);
  }
</style>
