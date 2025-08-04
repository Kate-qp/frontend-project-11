const isValidXML = (document) => {
  const errorElement = document.querySelector('parsererror')
  return !errorElement
}

const getPosts = (xmlDocument) => {
  const postElements = xmlDocument.querySelectorAll('item, entry')

  if (!postElements.length) {
    return []
  }

  return Array.from(postElements).map((postElement) => {
    const pubDate = postElement.querySelector('pubDate, published, updated')
    const title = postElement.querySelector('title')
    const description = postElement.querySelector('description, summary')
    const link = postElement.querySelector('link')
    const id = postElement.querySelector('guid, id')

    return {
      title: title ? title.textContent.trim() : '',
      description: description ? description.textContent.trim() : '',
      link: link ? (link.textContent || link.getAttribute('href')).trim() : '',
      id: id ? id.textContent.replace(/\D/g, '') : Date.now().toString(),
      pubDate: pubDate ? Date.parse(pubDate.textContent) : Date.now(),
    }
  })
}

const getFeed = (xmlDocument) => {
  const channel = xmlDocument.querySelector('channel, feed')
  if (!channel) {
    throw new Error('rss.invalid')
  }

  const title = channel.querySelector('title')
  const description = channel.querySelector('description, subtitle')

  return {
    title: title ? title.textContent.trim() : '',
    description: description ? description.textContent.trim() : '',
  }
}

export default (xml) => {
  if (!xml || typeof xml !== 'string') {
    throw new Error('rss.invalid')
  }

  const xmlDocument = new DOMParser().parseFromString(xml, 'text/xml')

  if (!isValidXML(xmlDocument)) {
    throw new Error('rss.invalid')
  }

  try {
    return {
      feed: getFeed(xmlDocument),
      posts: getPosts(xmlDocument),
    }
  } catch (error) {
    throw new Error('rss.invalid')
  }
}
