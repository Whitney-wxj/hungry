// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from "vue-router";
import VueResource from 'vue-resource';
import App from './App'

import Goods from './components/goods/Goods.vue';
import Ratings from './components/ratings/Ratings.vue';
import Seller from './components/seller/Seller.vue';

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.config.productionTip = false
const routes = [
  {path: '/goods', component: Goods},
  {path: '/ratings', component: Ratings},
  {path: '/seller', component: Seller},
  {path: '/', redirect: '/goods'}
];
const router = new VueRouter({
  routes
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
