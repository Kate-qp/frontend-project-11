import * as yup from 'yup'

const validateUrl = (urls) => {
  return yup.object().shape({
    url: yup
      .string()
      .required('Не должно быть пустым')
      .url('Ссылка должна быть валидным URL')
      .notOneOf(urls, 'RSS уже существует')
  })
}

export default validateUrl
