<template>
  <div class="fp-arithmetic">
    <h3>Floating Point Arithmetic</h3>
    <FloatingPointFormat/>
  </div>
</template>

<script>
import FloatingPointFormat from './FloatingPointFormat.vue';

export default {
  name: 'FloatingPointArithmetic',
  components: {
    FloatingPointFormat,
  },
};
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
