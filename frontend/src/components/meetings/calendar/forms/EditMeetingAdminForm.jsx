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
import setMeetingEndDate from '../../../../helpers/setMeetingEndDate'

const AddCustomerForm = lazy(() => import('./AddCustomerForm'))
const BarberInput = lazy(() => import('../tools/inputs/BarberInput'))
const CustomerInput = lazy(() => import('../tools/inputs/CustomerInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))
const BarberAndResourcesInputs = lazy(() =>
	import('../tools/inputs/BarberAndResourcesInputs')
)

class EditMeetingAdminForm extends Component {
	static propTypes = {
		selected: PropTypes.object.isRequired,
		saveMeeting: PropTypes.func.isRequired,
		barbers: PropTypes.array,
		customers: PropTypes.array,
		resources: PropTypes.array,
		servicesData: PropTypes.array.isRequired,
		loadCustomers: PropTypes.func.isRequired,
		startDate: PropTypes.instanceOf(Date),
		calendarStep: PropTypes.number,
		resourceMap: PropTypes.object.isRequired,
		changeEndDate: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		// Get barber's id from resources
		const selectedResourceMap = props.resourceMap.isMany
			? props.resourceMap.data.find(
					({ id }) => id === props.selected.resourceId
			  )
			: props.resourceMap.selected

		this.state = {
			saveLoading: false,
			deleteLoading: false,
			isAddCustomerForm: false,

			customer: props.customers.find(
				(customer) => customer.id === props.selected.data.customer
			),
			barber: selectedResourceMap?.barberId
				? props.barbers.find(
						({ id }) => id === selectedResourceMap.barberId
				  )
				: null,
			resource: selectedResourceMap?.resourceId
				? props.resources.find(
						({ id }) => id === selectedResourceMap.resourceId
				  )
				: null,
			services: props.selected.data.services.map((service) => ({
				resources: service.resources.map((resourceId) =>
					props.resources.find(
						(resource) => resource.id === resourceId
					)
				),
				barber: props.barbers.find(
					(barber) => barber.id === service.barber
				),
				value: props.servicesData.find(
					(_service) => _service.id === service.id
				),
			})),
			private_description: props.selected.data.private_description,
			customer_description: props.selected.data.customer_description,
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.customers !== this.props.customers &&
			this.state.customer == null
		)
			this.setState({
				customer: this.props.customers.find(
					(customer) => customer.id === this.props.selected.customer
				),
			})

		setMeetingEndDate(
			prevState,
			this.state,
			this.props.startDate,
			this.props.calendarStep,
			this.props.changeEndDate
		)
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	onSubmit = async (e) => {
		e.preventDefault()

		const {
			selected: { blocked },
		} = this.props
		const { customer, barber, services, description } = this.state

		const payload = {
			barber: barber?.id,
			description,
		}

		if (!blocked) {
			payload.customer = customer.id
			payload.services = services.map((service) => ({
				id: service.value.id,
				barber: service.barber.id,
				resources: service.resources.map((resource) => resource.id),
			}))
		}

		await this.props.saveMeeting(payload, (state) =>
			this.setState({ saveLoading: state })
		)
	}

	render() {
		const { selected } = this.props
		const {
			saveLoading,
			deleteLoading,
			isAddCustomerForm,
			customer,
			barber,
			resource,
			services,
			private_description,
			customer_description,
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
								<CustomerInput
									required={!selected.blocked}
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

								<FormGroup>
									<ServicesInput
										isAdminPanel
										required={!selected.blocked}
										value={services}
										updateState={(state) =>
											this.setState({ services: state })
										}
										defaultBarber={barber}
										defaultResource={resource}
									/>

									{services.length === 0 && (
										<BarberAndResourcesInputs
											barber={barber}
											updateBarber={(state) =>
												this.setState({
													barber: state,
												})
											}
											resource={resource}
											updateResource={(state) =>
												this.setState({
													resource: state,
												})
											}
										/>
									)}
								</FormGroup>
							</>
						)}

						<FormControl>
							<FormControl.Label
								htmlFor="customer_description"
								inputValue={customer_description}
							>
								Wiadomość dla klienta
							</FormControl.Label>
							<FormControl.Textarea
								id="customer_description"
								name="customer_description"
								onChange={this.onChange}
								value={customer_description}
							/>
						</FormControl>

						<FormControl>
							<FormControl.Label
								htmlFor="private_description"
								inputValue={private_description}
							>
								{selected.blocked ? 'Powód' : 'Opis'}
							</FormControl.Label>
							<FormControl.Textarea
								id="private_description"
								name="private_description"
								onChange={this.onChange}
								value={private_description}
							/>
						</FormControl>

						<ButtonContainer
							style={{ justifyContent: 'space-between' }}
						>
							<Button
								type="button"
								danger
								small
								onClick={() =>
									this.props.deleteMeeting((state) =>
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
									(barber === selected.barber &&
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
	barbers: state.data.barbers,
	customers: state.data.customers,
	resources: state.data.cms.data.resources,
	servicesData: state.data.cms.data.services,
	resourceMap: state.meetings.resourceMap,
})

export default connect(mapStateToProps, null)(EditMeetingAdminForm)
