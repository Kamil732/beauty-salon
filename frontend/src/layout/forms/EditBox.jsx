import React, { useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import getHeaders from '../../helpers/getHeaders'
import { UPDATE_DATA } from '../../redux/actions/types'

import { NotificationManager } from 'react-notifications'
import Button from '../buttons/Button'
import ButtonContainer from '../buttons/ButtonContainer'
import CSRFToken from '../../components/CSRFToken'

function EditBox({ children, isAdmin, ws, textarea, value, name, ...props }) {
	const [isEditMode, setIsEditMode] = useState(false)
	const [newValue, setNewValue] = useState(value)

	if (!isAdmin) return children

	const cancel = () => {
		setIsEditMode(false)
		setNewValue(value)
	}

	const save = async (e) => {
		e.preventDefault()

		try {
			const body = JSON.stringify({ value: newValue })

			await axios.put(
				`${process.env.REACT_APP_API_URL}/data/update/${name}/`,
				body,
				getHeaders(true)
			)

			ws.send(
				JSON.stringify({
					event: UPDATE_DATA,
					payload: {
						name,
						value: newValue,
					},
				})
			)
			setIsEditMode(false)
		} catch (err) {
			NotificationManager.error('Nie udało się zapisać zmian', 'błąd')
		}
	}

	return (
		<div className={`edit-box${isEditMode ? ' edit-mode' : ''}`} {...props}>
			{isEditMode ? (
				<form onSubmit={save}>
					<CSRFToken />
					{textarea ? (
						<textarea
							value={newValue}
							onChange={(e) => setNewValue(e.target.value)}
						>
							{value}
						</textarea>
					) : (
						<input
							value={newValue}
							onChange={(e) => setNewValue(e.target.value)}
						/>
					)}
					<ButtonContainer style={{ marginTop: '1rem' }}>
						<Button type="submit" small success>
							Zapisz
						</Button>
						<Button type="button" small primary onClick={cancel}>
							Anuluj
						</Button>
					</ButtonContainer>
				</form>
			) : (
				<>
					{children}
					<Button small secondary onClick={() => setIsEditMode(true)}>
						Edytuj
					</Button>
				</>
			)}
		</div>
	)
}

EditBox.prototype.propTypes = {
	isAdmin: PropTypes.bool,
	ws: PropTypes.object.isRequired,
	textarea: PropTypes.bool,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
	isAdmin: state.auth.data.is_admin,
	ws: state.meetings.ws,
})

export default connect(mapStateToProps, null)(EditBox)
