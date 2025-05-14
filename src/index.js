import './styles/main.scss'
import Controller from './controller.js'

const initApp = () => {
  const form = document.getElementById('rss-form')
  const input = document.getElementById('rss-url')
  const feedback = document.querySelector('.feedback')
  const urlsContainer = document.querySelector('.urls-container')

  if (!form || !input || !feedback || !urlsContainer) {
    throw new Error('Required elements not found')
  }

  new Controller(form, input, feedback, urlsContainer)

  input.focus()
}

document.addEventListener('DOMContentLoaded', initApp)
