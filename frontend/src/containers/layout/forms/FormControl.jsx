import React from 'react'
import PropTypes from 'prop-types'

function FormControl({ children }) {
	return <div className="form-control">{children}</div>
}

function Label(props) {
	const input = document.getElementById(props.htmlFor)
	let classNames = 'form-control__label'

	if (input?.value) classNames += ' active'

	return <label className={classNames} {...props} />
}

Label.prototype.propTypes = {
	htmlFor: PropTypes.string.isRequired,
}

function Input(props) {
	return <input className="form-control__input" {...props} />
}

FormControl.Label = Label
FormControl.Input = Input

export default FormControl
