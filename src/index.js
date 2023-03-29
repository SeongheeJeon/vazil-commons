import { createI18n } from 'vue-i18n'
import VazilLayout from './components/VazilLayout.vue'
import global from './plugins/global.js'
import store from './store/index'
import i18nOptions from './plugins/i18n/options'

function install(Vue) {
  Vue.component('VazilLayout', VazilLayout)
  Vue.use(global)
  Vue.use(store)
  Vue.use(createI18n(i18nOptions))
}

export default {install}

export {
  VazilLayout,
}

