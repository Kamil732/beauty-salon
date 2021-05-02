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
			{label} {freeHours > 0 && `(${freeHours})`}
		</>
	)
}

export default Header
