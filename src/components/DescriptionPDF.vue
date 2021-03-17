<template>
  <div>
    <div id="equation" ref="equation">
      {{math}}
    </div>
    <div class="pdfGen">
      <button v-on:click="print" v-if="this.math">Print</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DescriptionPDF',
  data() {
    return {
      math: '',
    };
  },
  mounted() {
    this.compileMath();
  },
  methods: {
    compileMath() {
      this.math = this.$route.query.math;
      console.log(this.math);
      return this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset();
        }
      });
    },
    print() {
      // return this.$htmlToPaper('equation');
      return window.print();
    },
  },
};
</script>

<style scoped lang="scss">

.pdfGen{
  float: right;
  display: inline-flex;
  flex-direction: row;
  position: relative;
  width: 40px;
  height: 40px;
  right: 0px;
  top: 0px;
  line-height: 40px;
}

</style>
