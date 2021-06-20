import React, { lazy, Suspense, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { components } from 'react-select'
import FormControl from '../../../../../layout/forms/FormControl'
import ErrorBoundary from '../../../../ErrorBoundary'

const BarberInput = lazy(() => import('./BarberInput'))

const MultiValueLabel = ({
	children,
	values,
	barbers,
	data,
	onChange,
	...props
}) => {
	console.log(values)

	return (
		<components.MultiValueLabel {...props}>
			<ErrorBoundary>
				<Suspense fallback={'Ładowanie...'}>
					<BarberInput
						value={values.find((value) => value.idx === data.id)?.value || {}}
						onChange={(options) => onChange(options, data.id)}
						choices={data.barbers.map((barberId) =>
							barbers.find((barber) => barber.id === barberId)
						)} // Get barbers related to service
					/>
				</Suspense>
			</ErrorBoundary>

			{children}
		</components.MultiValueLabel>
	)
}

function ServicesInput({
	value,
	barberValues,
	choices,
	services,
	barbers,
	onChange,
	onChangeBarberInput,
	...props
}) {
	return (
		<FormControl>
			<FormControl.Label htmlFor="services" inputValue={value[0]?.name}>
				Usługi
			</FormControl.Label>
			<FormControl.ChoiceField
				id="services"
				onChange={onChange}
				value={value}
				labelValue={value[0]?.name}
				choices={
					choices?.length > 0 ? [...choices, ...services] : services
				}
				getOptionLabel={(option) => option.name}
				getOptionValue={(option) => option.id}
				formatOptionLabel={({ name, display_time, price }) => (
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
				)}
				isMulti
				extraComponents={{
					MultiValueLabel: (provided) => (
						<MultiValueLabel
							{...provided}
							barbers={barbers}
							values={barberValues}
							onChange={onChangeBarberInput}
						/>
					),
				}}
				{...props}
			/>
		</FormControl>
	)
}

ServicesInput.prototype.propTypes = {
	value: PropTypes.any.isRequired,
	choices: PropTypes.array,
	services: PropTypes.array,
	barbers: PropTypes.array,
	onChange: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	services: state.data.cms.data.services,
	barbers: state.data.barbers,
})

export default connect(mapStateToProps, null)(ServicesInput)
