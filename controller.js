import * as yup from 'yup'
import uniqueId from 'lodash/uniqueId.js'
import uniqBy from 'lodash/uniqBy.js'
import axios from 'axios'

const parse = (response, feedId) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(response, 'application/xml')
  if (doc.querySelector('parsererror') === null) {
    const title = doc.querySelector('title').textContent
    const description = doc.querySelector('description').textContent
    const items = doc.querySelectorAll('item')
    const posts = []
    items.forEach((el) => {
      const name = el.querySelector('title').textContent
      const postDescription = el.querySelector('description').textContent
      const link = el.querySelector('link').textContent
      posts.push({
        name, postDescription, isReaded: false, id: uniqueId(`${feedId}_`), link,
      })
    })
    return { title, description, posts }
  }
  throw new Error('uncorrectRss')
}

const validate = (fields, feeds) => {
  const schema = yup.object({
    name: yup.string().url().trim().required()
      .notOneOf(feeds),
  })
  return schema.validate(fields, { abortEarly: false })
    .then(() => '').catch((e) => {
      if (e.message === 'name must be a valid URL') {
        return 'invalidUrl'
      }
      return 'duplicateError'
    })
}

const addNewFeed = (state, value, doc, feedId, posts) => {
  const watchedState = state
  watchedState.form.feeds.push(value)
  watchedState.form.processState = 'sent'
  const { title, description } = doc
  const parsedPosts = doc.posts
  watchedState.form.feedsDescription.push({ title, description, id: feedId })
  watchedState.form.posts = parsedPosts
  parsedPosts.forEach((el) => posts.push(el))
}

const updateFeed = (doc, feedId, posts, state) => {
  const watchedState = state
  const parsedPosts = doc.posts
  const newPosts = parsedPosts.map((el) => {
    const { name } = el
    return { name, id: uniqueId(`${feedId}_`) }
  })
  const res = [...posts, ...newPosts]
  const result = uniqBy(res, 'name')
  watchedState.form.posts = result
}

const addNewPosts = (state, value, feedId, posts) => {
  const parsedURL = new URL('https://allorigins.hexlet.app/get')
  parsedURL.searchParams.set('disableCache', 'true')
  parsedURL.searchParams.set('url', value)
  axios.get(parsedURL.href)
    .then((response) => {
      const doc = parse(response.data.contents, feedId)
      if (!state.form.feeds.includes(value)) {
        addNewFeed(state, value, doc, feedId, posts)
      } else {
        updateFeed(doc, feedId, posts, state)
      }
      setTimeout(addNewPosts, 5000, state, value, feedId, state.form.posts)
    })
    .catch((e) => {
      const watchedState = state
      watchedState.form.processError = e.message
      watchedState.form.processState = 'error'
    })
}

export default (state, watchedPosts) => {
  const form = document.querySelector('form')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = form.elements.url
    const { value } = input
    const watchedState = state
    watchedState.form.fields.name = value;
    validate(watchedState.form.fields, watchedState.form.feeds)
      .then((errors) => {
        watchedState.form.valid = errors === ''
        watchedState.form.processState = 'sending'
        if (watchedState.form.valid) {
          const feedId = uniqueId()
          addNewPosts(watchedState, value, feedId, watchedPosts)
        } else {
          watchedState.form.processError = `${errors}`
          watchedState.form.processState = 'error'
        }
      })
  })
  const postsList = document.querySelector('.col-8 .list-group')
  postsList.addEventListener('click', (event) => {
    const { target } = event;
    const post = watchedPosts.find((item) => item.id === target.dataset.id)
    post.isReaded = true;
  })
}
