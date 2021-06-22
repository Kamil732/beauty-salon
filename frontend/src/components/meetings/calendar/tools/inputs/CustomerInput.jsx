import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useId } from 'react-id-generator'

import { loadCustomers } from '../../../../../redux/actions/data'

import FormGroup from '../../../../../layout/forms/FormGroup'
import FormControl from '../../../../../layout/forms/FormControl'
import Button from '../../../../../layout/buttons/Button'
import Dropdown from '../../../../../layout/buttons/dropdowns/Dropdown'

function CustomerInput({
	value,
	choices,
	customers,
	onChange,
	changeForm,
	loadCustomers,
	...props
}) {
	const [id] = useId(1, 'customer-')

	return (
		<FormGroup>
			<Dropdown.InputContainer>
				<FormControl>
					<FormControl.Label
						htmlFor={id}
						inputValue={value?.full_name}
					>
						Klient
					</FormControl.Label>

					<Dropdown
						id={id}
						getOptionLabel={(option) => option.full_name}
						getOptionValue={(option) => option.id}
						onChange={onChange}
						value={value}
						searchAsync
						options={
							choices?.length > 0
								? [...choices, ...customers]
								: customers
						}
						loadOptions={loadCustomers}
						{...props}
					/>
				</FormControl>
				<Dropdown.ClearBtn clear={() => onChange(null)} value={value} />
			</Dropdown.InputContainer>
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
