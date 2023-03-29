import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import global from './plugins/global'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import store from './store'
import i18nOptions from './plugins/i18n/options'

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(global)
  .use(store)
  .use(createI18n(i18nOptions))
  .mount('#app')
