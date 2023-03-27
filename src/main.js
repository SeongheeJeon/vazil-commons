import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import global from './plugins/global'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import store from './store'

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(global)
  .use(store)
  .mount('#app')
