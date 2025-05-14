import validateUrl from './validators.js';
import onChange from 'on-change';
import axios from 'axios';

export default class Controller {
  constructor(form, input, feedback, urlsContainer) {
    this.form = form;
    this.input = input;
    this.feedback = feedback;
    this.urlsContainer = urlsContainer;

    this.state = {
      feeds: [],
      posts: [],
      form: {
        valid: true,
        errors: [],
        value: '',
        processState: 'filling', // 'filling', 'sending', 'success', 'error'
      },
    };

    this.init();
  }

  init() {
    this.watchedState = onChange(this.state, this.render.bind(this));
    this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
  }

  render(path) {
    if (path === 'form.processState') {
      const submitButton = this.form.querySelector('button[type="submit"]');
      const isLoading = this.state.form.processState === 'sending';

      submitButton.disabled = isLoading;
      submitButton.innerHTML = isLoading
        ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...'
        : 'Add';
    }

    if (path === 'form.errors') {
      this.feedback.textContent = this.state.form.errors.join(', ');
      this.feedback.classList.toggle('text-danger', this.state.form.errors.length > 0);
    }

    if (path === 'form.valid') {
      this.input.classList.toggle('is-invalid', !this.state.form.valid);
    }

    if (path === 'feeds' || path === 'posts') {
      this.renderContent();
    }
  }

  renderContent() {
    // Очищаем контейнер
    this.urlsContainer.innerHTML = '';

    // Создаем секцию для фидов
    const feedsSection = document.createElement('div');
    feedsSection.className = 'feeds-section mb-4';
    feedsSection.innerHTML = '<h2 class="h5 mb-3">Your Feeds</h2>';
    
    const feedsList = document.createElement('div');
    feedsList.className = 'list-group';
    
    if (this.state.feeds.length === 0) {
      feedsList.innerHTML = '<div class="text-muted">No feeds added yet</div>';
    } else {
      this.state.feeds.forEach(feed => {
        const feedElement = document.createElement('div');
        feedElement.className = 'list-group-item';
        feedElement.innerHTML = `
          <h3 class="h6">${feed.title}</h3>
          <p class="mb-0 text-muted">${feed.description}</p>
        `;
        feedsList.appendChild(feedElement);
      });
    }
    
    feedsSection.appendChild(feedsList);
    this.urlsContainer.appendChild(feedsSection);

    // Создаем секцию для постов
    const postsSection = document.createElement('div');
    postsSection.className = 'posts-section';
    postsSection.innerHTML = '<h2 class="h5 mb-3">Latest Posts</h2>';
    
    const postsList = document.createElement('div');
    postsList.className = 'list-group';
    
    if (this.state.posts.length === 0) {
      postsList.innerHTML = '<div class="text-muted">No posts available</div>';
    } else {
      this.state.posts.forEach(post => {
        const postElement = document.createElement('a');
        postElement.href = post.link;
        postElement.target = '_blank';
        postElement.rel = 'noopener noreferrer';
        postElement.className = 'list-group-item list-group-item-action';
        postElement.innerHTML = `
          <h4 class="h6 mb-1">${post.title}</h4>
          <p class="mb-1">${post.description}</p>
          <small class="text-muted">${new Date(post.pubDate).toLocaleString()}</small>
        `;
        postsList.appendChild(postElement);
      });
    }
    
    postsSection.appendChild(postsList);
    this.urlsContainer.appendChild(postsSection);
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    const url = this.input.value.trim();

    try {
      // Валидация URL
      this.state.form.processState = 'sending';
      await validateUrl(this.state.feeds.map(f => f.url)).validate({ url });

      // Загрузка и парсинг RSS
      const { feed, posts } = await this.fetchAndParseRSS(url);

      // Обновление состояния
      this.state.feeds = [...this.state.feeds, feed];
      this.state.posts = [...this.state.posts, ...posts];
      this.state.form = {
        valid: true,
        errors: [],
        value: '',
        processState: 'success',
      };

      this.input.focus();
    } catch (err) {
      this.state.form = {
        valid: false,
        errors: err.inner ? err.inner.map(e => e.message) : [err.message],
        value: url,
        processState: 'error',
      };
    }
  }

  async fetchAndParseRSS(url) {
    const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
    const response = await axios.get(proxyUrl);
    
    if (!response.data.contents) {
      throw new Error('Failed to load RSS feed');
    }

    return this.parseRSS(response.data.contents);
  }

  parseRSS(xmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid RSS format');
    }

    const channel = doc.querySelector('channel');
    if (!channel) {
      throw new Error('No channel found in RSS');
    }

    const feedTitle = channel.querySelector('title')?.textContent || 'Untitled feed';
    const feedDescription = channel.querySelector('description')?.textContent || 'No description';

    const items = doc.querySelectorAll('item');
    const posts = Array.from(items).map(item => ({
      title: item.querySelector('title')?.textContent || 'Untitled post',
      link: item.querySelector('link')?.textContent || '#',
      description: item.querySelector('description')?.textContent || 'No content',
      pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
    }));

    return {
      feed: {
        url: this.input.value.trim(),
        title: feedTitle,
        description: feedDescription,
      },
      posts,
    };
  }
}
