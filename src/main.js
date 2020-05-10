import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import { ipcRenderer } from 'electron';

Vue.config.productionTip = false;

window.VueRoot = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');