<template>
<vue-tiny-tabs id="extabs" :anchor="false" :closable="false" :hideTitle="false" @on-close="onClose"
  @on-before="onBefore" @on-after="onAfter">
  <div class="section" id="exercises">
    <h3 class="title">Übungsaufgaben</h3>
    stuff
  </div>
  <div class="section" id="free">
    <h3 class="title">Freie Berechnung</h3>
    mehr stuff
  </div>
</vue-tiny-tabs>
</template>

<script>
import VueTinyTabs from 'vue-tiny-tabs';

export default {
  name: 'TinyTabs',
  components: {
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
.tinytabs .tabs {
  margin-left: 15px;
  display: flex;
  flex-flow: row wrap;
}
.tinytabs .tabs .tab .close {
  padding-left: 5px;
}
.tinytabs {
  margin: auto;
  width: 640px;
}
.tinytabs .tabs .tab {
  margin: 0 3px 2px 0;
  background: #fcfcfc;
  display: block;
  padding: 6px 15px;
  text-decoration: none;
  color: #666;
  font-weight: bold;
  border-radius: 3px 3px 0 0;
}
.tinytabs .section {
  background: #f5f5f5;
  overflow: hidden;
  padding: 15px;
  clear: both;
  border-radius: 3px;
}
.tinytabs .tab.sel {
  background: #f5f5f5;
  color: #333;
  text-shadow: none;
}
</style>
