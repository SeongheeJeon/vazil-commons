import { createI18n } from 'vue-i18n'
import ko from './locales/ko.json'
import en from './locales/en.json'

const options = {
  legacy: false,
  locale:'ko',
  fallbackLocale:'en',
  messages: {
    'ko': ko,
    'en': en
  }
}

const i18n = createI18n(options)

export {i18n, options}
