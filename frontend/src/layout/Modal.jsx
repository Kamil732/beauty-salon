import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { CloseButton } from './buttons/Button'

function Modal({ children, closeModal, isChild, ...props }) {
	const modalRef = useRef(null)

	useEffect(() => {
		const body = document.querySelector('body')
		body.style.overflowY = 'hidden'

		return () => (body.style.overflowY = 'auto')
	}, [])

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (modalRef.current && !modalRef.current.contains(e.target))
				closeModal()
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [closeModal])

	const modal = (
		<div className="dark-bg">
			<div className="modal" {...props} ref={modalRef}>
				<CloseButton trCorner onClick={closeModal} />
				{children}
			</div>
		</div>
	)

	if (isChild) return modal

	return ReactDOM.createPortal(modal, document.querySelector('body'))
}

function Header(props) {
	return <div className="modal__header" {...props} />
}

function Body(props) {
	return <div className="modal__body" {...props} />
}

Modal.prototype.propTypes = {
	isChild: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
}

Modal.Header = Header
Modal.Body = Body

export default Modal
