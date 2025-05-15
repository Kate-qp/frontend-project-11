const renderModal = (post, i18n) => { 
  const viewButton = document.createElement('button');
  viewButton.classList.add('btn', 'btn-primary', 'view-button');
  viewButton.textContent = i18n.t('buttons.modalButtonName'); 
  viewButton.setAttribute('data-bs-toggle', 'modal');
  viewButton.setAttribute('data-bs-target', '#modal');
  viewButton.setAttribute('data-id', post.id);
  return viewButton;
};

const renderModalContent = (watchedState, elements) => {
  const { modalTitle, modalBody, fullArticleLink } = elements;

  if (!watchedState.modal) {
    return;
  }

  const post = watchedState.posts.find((p) => p.id === watchedState.modal.postId);
  if (!post) return;

  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  fullArticleLink.href = post.link;
};

const renderPost = (watchedState, elements, i18n) => {
  const { postsContainer } = elements;
  postsContainer.innerHTML = '';
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18n.t('items.postMain');
  cardBody.append(title);

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group');

  watchedState.posts.forEach((post) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'd-flex', 'justify-content-between', 'align-items-start');

    const postLink = document.createElement('a');
    postLink.href = post.link;
    postLink.target = '_blank';
    postLink.textContent = post.title;
    postLink.setAttribute('data-post-id', post.id); 

    if (watchedState.readPosts.includes(post.link)) {
      postLink.classList.remove('fw-bold');
      postLink.classList.add('text-muted');
    } else {
      postLink.classList.add('fw-bold');
      postLink.classList.remove('text-muted');
    }

    const viewButton = renderModal(post, i18n);
    viewButton.setAttribute('data-post-id', post.id);

    listItem.append(postLink, viewButton);
    listGroup.append(listItem); 
  });

  cardDiv.append(cardBody, listGroup);
  postsContainer.append(cardDiv);
};

const renderFeed = (watchedState, elements, i18n) => { 
  const { feedsContainer } = elements;
  feedsContainer.innerHTML = '';
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18n.t('items.feedMain');
  cardBody.append(title);

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group');

  watchedState.feeds.forEach((feed) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0');

    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6');
    feedTitle.textContent = feed.title;

    const feedDescription = document.createElement('p');
    feedDescription.classList.add('small', 'text-black-50');
    feedDescription.textContent = feed.description;

    listItem.append(feedTitle, feedDescription);
    listGroup.append(listItem);
  });

  cardDiv.append(cardBody, listGroup);
  feedsContainer.append(cardDiv);
};

const disableButton = (elements) => {
  const { submitButton } = elements;
  submitButton.disabled = true;
  submitButton.classList.add('disabled');
};

const enableButton = (elements) => {
  const { submitButton } = elements; 
  submitButton.disabled = false; 
  submitButton.classList.remove('disabled');
};

const renderForm = (watchedState, elements, i18n) => { 
  const { feedback, form, input } = elements; 

  switch (watchedState.form.status) {
    case 'filling':
      enableButton(elements);
      feedback.textContent = '';
      feedback.classList.remove('text-danger', 'text-success');
      break;

    case 'sending':
      disableButton(elements);
      feedback.textContent = i18n.t('status.loadingUrl');
      feedback.classList.remove('text-danger', 'text-success');
      break;

    case 'added':
      enableButton(elements);
      feedback.textContent = i18n.t('status.successLoadUrl');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      form.reset();
      input.focus();
      break;

    case 'error':
      enableButton(elements); 
      feedback.textContent = watchedState.form.error; 
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.focus(); 
      break;
    default:
      break;
  }
};

export {
  renderFeed, renderForm, renderPost, renderModalContent,
};