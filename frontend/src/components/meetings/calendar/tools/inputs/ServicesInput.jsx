import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useId } from 'react-id-generator'

import { FiMenu, FiTrash2 } from 'react-icons/fi'
import { GrUserWorker, GrResources } from 'react-icons/gr'
import { GiOfficeChair } from 'react-icons/gi'
import { BiTime } from 'react-icons/bi'
import { BsBoxArrowInDown } from 'react-icons/bs'

import FormControl from '../../../../../layout/forms/FormControl'
import FormGroup from '../../../../../layout/forms/FormGroup'
import Button from '../../../../../layout/buttons/Button'
import Modal from '../../../../../layout/Modal'
import ErrorBoundary from '../../../../ErrorBoundary'
import CircleLoader from '../../../../../layout/loaders/CircleLoader'
import ReactTooltip from 'react-tooltip'
import Dropdown from '../../../../../layout/buttons/dropdowns/Dropdown'
import ButtonContainer from '../../../../../layout/buttons/ButtonContainer'

const BarberInput = lazy(() => import('./BarberInput'))
const ResourcesInput = lazy(() => import('./ResourcesInput'))

const CATEOGRIES = [0, 1, 2]

function ServicesInput({
	defaultBarber,
	defaultResource,
	value,
	services,
	resources,
	updateState,
	isAdminPanel,
	showMoreOptions,
	...props
}) {
	const [selected, setSelected] = useState({})
	const [category, setCategory] = useState(CATEOGRIES[0])
	const [showCategories, setShowsCategories] = useState(false)
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

	const getServicesTimeSum = useCallback(
		() => value.reduce((n, { value: { time } }) => n + parseInt(time), 0),
		[value]
	)

	useEffect(() => {
		if (value.length === 0 && !showInput) setShowInput(true)
	}, [value, showInput])

	useEffect(() => {
		setShowsCategories(false)
	}, [category, showMoreOptions])

	const formatOptionLabel = (
		{ id, name, display_time, price },
		barber = defaultBarber,
		selectedFormat
	) => {
		const time = barber
			? getServiceBarberTime(barber, id) || display_time
			: display_time

		return (
			<div
				className={`service-item${
					selectedFormat ? ' selected-format' : ''
				}`}
			>
				<span>
					{name}
					&nbsp;
					<small
						className={`text-broken${
							!selectedFormat ? ' word-break-all' : ''
						}`}
					>
						{selectedFormat ? (
							<>
								(<span className="word-break-all">{time}</span>,{' '}
								<span className="word-break-all">
									{price} zł
								</span>
								)
							</>
						) : (
							time
						)}
					</small>
				</span>
				{!selectedFormat && (
					<span className="text-broken">{price} zł</span>
				)}
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
					{showMoreOptions && (
						<ButtonContainer.Group
							className={`categories-group${
								showCategories ? ' show-categories' : ''
							}`}
							onClick={() => setShowsCategories(true)}
						>
							<Button
								type="button"
								className={`btn-category icon-container${
									category === CATEOGRIES[0] ? ' active' : ''
								}`}
								onClick={() => setCategory(CATEOGRIES[0])}
							>
								{category === CATEOGRIES[0] && (
									<FiMenu className="categories-group__icon" />
								)}
								<GiOfficeChair className="icon-container__icon" />
								Ogólne
							</Button>
							<Button
								type="button"
								className={`btn-category icon-container${
									category === CATEOGRIES[1] ? ' active' : ''
								}`}
								onClick={() => setCategory(CATEOGRIES[1])}
							>
								{category === CATEOGRIES[1] && (
									<FiMenu className="categories-group__icon" />
								)}
								<BiTime className="icon-container__icon" />
								Czas
							</Button>
							<Button
								type="button"
								className={`btn-category icon-container${
									category === CATEOGRIES[2] ? ' active' : ''
								}`}
								onClick={() => setCategory(CATEOGRIES[2])}
							>
								{category === CATEOGRIES[2] && (
									<FiMenu className="categories-group__icon" />
								)}
								<BsBoxArrowInDown className="icon-container__icon" />
								Zużycie (0)
							</Button>
						</ButtonContainer.Group>
					)}

					<div>
						<table
							className="multi-list"
							style={
								showMoreOptions
									? {
											borderTopLeftRadius: 0,
											borderTopRightRadius: 0,
									  }
									: null
							}
							id={multiListId}
						>
							<tbody>
								{value.map((option) => (
									<tr key={option.value.id}>
										<td>
											{formatOptionLabel(
												option.value,
												option.barber,
												true
											)}
										</td>

										{!showMoreOptions ||
										category === CATEOGRIES[0] ? (
											<>
												<td style={{ width: '1px' }}>
													<div className="inline-wrap">
														{/* Worker btn */}
														<Button
															type="button"
															onClick={() =>
																setSelected(
																	option
																)
															}
															className={`btn-picker ${
																option.barber
																	? option
																			.barber
																			.color
																	: ''
															}`}
															data-tip={
																option.barber
																	? `pracownik: ${option.barber.full_name}`
																	: 'brak pracownika'
															}
															data-for={`barberBtnTip-${option.value.id}`}
														>
															{option.barber
																?.full_name || (
																<GrUserWorker />
															)}
														</Button>
														<ReactTooltip
															id={`barberBtnTip-${option.value.id}`}
															effect="solid"
															place="top"
														/>

														{isAdminPanel && (
															<div
																style={{
																	position:
																		'relative',
																}}
															>
																{/* Resource btn */}
																<Button
																	type="button"
																	onClick={() =>
																		setSelected(
																			option
																		)
																	}
																	className="btn-picker"
																	style={{
																		maxWidth:
																			'100%',
																	}}
																	data-tip={
																		option
																			.resources
																			.length >
																		0
																			? `zasoby: ${option.resources
																					.map(
																						(
																							resource
																						) =>
																							resource.name
																					)
																					.join(
																						', '
																					)}`
																			: 'brak zasobów'
																	}
																	data-for={`resourcesBtnTip-${option.value.id}`}
																>
																	<GrResources />
																	{option
																		.resources
																		.length >
																		0 && (
																		<div className="badge">
																			{
																				option
																					.resources
																					.length
																			}
																		</div>
																	)}
																</Button>

																<ReactTooltip
																	id={`resourcesBtnTip-${option.value.id}`}
																	effect="solid"
																	place="top"
																/>
															</div>
														)}
													</div>
												</td>
												<td style={{ width: '1px' }}>
													{/* Delete btn */}
													<Button
														type="button"
														rounded
														onClick={() =>
															updateState(
																value.filter(
																	(service) =>
																		service
																			.value
																			.id !==
																		option
																			.value
																			.id
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
												</td>
											</>
										) : category === CATEOGRIES[1] ? (
											<td style={{ width: '1px' }}>
												<div className="inline-inputs">
													<FormControl
														style={{
															width: '70px',
														}}
													>
														<FormControl.DatePicker
															value={new Date()}
															onChange={() => {}}
														/>
													</FormControl>
													<FormControl
														style={{
															width: '65px',
														}}
													>
														<FormControl.TimePicker
															onChange={() => {}}
															value={'12:30'}
															step={1}
															// beginLimit="06:00"
															// endLimit="07:00"
														/>
													</FormControl>
													<FormControl
														style={{
															width: '50px',
														}}
													>
														<FormControl.Input
															type="number"
															value={'30'}
															readOnly
														/>
													</FormControl>
													min
													<span className="text-broken">
														koniec:
													</span>{' '}
													12:30
												</div>
											</td>
										) : category === CATEOGRIES[2] ? (
											<h5>lol</h5>
										) : null}
									</tr>
								))}
							</tbody>
						</table>
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
					{value.length > 0 &&
						(!showMoreOptions || category !== CATEOGRIES[2]) && (
							<div style={{ marginLeft: 'auto' }}>
								Łącznie:{' '}
								<b>
									{!showMoreOptions ||
									category === CATEOGRIES[0]
										? `${getServicesPriceSum()} zł`
										: category === CATEOGRIES[1]
										? `${getServicesTimeSum()} min`
										: null}
								</b>
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
