import './styles/main.scss'
import Controller from './controller.js'

const form = document.getElementById('rss-form')
const input = document.getElementById('rss-url')
const feedback = document.querySelector('.feedback')
const urlsContainer = document.querySelector('.urls-container')

const controller = new Controller(form, input, feedback, urlsContainer)

document.addEventListener('DOMContentLoaded', () => {
  input.focus()
})
