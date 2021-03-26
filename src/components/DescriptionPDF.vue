<template>
  <div>
    <div style="float: left" class="pdfGen">
      <button v-on:click="print" v-if="this.math">Print</button>
    </div>
    <div id="equation" ref="equation" v-html="math">
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
      const langSelect = document.getElementById('languageDropdown');
      langSelect.style.visibility = 'hidden';
      const navBar = document.querySelector('.navbar');
      navBar.style.visibility = 'hidden';
      const menubtn = document.getElementById('menu-btn');
      menubtn.style.visibility = 'hidden';
      const menuicon = document.querySelector('.menu-icon');
      menuicon.style.visibility = 'hidden';
      const menu = document.querySelector('.menu');
      menu.style.visibility = 'hidden';
      const icon = document.getElementById('logo');
      icon.style.visibility = 'hidden';
      this.math = this.$route.query.math;
      return this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typeset();
        }
      });
    },
    print() {
      const pdfGen = document.querySelector('.pdfGen');
      pdfGen.style.visibility = 'hidden';
      window.print();
      pdfGen.style.visibility = 'visible';
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
