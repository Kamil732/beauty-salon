import React, { Component, lazy, Suspense } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import setMeetingEndDate from '../../../../helpers/setMeetingEndDate'

import CSRFToken from '../../../CSRFToken'
import FormControl from '../../../../layout/forms/FormControl'
import FormGroup from '../../../../layout/forms/FormGroup'
import Button from '../../../../layout/buttons/Button'
import Modal from '../../../../layout/Modal'
import ErrorBoundary from '../../../ErrorBoundary'
import CircleLoader from '../../../../layout/loaders/CircleLoader'

const AddCustomerForm = lazy(() => import('./AddCustomerForm'))
const BarberInput = lazy(() => import('../tools/inputs/BarberInput'))
const CustomerInput = lazy(() => import('../tools/inputs/CustomerInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))
const BarberAndResourcesInputs = lazy(() =>
	import('../tools/inputs/BarberAndResourcesInputs')
)

class AddMeetingAdminForm extends Component {
	static propTypes = {
		resourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
			.isRequired,
		isBlocked: PropTypes.bool,
		startDate: PropTypes.instanceOf(Date),
		calendarStep: PropTypes.number,
		barbers: PropTypes.array,
		resources: PropTypes.array,
		resourceMap: PropTypes.object,
		addMeeting: PropTypes.func.isRequired,
		changeEndDate: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		// Get barber's id from resources
		const selectedResourceMap = props.resourceMap.isMany
			? props.resourceMap.data.find(({ id }) => id === props.resourceId)
			: props.resourceMap.selected

		this.state = {
			loading: false,
			isAddCustomerForm: false,
			blocked: props.isBlocked,
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
			customer: null,
			services: [],
			private_description: '',
			customer_description: '',
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidUpdate(_, prevState) {
		if (prevState.blocked !== this.state.blocked && prevState.blocked)
			this.setState({ barber: null })

		setMeetingEndDate(
			prevState,
			this.state,
			this.props.startDate,
			this.props.calendarStep,
			this.props.changeEndDate
		)
	}

	onSubmit = async (e) => {
		e.preventDefault()
		const {
			blocked,
			customer,
			barber,
			services,
			private_description,
			customer_description,
		} = this.state

		const payload = {
			barber: barber?.id,
			private_description,
			customer_description,
		}

		if (!blocked) {
			payload.customer = customer.id
			payload.services = services.map((service) => ({
				id: service.value.id,
				barber: service.barber.id,
				resources: service.resources.map((resource) => resource.id),
			}))
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

		return (
			<>
				{' '}
				{isAddCustomerForm && (
					<Modal
						closeModal={() =>
							this.setState({ isAddCustomerForm: false })
						}
						isChild
					>
						<Modal.Header>Dodaj nowego klienta</Modal.Header>
						<Modal.Body>
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
						</Modal.Body>
					</Modal>
				)}
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
												this.setState({
													customer: option,
												})
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
												defaultBarber={barber}
												defaultResource={resource}
												required={!blocked}
												value={services}
												updateState={(state) =>
													this.setState({
														services: state,
													})
												}
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

										<FormControl>
											<FormControl.Label
												htmlFor="customer_description"
												inputValue={
													customer_description
												}
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
									extraOptions={[
										{
											full_name: 'Wszystkich',
											id: null,
										},
									]}
								/>
							)}

							<FormControl>
								<FormControl.Label
									htmlFor="private_description"
									inputValue={private_description}
								>
									{blocked
										? 'Powód'
										: 'Opis (widoczny dla personelu)'}
								</FormControl.Label>
								<FormControl.Textarea
									id="private_description"
									name="private_description"
									onChange={this.onChange}
									value={private_description}
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
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	barbers: state.data.barbers,
	resources: state.data.cms.data.resources,
	resourceMap: state.meetings.resourceMap,
})

export default connect(mapStateToProps, null)(AddMeetingAdminForm)
