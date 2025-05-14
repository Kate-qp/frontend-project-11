import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export const PostPreviewModal = ({ post = {}, show = false, onHide = () => {} }) => {
  const { t } = useTranslation()
  
  if (!post) return null
  
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton closeVariant="white" className="bg-dark text-white">
        <Modal.Title as="h3" className="mb-0">
          {post.title || t('post.noTitle')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <p className="mb-0">
          {post.description || t('post.noDescription')}
        </p>
      </Modal.Body>
    </Modal>
  )
}

PostPreviewModal.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  show: PropTypes.bool,
  onHide: PropTypes.func
}

export default PostPreviewModal
