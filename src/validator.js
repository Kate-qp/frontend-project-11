const validate = (url, urls) => {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url)
      
      if (urls.includes(url)) {
        const error = new Error('errors.exist')
        error.isUrlExist = true
        throw error
      }
      
      resolve()
    } catch (err) {
      if (err.isUrlExist) {
        reject(err)
      } else {
        const error = new Error('errors.invalid')
        reject(error)
      }
    }
  })
}

export default validate
