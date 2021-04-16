import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '../buttons/Button'
import { UPDATE_DATA } from '../../redux/actions/types'

function EditBox({ children, isAdmin, ws, textarea, value, name, ...props }) {
	const [isEditMode, setIsEditMode] = useState(false)
	const [newValue, setNewValue] = useState(value)

	if (isAdmin) return children

	const cancel = () => {
		setIsEditMode(false)
		setNewValue(value)
	}

	const save = () => {
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
	}

	return (
		<div className={`edit-box${isEditMode ? ' edit-mode' : ''}`} {...props}>
			{isEditMode ? (
				<>
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
					<Button small success onClick={save}>
						Zapisz
					</Button>
					<Button small primary onClick={cancel}>
						Anuluj
					</Button>
				</>
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
	isAdmin: state.auth.data.isAdmin,
	ws: state.meetings.ws,
})

export default connect(mapStateToProps, null)(EditBox)
