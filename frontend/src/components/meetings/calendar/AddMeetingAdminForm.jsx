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

			blocked: props.doNotWork,
			customer: '',
			barber: '',
			service: '',
			description: '',
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidMount = () => {
		if (this.props.barberChoiceList.length === 0) this.props.loadBarbers()
	}

	componentDidUpdate(_, prevState) {
		if (
			prevState.blocked !== this.state.blocked &&
			this.state.barber === 'everyone'
		)
			this.setState({ barber: '' })
	}

	onSubmit = async (e) => {
		e.preventDefault()
		const { blocked, customer, barber, service, description } = this.state

		const payload = {
			blocked,
			customer,
			barber,
			service,
			description,
		}

		const phoneRegexValidation =
			/^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/

		if (
			!this.state.blocked &&
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
		const { loading, blocked, customer, barber, service, description } =
			this.state

		return (
			<form onSubmit={this.onSubmit}>
				<CSRFToken />

				{!this.props.doNotWork ? (
					<>
						<FormControl>
							<FormControl.CheckBoxLabel>
								Blokada
								<FormControl.CheckBox
									name="blocked"
									checked={blocked}
									onChange={this.onChange}
								/>
							</FormControl.CheckBoxLabel>
						</FormControl>

						<div style={{ display: blocked ? 'none' : 'block' }}>
							<FormGroup>
								<FormControl>
									<FormControl.Label
										htmlFor="customer"
										inputValue={customer}
									>
										Klient
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
										required={!blocked}
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

							<FormControl>
								<FormControl.Label
									htmlFor="service"
									inputValue={service}
								>
									Usługa
								</FormControl.Label>
								<FormControl.ChoiceField
									required={!blocked}
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

							<FormControl>
								<FormControl.Label
									htmlFor="description"
									inputValue={description}
								>
									Opis
								</FormControl.Label>
								<FormControl.Textarea
									id="description"
									name="description"
									onChange={this.onChange}
									value={description}
								/>
							</FormControl>
						</div>
					</>
				) : null}

				{blocked ? (
					<>
						<FormControl>
							<FormControl.Label
								htmlFor="barber"
								inputValue={barber}
							>
								Urlop dla
							</FormControl.Label>

							<FormControl.ChoiceField
								required={blocked}
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
