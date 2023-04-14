import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import global from './plugins/global'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import store from './store'
import {i18n} from './plugins/i18n'

import VazilDialog from './components/VazilDialog.vue'
import VazilPagination from './components/VazilPagination.vue'
import VazilLogin from './components/VazilLogin.vue'

loadFonts()

const app = createApp(App)

app.use(router)
  .use(vuetify)
  .use(global)
  .use(store)
  .use(i18n)
  
  
app.component('VazilDialog', VazilDialog)
app.component('VazilPagination', VazilPagination)
app.component('VazilLogin', VazilLogin)

app.mount('#app')
