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
import CircleLoader from '../../../../../layout/loaders/CircleLoader'
import ReactTooltip from 'react-tooltip'
import Dropdown from '../../../../../layout/buttons/dropdowns/Dropdown'

const BarberInput = lazy(() => import('./BarberInput'))
const ResourcesInput = lazy(() => import('./ResourcesInput'))

function ServicesInput({
	defaultBarber,
	defaultResource,
	value,
	services,
	resources,
	updateState,
	isAdminPanel,
	...props
}) {
	const [selected, setSelected] = useState({})
	const [showInput, setShowInput] = useState(value.length === 0)
	const [dropdownId] = useId(1, 'service-')
	const [multiListId] = useId(1, 'multiList-')

	const getServiceBarberTime = useCallback((barber, id) => {
		if (barber === null) return null

		return barber.services_data.find(({ service }) => service === id)
			?.display_time
	}, [])

	const findValueBySelectedId = useCallback(
		() => value.find((option) => option.value.id === selected.value.id),
		[value, selected]
	)

	const getServicesPriceSum = useCallback(
		() =>
			value
				.reduce(
					(n, { value: { price } }) =>
						parseFloat(n) + parseFloat(price),
					0
				)
				.toFixed(2),
		[value]
	)

	useEffect(() => {
		if (value.length === 0 && !showInput) setShowInput(true)
	}, [value, showInput])

	const formatOptionLabel = (
		{ id, name, display_time, price },
		barber = defaultBarber
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

	const getBarberInput = () => {
		return (
			<BarberInput
				value={findValueBySelectedId().barber}
				serviceId={selected.value.id}
				serviceDisplayTime={selected.value.display_time}
				onChange={(option) =>
					updateState(
						value.map((service) => {
							if (service.value.id !== selected.value.id)
								return service

							return {
								...service,
								barber: option,
							}
						})
					)
				}
			/>
		)
	}

	return (
		<FormControl>
			{Object.keys(selected).length > 0 && (
				<Modal closeModal={() => setSelected({})} isChild>
					<Modal.Header>
						<span className="text-broken">
							{selected.value.name} (
							{getServiceBarberTime(
								selected.barber,
								selected.value.id
							) || selected.value.display_time}
							, {selected.value.price} zł)
						</span>
					</Modal.Header>
					<Modal.Body>
						<ErrorBoundary>
							<Suspense
								fallback={
									<div className="center-container">
										<CircleLoader />
									</div>
								}
							>
								{findValueBySelectedId().resources.length ===
								0 ? (
									getBarberInput()
								) : (
									<Dropdown.InputContainer>
										{getBarberInput()}
										<Dropdown.ClearBtn
											clear={() =>
												updateState(
													value.map((service) => {
														if (
															service.value.id !==
															selected.value.id
														)
															return service

														return {
															...service,
															barber: null,
														}
													})
												)
											}
											value={
												findValueBySelectedId().barber
											}
										/>
									</Dropdown.InputContainer>
								)}

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
								barber: defaultBarber ? defaultBarber : null,
								resources: defaultResource
									? [defaultResource]
									: [],

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
							Łącznie: <b>{getServicesPriceSum()} zł</b>
						</div>
					)}
				</div>
			)}
		</FormControl>
	)
}

ServicesInput.prototype.propTypes = {
	defaultBarber: PropTypes.object,
	defaultResource: PropTypes.object,
	value: PropTypes.any.isRequired,
	isAdminPanel: PropTypes.bool,
	services: PropTypes.array,
	resources: PropTypes.array,
	updateState: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	services: state.data.cms.data.services,
	resources: state.data.cms.data.resources,
})

export default connect(mapStateToProps, null)(ServicesInput)
