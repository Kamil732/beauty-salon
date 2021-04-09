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

function InputSelect({ children, options, selectprops, theme, ...props }) {
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

function ChoiceField(props) {
	const getValue = () => {
		if (!props.value) return props.value

		// If value is represented in the current options, just return that option.
		const currentOption = props.choices.find(
			(option) => option.value === props.value
		)
		if (currentOption) return currentOption

		// If value is truthy but not contained in the options, it must be new.
		return {
			value: props.value,
			label: props.value,
		}
	}

	if (props.searchAsync)
		return (
			<AsyncSelect
				loadOptions={props.choices}
				defaultOptions
				cacheOptions
				loadingMessage={() => 'Ładowanie...'}
				noOptionsMessage={() => 'Nic nie znaleziono'}
				components={{
					IndicatorSeparator: () => <></>,
					DropdownIndicator: () => <></>,
					Input: InputSelect,
					SingleValue: ({ children, ...props2 }) => {
						return (
							<components.SingleValue {...props2}>
								<div id={props.id}>{children}</div>
							</components.SingleValue>
						)
					},
				}}
				styles={{
					container: () => ({}),
					control: () => ({}),
					valueContainer: () => ({}),
					indicatorSeparator: () => ({}),
					indicatorsContainer: () => ({
						position: 'absolute',
						top: '0.7rem',
						right: '0',
					}),
				}}
				placeholder=""
				onChange={(opt) =>
					props.onChange(opt?.label || '', opt?.value || '')
				}
				isClearable
			/>
		)

	return (
		<Select
			options={props.choices}
			components={{
				IndicatorSeparator: () => <></>,
				DropdownIndicator: () => <></>,
				Input: InputSelect,
				SingleValue: ({ children, ...props2 }) => {
					return (
						<components.SingleValue {...props2}>
							<div id={props.id}>{children}</div>
						</components.SingleValue>
					)
				},
			}}
			styles={{
				container: () => ({}),
				control: () => ({}),
				valueContainer: () => ({}),
				indicatorSeparator: () => ({}),
				indicatorsContainer: () => ({
					position: 'absolute',
					top: '0.7rem',
					right: '0',
				}),
			}}
			placeholder=""
			onChange={(opt) =>
				props.onChange(opt?.label || '', opt?.value || '')
			}
			isClearable
		/>
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
