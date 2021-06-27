import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useId } from 'react-id-generator'

import { FiTrash2 } from 'react-icons/fi'
import { GrUserWorker, GrResources } from 'react-icons/gr'

import FormControl from '../../../../../layout/forms/FormControl'
import Button from '../../../../../layout/buttons/Button'
import Modal from '../../../../../layout/Modal'
import ErrorBoundary from '../../../../ErrorBoundary'
import ReactTooltip from 'react-tooltip'
import Dropdown from '../../../../../layout/buttons/dropdowns/Dropdown'

const BarberInput = lazy(() => import('./BarberInput'))
const ResourcesInput = lazy(() => import('./ResourcesInput'))

function ServicesInput({
	value,
	services,
	barbers,
	resources,
	updateState,
	isAdminPanel,
	...props
}) {
	const [selected, setSelected] = useState({})
	const [showInput, setShowInput] = useState(value.length === 0)
	const [dropdownId] = useId(1, 'service-')
	const [multiListId] = useId(1, 'multiList-')

	const getServiceBarberTime = useCallback(
		(barber, id) =>
			barber.services_data.find(({ service }) => service === id)
				?.display_time,
		[]
	)

	const findValueBySelectedId = useCallback(
		() => value.find((option) => option.value.id === selected.value.id),
		[value, selected]
	)

	const getBarberOpitionsFromSelected = useCallback(
		() =>
			selected.value.barbers.map((barberId) =>
				barbers.find((barber) => barber.id === barberId)
			),
		[barbers, selected]
	)

	useEffect(() => {
		if (value.length === 0 && !showInput) setShowInput(true)
	}, [value, showInput])

	const formatOptionLabel = (
		{ id, name, display_time, price },
		barber = null
	) => {
		const time = barber ? getServiceBarberTime(barber, id) : null

		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'baseline',
					flexGrow: '1',
				}}
			>
				<span>
					{name}
					&nbsp;
					<span className="text-broken word-break-all">
						{time ? time : display_time}
					</span>
				</span>
				<span className="text-broken">{price} zł</span>
			</div>
		)
	}

	return (
		<FormControl>
			{Object.keys(selected).length > 0 && (
				<Modal closeModal={() => setSelected({})} isChild>
					<Modal.Body>
						<ErrorBoundary>
							<Suspense fallback={'Ładowanie...'}>
								<BarberInput
									value={findValueBySelectedId().barber}
									onChange={(option) =>
										updateState(
											value.map((service) => {
												if (
													service.value.id !==
													selected.value.id
												)
													return service

												return {
													...service,
													barber: option,
												}
											})
										)
									}
									options={getBarberOpitionsFromSelected()} // Get barbers related to service
								/>

								<ResourcesInput
									value={findValueBySelectedId().resources}
									addValue={(option) =>
										updateState(
											value.map((service) => {
												if (
													service.value.id !==
													selected.value.id
												)
													return service

												return {
													...service,
													resources: [
														...service.resources,
														option,
													],
												}
											})
										)
									}
									removeValue={(resourceId) =>
										updateState(
											value.map((service) => {
												if (
													service.value.id !==
													selected.value.id
												)
													return service

												return {
													...service,
													resources:
														service.resources.filter(
															(resource) =>
																resource.id !==
																resourceId
														),
												}
											})
										)
									}
								/>
							</Suspense>
						</ErrorBoundary>
					</Modal.Body>
				</Modal>
			)}

			{value.length > 0 && (
				<div className="multi-list__container">
					<FormControl.Label htmlFor={multiListId} inputValue>
						Usługi
					</FormControl.Label>
					<div className="multi-list" id={multiListId}>
						{value.map((option) => (
							<div
								className="multi-list__item"
								key={option.value.id}
							>
								{formatOptionLabel(option.value, option.barber)}

								{/* Worker btn */}
								<Button
									type="button"
									onClick={() => setSelected(option)}
									className={`btn-picker ${
										option.barber ? option.barber.color : ''
									}`}
									data-tip={
										option.barber
											? `pracownik: ${option.barber.full_name}`
											: 'brak pracownika'
									}
									data-for={`barberBtnTip-${option.id}`}
								>
									{option.barber?.full_name || (
										<GrUserWorker />
									)}
								</Button>
								<ReactTooltip
									id={`barberBtnTip-${option.id}`}
									effect="solid"
									place="top"
								/>

								{isAdminPanel && (
									<div
										style={{
											position: 'relative',
										}}
									>
										{/* Resource btn */}
										<Button
											type="button"
											onClick={() => setSelected(option)}
											className="btn-picker"
											style={{ maxWidth: '100%' }}
											data-tip={
												option.resources.length > 0
													? `zasoby: ${option.resources
															.map(
																(resource) =>
																	resource.name
															)
															.join(', ')}`
													: 'brak zasobów'
											}
											data-for={`resourcesBtnTip-${option.id}`}
										>
											<GrResources />
											{option.resources.length > 0 && (
												<div className="badge">
													{option.resources.length}
												</div>
											)}
										</Button>

										<ReactTooltip
											id={`resourcesBtnTip-${option.id}`}
											effect="solid"
											place="top"
										/>
									</div>
								)}

								{/* Delete btn */}
								<Button
									type="button"
									rounded
									onClick={() =>
										updateState(
											value.filter(
												(service) =>
													service.value.id !==
													option.value.id
											)
										)
									}
									data-tip="Usuń usługę"
									data-for={`removeValueBtnTip-${option.id}`}
								>
									<FiTrash2 size="20" />
								</Button>

								<ReactTooltip
									id={`removeValueBtnTip-${option.id}`}
									effect="solid"
									place="right"
									delayShow={250}
								/>
							</div>
						))}
					</div>
				</div>
			)}
			{showInput ? (
				<>
					{value.length === 0 && (
						<FormControl.Label htmlFor={dropdownId}>
							Usługi
						</FormControl.Label>
					)}

					<Dropdown
						id={dropdownId}
						onChange={(option) => {
							const newOption = {
								value: option,
								barber:
									barbers.find(
										(barber) =>
											barber.id === option.barbers[0]
									) || null,
								resources: [],
								// option.resources.map((resourceData) =>
								// 	resources.find(
								// 		(_resource) => _resource.id === resourceId
								// 	)
								// )
							}

							updateState([...value, newOption])
							setShowInput(false)
						}}
						autoFocus={value.length > 0}
						value={value}
						options={services}
						getOptionLabel={(option) => option.name}
						getOptionValue={(option) => option.id}
						getValuesValue={(option) => option.value.id}
						formatOptionLabel={formatOptionLabel}
						isMulti
						setShowInput={(state) => setShowInput(state)}
						{...props}
					/>
				</>
			) : (
				<div className="space-between">
					{value.length !== services.length && (
						<Button
							secondary
							small
							onClick={() => setShowInput(true)}
						>
							Kolejna usługa
						</Button>
					)}
					{value.length > 0 && (
						<div style={{ marginLeft: 'auto' }}>
							Łącznie:{' '}
							<b>
								{value
									.reduce(
										(n, { value: { price } }) =>
											parseFloat(n) + parseFloat(price),
										0
									)
									.toFixed(2)}{' '}
								zł
							</b>
						</div>
					)}
				</div>
			)}
		</FormControl>
	)
}

ServicesInput.prototype.propTypes = {
	value: PropTypes.any.isRequired,
	isAdminPanel: PropTypes.bool,
	services: PropTypes.array,
	barbers: PropTypes.array,
	resources: PropTypes.array,
	updateState: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	services: state.data.cms.data.services,
	resources: state.data.cms.data.resources,
	barbers: state.data.barbers,
})

export default connect(mapStateToProps, null)(ServicesInput)
