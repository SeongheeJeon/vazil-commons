import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  plugins: [createPersistedState()],
  state: {
    theme: 'light',
    locale: 'ko',
  },
  mutations: {
    setTheme(state, val) {
      state.theme = val
    },
    setLocale(state, val) {
      state.locale = val
    }
  },
})