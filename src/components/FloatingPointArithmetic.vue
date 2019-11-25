<template>
<vue-tiny-tabs id="extabs" :anchor="false" :closable="false" :hideTitle="false" @on-close="onClose"
  @on-before="onBefore" @on-after="onAfter">
  <div class="section" id="exercises">
    <h3 class="title">Übungsaufgaben</h3>
    <fpe/>
  </div>
  <div class="section" id="free">
    <h3 class="title">Freie Berechnung</h3>
    <fpf/>
  </div>
</vue-tiny-tabs>
</template>

<script>
import VueTinyTabs from 'vue-tiny-tabs';
import FloatingPointFormat from './FloatingPointFormat.vue';
import FloatingPointExercises from './FloatingPointExercises.vue';

export default {
  name: 'TinyTabs',
  components: {
    fpe: FloatingPointExercises,
    fpf: FloatingPointFormat,
    'vue-tiny-tabs': VueTinyTabs,
  },
  methods: {
    onClose(id) {
      console.log('Callback function that gets evaluated while closing the tab', id);
    },
    onBefore(id, tab) {
      console.log('Callback function that gets evaluated before a tab is activated', id, tab);
    },
    onAfter(id, tab) {
      console.log('Callback function that gets evaluated after a tab is activated', id, tab);
    },
  },
};
</script>

<style lang="scss">
body{
  overflow-y: scroll;
}
@media screen and (max-width: 1400px) {
  .tinytabs {
    width: 95% !important;
  }
}
.tinytabs {
  margin: auto;
  width: 1240px;
  padding: 8px;

  .tabs {
    margin-left: 15px;
    display: flex;
    flex-flow: row wrap;

    .tab {
      margin: 0 3px 2px 0;
      background: #ffffff5e;
      display: block;
      padding: 12px 15px;
      text-decoration: none;
      color: #666;
      border-radius: 3px 3px 0 0;

      &.sel {
        background: #fff;
        color: #333;
        text-shadow: none;
      }
      .close {
        padding-left: 5px;
      }
    }
  }
  .section {
    background: #ffffff5e;
    overflow: hidden;
    padding: 15px;
    clear: both;
    border-radius: 3px;
  }
}
</style>
