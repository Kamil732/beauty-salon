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
	const [loading, setLoading] = useState(false)
	const [isEditMode, setIsEditMode] = useState(false)
	const [newValue, setNewValue] = useState(value)

	if (!isAdmin) return children

	const cancel = () => {
		setIsEditMode(false)
		setNewValue(value)
	}

	const save = async (e) => {
		e.preventDefault()

		setLoading(true)

		try {
			const body = JSON.stringify({ [name]: newValue })

			const res = await axios.patch(
				`${process.env.REACT_APP_API_URL}/data/`,
				body,
				getHeaders(true)
			)

			setIsEditMode(false)
			ws.send(
				JSON.stringify({
					event: UPDATE_DATA,
					payload: res.data,
				})
			)
		} catch (err) {
			NotificationManager.error('Nie udało się zapisać zmian', 'błąd')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="edit-box" {...props}>
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
						<Button
							type="submit"
							small
							success
							loading={loading}
							loadingText="Zapisywanie"
						>
							Zapisz
						</Button>
						<Button
							type="button"
							small
							primary
							onClick={cancel}
							loading={loading}
							loadingText="Anuluj"
						>
							Anuluj
						</Button>
					</ButtonContainer>
				</form>
			) : (
				<>
					{children}
					<Button extraSmall onClick={() => setIsEditMode(true)}>
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
