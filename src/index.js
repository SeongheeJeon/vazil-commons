import VazilLayout from './components/VazilLayout.vue'
import VazilDialog from './components/VazilDialog.vue'
import VazilPagination from './components/VazilPagination.vue'
import VazilLogin from './components/VazilLogin.vue'
import global from './plugins/global.js'
import store from './store/index'
import {i18n} from './plugins/i18n'

function install(Vue) {
  Vue.component('VazilLayout', VazilLayout)
  Vue.component('VazilDialog', VazilDialog)
  Vue.component('VazilPagination', VazilPagination)
  Vue.component('VazilLogin', VazilLogin)
  Vue.use(global)
  Vue.use(store)
  Vue.use(i18n)
}

export default {install}

export {
  VazilLayout,
}

