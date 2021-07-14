import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useId } from 'react-id-generator'

import { loadBarbers } from '../../../../../redux/actions/data'

import FormControl from '../../../../../layout/forms/FormControl'
import Dropdown from '../../../../../layout/buttons/dropdowns/Dropdown'

function ResourceInput({ value, resources, onChange, ...props }) {
	const [id] = useId(1, 'resource-')

	return (
		<FormControl>
			<FormControl.Label htmlFor={id} inputValue={value?.name}>
				Zasób
			</FormControl.Label>
			<Dropdown
				id={id}
				value={value}
				getOptionLabel={(option) => option.name}
				getOptionValue={(option) => option.id}
				getValuesValue={(option) => option.id}
				onChange={onChange}
				options={resources}
				{...props}
			/>
		</FormControl>
	)
}

ResourceInput.prototype.propTypes = {
	value: PropTypes.any.isRequired,
	resources: PropTypes.array,
	onChange: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	resources: state.data.cms.data.resources,
})

const mapDispatchToProps = {
	loadBarbers,
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceInput)
