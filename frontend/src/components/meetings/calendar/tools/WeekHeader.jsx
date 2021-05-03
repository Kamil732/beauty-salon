import moment from 'moment'
import React from 'react'

function Header({ freeSlots, date, label }) {
	const freeHours = freeSlots[moment(date).format('YYYY-MM-DD')]

	return (
		<>
			{label} <h5>{freeHours > 0 && `(${freeHours})`}</h5>
		</>
	)
}

export default Header
