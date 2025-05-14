import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ruTranslation from '../public/locales/ru/translation.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: ruTranslation
      }
    },
    lng: 'ru',
    fallbackLng: 'ru',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  })

import { setLocale } from 'yup'

setLocale({
  mixed: {
    required: 'validation.required',
    notOneOf: 'validation.notOneOf'
  },
  string: {
    url: 'validation.url',
    min: 'validation.min',
    max: 'validation.max'
  }
})

export default i18n
