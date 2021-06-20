import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadCustomers } from '../../../../../redux/actions/data'

import FormGroup from '../../../../../layout/forms/FormGroup'
import FormControl from '../../../../../layout/forms/FormControl'
import Button from '../../../../../layout/buttons/Button'

function CustomerInput({
	value,
	choices,
	customers,
	onChange,
	changeForm,
	loadCustomers,
	...props
}) {
	return (
		<FormGroup>
			<FormControl>
				<FormControl.Label
					htmlFor="customer"
					inputValue={value?.full_name}
				>
					Klient
				</FormControl.Label>

				<FormControl.ChoiceField
					id="customer"
					labelValue={value?.full_name}
					getOptionLabel={(option) => option.full_name}
					getOptionValue={(option) => option.id}
					onChange={onChange}
					value={value}
					searchAsync
					defaultOptions={
						choices?.length > 0
							? [...choices, ...customers]
							: customers
					}
					choices={loadCustomers}
					{...props}
				/>
			</FormControl>
			{!value?.full_name && (
				<Button type="button" small primary onClick={changeForm}>
					Nowy
				</Button>
			)}
		</FormGroup>
	)
}

CustomerInput.prototype.propTypes = {
	value: PropTypes.any.isRequired,
	choices: PropTypes.array,
	customers: PropTypes.array,
	loadCustomers: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	changeForm: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	customers: state.data.customers,
})

const mapDispatchToProps = {
	loadCustomers,
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerInput)
