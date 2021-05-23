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
		services: PropTypes.array.isRequired,
		loadBarbers: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			saveLoading: false,
			deleteLoading: false,

			barber: props.selected.barber,
			service: props.selected.service,
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit = async (e) => {
		e.preventDefault()

		const { barber, service } = this.state

		const payload = {
			start: this.props.selected.start,
			end: this.props.selected.end,
			barber,
			service,
		}

		await this.props.saveMeeting(payload, (state) =>
			this.setState({ saveLoading: state })
		)
	}

	componentDidMount = () => {
		if (this.props.barberChoiceList.length === 0) this.props.loadBarbers()
	}

	render() {
		const { barberChoiceList, selected, services } = this.props
		const { saveLoading, deleteLoading, barber, service } = this.state

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
					<FormControl.Label htmlFor="type" inputValue={service}>
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
						disabled={
							deleteLoading ||
							(barber === selected.barber &&
								service === selected.service)
						}
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
	services: state.data.cms.data.services,
})

const mapDispatchToProps = {
	loadBarbers,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMeetingForm)
