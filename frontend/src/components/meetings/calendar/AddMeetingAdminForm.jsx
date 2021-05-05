import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import axios from 'axios'
import { loadBarbers } from '../../../redux/actions/meetings'

import FormControl from '../../../layout/forms/FormControl'
import FormGroup from '../../../layout/forms/FormGroup'
import Button from '../../../layout/buttons/Button'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import CSRFToken from '../../CSRFToken'

class AddMeetingAdminForm extends Component {
	static propTypes = {
		addMeeting: PropTypes.func.isRequired,
		doNotWork: PropTypes.bool,
		barberChoiceList: PropTypes.array,
		loadBarbers: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: false,

			do_not_work: props.doNotWork,
			customer: '',
			customer_first_name: '',
			customer_last_name: '',
			customer_phone_number: '',
			customer_fax_number: '',
			barber: '',
			type: '',
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.loadCustomers = this.loadCustomers.bind(this)
	}

	componentDidMount = () => {
		if (this.props.barberChoiceList.length === 0) this.props.loadBarbers()
	}

	onSubmit = async (e) => {
		e.preventDefault()

		const phoneRegexValidation = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im

		if (
			!this.state.do_not_work &&
			(!this.state.customer_phone_number.match(phoneRegexValidation) ||
				(this.state.customer_fax_number &&
					!this.state.customer_fax_number.match(
						phoneRegexValidation
					)))
		) {
			NotificationManager.error('Numer telefonu jest niepoprawyny')

			return
		}

		await this.props.addMeeting(this.state, (state) =>
			this.setState({ loading: state })
		)
	}

	onChange = (e) => {
		const value =
			e.target.type === 'checkbox' ? e.target.checked : e.target.value

		this.setState({ [e.target.name]: value })
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
		const { barberChoiceList } = this.props
		const {
			loading,
			do_not_work,
			customer,
			customer_first_name,
			customer_last_name,
			customer_phone_number,
			customer_fax_number,
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
										onChange={(_, value) =>
											this.setState({
												customer: value.slug || '',
												customer_first_name:
													value.first_name || '',
												customer_last_name:
													value.last_name || '',
												customer_phone_number:
													value.phone_number || '',
												customer_fax_number:
													value.fax_number || '',
											})
										}
										searchAsync
										defaultOptions={this.props.customerList}
										choices={this.loadCustomers}
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
										choices={barberChoiceList}
									/>
								</FormControl>
							</FormGroup>

							<FormGroup>
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

								<FormControl>
									<FormControl.Label
										htmlFor="customer_last_name"
										inputValue={customer_last_name}
									>
										Nazwisko klienta
									</FormControl.Label>
									<FormControl.Input
										required={!do_not_work}
										type="text"
										id="customer_last_name"
										name="customer_last_name"
										onChange={(e) => {
											if (!customer) this.onChange(e)
										}}
										value={customer_last_name}
										minLength="3"
										maxLength="20"
									/>
								</FormControl>
							</FormGroup>

							<FormGroup>
								<FormControl>
									<FormControl.Label
										htmlFor="customer_phone_number"
										inputValue={customer_phone_number}
									>
										Nr. tel. klienta
									</FormControl.Label>
									<FormControl.Input
										required={!do_not_work}
										type="text"
										id="customer_phone_number"
										name="customer_phone_number"
										onChange={(e) => {
											if (!customer) this.onChange(e)
										}}
										value={customer_phone_number}
										minLength="9"
										maxLength="12"
									/>
								</FormControl>

								<FormControl>
									<FormControl.Label
										htmlFor="customer_fax_number"
										inputValue={customer_fax_number}
									>
										Zapasowy nr. tel. klienta
									</FormControl.Label>
									<FormControl.Input
										type="text"
										id="customer_fax_number"
										name="customer_fax_number"
										onChange={(e) => {
											if (!customer) this.onChange(e)
										}}
										value={customer_fax_number}
										minLength="9"
										maxLength="12"
									/>
								</FormControl>
							</FormGroup>

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
						</div>
					</>
				) : null}

				{do_not_work ? (
					<>
						<FormControl>
							<FormControl.Label
								htmlFor="barber"
								inputValue={barber}
							>
								Urlop dla
							</FormControl.Label>

							<FormControl.ChoiceField
								required={do_not_work}
								id="barber"
								name="barber"
								value={barber}
								onChange={(_, value) =>
									this.setState({
										barber: value,
									})
								}
								choices={[
									{
										label: 'Wszystkich',
										value: 'everyone',
									},
									...barberChoiceList,
								]}
							/>
						</FormControl>

						<Button
							danger
							center
							loading={loading}
							loadingText="Zapisywanie"
						>
							Zapisz urlop
						</Button>
					</>
				) : (
					<Button
						success
						center
						loading={loading}
						loadingText="Zapisywanie"
					>
						Zapisz wizytę
					</Button>
				)}
			</form>
		)
	}
}

const mapStateToProps = (state) => ({
	barberChoiceList: state.meetings.barberChoiceList,
})

const mapDispatchToProps = {
	loadBarbers,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMeetingAdminForm)
