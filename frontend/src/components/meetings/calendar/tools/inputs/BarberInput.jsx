import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useId } from 'react-id-generator'

import { loadBarbers } from '../../../../../redux/actions/data'

import FormControl from '../../../../../layout/forms/FormControl'
import Dropdown from '../../../../../layout/buttons/dropdowns/Dropdown'

function BarberInput({
	value,
	extraOptions,
	serviceId,
	serviceDisplayTime,
	options,
	barbers,
	loadBarbers,
	onChange,
	...props
}) {
	const [id] = useId(1, 'barber-')

	useEffect(() => {
		if (barbers.length === 0) loadBarbers()
	}, [barbers, loadBarbers])

	const getOptionLabel = (option) => option.full_name

	const formatOptionLabel = (option) => {
		const time = serviceId
			? option.services_data.find(({ service }) => service === serviceId)
					?.display_time || serviceDisplayTime
			: null

		if (time == null) return getOptionLabel(option)

		return `${getOptionLabel(option)} (${time})`
	}

	return (
		<FormControl>
			<FormControl.Label htmlFor={id} inputValue={value?.full_name}>
				Fryzjer
			</FormControl.Label>
			<Dropdown
				id={id}
				value={value}
				getOptionLabel={getOptionLabel}
				getOptionValue={(option) => option.id}
				getValuesValue={(option) => option.id}
				formatOptionLabel={formatOptionLabel}
				onChange={onChange}
				options={
					extraOptions?.length > 0
						? [...extraOptions, ...barbers]
						: options?.length > 0
						? options
						: barbers
				}
				{...props}
			/>
		</FormControl>
	)
}

BarberInput.prototype.propTypes = {
	value: PropTypes.any.isRequired,
	barbers: PropTypes.array,
	extraOptions: PropTypes.array,
	options: PropTypes.array,
	loadBarbers: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	barbers: state.data.barbers,
})

const mapDispatchToProps = {
	loadBarbers,
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberInput)
