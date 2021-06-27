import PropTypes from 'prop-types'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'

function FormControl({ children }) {
	return <div className="form-control">{children}</div>
}

function Label({ inputValue, ...props }) {
	return (
		<label
			className={`form-control__label${inputValue ? ' active' : ''}`}
			{...props}
		/>
	)
}

Label.prototype.propTypes = {
	inputValue: PropTypes.any.isRequired,
}

function CheckBoxLabel(props) {
	return <label className="form-control__checkbox-label" {...props} />
}

function Input(props) {
	return (
		<>
			<input
				className="form-control__input"
				title={props.required ? 'Proszę wypełnij to pole' : ''}
				{...props}
			/>
			<span className="form-control__input__border"></span>
		</>
	)
}

function Textarea(props) {
	return (
		<>
			<TextareaAutosize
				className="form-control__input form-control__textarea"
				title={props.required ? 'Proszę wypełnij to pole' : ''}
				{...props}
			/>
			<span className="form-control__input__border"></span>
		</>
	)
}

function CheckBox({ name, checked, onChange, ...props }) {
	return (
		<>
			<input
				type="checkbox"
				className="form-control__checkbox"
				name={name}
				checked={checked}
				onChange={onChange}
				{...props}
			/>
			<span className="form-control__checkbox-checkmark"></span>
		</>
	)
}

CheckBox.prototype.propTypes = {
	name: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
}

FormControl.Label = Label
FormControl.CheckBoxLabel = CheckBoxLabel
FormControl.Input = Input
FormControl.Textarea = Textarea
FormControl.CheckBox = CheckBox

export default FormControl
