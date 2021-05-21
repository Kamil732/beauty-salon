import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { CloseButton } from './buttons/Button'

function Modal({ children, closeModal, ...props }) {
	useEffect(() => {
		const body = document.querySelector('body')
		body.style.overflowY = 'hidden'

		return () => (body.style.overflowY = 'auto')
	}, [])

	return ReactDOM.createPortal(
		<>
			<div className="dark-bg" onClick={closeModal}></div>
			<div className="modal" {...props}>
				<CloseButton trCorner onClick={closeModal} />
				{children}
			</div>
		</>,
		document.getElementById('root')
	)
}

function Header(props) {
	return <div className="modal__header" {...props} />
}

function Body(props) {
	return <div className="modal__body" {...props} />
}

Modal.prototype.propTypes = {
	closeModal: PropTypes.func.isRequired,
}

Modal.Header = Header
Modal.Body = Body

export default Modal
