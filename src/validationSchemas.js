import * as yup from 'yup'
import i18n from 'i18next'

yup.setLocale({
  mixed: {
    required: ({ path }) => i18n.t('validation.required', { field: i18n.t(`registration.fields.${path}`) })
  },
  string: {
    min: ({ path, min }) => i18n.t('validation.min', { field: i18n.t(`registration.fields.${path}`), count: min }),
    max: ({ path, max }) => i18n.t('validation.max', { field: i18n.t(`registration.fields.${path}`), count: max })
  }
})

export const registrationSchema = yup.object().shape({
  username: yup.string()
    .required()
    .min(3)
    .max(20),
  password: yup.string()
    .required()
    .min(6)
    .max(40),
  confirmPassword: yup.string()
    .required()
    .oneOf([yup.ref('password'), null], i18n.t('validation.passwordsMustMatch'))
})
