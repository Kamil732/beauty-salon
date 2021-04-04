import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import moment from 'moment'
import 'moment/locale/pl'

import {
	Calendar as BigCalendar,
	momentLocalizer,
	Views,
} from 'react-big-calendar'
import BrickLoader from '../../layout/loaders/BrickLoader'
import { connect } from 'react-redux'

moment.locale('PL')
const localizer = momentLocalizer(moment)

class Calendar extends Component {
	static propTypes = {
		end_work_sunday: PropTypes.string.isRequired,
		start_work_sunday: PropTypes.string.isRequired,
		end_work_saturday: PropTypes.string.isRequired,
		start_work_saturday: PropTypes.string.isRequired,
		end_work_friday: PropTypes.string.isRequired,
		start_work_friday: PropTypes.string.isRequired,
		end_work_thursday: PropTypes.string.isRequired,
		start_work_thursday: PropTypes.string.isRequired,
		end_work_wednesday: PropTypes.string.isRequired,
		start_work_wednesday: PropTypes.string.isRequired,
		end_work_tuesday: PropTypes.string.isRequired,
		start_work_tuesday: PropTypes.string.isRequired,
		end_work_monday: PropTypes.string.isRequired,
		start_work_monday: PropTypes.string.isRequired,
	}

	constructor(props) {
		super(props)

		this.minDate = new Date()
		this.minDate.setHours(8, 0)

		this.maxDate = new Date()
		this.maxDate.setHours(19, 0)

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
				data[i].end = moment.utc(data[i].end).toDate()

				if (data[i].type === 'do_not_work') {
					data[i].allDay = true
					data[i].title = 'NIE PRACUJE'
				}
			}

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
			<div style={{ overflow: 'auto', width: '100%' }}>
				<BigCalendar
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
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	end_work_sunday: state.data.data.end_work_sunday,
	start_work_sunday: state.data.data.start_work_sunday,
	end_work_saturday: state.data.data.end_work_saturday,
	start_work_saturday: state.data.data.start_work_saturday,
	end_work_friday: state.data.data.end_work_friday,
	start_work_friday: state.data.data.start_work_friday,
	end_work_thursday: state.data.data.end_work_thursday,
	start_work_thursday: state.data.data.start_work_thursday,
	end_work_wednesday: state.data.data.end_work_wednesday,
	start_work_wednesday: state.data.data.start_work_wednesday,
	end_work_tuesday: state.data.data.end_work_tuesday,
	start_work_tuesday: state.data.data.start_work_tuesday,
	end_work_monday: state.data.data.end_work_monday,
	start_work_monday: state.data.data.start_work_monday,
})

export default connect(mapStateToProps, null)(Calendar)
