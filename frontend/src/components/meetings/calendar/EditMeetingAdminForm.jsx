import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { loadBarbers, loadCustomers } from '../../../redux/actions/meetings'

import CSRFToken from '../../CSRFToken'
import ButtonContainer from '../../../layout/buttons/ButtonContainer'
import Button from '../../../layout/buttons/Button'
import FormControl from '../../../layout/forms/FormControl'
import FormGroup from '../../../layout/forms/FormGroup'
import { connect } from 'react-redux'

class EditMeetingAdminForm extends Component {
	static propTypes = {
		selected: PropTypes.object.isRequired,
		saveMeeting: PropTypes.func.isRequired,
		barberChoiceList: PropTypes.array,
		customerChoiceList: PropTypes.array,
		services: PropTypes.array.isRequired,
		loadBarbers: PropTypes.func.isRequired,
		loadCustomers: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			saveLoading: false,
			deleteLoading: false,

			customer: props.selected.customer,
			customer_first_name: props.selected.customer_first_name,
			customer_last_name: props.selected.customer_last_name,
			customer_phone_number: props.selected.customer_phone_number,
			customer_fax_number: props.selected.customer_fax_number,
			barber: props.selected.barber || 'everyone',
			service: props.selected.service,
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	onSubmit = async (e) => {
		e.preventDefault()

		const {
			customer,
			customer_first_name,
			customer_last_name,
			customer_phone_number,
			customer_fax_number,
			barber,
			service,
		} = this.state

		const payload = {
			start: this.props.selected.start,
			end: this.props.selected.end,
			do_not_work: this.props.selected.do_not_work,
			customer,
			customer_first_name,
			customer_last_name,
			customer_phone_number,
			customer_fax_number,
			barber,
			service,
		}

		await this.props.saveMeeting(payload, (state) =>
			this.setState({ saveLoading: state })
		)
	}

	componentDidMount = () => {
		if (this.props.barberChoiceList.length === 0) this.props.loadBarbers()
	}

	render() {
		const { selected, barberChoiceList, customerChoiceList, services } =
			this.props
		const {
			saveLoading,
			deleteLoading,
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

				{selected.do_not_work ? (
					<FormControl>
						<FormControl.Label htmlFor="barber" inputValue={barber}>
							Urlop dla
						</FormControl.Label>

						<FormControl.ChoiceField
							required
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
				) : (
					<>
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
									value={
										customer
											? {
													value: customer,
													label: `${customer_first_name} ${customer_last_name}`,
											  }
											: null
									}
									labelValue={customer}
									onChange={(option) =>
										this.setState({
											customer: option?.value.slug || '',
											customer_first_name:
												option?.value.first_name || '',
											customer_last_name:
												option?.value.last_name || '',
											customer_phone_number:
												option?.value.phone_number ||
												'',
											customer_fax_number:
												option?.value.fax_number || '',
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
									required
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
									required
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
									required
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
									required
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
								inputValue={service}
							>
								Usługa
							</FormControl.Label>
							<FormControl.ChoiceField
								required
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
					</>
				)}

				<ButtonContainer style={{ justifyContent: 'space-between' }}>
					<Button
						type="button"
						danger
						small
						onClick={(state) =>
							this.props.deleteMeeting(
								this.setState({ deleteLoading: state })
							)
						}
						loading={deleteLoading}
						loadingText="Usuwanie"
						disabled={saveLoading}
					>
						Usuń {selected.do_not_work ? 'urlop' : 'wizytę'}
					</Button>
					<Button
						type="submit"
						success
						small
						loading={saveLoading}
						loadingText="Zapisywanie"
						disabled={
							deleteLoading ||
							(barber === (selected.barber || 'everyone') &&
								customer === selected.customer &&
								customer_first_name ===
									selected.customer_first_name &&
								customer_last_name ===
									selected.customer_last_name &&
								customer_phone_number ===
									selected.customer_phone_number &&
								customer_fax_number ===
									selected.customer_fax_number &&
								service === selected.service)
						}
					>
						Zapisz
					</Button>
				</ButtonContainer>
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditMeetingAdminForm)
