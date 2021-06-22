import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { useId } from 'react-id-generator'

import FormControl from '../../forms/FormControl'
import Button from '../Button'

import { ImCross } from 'react-icons/im'

function Dropdown({
	required,
	searchAsync,
	loadOptions,
	isMulti,
	addOptionBtnText,
	options,
	value,
	onChange,
	getOptionLabel,
	getOptionValue,
	formatOptionLabel,
	setShowInput,
	...props
}) {
	const [isOpen, setIsOpen] = useState(false)
	const [inputValue, setInputValue] = useState('')
	const [filteredOptions, setFilteredOptions] = useState(options)
	const [loading, setLoading] = useState(options.length === 0)
	const [navigatedIndex, setNavigatedIndex] = useState(0)

	const container = useRef(null)

	const isNotSelected = useCallback(
		(option) =>
			(isMulti &&
				!JSON.stringify(value).includes(JSON.stringify(option))) ||
			(!isMulti && JSON.stringify(value) !== JSON.stringify(option)),
		[isMulti, value]
	)

	useEffect(() => setLoading(options.length === 0), [options])

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (container.current && !container.current.contains(e.target)) {
				setIsOpen(false)

				if (isMulti && value.length > 0) setShowInput(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen, isMulti, value, setShowInput])

	useEffect(() => {
		if (searchAsync) {
			const asyncLoadOptions = async () => {
				try {
					setLoading(true)

					const filteredOptions = await loadOptions(inputValue)
					setFilteredOptions(
						filteredOptions.filter((option) =>
							isNotSelected(option)
						)
					)
				} finally {
					setLoading(false)
				}
			}

			asyncLoadOptions()
			return
		}
	}, [searchAsync, inputValue, isNotSelected, loadOptions])

	useEffect(() => {
		if (!searchAsync)
			setFilteredOptions(
				options.filter(
					(option) =>
						isNotSelected(option) &&
						getOptionLabel(option)
							.toLowerCase()
							.includes(inputValue.toLowerCase())
				)
			)
	}, [inputValue, options, getOptionLabel, isNotSelected, searchAsync])

	useEffect(() => setNavigatedIndex(0), [filteredOptions])

	const handleOnChange = (option) => {
		setInputValue('')
		onChange(option)
		setIsOpen(false)
	}

	const handleKeyDown = (e) => {
		// arrow up/down button should select next/previous list element
		switch (e.keyCode) {
			case 38: // Up Arrow
				setNavigatedIndex(
					navigatedIndex > 0
						? navigatedIndex - 1
						: filteredOptions.length - 1
				)
				break
			case 40: // Down Arrow
				setNavigatedIndex(
					navigatedIndex < filteredOptions.length - 1
						? navigatedIndex + 1
						: 0
				)
				break
			case 13: // Enter
			case 32: // Spacebar
				e.preventDefault()

				if (isOpen) {
					handleOnChange(filteredOptions[navigatedIndex])
					setNavigatedIndex(0)
				} else setIsOpen(true)

				break
			case 9: // TAB
				setIsOpen(false)

				if (isMulti && value.length > 0) setShowInput(false)
				break
			default:
				break
		}
	}

	return (
		<div
			className="dropdown"
			ref={container}
			onFocus={() => setIsOpen(true)}
			onKeyDown={handleKeyDown}
		>
			{!isMulti && value && inputValue === '' && (
				<div className="dropdown__value">{getOptionLabel(value)}</div>
			)}

			<div className="dropdown__input-container">
				<FormControl.Input
					required={required && !value}
					onBlur={() => setInputValue('')}
					onClick={() => setIsOpen(true)}
					onInput={() => setIsOpen(true)}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					{...props}
				/>
			</div>
			{isOpen && (
				<div className="dropdown-options">
					{!loading ? (
						filteredOptions.length > 0 ? (
							filteredOptions.map((option, index) => (
								<div
									className={`dropdown-options__option${
										navigatedIndex === index
											? ' navigated'
											: ''
									}`}
									onClick={() => handleOnChange(option)}
									onMouseMove={() => {
										if (navigatedIndex !== index)
											setNavigatedIndex(index)
									}}
									key={getOptionValue(option)}
								>
									{formatOptionLabel
										? formatOptionLabel(option)
										: getOptionLabel(option)}
								</div>
							))
						) : (
							<div className="dropdown-options__text">
								Nic nie znaleziono
							</div>
						)
					) : (
						<div className="dropdown-options__text">
							Ładowanie...
						</div>
					)}
				</div>
			)}
		</div>
	)
}

Dropdown.prototype.propTypes = {
	required: PropTypes.bool,
	searchAsync: PropTypes.bool,
	loadOptions: PropTypes.func,
	isMulti: PropTypes.bool,
	addOptionBtnText: PropTypes.string,
	options: PropTypes.array,
	value: PropTypes.oneOfType(PropTypes.object, PropTypes.array),
	onChange: PropTypes.func.isRequired,
	getOptionLabel: PropTypes.func,
	getOptionValue: PropTypes.func,
	formatOptionLabel: PropTypes.func,
	setShowInput: PropTypes.func,
}

function ClearBtn({ clear, value, ...props }) {
	const [tooltipId] = useId('clearableTip')

	if (!value) return null

	return (
		<>
			<Button
				type="button"
				onClick={clear}
				rounded
				data-tip="Wyczyść"
				data-for={tooltipId}
				{...props}
			>
				<ImCross size="12" />
			</Button>
			<ReactTooltip
				id={tooltipId}
				place="top"
				effect="solid"
				delayShow={250}
			/>
		</>
	)
}

ClearBtn.prototype.propTypes = {
	clear: PropTypes.func.isRequired,
	value: PropTypes.oneOfType(PropTypes.object, PropTypes.array),
}

function InputContainer({ children, ...props }) {
	return (
		<div className="dropdown__input-container" {...props}>
			{children}
		</div>
	)
}

Dropdown.ClearBtn = ClearBtn
Dropdown.InputContainer = InputContainer

export default Dropdown
