import React, { useEffect, useState } from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import i18n from './i18n'
import { initReactI18next } from 'react-i18next'
import ruTranslation from './locales/ru/translation.json'

i18n.use(initReactI18next).init({
  resources: {
    ru: {
      translation: ruTranslation
    }
  },
  lng: 'ru',
  fallbackLng: 'ru'
})

function App() {
  const { t } = useTranslation()
  const [state, setState] = useState({
    feeds: [],
    posts: [],
    error: null,
    process: 'idle',
    success: null,
    modal: {
      isOpen: false,
      title: '',
      description: '',
      link: ''
    }
  })

  const fetchFeed = async (url) => {
    try {
      const response = await fetch(`https://allorigins.win/get?url=${encodeURIComponent(url)}`)
      if (!response.ok) throw new Error('network_error')
      
      const data = await response.json()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(data.contents, 'text/xml')
      
      if (xmlDoc.querySelector('parsererror')) throw new Error('invalid_rss')
      
      const channelTitle = xmlDoc.querySelector('channel > title')?.textContent || url
      
      return {
        feed: {
          url,
          title: channelTitle
        },
        posts: Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
          id: item.querySelector('guid')?.textContent || Date.now().toString(),
          title: item.querySelector('title')?.textContent || t('post.noTitle'),
          description: item.querySelector('description')?.textContent || '',
          link: item.querySelector('link')?.textContent || '#',
          pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString()
        }))
      }
    } catch (error) {
      throw error
    }
  }

  const checkFeeds = async () => {
    try {
      for (const feed of state.feeds) {
        const { posts } = await fetchFeed(feed.url)
        const newPosts = posts.filter(
          post => !state.posts.some(p => p.id === post.id)
        )
        
        if (newPosts.length > 0) {
          setState(prev => ({
            ...prev,
            posts: [...newPosts, ...prev.posts]
          }))
        }
      }
    } catch (error) {
      console.error('Error checking feeds:', error)
    } finally {
      setTimeout(checkFeeds, 5000)
    }
  }

  useEffect(() => {
    if (state.feeds.length > 0) {
      checkFeeds()
    }
    return () => clearTimeout(checkFeeds)
  }, [state.feeds])

  const addFeed = async (url) => {
    try {
      setState(prev => ({ ...prev, process: 'loading', error: null, success: null }))
      
      if (state.feeds.some(feed => feed.url === url)) {
        throw new Error('duplicate')
      }
      
      const { feed, posts } = await fetchFeed(url)
      
      setState(prev => ({
        ...prev,
        feeds: [...prev.feeds, feed],
        posts: [...posts, ...prev.posts],
        process: 'idle',
        success: 'success',
        error: null
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        process: 'idle',
        error: error.message,
        success: null
      }))
    }
  }

  const openModal = (post) => {
    setState(prev => ({
      ...prev,
      modal: {
        isOpen: true,
        title: post.title,
        description: post.description,
        link: post.link
      }
    }))
  }

  const closeModal = () => {
    setState(prev => ({
      ...prev,
      modal: {
        ...prev.modal,
        isOpen: false
      }
    }))
  }

  return (
    <I18nextProvider i18n={i18n}>
      <div className="d-flex flex-column min-vh-100">
        {/* Модальное окно */}
        <div className={`modal fade ${state.modal.isOpen ? 'show d-block' : ''}`} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{state.modal.title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                  aria-label={t('modal.close')}
                ></button>
              </div>
              <div className="modal-body text-break">
                {state.modal.description}
              </div>
              <div className="modal-footer">
                <a 
                  className="btn btn-primary" 
                  href={state.modal.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t('modal.readFull')}
                </a>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeModal}
                >
                  {t('modal.close')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Основное содержимое */}
        <main className="flex-grow-1">
          <section className="container-fluid bg-dark p-5">
            <div className="row">
              <div className="col-md-10 col-lg-8 mx-auto text-white">
                <h1 className="display-3 mb-0">{t('app.title')}</h1>
                <p className="lead">{t('app.description')}</p>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault()
                    addFeed(e.target.url.value)
                  }} 
                  className="rss-form text-body"
                >
                  <div className="row">
                    <div className="col">
                      <div className="form-floating">
                        <input 
                          id="url-input"
                          name="url"
                          className={`form-control w-100 ${state.error ? 'is-invalid' : ''}`}
                          placeholder={t('form.urlPlaceholder')}
                          autoFocus
                          required
                        />
                        <label htmlFor="url-input">{t('form.urlLabel')}</label>
                      </div>
                    </div>
                    <div className="col-auto">
                      <button 
                        type="submit" 
                        className="h-100 btn btn-lg btn-primary px-sm-5"
                        disabled={state.process === 'loading'}
                      >
                        {state.process === 'loading' ? t('form.loading') : t('form.submit')}
                      </button>
                    </div>
                  </div>
                </form>
                
                <p className="mt-2 mb-0 text-muted">
                  {t('form.example')}: https://lorem-rss.hexlet.app/feed
                </p>
                
                {state.error && (
                  <p className="feedback m-0 position-absolute small text-danger">
                    {t(`errors.${state.error}`)}
                  </p>
                )}
                
                {state.success && (
                  <p className="feedback m-0 position-absolute small text-success">
                    {t('success')}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="container-fluid container-xxl p-5">
            <div className="row">
              <div className="col-md-10 col-lg-4 mx-auto order-0 order-lg-1">
                <h2>{t('feeds.title')}</h2>
                <div className="list-group">
                  {state.feeds.length === 0 ? (
                    <p className="text-muted">{t('feeds.empty')}</p>
                  ) : (
                    state.feeds.map(feed => (
                      <div key={feed.url} className="list-group-item">
                        <h3 className="h6">{feed.title}</h3>
                        <p className="mb-0 small text-muted">{feed.url}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="col-md-10 col-lg-8 order-1 mx-auto">
                <h2>{t('posts.title')}</h2>
                <div className="list-group">
                  {state.posts.length === 0 ? (
                    <p className="text-muted">{t('posts.empty')}</p>
                  ) : (
                    state.posts.map(post => (
                      <button
                        key={post.id}
                        type="button"
                        className="list-group-item list-group-item-action text-start"
                        onClick={() => openModal(post)}
                      >
                        <h3 className="h6">{post.title}</h3>
                        <p className="mb-0 small text-muted">
                          {new Date(post.pubDate).toLocaleString()}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer border-top py-3 mt-5 bg-light">
          <div className="container-xl">
            <div className="text-center">
              {t('footer.text')} <a href="https://ru.hexlet.io" target="_blank" rel="noopener noreferrer">Hexlet</a>
            </div>
          </div>
        </footer>
      </div>
    </I18nextProvider>
  )
}

export default App
