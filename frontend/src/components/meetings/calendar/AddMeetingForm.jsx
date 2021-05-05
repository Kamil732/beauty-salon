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
		loadBarbers: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			barber: '',
			type: '',
		}
	}

	componentDidMount = () => {
		if (this.props.barberChoiceList.length === 0) this.props.loadBarbers()
	}

	render() {
		const { barberChoiceList } = this.props
		const { loading, barber, type } = this.state

		return (
			<form>
				<FormControl>
					<FormControl.Label htmlFor="barber" inputValue={barber}>
						Fryzjer
					</FormControl.Label>

					<FormControl.ChoiceField
						required
						id="barber"
						name="barber"
						value={barber}
						onChange={(_, value) =>
							this.setState({
								barber: value,
							})
						}
						choices={barberChoiceList}
					/>
				</FormControl>

				<FormControl>
					<FormControl.Label htmlFor="type" inputValue={type}>
						Typ Wizyty
					</FormControl.Label>
					<FormControl.ChoiceField
						required
						id="type"
						name="type"
						onChange={(_, value) => this.setState({ type: value })}
						value={type}
						choices={[
							{ value: 'hair', label: 'Włosy' },
							{ value: 'beard', label: 'Broda' },
						]}
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
})

const mapDispatchToProps = {
	loadBarbers,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMeetingForm)
