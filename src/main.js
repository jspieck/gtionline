import Vue from 'vue';
// import VueHtmlToPaper from 'vue-html-to-paper';
import App from './App.vue';
import router from './router';
import { i18n } from './scripts/i18n';

Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app');

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes',
  ],
};

// Vue.use(VueHtmlToPaper, options);
Vue.use(options);
