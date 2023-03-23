import VazilLayout from './components/VazilLayout.vue'
import global from './plugins/global.js'

function install(Vue) {
  Vue.component('VazilLayout', VazilLayout)
  Vue.use(global)
}

export default {install}

export {
  VazilLayout,
}

