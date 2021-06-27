import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadBarbers } from '../../../../redux/actions/data'

import CSRFToken from '../../../CSRFToken'
import ButtonContainer from '../../../../layout/buttons/ButtonContainer'
import Button from '../../../../layout/buttons/Button'
import ErrorBoundary from '../../../ErrorBoundary'
import CircleLoader from '../../../../layout/loaders/CircleLoader'
import setMeetingEndDate from '../../../../helpers/setMeetingEndDate'

const BarberInput = lazy(() => import('../tools/inputs/BarberInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))

class EditMeetingCustomerForm extends Component {
	static propTypes = {
		selected: PropTypes.object.isRequired,
		saveMeeting: PropTypes.func.isRequired,
		barberChoiceList: PropTypes.array,
		servicesData: PropTypes.array.isRequired,
		loadBarbers: PropTypes.func.isRequired,
		startDate: PropTypes.instanceOf(Date),
		calendarStep: PropTypes.number,
		changeEndDate: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			saveLoading: false,
			deleteLoading: false,

			barber: props.barberChoiceList.find(
				(barber) => barber.id === props.selected.barber
			),
			services: props.selected.services.map((service) =>
				props.servicesData.find(
					(_service) => _service.id === service.id
				)
			),
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
			// start: this.props.selected.start,
			// end: this.props.selected.end,
			barber: barber.id,
			services: services.map((service) => service.id),
		}

		await this.props.saveMeeting(payload, (state) =>
			this.setState({ saveLoading: state })
		)
	}

	componentDidMount = () => {
		if (this.props.barberChoiceList.length === 0) this.props.loadBarbers()
	}

	render() {
		const { selected } = this.props
		const { saveLoading, deleteLoading, barber, services } = this.state

		return (
			<ErrorBoundary>
				<Suspense fallback={<CircleLoader />}>
					<form onSubmit={this.onSubmit}>
						<CSRFToken />

						<BarberInput
							required={!selected.blocked}
							value={barber}
							onChange={(option) =>
								this.setState({ barber: option })
							}
						/>

						<ServicesInput
							required={!selected.blocked}
							value={services}
							updateState={(state) =>
								this.setState({ services: state })
							}
						/>

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
								Usuń wizytę
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
	servicesData: state.data.cms.data.services,
})

const mapDispatchToProps = {
	loadBarbers,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditMeetingCustomerForm)
