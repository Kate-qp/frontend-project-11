import i18next from 'i18next'
import axios from 'axios'
import watch from './view.js'
import validate from './validator.js'
import parseRss from './rssParser.js'
import resources from './lang/langs.js'

const language = 'ru'
const allOriginsProxyUrl = 'https://allorigins.hexlet.app/get'
const errorsCodes = {
  ERR_NETWORK: new Error('network_error'),
  ECONNABORTED: new Error('request_timed_out'),
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

  const getFeedRequest = (url) => {
    axiosInstance
      .get(getRssData(url))
      .then(({ data }) => {
        const { feed, posts } = parseRss(data.contents)
        watchedState.feeds = [...watchedState.feeds, { url, ...feed }]
        watchedState.posts = [...watchedState.posts, ...posts]
        watchedState.sendingProcess.status = 'added'
        watchedState.form.isValid = true
        watchedState.form.error = null

        selectors.form.input.classList.remove('is-invalid')
      })
      .catch((error) => {
        watchedState.sendingProcess.status = 'failed'
        watchedState.sendingProcess.errors = errorsCodes[error.code] ?? new Error('rss.invalid')
      })
  }

  const onSubmittedForm = (e) => {
    e.preventDefault()

    const url = new FormData(e.target).get('url')
    const urls = state.feeds.map((feed) => feed.url)
    validate(url, urls)
      .then(() => {
        watchedState.form.isValid = true
        watchedState.form.error = null

        watchedState.sendingProcess.status = 'loading'
        getFeedRequest(url)
      })
      .catch((error) => {
        watchedState.sendingProcess.status = 'failed'
        watchedState.form.error = error
        watchedState.form.isValid = false
      })
  }

  const postExist = (postId) => state.posts.some((post) => post.id === postId)

  const readPost = (e) => {
    const readPostId = e.target.dataset.id
    if (!postExist(readPostId)) return
    watchedState.openedPosts = [...watchedState.openedPosts, readPostId]
    watchedState.openedPostInModal = readPostId
  }

  const getNewPosts = (posts) => {
    const initialPostsIds = state.posts.map(({ id }) => id)
    const initialPostsIdsSet = new Set(initialPostsIds)
    return posts.filter(({ id }) => !initialPostsIdsSet.has(id))
  }

  const updatePosts = () => {
    const { feeds } = state
    const promises = feeds.map(({ url }) =>
      axiosInstance
        .get(getRssData(url))
        .then((response) => {
          const parsedData = parseRss(response.data.contents)
          const newPosts = getNewPosts(parsedData.posts)
          if (newPosts.length > 0) {
            watchedState.posts.push(...newPosts)
          }
        })
        .catch((error) => error),
    )

    Promise.all(promises).finally(() => {
      setTimeout(updatePosts, defaultTimeout)
    })
  }

  if (selectors.postsDiv) {
    selectors.postsDiv.addEventListener('click', readPost)
  }

  selectors.form.objectForm.addEventListener('submit', onSubmittedForm)

  updatePosts()
}

export default () => {
  const selectors = {
    form: {
      objectForm: document.querySelector('.rss-form'),
      input: document.querySelector('#url-input'),
      btnSubmit: document.querySelector('button[type="submit"]'),
    },
    feedback: document.querySelector('.feedback'),
    feedsDiv: document.querySelector('.feeds'),
    postsDiv: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
  }

  const initState = {
    form: {
      isValid: true,
      error: null,
    },
    sendingProcess: {
      status: 'wait',
      errors: null,
    },
    feeds: [],
    posts: [],
    openedPosts: [],
    openedPostInModal: null,
    language,
  }

  const i18nextInstance = i18next.createInstance()
  const axiosInstance = axios.create({
    timeout: 10000,
  })

  i18nextInstance
    .init({
      debug: false,
      resources,
      fallbackLng: initState.language,
    })
    .then(() => {
      app(selectors, initState, i18nextInstance, axiosInstance)
    })
    .catch((error) => {
      console.log(`Неизвестная ошибка: ${error.message}`)
    })
}
