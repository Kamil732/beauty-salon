import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ButtonContainer from '../../../layout/buttons/ButtonContainer'
import Button from '../../../layout/buttons/Button'
import CSRFToken from '../../CSRFToken'

class EditMeetingAdminForm extends Component {
	static propTypes = {
		selected: PropTypes.object.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			saveLoading: false,
			deleteLoading: false,
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit = (e) => {
		e.preventDefault()
	}

	render() {
		const { selected } = this.props
		const { saveLoading, deleteLoading } = this.state

		return (
			<form onSubmit={this.onSubmit}>
				<CSRFToken />

				<ButtonContainer>
					<Button
						type="submit"
						primary
						small
						loading={saveLoading}
						loadingText="Zapisywanie"
					>
						Zapisz
					</Button>
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
					>
						Usuń{' '}
						{selected.do_not_work ? 'wolne od pracy' : 'wizytę'}
					</Button>
				</ButtonContainer>
			</form>
		)
	}
}

export default EditMeetingAdminForm
