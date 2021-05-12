import moment from 'moment'
import React from 'react'

function Header({ freeSlots, myMeetings, date, label }) {
	freeSlots = freeSlots[moment(date).format('YYYY-MM-DD')]

	return (
		<>
			{label}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					alignItems: 'center',
				}}
			>
				<h5>{freeSlots > 0 && `(${freeSlots})`}</h5>
			</div>
		</>
	)
}

export default Header
