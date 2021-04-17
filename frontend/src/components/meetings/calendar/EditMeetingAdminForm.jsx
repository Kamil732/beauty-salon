import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ButtonContainer from '../../../layout/buttons/ButtonContainer'
import Button from '../../../layout/buttons/Button'
import CSRFToken from '../../CSRFToken'

class EditMeetingAdminForm extends Component {
	static propTypes = {
		selected: PropTypes.object.isRequired,
	}

	onSubmit = (e) => {
		e.preventDefault()
	}

	render() {
		const { selected } = this.props

		return (
			<form onSubmit={this.onSubmit}>
				<CSRFToken />

				<ButtonContainer>
					<Button type="submit" primary small>
						Zapisz
					</Button>
					<Button
						type="button"
						danger
						small
						onClick={this.props.deleteMeeting}
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
