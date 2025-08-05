const validate = (url, existingUrls = []) => {
  try {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      throw new Error('Ссылка должна быть валидным URL')
    }

    new URL(url.trim()) // Проверяем валидность URL
    
    if (existingUrls.some(existingUrl => existingUrl === url.trim())) {
      throw new Error('RSS уже существует')
    }

    return { isValid: true }
  } catch (error) {
    return { 
      isValid: false,
      error: error.message === 'RSS уже существует' 
        ? error.message 
        : 'Ссылка должна быть валидным URL'
    }
  }
}

export default validate
