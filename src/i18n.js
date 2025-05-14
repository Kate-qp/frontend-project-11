import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  })

// Настройка Yup для работы с i18next
import { setLocale } from 'yup'

setLocale({
  mixed: {
    required: () => i18n.t('validation.required'),
    notOneOf: () => i18n.t('validation.notOneOf')
  },
  string: {
    url: () => i18n.t('validation.url')
  }
})

export default i18n