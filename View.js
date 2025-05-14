import onChange from 'on-change'
import { i18n } from '../i18n'
import { PostPreviewModal } from './components/PostPreviewModal'

export default class View {
  constructor(form, input, feedback, urlsContainer, postsContainer) {
    this.form = form
    this.input = input
    this.feedback = feedback
    this.urlsContainer = urlsContainer
    this.postsContainer = postsContainer
    
    this.state = onChange({
      form: {
        valid: true,
        errors: [],
        value: '',
      },
      urls: [],
      posts: [],
      readPosts: new Set(),
      previewPost: null,
      language: 'en',
    }, this.render.bind(this))

    this.modal = new PostPreviewModal({
      post: this.state.previewPost,
      onHide: () => { this.state.previewPost = null },
    })
  }

  setLanguage(lang) {
    this.state.language = lang
    i18n.changeLanguage(lang)
  }

  markAsRead(postId) {
    this.state.readPosts.add(postId)
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

    if (path === 'posts' || path === 'readPosts' || path === 'language') {
      this.renderPosts()
    }

    if (path === 'previewPost') {
      this.modal.update({ post: this.state.previewPost })
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

  renderPosts() {
    this.postsContainer.innerHTML = `
      <div class="posts-section">
        <h2 class="h5 mb-3">${i18n.t('rss.postsSection')}</h2>
        <div class="list-group">
          ${this.state.posts.length === 0
            ? `<div class="text-muted">${i18n.t('rss.noPosts')}</div>`
            : this.state.posts.map(post => `
              <div class="list-group-item post-item">
                <div class="d-flex justify-content-between align-items-center">
                  <h3 class="h6 ${this.state.readPosts.has(post.id) ? 'fw-normal' : 'fw-bold'}">
                    ${post.title}
                  </h3>
                  <button 
                    class="btn btn-outline-primary btn-sm preview-btn"
                    data-id="${post.id}"
                  >
                    ${i18n.t('post.preview')}
                  </button>
                </div>
                ${post.description ? `<p class="mt-2 mb-0">${post.description}</p>` : ''}
              </div>
            `).join('')
          }
        </div>
      </div>
    `

    this.postsContainer.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const postId = btn.dataset.id
        const post = this.state.posts.find(p => p.id === postId)
        this.state.previewPost = post
        this.markAsRead(postId)
      })
    })
  }

  resetForm() {
    this.state.form.value = ''
    this.state.form.valid = true
    this.state.form.errors = []
    this.input.focus()
  }
}
