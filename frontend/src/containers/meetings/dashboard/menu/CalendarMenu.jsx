import React, { useEffect, useState, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import 'react-calendar/dist/Calendar.css'

import moment from 'moment'
import { connect } from 'react-redux'
import { loadBarbers } from '../../../../redux/actions/data'
import { updateCalendarDates } from '../../../../redux/actions/meetings'

import ErorrBoundary from '../../../../components/ErrorBoundary'
import CircleLoader from '../../../../layout/loaders/CircleLoader'
const Calendar = lazy(() => import('react-calendar'))

function CalendarMenu({
	loadBarbers,
	barbers,
	currentDate,
	updateCalendarDates,
}) {
	const [activeDay, setActiveDay] = useState(currentDate)
	const formatShortWeekday = (_, date) => moment(date).format('dd')

	useEffect(() => {
		if (barbers.length === 0) loadBarbers()
	}, [barbers, loadBarbers])

	useEffect(() => {
		setActiveDay(currentDate)
	}, [currentDate])

	const onChange = (date) => updateCalendarDates(date)

	const onActiveStartDateChange = ({ activeStartDate }) =>
		setActiveDay(activeStartDate)

	return (
		<div className="tools-menu">
			<ErorrBoundary>
				<Suspense fallback={<CircleLoader />}>
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
				</Suspense>
			</ErorrBoundary>

			<div className="tools-menu__item">
				<h4 className="tools-menu__item__title">Pracownicy:</h4>

				{barbers.map((barber, idx) => (
					<div className="legend__item" key={idx}>
						<span
							className={barber.color}
							style={{
								width: '2rem',
								height: '1rem',
							}}
						></span>
						<span>{barber.full_name}</span>
					</div>
				))}
			</div>
		</div>
	)
}

CalendarMenu.prototype.propTypes = {
	barbers: PropTypes.array,
	currentDate: PropTypes.instanceOf(Date),
	loadBarbers: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	barbers: state.data.barbers,
	currentDate: state.meetings.calendarData.currentDate,
})

const mapDispatchToProps = {
	updateCalendarDates,
	loadBarbers,
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarMenu)
