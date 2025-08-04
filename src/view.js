import onChange from 'on-change'

const clearMessage = (paragraph) => {
  paragraph.classList.remove('text-danger')
  paragraph.classList.remove('text-success')
  paragraph.textContent = ''
}

const showMessage = (paragraph, message, isSuccess) => {
  paragraph.textContent = message
  paragraph.classList.add(isSuccess ? 'text-success' : 'text-danger')
}

const disableForm = (rssForm) => {
  rssForm.input.setAttribute('disabled', '')
  rssForm.btnSubmit.setAttribute('disabled', '')
}

const enableForm = (rssForm) => {
  rssForm.input.removeAttribute('disabled')
  rssForm.btnSubmit.removeAttribute('disabled')
}

export const renderFeedback = (state, i18nextInstance) => {
  const feedbackEl = document.querySelector('.feedback')
  if (!feedbackEl) return
  
  // Очищаем только если нет важных сообщений
  if (!state.form.feedback && !state.form.error) {
    clearMessage(feedbackEl)
  }

  // Приоритет у сообщений из формы
  if (state.form.feedback) {
    showMessage(feedbackEl, state.form.feedback, state.form.isValid)
  } else if (state.form.error) {
    showMessage(feedbackEl, state.form.error, false)
  } else if (state.sendingProcess.status === 'success') {
    showMessage(feedbackEl, i18nextInstance.t('success.loaded'), true)
  } else if (state.sendingProcess.status === 'failed') {
    const errorKey = state.sendingProcess.error || 'errors.invalid'
    showMessage(feedbackEl, i18nextInstance.t(errorKey), false)
  }
}

const handleProcess = (selectors, processStatus, i18nextInstance) => {
  switch (processStatus) {
    case 'sending':
      disableForm(selectors.form)
      break
    case 'success':
      enableForm(selectors.form)
      selectors.form.objectForm.reset()
      selectors.form.input.focus()
      break
    case 'failed':
      enableForm(selectors.form)
      selectors.form.input.focus()
      break
    default:
      break
  }
}

const createCardUl = (buttonName, entityType, i18nextInstance) => {
  const card = document.createElement('div')
  card.classList.add('card', 'border-0')
  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  const title = document.createElement('h2')
  title.classList.add('card-title', 'h4')
  title.textContent = i18nextInstance.t(buttonName)
  cardBody.append(title)
  const ul = document.createElement('ul')
  ul.setAttribute('id', entityType)
  ul.classList.add('list-group', 'border-0', 'rounded-0')
  card.append(cardBody, ul)
  return card
}

const clearDiv = (div) => {
  const updatedDiv = div
  updatedDiv.innerHTML = ''
}

const showFeeds = (div, state, i18nextInstance) => {
  clearDiv(div)
  const entityType = 'ulFeeds'
  div.append(createCardUl('feeds.title', entityType, i18nextInstance))
  const ul = document.querySelector(`#${entityType}`)
  state.feeds.forEach((feed) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'border-end-0')
    const h3 = document.createElement('h3')
    h3.classList.add('h6', 'm-0')
    h3.textContent = feed.title
    li.append(h3)
    const tagP = document.createElement('p')
    tagP.classList.add('m-0', 'small', 'text-black-50')
    tagP.textContent = feed.description
    li.append(tagP)
    ul.append(li)
  })
}

const isViewedPosts = (postId, viewedPosts) => viewedPosts.find((post) => post.id === postId)

const setPost = (post, buttonName, state) => {
  const li = document.createElement('li')
  li.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0'
  )
  const linkTag = document.createElement('a')
  const fontClass = !isViewedPosts(post.id, state.openedPosts) ? 'fw-bold' : 'fw-normal'
  linkTag.classList.add(fontClass)
  linkTag.setAttribute('href', post.link)
  linkTag.setAttribute('data-id', post.id)
  linkTag.setAttribute('target', '_blank')
  linkTag.setAttribute('rel', 'noopener noreferrer')
  linkTag.textContent = post.title
  li.append(linkTag)

  const button = document.createElement('button')
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
  button.setAttribute('type', 'button')
  button.setAttribute('data-id', post.id)
  button.setAttribute('data-bs-toggle', 'modal')
  button.setAttribute('data-bs-target', '#modal')
  button.textContent = buttonName
  li.append(button)
  return li
}

const showPosts = (div, state, i18nextInstance) => {
  clearDiv(div)
  const entityType = 'ulPosts'
  div.append(createCardUl('posts.title', 'ulPosts', i18nextInstance))
  const ul = document.querySelector(`#${entityType}`)
  const buttonName = i18nextInstance.t('posts.button')
  state.posts.forEach((post) => ul.append(setPost(post, buttonName, state)))
}

const openModal = (postId, posts, modalDiv) => {
  const modal = modalDiv
  const post = posts.find((currentPost) => currentPost.id === postId)
  modal.querySelector('.modal-title').textContent = post.title
  modal.querySelector('.modal-body').textContent = post.description
  const button = modal.querySelector('.full-article')
  button.setAttribute('href', post.link)
}

const showModalPost = (posts, selectors) => {
  posts.forEach((postId) => {
    const openedPost = selectors.postsDiv.querySelector(`[data-id="${postId}"]`)
    openedPost.classList.remove('fw-bold')
    openedPost.classList.add('fw-normal', 'link-secondary')
  })
}

export default (state, selectors, i18nextInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.isValid':
      selectors.form.input.classList.toggle('is-invalid', !value)
      selectors.form.input.focus()
      break
    case 'form.feedback':
    case 'form.error':
      renderFeedback(state, i18nextInstance)
      break
    case 'sendingProcess.status':
      handleProcess(selectors, value, i18nextInstance)
      renderFeedback(state, i18nextInstance)
      break
    case 'sendingProcess.error':
      renderFeedback(state, i18nextInstance)
      break
    case 'feeds':
      showFeeds(selectors.feedsDiv, state, i18nextInstance)
      break
    case 'posts':
      showPosts(selectors.postsDiv, state, i18nextInstance)
      break
    case 'openedPosts':
      showModalPost(value, selectors)
      break
    case 'openedPostInModal':
      openModal(value, state.posts, selectors.modal)
      break
    default:
      break
  }
})
