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
							onChange={(option) => {
								option = {
									value: option,
									barber:
										this.props.barberChoiceList.find(
											(barber) =>
												barber.id === option.barbers[0]
										) || null,
								}

								this.setState({
									services: [...services, option],
								})
							}}
							removeValue={(option) =>
								this.setState({
									services: services.filter(
										(service) =>
											service.value.id !== option.value.id
									),
								})
							}
							onChangeBarberInput={(option, serviceId) =>
								this.setState({
									services: services.map((service) => {
										if (service.value.id !== serviceId)
											return service

										return { ...service, barber: option }
									}),
								})
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

const mapStateToProps = (state) => ({
	barberChoiceList: state.data.barbers,
})

export default connect(mapStateToProps, null)(AddMeetingCustomerForm)
