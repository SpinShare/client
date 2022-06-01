import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import moment from 'moment'
import VueTilt from 'vue-tilt.js'
import { ipcRenderer } from 'electron';
import VueObserveVisibility from 'vue-observe-visibility'
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'

Vue.use(VueTilt);
Vue.use(VueObserveVisibility);

Vue.directive('tooltip', VTooltip);
Vue.directive('close-popover', VClosePopover);
Vue.component('v-popover', VPopover);

import SButton from "@/components/Common/SButton";
import SFormRow from "@/components/Common/SFormRow";
import SLoadingSpinner from "@/components/Common/SLoadingSpinner";

Vue.component('SButton', SButton);
Vue.component('SFormRow', SFormRow);
Vue.component('SLoadingSpinner', SLoadingSpinner);

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