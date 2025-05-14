import React from 'react'
import { useTranslation } from 'react-i18next'

export default function RegistrationForm({ onSubmit, state }) {
  const { t } = useTranslation()
  const [url, setUrl] = React.useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(url)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="url-input" className="form-label">
          Ссылка RSS
        </label>
        <input
          id="url-input"
          type="text"
          className={`form-control ${state.error ? 'is-invalid' : ''}`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {state.error && (
          <div className="invalid-feedback" data-testid="error-message">
            {t(`errors.${state.error}`)}
          </div>
        )}
        {state.success && (
          <div className="text-success" data-testid="success-message">
            {t('success')}
          </div>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={state.process === 'loading'}
        data-testid="submit-button"
      >
        {state.process === 'loading' ? 'Загрузка...' : 'Добавить'}
      </button>
    </form>
  )
}
