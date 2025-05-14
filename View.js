import onChange from 'on-change'

export default class View {
  constructor(form, input, feedback, urls) {
    this.form = form
    this.input = input
    this.feedback = feedback
    this.urls = urls
    this.state = onChange({
      form: {
        valid: true,
        errors: [],
        value: '',
      },
      urls: [],
    }, this.render.bind(this))
  }

  render(path) {
    if (path === 'form.valid') {
      this.input.classList.toggle('is-invalid', !this.state.form.valid);
    }
    
    if (path === 'form.errors') {
      this.feedback.textContent = this.state.form.errors.join(', ')
      this.feedback.classList.toggle('text-danger', !this.state.form.valid)
    }
    
    if (path === 'form.value') {
      this.input.value = this.state.form.value
    }
    
    if (path === 'urls') {
      this.urls = [...this.state.urls]
    }
  }

  resetForm() {
    this.state.form.value = ''
    this.state.form.valid = true
    this.state.form.errors = []
    this.input.focus()
  }
}