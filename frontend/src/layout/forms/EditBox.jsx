import React, { useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import getHeaders from '../../helpers/getHeaders'
import { UPDATE_DATA } from '../../redux/actions/types'

import { FaRegEdit } from 'react-icons/fa'

import { NotificationManager } from 'react-notifications'
import Modal from '../Modal'
import Button from '../buttons/Button'
import ButtonContainer from '../buttons/ButtonContainer'
import CSRFToken from '../../components/CSRFToken'
import FormControl from './FormControl'

function EditBox({
	dispatch,
	type,
	children,
	isAdmin,
	regexValidation,
	validationErrorMessage,
	value,
	name,
	label,
	onSave,
	...props
}) {
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

		if (newValue && regexValidation && !newValue.match(regexValidation)) {
			NotificationManager.error(validationErrorMessage, 'błąd')
			return
		}

		setLoading(true)

		try {
			const headers = getHeaders(true)
			let res

			if (onSave) res = await onSave(name, newValue, headers)
			else {
				const body = JSON.stringify({ [name]: newValue })

				res = await axios.patch(
					`${process.env.REACT_APP_API_URL}/data/cms/`,
					body,
					headers
				)
				res = res.data
			}

			dispatch({
				type: UPDATE_DATA,
				payload: res,
			})
			setIsEditMode(false)

			NotificationManager.success('Zapisano zmainę')
		} catch (err) {
			NotificationManager.error('Nie udało się zapisać zmian', 'błąd')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			{isEditMode && (
				<Modal closeModal={() => setIsEditMode(false)}>
					<Modal.Header>Edycja danych</Modal.Header>
					<Modal.Body>
						<form onSubmit={save}>
							<CSRFToken />

							<FormControl>
								<FormControl.Label
									htmlFor={name}
									inputValue={newValue}
								>
									{label}
								</FormControl.Label>

								{type === 'textarea' ? (
									<FormControl.Textarea
										id={name}
										value={newValue}
										onChange={(e) =>
											setNewValue(e.target.value)
										}
										{...props}
									>
										{value}
									</FormControl.Textarea>
								) : (
									<FormControl.Input
										id={name}
										type={type || 'text'}
										value={newValue}
										onChange={(e) =>
											setNewValue(e.target.value)
										}
										{...props}
									/>
								)}
							</FormControl>

							<ButtonContainer
								style={{
									marginTop: '1rem',
									justifyContent: 'space-between',
								}}
							>
								<Button
									type="submit"
									small
									success
									loading={loading}
									loadingText="Zapisywanie"
									disabled={newValue === value}
								>
									Zapisz
								</Button>
								<Button
									type="button"
									small
									primary
									onClick={cancel}
									disabled={loading}
								>
									Anuluj
								</Button>
							</ButtonContainer>
						</form>
					</Modal.Body>
				</Modal>
			)}

			<div className="edit-box">
				{children}

				<Button rounded onClick={() => setIsEditMode(true)}>
					<FaRegEdit />
				</Button>
			</div>
		</>
	)
}

EditBox.prototype.propTypes = {
	isAdmin: PropTypes.bool,
	type: PropTypes.string,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	regexValidation: PropTypes.string,
	validationErrorMessage: PropTypes.string,
	label: PropTypes.string.isRequired,
	onSave: PropTypes.func,
}

const mapStateToProps = (state) => ({
	isAdmin: state.auth.data.is_admin,
})

export default connect(mapStateToProps, null)(EditBox)
