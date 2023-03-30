import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import global from './plugins/global'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import store from './store'
import {i18n} from './plugins/i18n'

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(global)
  .use(store)
  .use(i18n)
  .mount('#app')
