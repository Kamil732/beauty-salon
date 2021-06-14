import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadBarbers, loadCustomers } from '../../../redux/actions/meetings'

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
		customerChoiceList: PropTypes.array,
		services: PropTypes.array.isRequired,
		loadBarbers: PropTypes.func.isRequired,
		loadCustomers: PropTypes.func.isRequired,
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
			service: '',
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidMount = () => {
		if (this.props.barberChoiceList.length === 0) this.props.loadBarbers()
	}

	componentDidUpdate(_, prevState) {
		if (
			prevState.do_not_work !== this.state.do_not_work &&
			this.state.barber === 'everyone'
		)
			this.setState({ barber: '' })
	}

	onSubmit = async (e) => {
		e.preventDefault()
		const {
			do_not_work,
			customer,
			customer_first_name,
			customer_last_name,
			customer_phone_number,
			customer_fax_number,
			barber,
			service,
		} = this.state

		const payload = {
			do_not_work,
			customer,
			customer_first_name,
			customer_last_name,
			customer_phone_number,
			customer_fax_number,
			barber,
			service,
		}

		const phoneRegexValidation =
			/^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/

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

		await this.props.addMeeting(payload, (state) =>
			this.setState({ loading: state })
		)
	}

	onChange = (e) => {
		const value =
			e.target.type === 'checkbox' ? e.target.checked : e.target.value

		this.setState({ [e.target.name]: value })
	}

	render() {
		const { barberChoiceList, customerChoiceList, services } = this.props
		const {
			loading,
			do_not_work,
			customer,
			customer_first_name,
			customer_last_name,
			customer_phone_number,
			customer_fax_number,
			barber,
			service,
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
										labelValue={customer}
										onChange={(option) =>
											this.setState({
												customer:
													option?.value.slug || '',
												customer_first_name:
													option?.value.first_name ||
													'',
												customer_last_name:
													option?.value.last_name ||
													'',
												customer_phone_number:
													option?.value
														.phone_number || '',
												customer_fax_number:
													option?.value.fax_number ||
													'',
											})
										}
										searchAsync
										defaultOptions={customerChoiceList}
										choices={this.props.loadCustomers}
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
										getValue={(choices) =>
											choices.filter(
												(choice) =>
													choice.value === barber
											)
										}
										labelValue={barber}
										onChange={(option) =>
											this.setState({
												barber: option?.value || '',
											})
										}
										choices={barberChoiceList}
										isNotClearable
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
									htmlFor="service"
									inputValue={service}
								>
									Usługa
								</FormControl.Label>
								<FormControl.ChoiceField
									required={!do_not_work}
									id="service"
									name="service"
									onChange={(option) =>
										this.setState({
											service: option?.id || '',
										})
									}
									value={service}
									labelValue={service}
									choices={services}
									getValue={(choices) =>
										choices.filter(
											(choice) => choice.id === service
										)
									}
									getOptionLabel={(option) => option.name}
									getOptionValue={(option) => option.id}
									formatOptionLabel={({ name, price }) => (
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<div>{name}</div>
											<div className="text-broken">
												{price} zł
											</div>
										</div>
									)}
									isNotClearable
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
								getValue={(choices) =>
									choices.filter(
										(choice) => choice.value === barber
									)
								}
								labelValue={barber}
								onChange={(option) =>
									this.setState({
										barber: option?.value || '',
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
							loading={loading}
							loadingText="Zapisywanie"
							className="center-item"
						>
							Zapisz urlop
						</Button>
					</>
				) : (
					<Button
						success
						loading={loading}
						loadingText="Zapisywanie"
						className="center-item"
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
	customerChoiceList: state.meetings.customerChoiceList,
	services: state.data.cms.data.services,
})

const mapDispatchToProps = {
	loadBarbers,
	loadCustomers,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMeetingAdminForm)
