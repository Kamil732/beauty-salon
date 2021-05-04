import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FormControl from '../../../layout/forms/FormControl'
import Button from '../../../layout/buttons/Button'
import { NotificationManager } from 'react-notifications'
import axios from 'axios'

class AddMeetingForm extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool,
		data: PropTypes.object,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			barber: '',
			type: '',
		}

		this.loadBarbers = this.loadBarbers.bind(this)
	}

	loadBarbers = async (value) => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/accounts/choice-list/barbers/?search=${value}`
			)

			return res.data
		} catch (err) {
			NotificationManager.error(
				'Nie udało się załadować listy fryzjerów',
				'Błąd',
				4000
			)
		}
	}

	render() {
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
						searchAsync
						choices={this.loadBarbers}
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
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AddMeetingForm)
