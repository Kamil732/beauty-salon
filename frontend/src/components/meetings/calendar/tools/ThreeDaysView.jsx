import PropTypes from 'prop-types'
import React from 'react'

import * as dates from 'react-big-calendar/lib/utils/dates'
import { navigate } from 'react-big-calendar/lib/utils/constants'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import moment from 'moment'

class ThreeDaysView extends React.Component {
	render() {
		let { date, ...props } = this.props
		let range = ThreeDaysView.range(date)

		return <TimeGrid {...props} range={range} eventOffset={15} />
	}
}

ThreeDaysView.propTypes = {
	date: PropTypes.instanceOf(Date).isRequired,
}

ThreeDaysView.range = (date) => {
	const start = dates.startOf(moment(date).subtract(1, 'days'), 'day')
	const end = dates.endOf(moment(date).add(1, 'days'), 'day')

	return dates.range(start, end)
}

ThreeDaysView.navigate = (date, action) => {
	switch (action) {
		case navigate.PREVIOUS:
			return dates.add(date, -1, 'day')

		case navigate.NEXT:
			return dates.add(date, 1, 'day')

		default:
			return date
	}
}

ThreeDaysView.title = (date, { localizer }) =>
	localizer.format(date, 'dayHeaderFormat')

export default ThreeDaysView
