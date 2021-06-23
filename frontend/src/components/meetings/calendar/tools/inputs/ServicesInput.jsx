import React, { lazy, Suspense, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useId } from 'react-id-generator'

import { FiTrash2 } from 'react-icons/fi'

import FormControl from '../../../../../layout/forms/FormControl'
import Button from '../../../../../layout/buttons/Button'
import Modal from '../../../../../layout/Modal'
import ErrorBoundary from '../../../../ErrorBoundary'
import ReactTooltip from 'react-tooltip'
import Dropdown from '../../../../../layout/buttons/dropdowns/Dropdown'

const BarberInput = lazy(() => import('./BarberInput'))

function ServicesInput({
	value,
	// barberValues,
	services,
	barbers,
	onChange,
	onChangeBarberInput,
	removeValue,
	...props
}) {
	const [selected, setSelected] = useState({})
	const [showInput, setShowInput] = useState(true)
	const [dropdownId] = useId(1, 'service-')
	const [multiListId] = useId(1, 'multiList-')

	useEffect(() => {
		if (value.length === 0 && !showInput) setShowInput(true)
	}, [value, showInput])

	const formatOptionLabel = ({ name, display_time, price }) => (
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
				<span className="text-broken">{display_time}</span>
			</span>
			<span className="text-broken">{price} zł</span>
		</div>
	)

	const input = (
		<Dropdown
			id={dropdownId}
			onChange={(option) => {
				onChange(option)
				setShowInput(false)
			}}
			autoFocus={value.length > 0}
			value={value}
			options={services}
			addOptionBtnText="kolejna usługa"
			getOptionLabel={(option) => option.name}
			getOptionValue={(option) => option.id}
			formatOptionLabel={formatOptionLabel}
			isMulti
			setShowInput={(state) => setShowInput(state)}
			{...props}
		/>
	)

	return (
		<FormControl>
			{Object.keys(selected).length > 0 && (
				<Modal closeModal={() => setSelected({})} isChild>
					<Modal.Body>
						<ErrorBoundary>
							<Suspense fallback={'Ładowanie...'}>
								<BarberInput
									value={value}
									onChange={onChangeBarberInput}
									options={selected.barbers.map((barberId) =>
										barbers.find(
											(barber) => barber.id === barberId
										)
									)} // Get barbers related to service
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
							<div className="multi-list__item" key={option.id}>
								{formatOptionLabel(option)}

								<Button
									type="button"
									primary
									small
									onClick={() => setSelected(option)}
								>
									{option.full_name}
								</Button>
								<Button
									type="button"
									rounded
									onClick={() => removeValue(option)}
									data-tip="Usuń usługę"
									data-for={`removeValueTip-${option.id}`}
								>
									<FiTrash2 size="20" />
								</Button>

								<ReactTooltip
									id={`removeValueTip-${option.id}`}
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
				value.length > 0 ? (
					input
				) : (
					<>
						<FormControl.Label htmlFor={dropdownId}>
							Usługi
						</FormControl.Label>

						{input}
					</>
				)
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
										(n, { price }) =>
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
	barbersValue: PropTypes.any.isRequired,
	services: PropTypes.array,
	barbers: PropTypes.array,
	onChange: PropTypes.func.isRequired,
	onChangeBarberInput: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	services: state.data.cms.data.services,
	barbers: state.data.barbers,
})

export default connect(mapStateToProps, null)(ServicesInput)
