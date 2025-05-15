import * as yup from 'yup'

// Схема валидации с кастомными сообщениями
const urlSchema = yup.string()
  .required('Поле не должно быть пустым')
  .url('Ссылка должна быть валидным URL')
  .test(
    'is-not-duplicate',
    'RSS уже существует',
    function(value) {
      if (!this.parent || !this.parent.existingUrls) return true
      return !this.parent.existingUrls.includes(value)
    }
  )

// Простая функция проверки URL (без yup)
export const isUrlValid = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Основная функция валидации
export const validateUrl = async (url, existingUrls = []) => {
  try {
    await urlSchema.validate({
      url,
      existingUrls
    }, { abortEarly: false })
    return { valid: true, errors: [] }
  } catch (err) {
    return {
      valid: false,
      errors: err.inner.map(e => e.message)
    }
  }
}
