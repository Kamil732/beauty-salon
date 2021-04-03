import React, { Component } from 'react'
import axios from 'axios'

import moment from 'moment'
import 'moment/locale/pl'

import {
	Calendar as BigCalendar,
	momentLocalizer,
	Views,
} from 'react-big-calendar'
import BrickLoader from '../../layout/loaders/BrickLoader'

moment.locale('PL')
const localizer = momentLocalizer(moment)

class Calendar extends Component {
	constructor(props) {
		super(props)

		this.minDate = new Date()
		this.minDate.setHours(9, 0)

		this.maxDate = new Date()
		this.maxDate.setHours(23, 0)

		this.state = {
			loading: true,
			data: [],
		}
	}

	componentDidMount = async () => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/meetings/`
			)

			let data = res.data

			for (let i = 0; i < data.length; i++) {
				data[i].start = moment.utc(data[i].start).toDate()
				data[i].end = moment(data[i].start).add(30, 'm').toDate()
			}

			const x = new Date()
			x.setDate(2)

			this.setState({
				loading: false,
				data,
			})
		} catch (err) {
			this.setState({
				loading: false,
			})
		}
	}

	render() {
		const { loading, data } = this.state

		if (loading) return <BrickLoader />

		return (
			<BigCalendar
				style={{ width: '80%' }}
				localizer={localizer}
				events={data}
				step={30}
				timeslots={1}
				views={[Views.WEEK]}
				defaultView={Views.WEEK}
				selected={false}
				selectable={false}
				min={this.minDate}
				max={this.maxDate}
				messages={{
					next: 'Dalej',
					previous: 'Wstecz',
					today: 'Dziś',
					month: 'Miesiąc',
					week: 'Tydzień',
					day: 'Dzień',
				}}
				dayLayoutAlgorithm="no-overlap"
			/>
		)
	}
}

export default Calendar
