import React, { Component } from 'react'
import axios from 'axios'

import moment from 'moment'
import 'moment/locale/pl'

import Card from '../../layout/cards/Card'
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
		this.minDate.setHours(8, 0)

		this.maxDate = new Date()
		this.maxDate.setHours(20, 0)

		this.timeout = 250

		this.state = {
			ws: null,
			loading: true,
			data: [],
		}
	}

	// Check if websocket instance is closed, if so call `connect` function.
	checkIsWebSocketClosed = () => {
		const { ws } = this.state
		if (!ws || ws.readyState === WebSocket.CLOSED) this.connectWebSocket()
	}

	connectWebSocket = () => {
		const ws = new WebSocket(
			`${process.env.REACT_APP_SOCKET_URL}/meetings/`
		)
		const that = this // cache the this
		let connectInterval = null

		// websocket onopen event listener
		ws.onopen = () => {
			console.log('connected websocket')

			this.setState({
				loading: false,
				ws,
			})

			that.timeout = 250 // reset timer to 250 on open of websocket connection
			clearTimeout(connectInterval) // clear Interval on on open of websocket connection
			connectInterval = null
		}

		ws.onmessage = (e) => {
			this.setState({ loading: true })
			const data = JSON.parse(e.data)
			let meetings = data.meetings

			for (let i = 0; i < meetings.length; i++) {
				meetings[i].start = moment.utc(meetings[i].start).toDate()
				meetings[i].end = moment.utc(meetings[i].end).toDate()

				if (meetings[i].type === 'do_not_work') {
					meetings[i].allDay = true
					meetings[i].title = 'NIE PRACUJE'
				}
			}

			setTimeout(
				() =>
					this.setState({
						loading: false,
						data: meetings,
					}),
				250
			)
		}

		ws.onclose = (e) => {
			this.setState({ loading: true })
			console.log(
				`Socket is closed. Reconnect will be attempted in ${Math.min(
					10000 / 1000,
					(that.timeout + that.timeout) / 1000
				)} second.`,
				e.reason
			)

			that.timeout = that.timeout + that.timeout //increment retry interval
			connectInterval = setTimeout(
				this.checkIsWebSocketClosed,
				Math.min(10000, that.timeout)
			) //call checkIsWebSocketClosed function after timeout
		}

		ws.onerror = (err) => {
			this.setState({ loading: true })
			console.error(
				'Socket encountered error: ',
				err.message,
				'Closing socket'
			)

			ws.close()
		}
	}

	componentDidMount = async () => {
		this.connectWebSocket()

		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/meetings/`
			)

			let data = res.data

			for (let i = 0; i < data.length; i++) {
				data[i].start = moment.utc(data[i].start).toDate()
				data[i].end = moment.utc(data[i].end).toDate()

				if (data[i].do_not_work) {
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

	componentWillUnmount() {
		this.state.ws.close()
	}

	render() {
		const { loading, data } = this.state

		if (loading) return <BrickLoader />

		return (
			<Card>
				<Card.Body>
					<div className="legend">
						<div className="legend__item">
							<span
								style={{
									width: '2rem',
									height: '1rem',
								}}
								className="s-color"
							></span>
							<span>Obecna data</span>
						</div>
						<div className="legend__item">
							<span
								className="rbc-current-time-indicator"
								style={{ width: '2rem' }}
							></span>
							<span>Obecny czas</span>
						</div>
						<div className="legend__item">
							<span
								className="rbc-event"
								style={{ width: '2rem', height: '1rem' }}
							></span>
							<span>Wizyta</span>
						</div>
						<div className="legend__item">
							<span
								className="rbc-event-allday"
								style={{ width: '2rem', height: '1rem' }}
							></span>
							<span>Nie pracuje</span>
						</div>
					</div>
				</Card.Body>
				<Card.Body style={{ overflow: 'auto' }}>
					<BigCalendar
						localizer={localizer}
						events={data}
						step={30}
						timeslots={1}
						views={[Views.WEEK]}
						defaultView={Views.WEEK}
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
				</Card.Body>
			</Card>
		)
	}
}

export default Calendar
