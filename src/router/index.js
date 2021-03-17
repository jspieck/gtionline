import Vue from 'vue';
import VueRouter from 'vue-router';
import PrettyCheckbox from 'pretty-checkbox-vue';
import Home from '../views/Home.vue';
import FloatingPointArithmetic from '@/components/FloatingPointArithmetic.vue';
import KVDiagram from '@/components/KVDiagram.vue';
import DescriptionPDF from '@/components/DescriptionPDF.vue';

Vue.use(VueRouter);
Vue.use(PrettyCheckbox);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/fparithmetic',
    name: 'FloatingPointArithmetic',
    component: FloatingPointArithmetic,
  },
  {
    path: '/kvdiagram',
    name: 'KVDiagram',
    component: KVDiagram,
  },
  {
    path: '/descriptionpdf',
    name: 'DescriptionPDF',
    component: DescriptionPDF,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
