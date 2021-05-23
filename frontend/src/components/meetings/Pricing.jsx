import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { GrFormAdd } from 'react-icons/gr'
import { IoTrash } from 'react-icons/io5'

import getHeaders from '../../helpers/getHeaders'
import axios from 'axios'

import EditBox from '../../layout/forms/EditBox'
import ButtonContainer from '../../layout/buttons/ButtonContainer'
import Button from '../../layout/buttons/Button'
import CSRFToken from '../CSRFToken'
import FormControl from '../../layout/forms/FormControl'
import Modal from '../../layout/Modal'
import { UPDATE_DATA } from '../../redux/actions/types'
import { NotificationManager } from 'react-notifications'

function Pricing({ dispatch, services, isAdmin }) {
	const [modalData, setModalData] = useState({
		isOpen: false,
		type: '',
	})
	const [isBtnLoading, setIsBtnLoading] = useState(false)
	const [name, setName] = useState('')
	const [price, setPrice] = useState(null)

	const onSave = async (id, newValue, headers, type) => {
		const body = JSON.stringify({ [type]: newValue })

		await axios.patch(
			`${process.env.REACT_APP_API_URL}/data/services/${id}/`,
			body,
			headers
		)

		return {
			services: services.map((service) => {
				if (service.id !== id) return service

				return {
					...service,
					[type]: newValue,
				}
			}),
		}
	}

	const resetForm = () => {
		setModalData({
			isOpen: false,
			type: '',
		})
		setName('')
		setPrice(null)
	}

	const addService = async (e) => {
		e.preventDefault()

		setIsBtnLoading(true)

		try {
			const body = JSON.stringify({ name, price })

			const res = await axios.post(
				`${process.env.REACT_APP_API_URL}/data/services/`,
				body,
				getHeaders(true)
			)

			dispatch({
				type: UPDATE_DATA,
				payload: {
					services: [...services, res.data],
				},
			})

			resetForm()
		} catch (err) {
			NotificationManager.error('Nie udało się dodać nowej usługi')
		} finally {
			setIsBtnLoading(false)
		}
	}

	const deleteService = async (e) => {
		e.preventDefault()

		setIsBtnLoading(true)

		try {
			const serviceId = services[services.length - 1].id

			await axios.delete(
				`${process.env.REACT_APP_API_URL}/data/services/${serviceId}/`,
				getHeaders(true)
			)

			dispatch({
				type: UPDATE_DATA,
				payload: {
					services: services.filter(
						(service) => service.id !== serviceId
					),
				},
			})

			resetForm()
		} catch (err) {
			NotificationManager.error('Nie udało się usunąć usługi')
		} finally {
			setIsBtnLoading(false)
		}
	}

	if (!isAdmin && services.length === 0)
		return <h4>Nie obsługujemy narazie żadnych wizyt</h4>

	return (
		<>
			{modalData.isOpen && (
				<Modal closeModal={resetForm}>
					<Modal.Header>
						{modalData.type === 'create'
							? 'Edycja danych'
							: 'Usuń ostanią usługę'}
					</Modal.Header>
					<Modal.Body>
						<form
							onSubmit={
								modalData.type === 'create'
									? addService
									: deleteService
							}
						>
							<CSRFToken />

							{modalData.type === 'create' ? (
								<>
									<FormControl>
										<FormControl.Label
											htmlFor="name"
											inputValue={name}
										>
											Nazwa usługi
										</FormControl.Label>
										<FormControl.Input
											id="name"
											value={name}
											onChange={(e) =>
												setName(e.target.value)
											}
										/>
									</FormControl>

									<FormControl>
										<FormControl.Label
											htmlFor="price"
											inputValue={price}
										>
											Cena za usługę
										</FormControl.Label>
										<FormControl.Input
											id="price"
											type="number"
											min="0"
											step=".5"
											value={price}
											onChange={(e) =>
												setPrice(e.target.value)
											}
										/>
									</FormControl>
								</>
							) : (
								<p
									style={{
										letterSpacing: '1px',
										textAlign: 'center',
										fontWeight: '500',
									}}
								>
									Czy na pewno chcesz usunąć ostatnią usługę?
								</p>
							)}

							<ButtonContainer
								style={{
									marginTop: '2rem',
									justifyContent: 'space-between',
								}}
							>
								<Button
									type="button"
									small
									primary
									onClick={resetForm}
									disabled={isBtnLoading}
								>
									Anuluj
								</Button>
								{modalData.type === 'create' ? (
									<Button
										type="submit"
										small
										success
										loading={isBtnLoading}
										loadingText="Zapisywanie"
									>
										Zapisz
									</Button>
								) : (
									<Button
										type="submit"
										small
										danger
										loading={isBtnLoading}
										loadingText="Usuwanie"
									>
										Usuń
									</Button>
								)}
							</ButtonContainer>
						</form>
					</Modal.Body>
				</Modal>
			)}

			<table className="table">
				<tbody>
					{services.length === 0 && <h4>Nie ma żadnych usług</h4>}

					{services.map((service) => (
						<tr>
							<th>
								<EditBox
									name={service.id}
									value={service.name}
									label="Nazwa usługi"
									onSave={(...data) =>
										onSave(...data, 'name')
									}
								>
									{service.name}
								</EditBox>
							</th>
							<td>
								<EditBox
									name={service.id}
									value={service.price}
									label={`Cena za ${service.name}`}
									type="number"
									step=".5"
									min="0"
									onSave={(...data) =>
										onSave(...data, 'price')
									}
								>
									{service.price > 0
										? `${service.price} zł`
										: 'Za darmo'}
								</EditBox>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{isAdmin && (
				<ButtonContainer
					style={{
						justifyContent: 'space-between',
						marginTop: '10px',
					}}
				>
					<Button
						rounded
						onClick={() =>
							setModalData({
								isOpen: true,
								type: 'delete',
							})
						}
					>
						<IoTrash size={18} />
						Usuń
					</Button>

					<Button
						rounded
						onClick={() =>
							setModalData({
								isOpen: true,
								type: 'create',
							})
						}
					>
						<GrFormAdd size={25} />
						Dodaj
					</Button>
				</ButtonContainer>
			)}
		</>
	)
}

Pricing.prototype.propTypes = {
	dispatch: PropTypes.func.isRequired,
	services: PropTypes.array,
	isAdmin: PropTypes.bool,
}

const mapStateToProps = (state) => ({
	services: state.data.cms.data.services,
	isAdmin: state.auth.data.is_admin,
})

export default connect(mapStateToProps, null)(Pricing)
