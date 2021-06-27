import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../layout/buttons/Button'
import ErrorBoundary from '../../../ErrorBoundary'
import CircleLoader from '../../../../layout/loaders/CircleLoader'
import { connect } from 'react-redux'
import setMeetingEndDate from '../../../../helpers/setMeetingEndDate'

const BarberInput = lazy(() => import('../tools/inputs/BarberInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))

class AddMeetingCustomerForm extends Component {
	static propTypes = {
		barberChoiceList: PropTypes.array.isRequired,
		startDate: PropTypes.instanceOf(Date),
		calendarStep: PropTypes.number,
		changeEndDate: PropTypes.func.isRequired,
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

	componentDidUpdate(_, prevState) {
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
							updateState={(state) =>
								this.setState({ services: state })
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
