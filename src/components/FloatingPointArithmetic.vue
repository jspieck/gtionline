<template>
<div class="floatingPoint">
  <tabs :tabs="tabs" :currentTab="currentTab" @onClick="handleClick" updated="this.$t('exercises')"
  :wrapper-class="'default-tabs'" :tab-class="'default-tabs__item'"
  :tab-active-class="'default-tabs__item_active'" :line-class="'default-tabs__active-line'"/>
  <div class="tab" v-if="currentTab === 'exercises'">
    <h3 class="title">{{$t('exercises')}}</h3>
    <fpe/>
  </div>
  <div class="tab" v-if="currentTab === 'free'">
    <h3 class="title">{{$t('freeCalculation')}}</h3>
    <fpf/>
  </div>
  <div class="tab" v-if="currentTab === 'convert'">
    <h3 class="title">{{$t('conversion')}}</h3>
    <fpc/>
  </div>
</div>
</template>

<script>
// eslint-disable-next-line
import Tabs from 'vue-tabs-with-active-line';
import FloatingPointFormat from './FloatingPointFormat.vue';
import FloatingPointExercises from './FloatingPointExercises.vue';
import FloatingPointConversion from './FloatingPointConversion.vue';

export default {
  name: 'TinyTabs',
  components: {
    fpc: FloatingPointConversion,
    fpe: FloatingPointExercises,
    fpf: FloatingPointFormat,
    tabs: Tabs,
  },
  data() {
    return {
      currentTab: 'free',
    };
  },
  computed: {
    tabs() {
      return [
        {
          title: this.$t('exercises'),
          value: 'exercises',
        },
        {
          title: this.$t('freeCalculation'),
          value: 'free',
        },
        {
          title: this.$t('conversion'),
          value: 'convert',
        },
      ];
    },
  },
  methods: {
    handleClick(newTab) {
      this.currentTab = newTab;
    },
  },
};
</script>

<style lang="scss">
body{
  overflow-y: scroll;
}

.default-tabs {
  position: relative;
  margin: 10px auto;
  display: inline-block;

  &__item {
    display: inline-block;
    margin: 0 5px;
    padding: 0 10px;
    padding-bottom: 8px;
    font-size: 16px;
    color: gray;
    background: none;
    text-decoration: none;
    border: none;
    background-color: transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    border-radius: 0;
    transition: all 0.25s;

    &_active {
      color: black;
      border-bottom: 2px solid gray;
    }

    &:hover {
      background: none;
      border-radius: 0;
      border-bottom: 2px solid gray;
      color: black;
    }

    &:focus {
      outline: none;
      border-bottom: 2px solid gray;
      color: black;
    }

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }
  &__active-line {
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: black;
    transition: transform 0.4s ease, width 0.4s ease;
  }
}
@media screen and (max-width: 1400px) {
  .tab {
    width: 95% !important;
  }
}
.tab {
  margin: auto;
  width: 1240px;
  padding: 8px;
  background: #ffffff5e;
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
