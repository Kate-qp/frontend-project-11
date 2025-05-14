import React, { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import RegistrationForm from './components/RegistrationForm'

function App() {
  const [feeds, setFeeds] = useState([])
  const [posts, setPosts] = useState([])
  const [timerId, setTimerId] = useState(null)

  const fetchFeed = async (url) => {
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
      if (!response.ok) throw new Error('Network response was not ok')
      
      const data = await response.json()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(data.contents, 'text/xml')
      
      return Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
        id: item.querySelector('guid')?.textContent || Date.now().toString(),
        title: item.querySelector('title')?.textContent || 'No title',
        link: item.querySelector('link')?.textContent || '#',
        pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
        feedUrl: url
      }))
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
      return []
    }
  }

  const checkFeeds = async () => {
    const newPosts = []
    
    for (const feed of feeds) {
      const currentPosts = await fetchFeed(feed.url)
      const existingPostIds = posts.map(post => post.id)
      const filteredPosts = currentPosts.filter(post => !existingPostIds.includes(post.id))
      
      newPosts.push(...filteredPosts)
    }
    
    if (newPosts.length > 0) {
      setPosts(prevPosts => [...newPosts, ...prevPosts])
    }
    
    // Планируем следующую проверку
    setTimerId(setTimeout(checkFeeds, 5000))
  }

  useEffect(() => {
    // Запускаем проверку при изменении feeds
    if (feeds.length > 0) {
      checkFeeds()
    }
    
    // Очистка при размонтировании
    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [feeds])

  const addFeed = (url) => {
    if (!feeds.some(feed => feed.url === url)) {
      setFeeds(prevFeeds => [...prevFeeds, { url }])
    }
  }

  return (
    <I18nextProvider i18n={i18n}>
      <div className="app-container">
        <RegistrationForm onAddFeed={addFeed} />
        <div className="posts-container">
          {posts.map(post => (
            <div key={post.id} className="post-item">
              <h3><a href={post.link}>{post.title}</a></h3>
              <p>{new Date(post.pubDate).toLocaleString()}</p>
              <small>From: {post.feedUrl}</small>
            </div>
          ))}
        </div>
      </div>
    </I18nextProvider>
  )
}

export default App
