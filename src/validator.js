const validate = (url, existingUrls = []) => {
  return new Promise((resolve, reject) => {
    try {
      // Проверяем, что URL не пустой
      if (!url || typeof url !== 'string') {
        throw new Error('errors.empty')
      }

      // Создаем URL объект для проверки формата
      const urlObj = new URL(url.trim())
      
      // Проверяем, что URL не добавлен ранее
      if (existingUrls.includes(url.trim())) {
        throw new Error('errors.exist')
      }
      
      // Если все проверки пройдены
      resolve(true)
    } catch (err) {
      // Обрабатываем разные типы ошибок
      if (err.message === 'errors.exist') {
        reject(new Error('RSS уже существует'))
      } else if (err.message === 'errors.empty') {
        reject(new Error('Ссылка должна быть валидным URL'))
      } else {
        reject(new Error('Ссылка должна быть валидным URL'))
      }
    }
  })
}

export default validate
