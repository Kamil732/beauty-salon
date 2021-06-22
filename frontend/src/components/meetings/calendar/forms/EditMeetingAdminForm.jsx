import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { BiLeftArrowAlt } from 'react-icons/bi'

import CSRFToken from '../../../CSRFToken'
import ButtonContainer from '../../../../layout/buttons/ButtonContainer'
import Button from '../../../../layout/buttons/Button'
import FormControl from '../../../../layout/forms/FormControl'
import FormGroup from '../../../../layout/forms/FormGroup'
import ErrorBoundary from '../../../ErrorBoundary'
import CircleLoader from '../../../../layout/loaders/CircleLoader'

const AddCustomerForm = lazy(() => import('./AddCustomerForm'))
const BarberInput = lazy(() => import('../tools/inputs/BarberInput'))
const CustomerInput = lazy(() => import('../tools/inputs/CustomerInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))

class EditMeetingAdminForm extends Component {
	static propTypes = {
		selected: PropTypes.object.isRequired,
		saveMeeting: PropTypes.func.isRequired,
		barberChoiceList: PropTypes.array,
		customerChoiceList: PropTypes.array,
		servicesData: PropTypes.array.isRequired,
		loadCustomers: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			saveLoading: false,
			deleteLoading: false,
			isAddCustomerForm: false,

			customer: props.customerChoiceList.find(
				(customer) => customer.id === props.selected.customer
			),
			barber: props.barberChoiceList.find(
				(barber) => barber.id === props.selected.barber
			),
			// barbers: props.selected.services.map((service) => ({
			// 	idx: service.id,
			// 	value: props.barberChoiceList.find(
			// 		(barber) => barber.id === service.barber
			// 	),
			// })),
			services: props.selected.services.map((service) =>
				props.servicesData.find(
					(_service) => _service.id === service.id
				)
			),
			description: props.selected.description,
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	onSubmit = async (e) => {
		e.preventDefault()
		// const { selected } = this.props

		const { customer, barber, services, description } = this.state

		const payload = {
			// start: selected.start,
			// end: selected.end,
			customer: customer?.id,
			barber: barber?.id,
			services: services.map((service) => service.id),
			description,
		}

		await this.props.saveMeeting(payload, (state) =>
			this.setState({ saveLoading: state })
		)
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.customerChoiceList !== this.props.customerChoiceList &&
			this.state.customer == null
		)
			this.setState({
				customer: this.props.customerChoiceList.find(
					(customer) => customer.id === this.props.selected.customer
				),
			})

		// if (prevState.services.length !== this.state.services.length) {
		// 	// Deleted service
		// 	if (prevState.services.length > this.state.services.length) {
		// 		const deletedServicesIds = prevState.services
		// 			.filter((service) => !this.state.services.includes(service))
		// 			.map((service) => service.id)

		// 		// Filter barbers without deleted ones
		// 		const newBarbers = this.state.barbers.filter(
		// 			(barber) => !deletedServicesIds.includes(barber.idx)
		// 		)

		// 		this.setState({ barbers: [...newBarbers] })
		// 	}
		// 	// Add service
		// 	else {
		// 		const newService =
		// 			this.state.services[this.state.services.length - 1]

		// 		this.setState((state) => ({
		// 			barbers: [
		// 				...state.barbers,
		// 				{
		// 					idx: newService.id, // set idx as last service id for item so it can be detected
		// 					value: this.props.barberChoiceList.find(
		// 						(barber) => barber.id === newService.barbers[0]
		// 					),
		// 				},
		// 			],
		// 		}))
		// 	}
		// }
	}

	render() {
		const { selected } = this.props
		const {
			saveLoading,
			deleteLoading,
			isAddCustomerForm,
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

						{selected.blocked ? (
							<BarberInput
								required={selected.blocked}
								value={barber}
								onChange={(option) =>
									this.setState({ barber: option })
								}
								extraChoices={[
									{
										label: 'Wszystkich',
										value: 'everyone',
									},
								]}
							/>
						) : (
							<>
								<FormGroup>
									<CustomerInput
										required={!selected.blocked}
										value={customer}
										onChange={(options) =>
											this.onChangeSelect(
												options,
												'customer'
											)
										}
										changeForm={() =>
											this.setState({
												isAddCustomerForm: true,
											})
										}
									/>

									{services.length === 0 && (
										<BarberInput
											required={!selected.blocked}
											value={barber}
											onChange={(option) =>
												this.setState({
													barber: option,
												})
											}
										/>
									)}
								</FormGroup>

								<ServicesInput
									required={!selected.blocked}
									value={services}
									onChange={(option) =>
										this.setState({
											services: [...services, option],
										})
									}
									removeValue={(option) =>
										this.setState({
											services: services.filter(
												(service) =>
													service.id !== option.id
											),
										})
									}
									// onChangeBarberInput={(options, idx) =>
									// 	this.setState((state) => ({
									// 		barbers: state.barbers.map(
									// 			(barber) => {
									// 				if (barber.idx !== idx)
									// 					return barber

									// 				return {
									// 					...barber,
									// 					value: options,
									// 				}
									// 			}
									// 		),
									// 	}))
									// }
								/>
							</>
						)}

						<FormControl>
							<FormControl.Label
								htmlFor="description"
								inputValue={description}
							>
								{selected.blocked ? 'Powód' : 'Opis'}
							</FormControl.Label>
							<FormControl.Textarea
								id="description"
								name="description"
								onChange={this.onChange}
								value={description}
							/>
						</FormControl>

						<ButtonContainer
							style={{ justifyContent: 'space-between' }}
						>
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
								Usuń {selected.blocked ? 'urlop' : 'wizytę'}
							</Button>
							<Button
								type="submit"
								success
								small
								loading={saveLoading}
								loadingText="Zapisywanie"
								disabled={
									deleteLoading ||
									(barber ===
										(selected.barber || 'everyone') &&
										customer === selected.customer &&
										services === selected.services)
								}
							>
								Zapisz
							</Button>
						</ButtonContainer>
					</form>
				</Suspense>
			</ErrorBoundary>
		)
	}
}

const mapStateToProps = (state) => ({
	barberChoiceList: state.data.barbers,
	customerChoiceList: state.data.customers,
	servicesData: state.data.cms.data.services,
})

export default connect(mapStateToProps, null)(EditMeetingAdminForm)
