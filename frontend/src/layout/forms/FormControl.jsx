import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import TextareaAutosize from 'react-textarea-autosize'
import ErrorBoundary from '../../components/ErrorBoundary'
import moment from 'moment'
import CircleLoader from '../loaders/CircleLoader'
import Dropdown from '../buttons/dropdowns/Dropdown'

import { timeValidation } from '../../helpers/validations'

const DatePickerCalendar = lazy(() => import('react-calendar'))

function FormControl({ children, ...props }) {
	return (
		<div className="form-control" {...props}>
			{children}
		</div>
	)
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

function DatePicker({ value, onChange, minDate, maxDate, ...props }) {
	const [isOpen, setIsOpen] = useState(false)
	const container = useRef(null)
	const formatShortWeekday = (_, date) => moment(date).format('dd')

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (container.current && !container.current.contains(e.target))
				setIsOpen(false)
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div ref={container}>
			<FormControl.Input
				value={moment(value).format('YYYY-MM-DD')}
				onFocus={() => setIsOpen(true)}
				readOnly
				{...props}
			/>

			{isOpen && (
				<div className="dropdown-options">
					<ErrorBoundary>
						<Suspense
							fallback={
								<div className="center-container">
									<CircleLoader />
								</div>
							}
						>
							<DatePickerCalendar
								onChange={onChange}
								value={value}
								locale="pl-PL"
								next2Label={null}
								prev2Label={null}
								minDetail="year"
								maxDetail="month"
								onClickDay={() =>
									setTimeout(() => setIsOpen(false), 0)
								}
								minDate={minDate}
								maxDate={maxDate}
								formatShortWeekday={formatShortWeekday}
							/>
						</Suspense>
					</ErrorBoundary>
				</div>
			)}
		</div>
	)
}

DatePicker.prototype.propTypes = {
	value: PropTypes.instanceOf(Date).isRequired,
	onChange: PropTypes.func.isRequired,
	minDate: PropTypes.instanceOf(Date),
	maxDate: PropTypes.instanceOf(Date),
}

function TimePicker({ value, onChange, beginLimit, endLimit, step, ...props }) {
	const [options, setOptions] = useState([])

	beginLimit = beginLimit ? beginLimit : '00:00'
	endLimit = endLimit ? endLimit : '23:59'
	step = step ? step : 15

	useEffect(() => {
		let _options = []
		let currentTime = beginLimit

		while (true) {
			_options.push({ label: currentTime, value: currentTime })

			if (
				moment(currentTime, 'HH:mm').isAfter(
					moment(endLimit, 'HH:mm')
				) ||
				moment(endLimit, 'HH:mm').diff(
					moment(currentTime, 'HH:mm'),
					'minutes'
				) < step
			)
				break

			currentTime = moment(currentTime, 'HH:mm')
				.add(step, 'minutes')
				.format('HH:mm')
		}

		setOptions(_options)
	}, [beginLimit, endLimit, step])

	return (
		<Dropdown
			value={{ label: value, value }}
			onChange={({ value }) => onChange(value)}
			options={options}
			getOptionLabel={(opt) => opt.label}
			getOptionValue={(opt) => opt.value}
			getValuesValue={(opt) => opt.value}
			formatOptionLabel={({ label }) => (
				<span className="word-break-all">{label}</span>
			)}
			editable
			regexValidation={timeValidation}
			{...props}
		/>
	)
}

TimePicker.prototype.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	beginLimit: PropTypes.string,
	endLimit: PropTypes.string,
	step: PropTypes.number,
}

FormControl.Label = Label
FormControl.CheckBoxLabel = CheckBoxLabel
FormControl.Input = Input
FormControl.Textarea = Textarea
FormControl.CheckBox = CheckBox
FormControl.DatePicker = DatePicker
FormControl.TimePicker = TimePicker

export default FormControl
