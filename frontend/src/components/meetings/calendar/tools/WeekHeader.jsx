import moment from 'moment'
import React, { useEffect, useState } from 'react'

function Header({ freeSlots, date, label }) {
	const [freeHours, setFreeHours] = useState(0)

	useEffect(
		() => setFreeHours(freeSlots[moment(date).format('YYYY-MM-DD')]),
		[date, freeSlots]
	)

	return (
		<>
			{label} <h5>{freeHours > 0 && `(${freeHours})`}</h5>
		</>
	)
}

export default Header
