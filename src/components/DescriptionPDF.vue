<template>
  <div>
    <div style="display: flex; margin-bottom: 40px; margin-top: 0">
      <div style="flex: 50%; padding: 15px;">
        <img :src="codesign_logo" alt="CODESIGN_LOGO" style="width: 50%">
      </div>
      <div style="flex: 50%; padding: 15px;">
        <img :src="fau_logo" alt="FAU_Logo" style="width: 50%">
      </div>
    </div>
    <div id="equation" ref="equation" v-html="math">
    </div>
  </div>
</template>

<script>
import faulogo from '../assets/FAU_logo.png';
import codesignlogo from '../assets/codesign.png';

export default {
  name: 'DescriptionPDF',
  data() {
    return {
      math: '',
      fau_logo: faulogo,
      codesign_logo: codesignlogo,
    };
  },
  mounted() {
    this.compileMath();
    window.addEventListener('load', () => {
      window.print();
    });
    window.addEventListener('afterprint', () => {
      window.close();
    });
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
  },
};
</script>

<style scoped lang="scss">

</style>
