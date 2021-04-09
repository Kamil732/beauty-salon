import PropTypes from 'prop-types'
import React from 'react'
import Select, { components } from 'react-select'
import AsyncSelect from 'react-select/async'

function FormControl({ children }) {
	return <div className="form-control">{children}</div>
}

function Label(props) {
	return (
		<label
			className={`form-control__label${
				props.inputValue ? ' active' : ''
			}`}
			{...props}
		/>
	)
}

Label.prototype.propTypes = {
	inputValue: PropTypes.any.isRequired,
}

function Input(props) {
	return (
		<input
			className="form-control__input"
			title={props.required ? 'Proszę wypełnij to pole' : ''}
			{...props}
		/>
	)
}

function SelectSearchInput({
	children,
	options,
	selectprops,
	theme,
	...props
}) {
	const { getValue, hasValue } = props
	const value = getValue()

	if (!hasValue) return <input className="form-control__input" {...props} />

	return (
		<input
			className="form-control__input"
			value={value[0] ? value[0].label : props.value}
			{...props}
		/>
	)
}

function SelectSingleValue({ children, id, ...props2 }) {
	return (
		<components.SingleValue {...props2}>
			<div id={id}>{children}</div>
		</components.SingleValue>
	)
}

function ChoiceField(props) {
	const onChange = (opt) => props.onChange(opt?.label || '', opt?.value || '')

	const styles = {
		container: () => ({}),
		control: () => ({}),
		valueContainer: () => ({}),
		indicatorSeparator: () => ({}),
		indicatorsContainer: () => ({
			position: 'absolute',
			top: '0.7rem',
			right: '0',
		}),
	}

	const components = {
		IndicatorSeparator: () => <></>,
		DropdownIndicator: () => <></>,
		Input: SelectSearchInput,
		SingleValue: (provided) => (
			<SelectSingleValue {...provided} id={props.id} />
		),
	}

	const loadingMessage = () => 'Ładowanie...'

	const noOptionsMessage = () => 'Nic nie znaleziono'

	if (props.searchAsync)
		return (
			<>
				<AsyncSelect
					defaultOptions
					cacheOptions
					loadOptions={props.choices}
					loadingMessage={loadingMessage}
					noOptionsMessage={noOptionsMessage}
					components={components}
					styles={styles}
					placeholder=""
					onChange={onChange}
					isClearable
				/>
				{props.required && (
					<input
						tabIndex={-1}
						autoComplete="off"
						style={{ opacity: 0, height: 0 }}
						value={props.value}
						required
					/>
				)}
			</>
		)

	return (
		<>
			<Select
				options={props.choices}
				loadingMessage={loadingMessage}
				noOptionsMessage={noOptionsMessage}
				components={components}
				styles={styles}
				placeholder=""
				onChange={onChange}
				isClearable
			/>
			{props.required && (
				<input
					tabIndex={-1}
					autoComplete="off"
					style={{ opacity: 0, height: 0 }}
					value={props.value}
					required
				/>
			)}
		</>
	)
}

ChoiceField.prototype.propTypes = {
	searchAsync: PropTypes.bool,
	loadOptions: PropTypes.func,
	choices: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired,
		}).isRequired
	).isRequired,
}

FormControl.Label = Label
FormControl.Input = Input
FormControl.ChoiceField = ChoiceField

export default FormControl
