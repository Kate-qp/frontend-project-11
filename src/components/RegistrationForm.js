import React from 'react'
import { useFormik } from 'formik'
import { registrationSchema } from '../validationSchemas'
import { useTranslation } from 'react-i18next'

const RegistrationForm = () => {
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: registrationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        // Логика регистрации
        // Например: await api.register(values)
      } catch (error) {
        if (error.response?.data?.error === 'username_taken') {
          setErrors({ username: t('errors.usernameTaken') })
        } else {
          setErrors({ form: t('errors.network') })
        }
      }
    }
  })

  return (
    <div className="registration-form">
      <h1>{t('registration.title')}</h1>
      {formik.errors.form && <div className="error-message">{formik.errors.form}</div>}
      
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">{t('registration.fields.username')}</label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            className={formik.errors.username && formik.touched.username ? 'error' : ''}
          />
          {formik.errors.username && formik.touched.username && (
            <div className="error-message">{formik.errors.username}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">{t('registration.fields.password')}</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={formik.errors.password && formik.touched.password ? 'error' : ''}
          />
          {formik.errors.password && formik.touched.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">{t('registration.fields.confirmPassword')}</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className={formik.errors.confirmPassword && formik.touched.confirmPassword ? 'error' : ''}
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <div className="error-message">{formik.errors.confirmPassword}</div>
          )}
        </div>

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? t('registration.submitting') : t('registration.submit')}
        </button>
      </form>
      
      <div className="login-link">
        <a href="/login">{t('registration.alreadyHaveAccount')}</a>
      </div>
    </div>
  )
}

export default RegistrationForm
