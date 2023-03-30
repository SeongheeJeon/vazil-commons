import VazilLayout from './components/VazilLayout.vue'
import global from './plugins/global.js'
import store from './store/index'
import {i18n} from './plugins/i18n'

function install(Vue) {
  Vue.component('VazilLayout', VazilLayout)
  Vue.use(global)
  Vue.use(store)
  Vue.use(i18n)
}

export default {install}

export {
  VazilLayout,
}

