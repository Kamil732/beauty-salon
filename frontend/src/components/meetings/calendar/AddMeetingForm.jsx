import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FormControl from '../../../layout/forms/FormControl'
import FormGroup from '../../../layout/forms/FormGroup'
import Button from '../../../layout/buttons/Button'
import axios from 'axios'
import { NotificationManager } from 'react-notifications'

class AddMeetingForm extends Component {
	static propTypes = {
		addMeeting: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			customer: '',
			customer_first_name: '',
			type: '',
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.loadOptions = this.loadOptions.bind(this)
	}

	onSubmit = (e) => {
		e.preventDefault()

		this.props.addMeeting(this.state)
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	loadOptions = async (value) => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/accounts/choice-list/?search=${value}`
			)

			return res.data
		} catch (err) {
			NotificationManager.error(
				'Nie udało się załadować listy urzytkowników',
				'Błąd',
				4000
			)
		}
	}

	render() {
		const { customer, customer_first_name, type } = this.state

		return (
			<form onSubmit={this.onSubmit}>
				<FormGroup>
					<FormControl>
						<FormControl.Label
							htmlFor="customer"
							inputValue={customer}
						>
							Konto Klienta
						</FormControl.Label>
						<FormControl.ChoiceField
							id="customer"
							name="customer"
							value={customer}
							onChange={(label, value) => {
								this.setState({
									customer: value,
									customer_first_name: label.split(' ')[0],
								})
							}}
							searchAsync
							choices={this.loadOptions}
						/>
					</FormControl>

					<FormControl>
						<FormControl.Label
							htmlFor="customer_first_name"
							inputValue={customer_first_name}
						>
							Imię klienta
						</FormControl.Label>
						<FormControl.Input
							required
							type="text"
							id="customer_first_name"
							name="customer_first_name"
							onChange={(e) => {
								if (!customer) this.onChange(e)
							}}
							value={customer_first_name}
							minLength="3"
							maxLength="20"
						/>
					</FormControl>
				</FormGroup>

				<FormControl>
					<FormControl.Label htmlFor="type" inputValue={type}>
						Typ Wizyty
					</FormControl.Label>
					<FormControl.ChoiceField
						required
						id="type"
						name="type"
						onChange={(_, value) =>
							this.setState({
								type: value,
							})
						}
						value={type}
						choices={[
							{ value: 'hair', label: 'Włosy' },
							{ value: 'beard', label: 'Broda' },
						]}
					/>
				</FormControl>

				<Button primary center>
					Zapisz wizytę
				</Button>
			</form>
		)
	}
}

export default AddMeetingForm
