import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import { addCustomer } from '../../../../redux/actions/data'
import { MdSwapHoriz } from 'react-icons/md'
import getHeaders from '../../../../helpers/getHeaders'
import {
	phoneNumberValidation,
	phoneNumberValidationErrorMessage,
} from '../../../../helpers/validations'

import FormControl from '../../../../layout/forms/FormControl'
import FormGroup from '../../../../layout/forms/FormGroup'
import Button from '../../../../layout/buttons/Button'
import ReactTooltip from 'react-tooltip'
import { NotificationManager } from 'react-notifications'
import { connect } from 'react-redux'

class AddCustomerForm extends Component {
	static propTypes = {
		setCustomer: PropTypes.func.isRequired,
		addCustomer: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: false,

			first_name: '',
			last_name: '',
			phone_number: '',
			fax_number: '',
		}

		this.swapNames = this.swapNames.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	swapNames = () =>
		this.setState((state) => ({
			first_name: state.last_name,
			last_name: state.first_name,
		}))

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	onSubmit = async (e) => {
		e.preventDefault()
		const { first_name, last_name, phone_number, fax_number } = this.state

		this.setState({ loading: true })

		try {
			const body = JSON.stringify({
				first_name,
				last_name,
				phone_number,
				fax_number,
			})

			if (
				!phone_number.match(phoneNumberValidation) ||
				(fax_number && !fax_number.match(phoneNumberValidation))
			) {
				NotificationManager.error(phoneNumberValidationErrorMessage)

				return
			}

			const res = await axios.post(
				`${process.env.REACT_APP_API_URL}/accounts/customers/`,
				body,
				getHeaders(true)
			)

			this.props.setCustomer(res.data)
			this.props.addCustomer(res.data)

			NotificationManager.success('Utworzono nowego klienta')
		} catch {
			NotificationManager.error('Nie udało się zapisać klienta')
		} finally {
			this.setState({ loading: false })
		}
	}

	render() {
		const { loading, first_name, last_name, phone_number, fax_number } =
			this.state

		return (
			<form onSubmit={this.onSubmit}>
				<FormGroup>
					<FormControl>
						<FormControl.Label
							htmlFor="first_name"
							inputValue={first_name}
						>
							Imię
						</FormControl.Label>
						<FormControl.Input
							required
							id="first_name"
							name="first_name"
							value={first_name}
							onChange={this.onChange}
						/>
					</FormControl>

					<Button
						type="button"
						rounded
						onClick={this.swapNames}
						data-tip="Zamień imię z nazwiskiem"
						data-for="swapNamesTip"
					>
						<MdSwapHoriz size="25" />
					</Button>
					<ReactTooltip
						type="dark"
						id="swapNamesTip"
						place="top"
						effect="solid"
						delayShow={250}
					/>

					<FormControl>
						<FormControl.Label
							htmlFor="last_name"
							inputValue={last_name}
						>
							Nazwisko
						</FormControl.Label>
						<FormControl.Input
							required
							id="last_name"
							name="last_name"
							value={last_name}
							onChange={this.onChange}
						/>
					</FormControl>
				</FormGroup>
				<FormGroup>
					<FormControl>
						<FormControl.Label
							htmlFor="phone_number"
							inputValue={phone_number}
						>
							Numer tel.
						</FormControl.Label>
						<FormControl.Input
							required
							id="phone_number"
							name="phone_number"
							value={phone_number}
							onChange={this.onChange}
						/>
					</FormControl>
					<FormControl>
						<FormControl.Label
							htmlFor="fax_number"
							inputValue={fax_number}
						>
							Drugi numer tel.
						</FormControl.Label>
						<FormControl.Input
							id="fax_number"
							name="fax_number"
							value={fax_number}
							onChange={this.onChange}
						/>
					</FormControl>
				</FormGroup>
				<Button
					type="submit"
					success
					loading={loading}
					loadingText="Zapisywanie"
					className="center-item"
				>
					Zapisz i wybierz
				</Button>
			</form>
		)
	}
}

const mapDispatchToProps = {
	addCustomer,
}

export default connect(null, mapDispatchToProps)(AddCustomerForm)
