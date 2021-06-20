import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadBarbers } from '../../../../../redux/actions/data'

import FormControl from '../../../../../layout/forms/FormControl'

function BarberInput({
	value,
	extraChoices,
	choices,
	barbers,
	loadBarbers,
	onChange,
	...props
}) {
	return (
		<FormControl>
			<FormControl.Label htmlFor="barber" inputValue={value?.full_name}>
				Fryzjer
			</FormControl.Label>

			<FormControl.ChoiceField
				id="barber"
				value={value}
				searchAsync
				labelValue={value?.full_name}
				getOptionLabel={(option) => option.full_name}
				getOptionValue={(option) => option.id}
				onChange={onChange}
				defaultOptions={
					extraChoices?.length > 0
						? [...extraChoices, ...barbers]
						: choices?.length > 0
						? choices
						: barbers
				}
				choices={loadBarbers}
				isNotClearable
				{...props}
			/>
		</FormControl>
	)
}

BarberInput.prototype.propTypes = {
	value: PropTypes.any.isRequired,
	barbers: PropTypes.array,
	extraChoices: PropTypes.array,
	choices: PropTypes.array,
	onChange: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	barbers: state.data.barbers,
})

const mapDispatchToProps = {
	loadBarbers,
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberInput)
