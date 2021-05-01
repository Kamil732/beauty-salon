import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

function Modal({ children, closeModal, ...props }) {
	useEffect(() => {
		const body = document.querySelector('body')
		body.style.overflowY = 'hidden'

		return () => (body.style.overflowY = 'auto')
	}, [])

	return (
		<>
			<div className="dark-bg" onClick={closeModal}></div>
			<div className="modal show" {...props}>
				<span
					className="btn-close rt-corner"
					onClick={closeModal}
				></span>
				{children}
			</div>
		</>
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
