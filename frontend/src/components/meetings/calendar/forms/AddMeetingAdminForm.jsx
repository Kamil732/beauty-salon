import React, { Component, lazy, Suspense } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import setMeetingEndDate from '../../../../helpers/setMeetingEndDate'

import CSRFToken from '../../../CSRFToken'
import FormControl from '../../../../layout/forms/FormControl'
import FormGroup from '../../../../layout/forms/FormGroup'
import Button from '../../../../layout/buttons/Button'
import ButtonContainer from '../../../../layout/buttons/ButtonContainer'
import Modal from '../../../../layout/Modal'
import ErrorBoundary from '../../../ErrorBoundary'
import CircleLoader from '../../../../layout/loaders/CircleLoader'
import Dropdown from '../../../../layout/buttons/dropdowns/Dropdown'
import { options } from '../tools/inputs/RepeatEventInput'

const AddCustomerForm = lazy(() => import('./AddCustomerForm'))
const BarberInput = lazy(() => import('../tools/inputs/BarberInput'))
const ResourceInput = lazy(() => import('../tools/inputs/ResourceInput'))
const CustomerInput = lazy(() => import('../tools/inputs/CustomerInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))
const BarberAndResourceInputs = lazy(() =>
	import('../tools/inputs/BarberAndResourceInputs')
)
const RepeatEventInput = lazy(() => import('../tools/inputs/RepeatEventInput'))

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
			showMoreOptions: false,
			blocked: props.isBlocked,

			repeatData: {
				repeatTimes: 1,
				unit: options[0],
				appearancesNum: 1,
				endDate: props.startDate,
			},
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
			resource,
			services,
			private_description,
			customer_description,
		} = this.state

		const payload = blocked
			? {
					barber: barber?.id,
					resource: resource?.id,
					private_description,
			  }
			: {
					customer: customer.id,
					services: services.map((service) => ({
						id: service.value.id,
						barber: service.barber.id,
						resources: service.resources.map(
							(resource) => resource.id
						),
					})),
					private_description,
					customer_description,
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
		const { startDate } = this.props
		const {
			loading,
			isAddCustomerForm,
			showMoreOptions,
			blocked,
			repeatData,
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

							{!this.props.isBlocked && (
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
										{showMoreOptions && (
											<RepeatEventInput
												value={repeatData}
												updateValue={(name, value) =>
													this.setState({
														repeatData: {
															...repeatData,
															[name]: value,
														},
													})
												}
												eventStartDate={startDate}
											/>
										)}
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
												showMoreOptions={
													showMoreOptions
												}
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
												<BarberAndResourceInputs
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
							)}

							{blocked && (
								<>
									<Dropdown.InputContainer>
										<BarberInput
											required={resource == null}
											value={barber}
											onChange={(option) =>
												this.setState({
													barber: option,
												})
											}
											extraOptions={[
												{
													full_name: 'Wszystkich',
													id: null,
												},
											]}
											disabled={resource != null}
										/>
										<Dropdown.ClearBtn
											clear={() =>
												this.setState({
													barber: null,
												})
											}
											value={barber}
										/>
									</Dropdown.InputContainer>

									<FormGroup>
										<Dropdown.InputContainer>
											<ResourceInput
												required={barber == null}
												value={resource}
												onChange={(option) =>
													this.setState({
														resource: option,
													})
												}
												disabled={barber != null}
											/>
											<Dropdown.ClearBtn
												clear={() =>
													this.setState({
														resource: null,
													})
												}
												value={resource}
											/>
										</Dropdown.InputContainer>
									</FormGroup>
								</>
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

							<ButtonContainer
								style={{ justifyContent: 'space-between' }}
							>
								<Button
									type="submit"
									success={!blocked}
									danger={blocked}
									small
									loading={loading}
									loadingText="Zapisywanie"
								>
									Zapisz {blocked ? 'blokadę' : 'wizytę'}
								</Button>

								<Button
									type="button"
									primary
									small
									onClick={() =>
										this.setState({
											showMoreOptions: !showMoreOptions,
										})
									}
								>
									{showMoreOptions ? 'Mniej' : 'Więcej'} opcji
								</Button>
							</ButtonContainer>
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
