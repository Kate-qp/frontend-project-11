import onChange from 'on-change'
import { i18n } from '../i18n' // Импортируем i18n экземпляр

export default class View {
  constructor(form, input, feedback, urlsContainer) {
    this.form = form
    this.input = input
    this.feedback = feedback
    this.urlsContainer = urlsContainer
    
    this.state = onChange({
      form: {
        valid: true,
        errors: [],
        value: '',
      },
      urls: [],
      language: 'en', // Текущий язык
    }, this.render.bind(this))
  }

  // Метод для переключения языка
  setLanguage(lang) {
    this.state.language = lang
    i18n.changeLanguage(lang)
  }

  render(path) {
    if (path === 'form.valid') {
      this.input.classList.toggle('is-invalid', !this.state.form.valid)
    }
    
    if (path === 'form.errors') {
      this.feedback.textContent = this.state.form.errors.join(', ')
      this.feedback.classList.toggle('text-danger', !this.state.form.valid)
    }
    
    if (path === 'form.value') {
      this.input.value = this.state.form.value
    }
    
    if (path === 'urls' || path === 'language') {
      this.renderUrls()
    }
  }

  renderUrls() {
    this.urlsContainer.innerHTML = `
      <div class="feeds-section mb-4">
        <h2 class="h5 mb-3">${i18n.t('rss.feedsSection')}</h2>
        <div class="list-group">
          ${this.state.urls.length === 0 
            ? `<div class="text-muted">${i18n.t('rss.noFeeds')}</div>`
            : this.state.urls.map(url => `
              <div class="list-group-item">
                <h3 class="h6">${url}</h3>
              </div>
            `).join('')
          }
        </div>
      </div>
    `
  }

  resetForm() {
    this.state.form.value = ''
    this.state.form.valid = true
    this.state.form.errors = []
    this.input.focus()
  }
}
