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

function Input(props) {
	return (
		<input
			className="form-control__input"
			title={props.required ? 'Proszę wypełnij to pole' : ''}
			{...props}
		/>
	)
}

function SelectSearchInput({ children, getValue, hasValue, ...props }) {
	const values = getValue()

	// if (!hasValue)
	return (
		<input
			className="form-control__input"
			// value={values[0] ? values[0].label : ''}
			{...props}
		>
			{children}
		</input>
	)

	// return (
	// 	<components.Input
	// 		className="form-control__input"
	// 		// value={values[0] ? values[0].label : ''}
	// 		getValue={getValue}
	// 		hasValue={hasValue}
	// 		{...props}
	// 	>
	// 		{children}
	// 	</components.Input>
	// )
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
			position: 'relative',
		}),
		indicatorSeparator: () => ({}),
		indicatorsContainer: () => ({
			zIndex: 2,
			flex: 0,
		}),
		valueContainer: (provided, _) => ({
			...provided,
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
					hideSelectedOptions
				/>
				{props.required && (
					<input
						tabIndex={-1}
						autoComplete="off"
						style={{ opacity: 0, height: 0 }}
						value={value}
						required
						readOnly
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
			/>
			{props.required && (
				<input
					tabIndex={-1}
					autoComplete="off"
					style={{ opacity: 0, height: 0 }}
					value={value}
					required
					readOnly
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
FormControl.Input = Input
FormControl.ChoiceField = ChoiceField

export default FormControl
