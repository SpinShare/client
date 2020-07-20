import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import moment from 'moment'
import { ipcRenderer } from 'electron';
import VueObserveVisibility from 'vue-observe-visibility'
import Ripple from 'vue-ripple-directive'
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'

Vue.use(VueObserveVisibility);

Vue.directive('tooltip', VTooltip);
Vue.directive('close-popover', VClosePopover);
Vue.component('v-popover', VPopover);

Ripple.color = 'rgba(255, 255, 255, 0.35)';
Ripple.zIndex = 55;
Vue.directive('ripple', Ripple);

Vue.config.productionTip = false;


Vue.filter('formatDate', function(value) {
  if (value && !String(value).includes("-0001")) {
    return moment(String(value)).format(i18n.t('locale.dateFormat'))
  }
});

window.VueRoot = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');