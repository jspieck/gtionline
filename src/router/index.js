import FloatingPointArithmetic from '@/components/FloatingPointArithmetic.vue';
import PolyadicNumbers from '@/components/PolyadicNumbers.vue';
import BooleanFunctionMinimizer from '@/components/BooleanFunctionMinimizer.vue';
import KVDiagram from '@/components/KVDiagram.vue';
import DescriptionPDF from '@/components/DescriptionPDF.vue';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/impressum',
    name: 'impressum',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Impressum.vue'),
  },
  {
    path: '/fparithmetic',
    name: 'FloatingPointArithmetic',
    component: FloatingPointArithmetic,
  },
  {
    path: '/polyadic',
    name: 'PolyadicNumbers',
    component: PolyadicNumbers,
  },
  {
    path: '/kvdiagram',
    name: 'KVDiagram',
    component: KVDiagram,
  },
  {
    path: '/bfminimizer',
    name: 'BooleanFunctionMinimizer',
    component: BooleanFunctionMinimizer,
  },
  {
    path: '/descriptionpdf',
    name: 'DescriptionPDF',
    component: DescriptionPDF,
  },
];

export default routes;
