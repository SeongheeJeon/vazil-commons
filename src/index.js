import VazilLayout from './components/VazilLayout.vue'
import global from './plugins/global.js'
import store from './store/index'

function install(Vue) {
  Vue.component('VazilLayout', VazilLayout)
  Vue.use(global)
  Vue.use(store)
}

export default {install}

export {
  VazilLayout,
}

