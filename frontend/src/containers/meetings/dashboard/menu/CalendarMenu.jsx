import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import moment from 'moment'

function CalendarMenu() {
	const [value, onChange] = useState(new Date())

	const formatShortWeekday = (locale, date) => moment(date).format('dd')

	return (
		<div className="nav-menu">
			<Calendar
				onChange={onChange}
				value={value}
				locale="pl-PL"
				next2Label={null}
				prev2Label={null}
				minDetail="year"
				maxDetail="month"
				formatShortWeekday={formatShortWeekday}
			/>
		</div>
	)
}

export default CalendarMenu
