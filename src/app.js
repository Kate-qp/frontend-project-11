import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import axios from 'axios'
import watch from './view.js'
import validate from './validator.js'
import parseRss from './rssParser.js'
import resources from './lang/langs.js'

const language = 'ru'
const allOriginsProxyUrl = 'https://allorigins.hexlet.app/get'
const errorsCodes = {
  ERR_NETWORK: 'Ошибка сети',
  ECONNABORTED: 'Таймаут запроса'
}
const defaultTimeout = 5000

const getRssData = (url) => {
  const objectUrl = new URL(allOriginsProxyUrl)
  objectUrl.searchParams.set('disableCache', 'true')
  objectUrl.searchParams.set('url', url)
  return objectUrl.href
}

const app = (selectors, initState, i18nextInstance, axiosInstance) => {
  const state = { ...initState }
  const watchedState = watch(state, selectors, i18nextInstance)

  const onSubmittedForm = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const url = formData.get('url').trim()

    watchedState.form = {
      isValid: true,
      error: null,
      feedback: null
    }

    if (!validate(url)) {
      watchedState.form = {
        isValid: false,
        error: 'Ссылка должна быть валидным URL',
        feedback: 'Ссылка должна быть валидным URL'
      }
      return
    }

    const duplicateFeed = state.feeds.find(feed => feed.url === url)
    if (duplicateFeed) {
      watchedState.form = {
        isValid: false,
        error: 'RSS уже существует',
        feedback: 'RSS уже существует'
      }
      watchedState.sendingProcess.status = 'idle'
      return
    }

    getFeedRequest(url)
  }

  const getFeedRequest = (url) => {
    watchedState.sendingProcess = {
      status: 'sending',
      error: null
    }
    
    axiosInstance.get(getRssData(url), { timeout: 10000 })
      .then((response) => {
        if (!response.data.contents) {
          throw new Error('Invalid RSS feed')
        }
        
        const { feed, posts } = parseRss(response.data.contents)
        watchedState.feeds = [
          ...state.feeds,
          { ...feed, id: uuidv4(), url }
        ]
        watchedState.posts = [
          ...state.posts,
          ...posts.map((post) => ({
            ...post,
            id: uuidv4(),
            feedId: feed.id,
            visited: false
          }))
        ]
        watchedState.sendingProcess.status = 'success'
        watchedState.form = {
          isValid: true,
          error: null,
          feedback: 'RSS успешно загружен'
        }
      })
      .catch((error) => {
        watchedState.sendingProcess.status = 'failed'
        const errorMessage = errorsCodes[error.code] || 
                         (error.message.includes('Invalid RSS') ? 
                          'Ресурс не содержит валидный RSS' : 
                          'Ошибка сети')
        watchedState.form = {
          isValid: false,
          error: errorMessage,
          feedback: errorMessage
        }
      })
  }

  const postExist = (postId) => state.posts.some(post => post.id === postId)

  const readPost = (e) => {
    const readPostId = e.target.dataset.id
    if (!postExist(readPostId)) return
    
    watchedState.openedPosts = [...state.openedPosts, readPostId]
    watchedState.openedPostInModal = readPostId

    watchedState.posts = state.posts.map(post => 
      post.id === readPostId ? { ...post, visited: true } : post
    )
  }

  const getNewPosts = (posts) => {
    const initialPostsIds = state.posts.map(({ id }) => id)
    const initialPostsIdsSet = new Set(initialPostsIds)
    return posts.filter(({ id }) => !initialPostsIdsSet.has(id))
  }

  const updatePosts = () => {
    if (state.feeds.length === 0) {
      setTimeout(updatePosts, defaultTimeout)
      return
    }

    const promises = state.feeds.map(({ url, id }) => 
      axiosInstance.get(getRssData(url))
        .then(response => {
          const parsedData = parseRss(response.data.contents)
          const newPosts = getNewPosts(parsedData.posts)
          if (newPosts.length > 0) {
            watchedState.posts = [
              ...newPosts.map(post => ({
                ...post,
                id: uuidv4(),
                feedId: id,
                visited: false
              })),
              ...state.posts
            ]
          }
        })
        .catch(() => {})
    )

    Promise.all(promises)
      .finally(() => setTimeout(updatePosts, defaultTimeout))
  }

  if (selectors.postsDiv) {
    selectors.postsDiv.addEventListener('click', readPost)
  }

  selectors.form.objectForm.addEventListener('submit', onSubmittedForm)
  selectors.form.input.addEventListener('input', () => {
    watchedState.form.error = null
    watchedState.form.feedback = null
  })

  updatePosts()
}

export default () => {
  const selectors = {
    form: {
      objectForm: document.querySelector('.rss-form'),
      input: document.querySelector('#url-input'),
      btnSubmit: document.querySelector('button[type="submit"]')
    },
    feedback: document.querySelector('.feedback'),
    feedsDiv: document.querySelector('.feeds'),
    postsDiv: document.querySelector('.posts'),
    modal: document.querySelector('#modal')
  }

  const initState = {
    form: {
      isValid: true,
      error: null,
      feedback: null
    },
    sendingProcess: {
      status: 'idle',
      error: null
    },
    feeds: [],
    posts: [],
    openedPosts: [],
    openedPostInModal: null,
    language
  }

  const i18nextInstance = i18next.createInstance()
  const axiosInstance = axios.create({
    timeout: 10000
  })

  i18nextInstance.init({
    lng: language,
    debug: false,
    resources
  }).then(() => {
    app(selectors, initState, i18nextInstance, axiosInstance)
  })
}
