import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import moment from 'moment'
import { connect } from 'react-redux'
import { updateCalendarDates } from '../../../../redux/actions/meetings'

function CalendarMenu({ barbers, colors, currentDate, updateCalendarDates }) {
	const [activeDay, setActiveDay] = useState(currentDate)
	const formatShortWeekday = (_, date) => moment(date).format('dd')

	useEffect(() => {
		setActiveDay(currentDate)
	}, [currentDate])

	const onChange = (date) => updateCalendarDates(date)

	const onActiveStartDateChange = ({ activeStartDate }) =>
		setActiveDay(activeStartDate)

	return (
		<div className="tools-menu">
			<Calendar
				onChange={onChange}
				value={currentDate}
				activeStartDate={activeDay}
				onActiveStartDateChange={onActiveStartDateChange}
				locale="pl-PL"
				next2Label={null}
				prev2Label={null}
				minDetail="year"
				maxDetail="month"
				formatShortWeekday={formatShortWeekday}
				className="tools-menu__item"
			/>

			<div className="tools-menu__item">
				<h4 className="tools-menu__item__title">Pracownicy:</h4>
				{barbers.map((barber, idx) => (
					<div className="legend__item" key={idx}>
						<span
							className={colors[barber.value]}
							style={{
								width: '2rem',
								height: '1rem',
							}}
						></span>
						<span>{barber.label}</span>
					</div>
				))}
			</div>
		</div>
	)
}

CalendarMenu.prototype.propTypes = {
	barbers: PropTypes.array,
	colors: PropTypes.array,
	currentDate: PropTypes.instanceOf(Date),
}

const mapStateToProps = (state) => ({
	barbers: state.meetings.barberChoiceList,
	colors: state.data.cms.data.colors,
	currentDate: state.meetings.calendarData.currentDate,
})

const mapDispatchToProps = {
	updateCalendarDates,
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarMenu)
