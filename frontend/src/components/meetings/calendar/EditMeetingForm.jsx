import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadBarbers } from '../../../redux/actions/meetings'

import CSRFToken from '../../CSRFToken'
import ButtonContainer from '../../../layout/buttons/ButtonContainer'
import Button from '../../../layout/buttons/Button'
import FormControl from '../../../layout/forms/FormControl'

class EditMeetingForm extends Component {
	static propTypes = {
		selected: PropTypes.object.isRequired,
		saveMeeting: PropTypes.func.isRequired,
		barberChoiceList: PropTypes.array,
		loadBarbers: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			saveLoading: false,
			deleteLoading: false,

			barber: props.selected.barber,
			type: [
				{ value: 'hair', label: 'Włosy' },
				{ value: 'beard', label: 'Broda' },
			].find((choice) => choice.label === props.selected.type).value,
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit = async (e) => {
		e.preventDefault()

		const { barber, type } = this.state

		const payload = {
			start: this.props.selected.start,
			end: this.props.selected.end,
			barber,
			type,
		}

		await this.props.saveMeeting(payload, (state) =>
			this.setState({ saveLoading: state })
		)
	}

	componentDidMount = () => {
		if (this.props.barberChoiceList.length === 0) this.props.loadBarbers()
	}

	render() {
		const { barberChoiceList } = this.props
		const { saveLoading, deleteLoading, barber, type } = this.state

		return (
			<form onSubmit={this.onSubmit}>
				<CSRFToken />

				<FormControl>
					<FormControl.Label htmlFor="barber" inputValue={barber}>
						Fryzjer
					</FormControl.Label>

					<FormControl.ChoiceField
						required
						id="barber"
						name="barber"
						value={barber}
						labelValue={barber}
						isNotClearable
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
						labelValue={type}
						isNotClearable
						choices={[
							{ value: 'hair', label: 'Włosy' },
							{ value: 'beard', label: 'Broda' },
						]}
					/>
				</FormControl>

				<ButtonContainer style={{ justifyContent: 'space-between' }}>
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
						disabled={deleteLoading}
					>
						Zapisz
					</Button>
				</ButtonContainer>
			</form>
		)
	}
}

const mapStateToProps = (state) => ({
	barberChoiceList: state.meetings.barberChoiceList,
})

const mapDispatchToProps = {
	loadBarbers,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMeetingForm)
