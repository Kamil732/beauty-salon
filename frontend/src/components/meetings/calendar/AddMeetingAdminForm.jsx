import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FormControl from '../../../layout/forms/FormControl'
import FormGroup from '../../../layout/forms/FormGroup'
import Button from '../../../layout/buttons/Button'
import axios from 'axios'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import CSRFToken from '../../CSRFToken'

class AddMeetingAdminForm extends Component {
	static propTypes = {
		addMeeting: PropTypes.func.isRequired,
		doNotWork: PropTypes.bool,
	}

	constructor(props) {
		super(props)

		this.state = {
			do_not_work: props.doNotWork,
			customer: '',
			customer_first_name: '',
			barber: '',
			type: '',
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.loadBarbers = this.loadBarbers.bind(this)
		this.loadCustomers = this.loadCustomers.bind(this)
	}

	onSubmit = (e) => {
		e.preventDefault()

		this.props.addMeeting(this.state)
	}

	onChange = (e) => {
		const value =
			e.target.type === 'checkbox' ? e.target.checked : e.target.value

		this.setState({ [e.target.name]: value })
	}

	loadBarbers = async (value) => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/accounts/choice-list/barbers/?search=${value}`
			)

			return res.data
		} catch (err) {
			NotificationManager.error(
				'Nie udało się załadować listy fryzjerów',
				'Błąd',
				4000
			)
		}
	}

	loadCustomers = async (value) => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/accounts/choice-list/customers/?search=${value}`
			)

			return res.data
		} catch (err) {
			NotificationManager.error(
				'Nie udało się załadować listy klientów',
				'Błąd',
				4000
			)
		}
	}

	render() {
		const {
			do_not_work,
			customer,
			customer_first_name,
			barber,
			type,
		} = this.state

		return (
			<form onSubmit={this.onSubmit}>
				<CSRFToken />

				{!this.props.doNotWork ? (
					<>
						<FormControl>
							<FormControl.CheckBoxLabel>
								Nie pracuje
								<FormControl.CheckBox
									name="do_not_work"
									checked={do_not_work}
									onChange={this.onChange}
								/>
							</FormControl.CheckBoxLabel>
						</FormControl>

						<div
							style={{ display: do_not_work ? 'none' : 'block' }}
						>
							<FormGroup>
								<FormControl>
									<FormControl.Label
										htmlFor="customer"
										inputValue={customer}
									>
										Konto Klienta
									</FormControl.Label>

									<FormControl.ChoiceField
										id="customer"
										name="customer"
										value={customer}
										onChange={(label, value) =>
											this.setState({
												customer: value,
												customer_first_name: label.split(
													' '
												)[0],
											})
										}
										searchAsync
										defaultOptions={this.props.customerList}
										choices={this.loadCustomers}
									/>
								</FormControl>

								<FormControl>
									<FormControl.Label
										htmlFor="customer_first_name"
										inputValue={customer_first_name}
									>
										Imię klienta
									</FormControl.Label>
									<FormControl.Input
										required={!do_not_work}
										type="text"
										id="customer_first_name"
										name="customer_first_name"
										onChange={(e) => {
											if (!customer) this.onChange(e)
										}}
										value={customer_first_name}
										minLength="3"
										maxLength="20"
									/>
								</FormControl>
							</FormGroup>

							<FormGroup>
								<FormControl>
									<FormControl.Label
										htmlFor="type"
										inputValue={type}
									>
										Typ Wizyty
									</FormControl.Label>
									<FormControl.ChoiceField
										required={!do_not_work}
										id="type"
										name="type"
										onChange={(_, value) =>
											this.setState({ type: value })
										}
										value={type}
										choices={[
											{ value: 'hair', label: 'Włosy' },
											{ value: 'beard', label: 'Broda' },
										]}
									/>
								</FormControl>

								<FormControl>
									<FormControl.Label
										htmlFor="barber"
										inputValue={barber}
									>
										Fryzjer
									</FormControl.Label>

									<FormControl.ChoiceField
										required={!do_not_work}
										id="barber"
										name="barber"
										value={barber}
										onChange={(_, value) =>
											this.setState({
												barber: value,
											})
										}
										searchAsync
										choices={this.loadBarbers}
									/>
								</FormControl>
							</FormGroup>
						</div>
					</>
				) : null}

				{do_not_work ? (
					<>
						<p>
							Czy chcesz zapisać ten okres czasu jako nie
							pracujący?
						</p>
						<Button danger center>
							Tak
						</Button>
					</>
				) : (
					<Button success center>
						Zapisz wizytę
					</Button>
				)}
			</form>
		)
	}
}

export default AddMeetingAdminForm
