import React, { useState, Suspense, lazy } from 'react'
import { connect } from 'react-redux'

import { GrUserWorker, GrResources } from 'react-icons/gr'

import ReactTooltip from 'react-tooltip'
import Modal from '../../../../../layout/Modal'
import FormGroup from '../../../../../layout/forms/FormGroup'
import Dropdown from '../../../../../layout/buttons/dropdowns/Dropdown'
import Button from '../../../../../layout/buttons/Button'
import ErrorBoundary from '../../../../ErrorBoundary'
import CircleLoader from '../../../../../layout/loaders/CircleLoader'

const BarberInput = lazy(() => import('./BarberInput'))
const ResourceInput = lazy(() => import('./ResourceInput'))

function BarberAndResourcesInputs({
	barber,
	updateBarber,
	resource,
	updateResource,
	resources,
}) {
	const [isOpen, setIsOpen] = useState(false)

	const barberInput = (
		<BarberInput
			required={resource === null}
			value={barber}
			onChange={(option) => updateBarber(option)}
		/>
	)

	const resourceInput =
		resources.length > 0 ? (
			<ResourceInput
				required={barber === null}
				value={resource}
				onChange={(option) => updateResource(option)}
			/>
		) : null

	return (
		<>
			{isOpen && (
				<Modal closeModal={() => setIsOpen(false)} isChild>
					<Modal.Header>Wybór pracownika i zasobów</Modal.Header>
					<Modal.Body>
						<ErrorBoundary>
							<Suspense
								fallback={
									<div className="center-container">
										<CircleLoader />
									</div>
								}
							>
								{resource === null ? (
									barberInput
								) : (
									<FormGroup>
										<Dropdown.InputContainer>
											{barberInput}
											<Dropdown.ClearBtn
												clear={() => updateBarber(null)}
												value={barber}
											/>
										</Dropdown.InputContainer>
									</FormGroup>
								)}

								{barber === null ? (
									resourceInput
								) : (
									<FormGroup>
										<Dropdown.InputContainer>
											{resourceInput}
											<Dropdown.ClearBtn
												clear={() =>
													updateResource(null)
												}
												value={resource}
											/>
										</Dropdown.InputContainer>
									</FormGroup>
								)}
							</Suspense>
						</ErrorBoundary>
					</Modal.Body>
				</Modal>
			)}

			<div
				style={{
					display: 'flex',
					gap: '0.5rem',
					alignItems: 'center',
				}}
			>
				{/* Worker btn */}
				<Button
					type="button"
					onClick={() => setIsOpen(true)}
					className={`btn-picker ${barber ? barber.color : ''}`}
					data-tip={
						barber
							? `pracownik: ${barber.full_name}`
							: 'brak pracownika'
					}
					style={{
						maxWidth: '100%',
					}}
					data-for="barberBtnTip"
				>
					{barber ? (
						`${barber?.first_name.charAt(
							0
						)}.${barber?.last_name.charAt(0)}.`
					) : (
						<GrUserWorker />
					)}
				</Button>
				<ReactTooltip id="barberBtnTip" effect="solid" place="top" />

				{/* Resource btn */}
				<div
					style={{
						position: 'relative',
					}}
				>
					<Button
						type="button"
						onClick={() => setIsOpen(true)}
						className="btn-picker"
						style={{
							maxWidth: '100%',
						}}
						data-tip={
							resource
								? `zasób: ${resource.name}`
								: 'brak zasobów'
						}
						data-for="resourcesBtnTip"
					>
						<GrResources />
						{resource && <div className="badge">1</div>}
					</Button>

					<ReactTooltip
						id="resourcesBtnTip"
						effect="solid"
						place="top"
					/>
				</div>
			</div>
		</>
	)
}

const mapStateToProps = (state) => ({
	resources: state.data.cms.data.resources,
})

export default connect(mapStateToProps, null)(BarberAndResourcesInputs)
