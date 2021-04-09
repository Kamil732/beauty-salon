import React from 'react'
import PropTypes from 'prop-types'

function Modal(props) {
	return (
		<>
			{props.isOpen && (
				<div className="dark-bg" onClick={props.closeModal}></div>
			)}
			<div className={`modal${props.isOpen ? ' show' : ''}`} {...props}>
				<span
					className="btn-close rt-corner"
					onClick={props.closeModal}
				></span>
				{props.children}
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
	isOpen: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
}

Modal.Header = Header
Modal.Body = Body

export default Modal
