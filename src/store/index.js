import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  plugins: [createPersistedState()],
  state: {
    theme: 'light',
    locale: 'ko',
    loginLockStatus:{
      captchaActive: false,
      latestLoginTryDate: '',
      loginFailCount: 0
    },
  },
  mutations: {
    setTheme(state, val) {
      state.theme = val
    },
    setLocale(state, val) {
      state.locale = val
    },
    setLoginLockStatus: (state, loginLockStatus) => {
      state.loginLockStatus = loginLockStatus
    },
  },
})