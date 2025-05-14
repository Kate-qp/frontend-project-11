import validateUrl from './validators.js'
import onChange from 'on-change'

export default class Controller {
  constructor(form, input, feedback, urlsContainer) {
    this.urls = [] 

    this.view = {
      state: onChange({
        form: {
          valid: true,
          errors: [],
          value: ''
        },
        urls: []
      }, this.render.bind(this)),
      
      render: (path) => {
        if (path === 'form.valid') {
          input.classList.toggle('is-invalid', !this.view.state.form.valid)
        }
        
        if (path === 'form.errors') {
          feedback.textContent = this.view.state.form.errors.join(', ')
          feedback.classList.toggle('text-danger', !this.view.state.form.valid)
        }
        
        if (path === 'form.value') {
          input.value = this.view.state.form.value
        }
      },
      
      resetForm: () => {
        this.view.state.form = {
          valid: true,
          errors: [],
          value: ''
        }
        input.focus()
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const url = input.value.trim()
      await this.handleSubmit(url)
    })
  }

  async handleSubmit(url) {
    try {
      const schema = validateUrl(this.urls)
      await schema.validate({ url }, { abortEarly: false })

      this.urls.push(url)
      this.view.state.urls = [...this.urls]
      this.view.resetForm()
      console.log('RSS feed added:', url) // Ваш лог
    } catch (err) {
      const errors = err.inner.map((error) => error.message)
      this.view.state.form = {
        valid: false,
        errors,
        value: url
      }
    }
  }
}
