import './styles/main.scss'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rss-form')
  
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const urlInput = document.getElementById('rss-url')
    const url = urlInput.value.trim()
    
    if (url) {
      console.log('Adding RSS feed:', url)
      urlInput.value = ''
    }
  })
})
