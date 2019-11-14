<template>
  <div class="selectBox">
    <select class="fpfSelect" v-model="selectedOption"
      @input="event => { $emit('input', num, event.target.value) }">
      <option v-for="(name, option) in options" :value="option"
        v-bind:key="option">{{name}}</option>
    </select>
    <img class="selectIcon" src="http://cdn.onlinewebfonts.com/svg/img_295694.svg">
  </div>
</template>

<script>
export default {
  name: 'FloatingPointArithmetic',
  props: ['num', 'sel', 'options'],
  created() {
    this.selectedOption = this.sel;
  },
  data() {
    return {
      selectedOption: 'binary',
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.selectedOption = newValue;
      },
    },
  },
};
</script>

<style scoped lang="scss">
select{
  -webkit-appearance: button;
  border: none;
  font-size: 13px;
  list-style: none;
  outline: none;
  overflow: hidden;
  text-align: left;
  text-decoration: none;
  vertical-align: middle;
  background-color: transparent;
  color: #202124!important;
  height: 36px;
  padding-left: 8px;
  padding-right: 30px;
  background-image: none;
}

.selectBox{
  position: relative;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #DFE1E5;
}

.selectIcon{
  position:absolute;
  right: 10px;
  top: 11px;
  width: 15px;
  height: 15px;
  pointer-events: none;
}
</style>
