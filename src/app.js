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
  ERR_NETWORK: 'network_error',
  ECONNABORTED: 'request_timed_out'
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
    watchedState.sendingProcess.status = 'sending'
    
    axiosInstance.get(getRssData(url))
      .then(({ data }) => {
        const { feed, posts } = parseRss(data.contents)
        watchedState.feeds = [
          ...watchedState.feeds,
          { ...feed, id: uuidv4(), url }
        ]
        watchedState.posts = [
          ...watchedState.posts,
          ...posts.map((post) => ({
            ...post,
            id: uuidv4(),
            feedId: feed.id
          }))
        ]
        watchedState.sendingProcess.status = 'success'
        watchedState.form.feedback = 'RSS загружен успешно'
        watchedState.form.error = null
      })
      .catch((error) => {
        watchedState.sendingProcess.status = 'failed'
        watchedState.form.feedback = errorsCodes[error.code] ?? 'Ошибка при загрузке RSS'
        watchedState.form.error = watchedState.form.feedback
      })
}

  const postExist = postId => state.posts.some(post => post.id === postId)

  const readPost = e => {
    const readPostId = e.target.dataset.id
    if (!postExist(readPostId)) {
      return
    }
    watchedState.openedPosts = [...watchedState.openedPosts, readPostId]
    watchedState.openedPostInModal = readPostId
  }

  const getNewPosts = posts => {
    const initialPostsIds = state.posts.map(({ id }) => id)
    const initialPostsIdsSet = new Set(initialPostsIds)
    return posts.filter(({ id }) => !initialPostsIdsSet.has(id))
  }

  const updatePosts = () => {
    const { feeds } = state

    const promises = feeds.map(({ url }) => axiosInstance.get(getRssData(url))
      .then(response => {
        const parsedData = parseRss(response.data.contents)
        const newPosts = getNewPosts(parsedData.posts)
        if (!newPosts.length) {
          return
        }
        watchedState.posts.push(...newPosts)
      })
      .catch(error => error))

    Promise.all(promises)
      .then(() => {
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
