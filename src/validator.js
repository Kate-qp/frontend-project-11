import * as yup from 'yup'

yup.setLocale({
  string: {
    url: 'errors.invalid'
  },
  mixed: {
    required: 'errors.required',
    notOneOf: 'errors.exists'
  }
})

export default (url, feeds) => {
  const schema = yup.string().required().url().notOneOf(feeds)
  return schema.validate(url)
}
