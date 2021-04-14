<template>
  <div>
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
