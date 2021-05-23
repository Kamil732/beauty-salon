import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadBarbers } from '../../../redux/actions/meetings'

import FormControl from '../../../layout/forms/FormControl'
import Button from '../../../layout/buttons/Button'

class AddMeetingForm extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool,
		data: PropTypes.object,
		barberChoiceList: PropTypes.array,
		services: PropTypes.array.isRequired,
		loadBarbers: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			barber: '',
			service: '',
		}
	}

	componentDidMount = () => {
		if (this.props.barberChoiceList.length === 0) this.props.loadBarbers()
	}

	onSubmit = async (e) => {
		e.preventDefault()

		const { barber, service } = this.state
		const payload = { barber, service }

		this.props.addMeeting(payload, (state) =>
			this.setState({ loading: state })
		)
	}

	render() {
		const { barberChoiceList, services } = this.props
		const { loading, barber, service } = this.state

		return (
			<form onSubmit={this.onSubmit}>
				<FormControl>
					<FormControl.Label htmlFor="barber" inputValue={barber}>
						Fryzjer
					</FormControl.Label>

					<FormControl.ChoiceField
						required
						id="barber"
						name="barber"
						value={barber}
						getValue={(choices) =>
							choices.filter((choice) => choice.value === barber)
						}
						labelValue={barber}
						onChange={(option) =>
							this.setState({
								barber: option?.value || '',
							})
						}
						choices={barberChoiceList}
						isNotClearable
					/>
				</FormControl>

				<FormControl>
					<FormControl.Label htmlFor="service" inputValue={service}>
						Usługa
					</FormControl.Label>

					<FormControl.ChoiceField
						required
						id="service"
						name="service"
						onChange={(option) =>
							this.setState({
								service: option?.id || '',
							})
						}
						value={service}
						labelValue={service}
						choices={services}
						getValue={(choices) =>
							choices.filter((choice) => choice.id === service)
						}
						getOptionLabel={(option) => option.name}
						getOptionValue={(option) => option.id}
						formatOptionLabel={({ name, price }) => (
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<div>{name}</div>
								<div className="text-broken">{price} zł</div>
							</div>
						)}
						isNotClearable
					/>
				</FormControl>

				<Button
					success
					center
					loading={loading}
					loadingText="Zapisywanie"
				>
					Zapisz wizytę
				</Button>
			</form>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	data: state.auth.data,
	barberChoiceList: state.meetings.barberChoiceList,
	services: state.data.cms.data.services,
})

const mapDispatchToProps = {
	loadBarbers,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMeetingForm)
