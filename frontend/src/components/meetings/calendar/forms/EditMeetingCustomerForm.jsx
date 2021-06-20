import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadBarbers } from '../../../../redux/actions/data'

import CSRFToken from '../../../CSRFToken'
import ButtonContainer from '../../../../layout/buttons/ButtonContainer'
import Button from '../../../../layout/buttons/Button'
import ErrorBoundary from '../../../ErrorBoundary'
import CircleLoader from '../../../../layout/loaders/CircleLoader'

const BarberInput = lazy(() => import('../tools/inputs/BarberInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))

class EditMeetingForm extends Component {
	static propTypes = {
		selected: PropTypes.object.isRequired,
		saveMeeting: PropTypes.func.isRequired,
		barberChoiceList: PropTypes.array,
		servicesData: PropTypes.array.isRequired,
		loadBarbers: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			saveLoading: false,
			deleteLoading: false,

			barber: props.barberChoiceList.find(
				(barber) => barber.id === props.selected.barber
			),
			barbers: props.selected.services.map((service) => ({
				idx: service.id,
				value: props.barberChoiceList.find(
					(barber) => barber.id === service.barber
				),
			})),
			services: props.selected.services.map((service) =>
				props.servicesData.find(
					(_service) => _service.id === service.id
				)
			),
		}

		this.onChangeSelect = this.onChangeSelect.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onChangeSelect = (options, name) =>
		this.setState({
			[name]: options,
		})

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

	render() {
		const { selected } = this.props
		const { saveLoading, deleteLoading, barber, barbers, services } =
			this.state

		return (
			<ErrorBoundary>
				<Suspense fallback={<CircleLoader />}>
					<form onSubmit={this.onSubmit}>
						<CSRFToken />

						<BarberInput
							required={!selected.blocked}
							value={barber}
							onChange={(options) =>
								this.onChangeSelect(options, 'barber')
							}
						/>

						<ServicesInput
							required={!selected.blocked}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditMeetingForm)
