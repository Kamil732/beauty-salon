import React, { Component, lazy, Suspense } from 'react'

import Button from '../../../../layout/buttons/Button'
import ErrorBoundary from '../../../ErrorBoundary'
import CircleLoader from '../../../../layout/loaders/CircleLoader'

const BarberInput = lazy(() => import('../tools/inputs/BarberInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))

class AddMeetingForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			barber: null,
			barbers: [],
			services: [],
		}

		this.onChangeSelect = this.onChangeSelect.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidUpdate(_, prevState) {
		if (prevState.services.length !== this.state.services.length) {
			// Deleted service
			if (prevState.services.length > this.state.services.length) {
				const deletedServicesIds = prevState.services
					.filter((service) => !this.state.services.includes(service))
					.map((service) => service.id)

				// Filter barbers without deleted ones
				const newBarbers = this.state.barbers.filter(
					(barber) => !deletedServicesIds.includes(barber.idx)
				)

				this.setState({ barbers: [...newBarbers] })
			}
			// Add service
			else
				this.setState((state) => ({
					barbers: [
						...state.barbers,
						{
							// set idx as last service id for item so it can be detected
							idx: state.services[state.services.length - 1].id,
							value: {},
						},
					],
				}))
		}
	}

	onChangeSelect = (options, name) =>
		this.setState({
			[name]: options,
		})

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
		const { loading, barber, barbers, services } = this.state

		return (
			<ErrorBoundary>
				<Suspense fallback={<CircleLoader />}>
					<form onSubmit={this.onSubmit}>
						<BarberInput
							required
							value={barber}
							onChange={(options) =>
								this.onChangeSelect(options, 'barber')
							}
						/>

						<ServicesInput
							required
							value={services}
							barberValues={barbers}
							onChange={(options) =>
								this.onChangeSelect(options, 'services')
							}
							onChangeBarberInput={(options, idx) =>
								this.setState((state) => ({
									barbers: state.barbers.map((barber) => {
										if (barber.idx !== idx) return barber

										return {
											...barber,
											value: options,
										}
									}),
								}))
							}
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

export default AddMeetingForm
