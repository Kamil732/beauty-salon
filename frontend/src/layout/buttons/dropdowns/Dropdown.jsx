import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { useId } from 'react-id-generator'

import FormControl from '../../forms/FormControl'
import Button from '../Button'

import { ImCross } from 'react-icons/im'
import { Component } from 'react'

class Dropdown extends Component {
	static propTypes = {
		required: PropTypes.bool,
		searchAsync: PropTypes.bool,
		loadOptions: PropTypes.func,
		isMulti: PropTypes.bool,
		editable: PropTypes.bool,
		regexValidation: PropTypes.string,
		options: PropTypes.array,
		value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
		onChange: PropTypes.func.isRequired,
		getOptionLabel: PropTypes.func,
		getOptionValue: PropTypes.func,
		getValuesValue: PropTypes.func,
		formatOptionLabel: PropTypes.func,
		setShowInput: PropTypes.func,
	}

	constructor(props) {
		super(props)

		this.container = React.createRef()

		this.state = {
			isOpen: false,
			inputValue: '',
			filteredOptions: props.options,
			loading: props.options.length === 0,
			navigatedIndex: 0,
		}

		this.isNotSelected = this.isNotSelected.bind(this)
		this.handleClickOutside = this.handleClickOutside.bind(this)
		this.handleOnChange = this.handleOnChange.bind(this)
		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.asyncLoadOptions = this.asyncLoadOptions.bind(this)
	}

	isNotSelected = (option) => {
		const { value, isMulti, getOptionValue, getValuesValue } = this.props

		const _value = value
			? !isMulti
				? getValuesValue(value)
				: value.map((option) => getValuesValue(option))
			: null

		return (
			(isMulti && !_value.includes(getOptionValue(option))) ||
			(!isMulti && _value !== getOptionValue(option))
		)
	}

	handleClickOutside = (e) => {
		const { isMulti, value, setShowInput } = this.props

		if (
			this.container.current &&
			!this.container.current.contains(e.target)
		) {
			this.setState({ isOpen: false, inputValue: '' })

			if (isMulti && value.length > 0) setShowInput(false)
		}
	}

	handleOnChange = (option) => {
		this.props.onChange(option)
		this.setState({ isOpen: false, inputValue: '' })
	}

	handleKeyDown = (e) => {
		const { isMulti, value, setShowInput } = this.props
		const { isOpen, filteredOptions, navigatedIndex } = this.state

		// arrow up/down button should select next/previous list element
		switch (e.keyCode) {
			case 38: // Up Arrow
				this.setState((prevState) => ({
					navigatedIndex:
						prevState.navigatedIndex > 0
							? prevState.navigatedIndex - 1
							: prevState.filteredOptions.length - 1,
				}))
				break
			case 40: // Down Arrow
				this.setState((prevState) => ({
					navigatedIndex:
						prevState.navigatedIndex <
						prevState.filteredOptions.length - 1
							? prevState.navigatedIndex + 1
							: 0,
				}))
				break
			case 13: // Enter
			case 32: // Spacebar
				e.preventDefault()

				if (isOpen && filteredOptions.length > 0) {
					this.handleOnChange(filteredOptions[navigatedIndex])
					this.setState({ navigatedIndex: 0 })
				} else this.setState({ isOpen: true })

				break
			case 9: // TAB
				this.setState({ isOpen: false })

				if (isMulti && value.length > 0) setShowInput(false)
				break
			default:
				break
		}
	}

	asyncLoadOptions = async () => {
		try {
			this.setState({ loading: true })

			const filteredOptions = await this.props.loadOptions(
				this.state.inputValue
			)

			this.setState({
				filteredOptions: filteredOptions.filter((option) =>
					this.isNotSelected(option)
				),
			})
		} finally {
			this.setState({ loading: false })
		}
	}

	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside)

		if (this.props.searchAsync && this.props.options.length === 0) {
			this.asyncLoadOptions()
		} else {
			this.setState({
				filteredOptions: this.props.options.filter((option) =>
					this.isNotSelected(option)
				),
			})
		}
	}

	componentWillUnmount = () =>
		document.removeEventListener('mousedown', this.handleClickOutside)

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.options.length !== this.props.options.length)
			this.setState({ loading: this.props.options.length === 0 })

		if (prevState.filteredOptions !== this.state.filteredOptions)
			this.setState({ navigatedIndex: 0 })

		if (prevState.inputValue !== this.state.inputValue) {
			if (this.props.searchAsync) {
				// Search Async
				this.asyncLoadOptions()
			}
			// Search Sync
			else
				this.setState({
					filteredOptions: this.props.options.filter(
						(option) =>
							this.isNotSelected(option) &&
							this.props
								.getOptionLabel(option)
								.toLowerCase()
								.includes(this.state.inputValue.toLowerCase())
					),
				})

			if (
				(this.props.regexValidation &&
					this.props.regexValidation.test(this.state.inputValue) &&
					this.props.editable) ||
				(!this.props.regexValidation && this.props.editable)
			) {
				const option = {
					label: this.state.inputValue,
					value: this.state.inputValue,
				}

				if (this.props.regexValidation) this.handleOnChange(option)
				else this.props.onChange(option)
			}
		}

		if (
			(!this.props.isMulti &&
				JSON.stringify(prevProps.value) !==
					JSON.stringify(this.props.value)) ||
			(this.props.isMulti &&
				prevProps.value.length !== this.props.value.length)
		)
			this.setState({
				filteredOptions: this.props.options.filter((option) =>
					this.isNotSelected(option)
				),
			})
	}

	render() {
		const {
			required,
			searchAsync,
			loadOptions,
			isMulti,
			options,
			value,
			onChange,
			getOptionLabel,
			getOptionValue,
			getValuesValue,
			formatOptionLabel,
			setShowInput,
			...props
		} = this.props
		const { inputValue, isOpen, loading, filteredOptions, navigatedIndex } =
			this.state

		return (
			<div
				className="dropdown"
				ref={this.container}
				onFocus={() => this.setState({ isOpen: true })}
				onKeyDown={this.handleKeyDown}
			>
				{!isMulti && value && inputValue === '' && (
					<div className="dropdown__value">
						{getOptionLabel(value)}
					</div>
				)}

				<div className="dropdown__input-container">
					<FormControl.Input
						required={required && !value}
						onClick={() => this.setState({ isOpen: true })}
						onInput={() => this.setState({ isOpen: true })}
						value={inputValue}
						onChange={(e) =>
							this.setState({ inputValue: e.target.value })
						}
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
										onClick={() =>
											this.handleOnChange(option)
										}
										onMouseMove={() => {
											if (navigatedIndex !== index)
												this.setState({
													navigatedIndex: index,
												})
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
}

function ClearBtn({ clear, value, ...props }) {
	const [tooltipId] = useId(1, 'clearableTip')

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
	value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
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
