import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../layout/buttons/Button'
import ErrorBoundary from '../../../ErrorBoundary'
import CircleLoader from '../../../../layout/loaders/CircleLoader'
import { connect } from 'react-redux'

const BarberInput = lazy(() => import('../tools/inputs/BarberInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))

class AddMeetingCustomerForm extends Component {
	static propTypes = {
		barberChoiceList: PropTypes.array.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			barber: null,
			// barbers: [],
			services: [],
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	// componentDidUpdate(_, prevState) {
	// 	if (prevState.services.length !== this.state.services.length) {
	// 		// Deleted service
	// 		if (prevState.services.length > this.state.services.length) {
	// 			const deletedServicesIds = prevState.services
	// 				.filter((service) => !this.state.services.includes(service))
	// 				.map((service) => service.id)

	// 			// Filter barbers without deleted ones
	// 			const newBarbers = this.state.barbers.filter(
	// 				(barber) => !deletedServicesIds.includes(barber.idx)
	// 			)

	// 			this.setState({ barbers: [...newBarbers] })
	// 		}
	// 		// Add service
	// 		else {
	// 			const newService =
	// 				this.state.services[this.state.services.length - 1]

	// 			this.setState((state) => ({
	// 				barbers: [
	// 					...state.barbers,
	// 					{
	// 						idx: newService.id, // set idx as last service id for item so it can be detected
	// 						value:
	// 							this.props.barberChoiceList.find(
	// 								(barber) =>
	// 									barber.id === newService.barbers[0]
	// 							) || null,
	// 					},
	// 				],
	// 			}))
	// 		}
	// 	}
	// }

	onSubmit = async (e) => {
		e.preventDefault()

		const { barber, services } = this.state
		const payload = {
			barber: barber.data.id,
			service: services.map((service) => service.id),
		}

		this.props.addMeeting(payload, (state) =>
			this.setState({ loading: state })
		)
	}

	render() {
		const { loading, barber, services } = this.state

		return (
			<ErrorBoundary>
				<Suspense fallback={<CircleLoader />}>
					<form onSubmit={this.onSubmit}>
						<BarberInput
							required
							value={barber}
							onChange={(option) =>
								this.setState({ barber: option })
							}
						/>

						<ServicesInput
							required
							value={services}
							onChange={(option) =>
								this.setState({
									services: [...services, option],
								})
							}
							removeValue={(option) =>
								this.setState({
									services: services.filter(
										(service) => service.id !== option.id
									),
								})
							}
							// onChangeBarberInput={(options, idx) =>
							// 	this.setState((state) => ({
							// 		barbers: state.barbers.map((barber) => {
							// 			if (barber.idx !== idx) return barber

							// 			return {
							// 				...barber,
							// 				value: options,
							// 			}
							// 		}),
							// 	}))
							// }
						/>

						<Button
							success
							loading={loading}
							loadingText="Zapisywanie"
							className="center-item"
						>
							Zapisz wizytę
						</Button>
					</form>
				</Suspense>
			</ErrorBoundary>
		)
	}
}

const mapStateToProps = (state) => ({
	barberChoiceList: state.data.barbers,
})

export default connect(mapStateToProps, null)(AddMeetingCustomerForm)
