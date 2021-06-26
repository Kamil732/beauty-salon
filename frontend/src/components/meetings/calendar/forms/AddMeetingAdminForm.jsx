import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'

import { BiLeftArrowAlt } from 'react-icons/bi'

import FormControl from '../../../../layout/forms/FormControl'
import Button from '../../../../layout/buttons/Button'
import CSRFToken from '../../../CSRFToken'
import ErrorBoundary from '../../../ErrorBoundary'
import CircleLoader from '../../../../layout/loaders/CircleLoader'
import moment from 'moment'

const AddCustomerForm = lazy(() => import('./AddCustomerForm'))
const BarberInput = lazy(() => import('../tools/inputs/BarberInput'))
const CustomerInput = lazy(() => import('../tools/inputs/CustomerInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))

class AddMeetingAdminForm extends Component {
	static propTypes = {
		isBlocked: PropTypes.bool,
		startDate: PropTypes.instanceOf(Date),
		addMeeting: PropTypes.func.isRequired,
		changeEndDate: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			isAddCustomerForm: false,

			blocked: props.isBlocked,
			customer: null,
			barber: null,
			services: [],
			description: '',
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidUpdate(_, prevState) {
		if (prevState.blocked !== this.state.blocked && prevState.blocked)
			this.setState({ barber: null })
		if (prevState.services.length !== this.state.services.length) {
			this.props.changeEndDate(
				moment(this.props.startDate).add(
					this.state.services.reduce(
						(prev, { barber, value: { id, time } }) => {
							time =
								barber?.services_data.find(
									({ service }) => service === id
								)?.time || time

							return prev + time
						},
						15
					),
					'minutes'
				)
			)
		}
	}

	onSubmit = async (e) => {
		e.preventDefault()
		const { blocked, customer, barber, services, description } = this.state

		const payload = {
			blocked,
			customer: !blocked ? customer.id : null,
			barber: barber?.id,
			services: !blocked ? services.map((service) => service.id) : null,
			description,
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
		const {
			loading,
			isAddCustomerForm,
			blocked,
			customer,
			barber,

			services,
			description,
		} = this.state

		const loader = (
			<div className="center-container">
				<CircleLoader />
			</div>
		)

		return isAddCustomerForm ? (
			<>
				<Button
					primary
					rounded
					small
					onClick={() => this.setState({ isAddCustomerForm: false })}
				>
					<BiLeftArrowAlt size="23" />
					Wróć
				</Button>

				<ErrorBoundary>
					<Suspense fallback={loader}>
						<AddCustomerForm
							setCustomer={(state) =>
								this.setState({
									customer: state,
									isAddCustomerForm: false,
								})
							}
						/>
					</Suspense>
				</ErrorBoundary>
			</>
		) : (
			<ErrorBoundary>
				<Suspense fallback={loader}>
					<form onSubmit={this.onSubmit}>
						<CSRFToken />

						{!this.props.isBlocked ? (
							<>
								<FormControl.CheckBoxLabel>
									Blokada
									<FormControl.CheckBox
										name="blocked"
										checked={blocked}
										onChange={this.onChange}
									/>
								</FormControl.CheckBoxLabel>

								<div
									style={{
										display: blocked ? 'none' : 'block',
									}}
								>
									<CustomerInput
										required={!blocked}
										value={customer}
										onChange={(option) =>
											this.setState({ customer: option })
										}
										changeForm={() =>
											this.setState({
												isAddCustomerForm: true,
											})
										}
									/>

									{services.length === 0 && (
										<BarberInput
											required={!blocked}
											value={barber}
											onChange={(option) =>
												this.setState({
													barber: option,
												})
											}
										/>
									)}

									<ServicesInput
										isAdminPanel
										required={!blocked}
										value={services}
										updateState={(state) =>
											this.setState({ services: state })
										}
									/>
								</div>
							</>
						) : null}

						{blocked && (
							<BarberInput
								required={blocked}
								value={barber}
								onChange={(option) =>
									this.setState({ barber: option })
								}
								extraChoices={[
									{
										full_name: 'Wszystkich',
										id: null,
									},
								]}
							/>
						)}

						<FormControl>
							<FormControl.Label
								htmlFor="description"
								inputValue={description}
							>
								{blocked ? 'Powód' : 'Opis'}
							</FormControl.Label>
							<FormControl.Textarea
								id="description"
								name="description"
								onChange={this.onChange}
								value={description}
							/>
						</FormControl>

						<Button
							type="submit"
							success={!blocked}
							danger={blocked}
							loading={loading}
							loadingText="Zapisywanie"
							className="center-item"
						>
							Zapisz {blocked ? 'blokadę' : 'wizytę'}
						</Button>
					</form>
				</Suspense>
			</ErrorBoundary>
		)
	}
}

export default AddMeetingAdminForm
