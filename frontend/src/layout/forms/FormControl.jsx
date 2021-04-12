import PropTypes from 'prop-types'
import React from 'react'
import Select, { components } from 'react-select'
import AsyncSelect from 'react-select/async'

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
		<input
			className="form-control__input"
			title={props.required ? 'Proszę wypełnij to pole' : ''}
			{...props}
		/>
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

function SelectSearchInput({
	children,
	cx,
	isHidden,
	isDisabled,
	innerRef,

	clearValue,
	getStyles,
	getValue,
	hasValue,
	isMulti,
	isRtl,
	options,
	selectOption,
	setValue,
	selectProps,
	theme,
	...props
}) {
	return (
		<input className="form-control__input" {...props}>
			{children}
		</input>
	)
}

function SelectSingleValue({ children, id, ...props }) {
	return (
		<components.SingleValue {...props}>
			{id ? <div id={id}>{children}</div> : <div>{children}</div>}
		</components.SingleValue>
	)
}

function ChoiceField({ value, choices, searchAsync, onChange, id, ...props }) {
	const handleOnChange = (opt) => onChange(opt?.label || '', opt?.value || '')

	const styles = {
		container: () => ({}),
		control: (_, state) => ({
			display: state.hasValue ? 'flex' : 'block',
			justifyContent: 'start-flex',
			alignItems: 'center',
		}),
		indicatorSeparator: () => ({}),
		indicatorsContainer: () => ({
			zIndex: 2,
			flex: 0,
		}),
		valueContainer: (provided, _) => ({
			...provided,
			padding: 0,
		}),
		menu: (provided, _) => ({
			...provided,
			zIndex: 3,
		}),
	}

	const components = {
		IndicatorSeparator: () => <></>,
		DropdownIndicator: () => <></>,
		Input: SelectSearchInput,
		SingleValue: (provided) => <SelectSingleValue {...provided} id={id} />,
	}

	const loadingMessage = () => 'Ładowanie...'

	const noOptionsMessage = () => 'Nic nie znaleziono'

	if (searchAsync)
		return (
			<>
				<AsyncSelect
					defaultOptions
					cacheOptions
					loadOptions={choices}
					loadingMessage={loadingMessage}
					noOptionsMessage={noOptionsMessage}
					components={components}
					styles={styles}
					placeholder=""
					onChange={handleOnChange}
					isClearable
					hideSelectedOptions={value}
				/>
				{props.required && (
					<input
						tabIndex={-1}
						autoComplete="off"
						style={{ opacity: 0, height: 0 }}
						value={value}
						required
					/>
				)}
			</>
		)

	return (
		<>
			<Select
				options={choices}
				noOptionsMessage={noOptionsMessage}
				components={components}
				styles={styles}
				placeholder=""
				onChange={handleOnChange}
				isClearable
				hideSelectedOptions
				isOptionSelected={value}
			/>
			{props.required && (
				<input
					tabIndex={-1}
					autoComplete="off"
					style={{ opacity: 0, height: 0 }}
					value={value}
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
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func.isRequired,
}

FormControl.Label = Label
FormControl.CheckBoxLabel = CheckBoxLabel
FormControl.Input = Input
FormControl.CheckBox = CheckBox
FormControl.ChoiceField = ChoiceField

export default FormControl
