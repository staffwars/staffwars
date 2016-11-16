import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';

import MilkCocoa from 'milkcocoa';

Vue.use(VueResource);

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: (h) => h(App)
});
