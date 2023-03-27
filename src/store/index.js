import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  plugins: [createPersistedState()],
  state: {
    theme: 'light'
  },
  mutations: {
    setTheme(state, val) {
      state.theme = val
    }
  },
})