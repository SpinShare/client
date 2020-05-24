import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import moment from 'moment'
import { ipcRenderer } from 'electron';

Vue.config.productionTip = false;

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format(i18n.t('locale.dateFormat'))
  }
});

window.VueRoot = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');