import { useState } from 'react'
import { fetchFeed } from '../utils/api'
import { isValidUrl } from '../utils/validators'

export const RegistrationForm = ({ feeds, addNewFeed }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const url = formData.get('url').trim()
    
    try {
      if (!isValidUrl(url)) {
        setError('invalidUrl')
        return
      }
      
      if (feeds.some(feed => feed.url === url)) {
        setError('duplicate')
        return
      }
      
      setLoading(true)
      const feedContent = await fetchFeed(url)
      addNewFeed(url, feedContent)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rss-form">
      <div className="form-floating">
        <input
          id="url-input"
          name="url"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder="ссылка RSS"
          disabled={loading}
        />
        <label htmlFor="url-input">Ссылка RSS</label>
        {error === 'invalidUrl' && (
          <div className="invalid-feedback">Ссылка должна быть валидным URL</div>
        )}
        {error === 'duplicate' && (
          <div className="invalid-feedback">RSS уже существует</div>
        )}
      </div>
      
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Загрузка...
          </>
        ) : 'Добавить'}
      </button>
    </form>
  )
}
