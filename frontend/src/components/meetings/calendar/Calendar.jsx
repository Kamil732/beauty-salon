import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import moment from 'moment'
import 'moment/locale/pl'

import Card from '../../../layout/cards/Card'
import ButtonContainer from '../../../layout/buttons/ButtonContainer'
import Button from '../../../layout/buttons/Button'
import BrickLoader from '../../../layout/loaders/BrickLoader'
import Modal from '../../../layout/Modal'
import { NotificationManager } from 'react-notifications'

import {
	Calendar as BigCalendar,
	momentLocalizer,
	Views,
} from 'react-big-calendar'
import Toolbar from './Toolbar'
import AddMeetingForm from './AddMeetingForm'
import { connect } from 'react-redux'

moment.locale('PL')
const localizer = momentLocalizer(moment)

class Calendar extends Component {
	static propTypes = {
		isAdminPanel: PropTypes.bool,
		isAuthenticated: PropTypes.bool,

		end_work_sunday: PropTypes.string,
		start_work_sunday: PropTypes.string,
		end_work_saturday: PropTypes.string,
		start_work_saturday: PropTypes.string,
		end_work_friday: PropTypes.string,
		start_work_friday: PropTypes.string,
		end_work_thursday: PropTypes.string,
		start_work_thursday: PropTypes.string,
		end_work_wednesday: PropTypes.string,
		start_work_wednesday: PropTypes.string,
		end_work_tuesday: PropTypes.string,
		start_work_tuesday: PropTypes.string,
		end_work_monday: PropTypes.string,
		start_work_monday: PropTypes.string,
	}

	constructor(props) {
		super(props)

		this.minDate = new Date()
		this.minDate.setHours(8, 0)

		this.maxDate = new Date()
		this.maxDate.setHours(20, 0)

		this.timeout = 250

		this.state = {
			ws: null,
			windowWidth: window.innerWidth,
			loading: true,
			data: [],
			selected: {},
		}

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
		this.checkIsWebSocketClosed = this.checkIsWebSocketClosed.bind(this)
		this.setData = this.setData.bind(this)
		this.connectWebSocket = this.connectWebSocket.bind(this)
		this.openModal = this.openModal.bind(this)
		this.deleteMeeting = this.deleteMeeting.bind(this)
		this.addMeeting = this.addMeeting.bind(this)
	}

	updateWindowDimensions = () =>
		this.setState({ windowWidth: window.innerWidth })

	openModal = (type, selected) => {
		// if (this.props.isAuthenticated)

		console.log(selected)
		if (!selected.do_not_work)
			selected.end = moment(selected.start).add(30, 'minutes').toDate()

		this.setState({
			selected: {
				selected_type: type,
				...selected,
			},
		})
	}

	// Check if websocket instance is closed, if so call `connect` function.
	checkIsWebSocketClosed = () => {
		const { ws } = this.state
		if (!ws || ws.readyState === WebSocket.CLOSED) this.connectWebSocket()
	}

	setData = (data) => {
		const { isAdminPanel } = this.props

		for (let i = 0; i < data.length; i++) {
			data[i].start = moment.utc(data[i].start).toDate()
			data[i].end = moment.utc(data[i].end).toDate()

			if (isAdminPanel)
				data[
					i
				].title = `${data[i].customer_first_name}, ${data[i].type}`

			if (data[i].do_not_work) {
				data[i].allDay = true
				data[i].title = 'NIE PRACUJE'
			}
		}

		this.setState({
			loading: false,
			data,
			selected: {},
		})
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
			const data = JSON.parse(e.data)

			if (data.event === 'DELETE_MEETING')
				this.setData(
					this.state.data.filter(
						(meeting) => meeting.id !== data.payload
					)
				)
			else if (data.event === 'ADD_MEETING')
				this.setData([...this.state.data, data.payload])
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
			NotificationManager.error(
				`Nie można połączyć się z kalendarzem. Następna próba nastąpi za: ${Math.min(
					10000 / 1000,
					(that.timeout + that.timeout) / 1000
				)} sekund`,
				'Błąd',
				5000
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
		window.addEventListener('resize', this.updateWindowDimensions)

		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/meetings/`
			)

			this.setData(res.data)
		} catch (err) {
			this.setState({
				loading: false,
			})
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions)
	}

	deleteMeeting = () => {
		const { selected } = this.state

		this.state.ws.send(
			JSON.stringify({
				event: 'DELETE_MEETING',
				payload: selected.id,
			})
		)
		this.setState({ selected: {} })
	}

	addMeeting = (data) => {
		const { start, end } = this.state.selected
		const { customer, customer_first_name, type } = data

		const payload = { start, end, customer, customer_first_name, type }

		this.state.ws.send(
			JSON.stringify({
				event: 'ADD_MEETING',
				payload,
			})
		)
		this.setState({ selected: {} })
	}

	render() {
		const {
			isAdminPanel,

			start_work_monday,
			end_work_monday,
			start_work_tuesday,
			end_work_tuesday,
			start_work_wednesday,
			end_work_wednesday,
			start_work_thursday,
			end_work_thursday,
			start_work_friday,
			end_work_friday,
			start_work_saturday,
			end_work_saturday,
			start_work_sunday,
			end_work_sunday,
		} = this.props
		const { windowWidth, loading, data, selected } = this.state

		if (loading) return <BrickLoader />

		return (
			<>
				<Modal
					isOpen={Object.keys(selected).length > 0}
					closeModal={() => this.setState({ selected: {} })}
				>
					<Modal.Header>
						{selected.do_not_work ? (
							<>
								{moment(selected.start).format('DD/MM/YYYY')} -{' '}
								{moment(selected.end).format('DD/MM/YYYY')}
							</>
						) : (
							<>
								{moment(selected.start).format('DD/H:mm')} -{' '}
								{moment(selected.end).format('DD/H:mm')}
							</>
						)}
						<br />
						{selected?.title}
					</Modal.Header>
					<Modal.Body>
						{selected.selected_type === 'event' ? (
							<ButtonContainer>
								<Button primary small>
									Edytuj
								</Button>
								<Button
									danger
									small
									onClick={this.deleteMeeting}
								>
									Usuń{' '}
									{selected.do_not_work
										? 'wolne od pracy'
										: 'wizytę'}
								</Button>
							</ButtonContainer>
						) : (
							<AddMeetingForm addMeeting={this.addMeeting} />
						)}
					</Modal.Body>
				</Modal>

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
								<span>Umówiona wizyta</span>
							</div>
							<div className="legend__item">
								<span
									className="rbc-event-allday"
									style={{
										width: '2rem',
										height: '1rem',
										borderRadius: '8px',
									}}
								></span>
								<span>Nie pracuje</span>
							</div>
						</div>
					</Card.Body>
					<Card.Body>
						<BigCalendar
							localizer={localizer}
							events={data}
							step={30}
							timeslots={1}
							views={
								windowWidth >= 768 ? [Views.WEEK] : [Views.DAY]
							}
							view={windowWidth >= 768 ? Views.WEEK : Views.DAY}
							min={this.minDate}
							max={this.maxDate}
							dayLayoutAlgorithm="no-overlap"
							slotPropGetter={(date) => {
								let isDisabled = false

								const weekDay = moment(date).format('dddd')
								const currentDay = date.getDay()
								let start = new Date()
								let end = new Date()

								if (weekDay === 'poniedziałek') {
									if (!start_work_monday) isDisabled = true
									else {
										const distance = 1 - currentDay

										start.setHours(
											start_work_monday.split(':')[0],
											start_work_monday.split(':')[1]
										)
										start.setDate(date.getDate() + distance)
										end.setHours(
											end_work_monday.split(':')[0],
											end_work_monday.split(':')[1]
										)

										end.setDate(date.getDate() + distance)
									}
								} else if (weekDay === 'wtorek') {
									if (!start_work_tuesday) isDisabled = true
									else {
										const distance = 2 - currentDay

										start.setHours(
											start_work_tuesday.split(':')[0],
											start_work_tuesday.split(':')[1]
										)
										start.setDate(date.getDate() + distance)
										end.setHours(
											end_work_tuesday.split(':')[0],
											end_work_tuesday.split(':')[1]
										)

										end.setDate(date.getDate() + distance)
									}
								} else if (weekDay === 'środa') {
									if (!start_work_wednesday) isDisabled = true
									else {
										const distance = 3 - currentDay

										start.setHours(
											start_work_wednesday.split(':')[0],
											start_work_wednesday.split(':')[1]
										)
										start.setDate(date.getDate() + distance)
										end.setHours(
											end_work_wednesday.split(':')[0],
											end_work_wednesday.split(':')[1]
										)

										end.setDate(date.getDate() + distance)
									}
								} else if (weekDay === 'czwartek') {
									if (!start_work_thursday) isDisabled = true
									else {
										const distance = 4 - currentDay

										start.setHours(
											start_work_thursday.split(':')[0],
											start_work_thursday.split(':')[1]
										)
										start.setDate(date.getDate() + distance)
										end.setHours(
											end_work_thursday.split(':')[0],
											end_work_thursday.split(':')[1]
										)

										end.setDate(date.getDate() + distance)
									}
								} else if (weekDay === 'piątek') {
									if (!start_work_friday) isDisabled = true
									else {
										const distance = 5 - currentDay

										start.setHours(
											start_work_friday.split(':')[0],
											start_work_friday.split(':')[1]
										)
										start.setDate(date.getDate() + distance)
										end.setHours(
											end_work_friday.split(':')[0],
											end_work_friday.split(':')[1]
										)

										end.setDate(date.getDate() + distance)
									}
								} else if (weekDay === 'sobota') {
									if (!start_work_saturday) isDisabled = true
									else {
										const distance = 6 - currentDay

										start.setHours(
											start_work_saturday.split(':')[0],
											start_work_saturday.split(':')[1]
										)
										start.setDate(date.getDate() + distance)
										end.setHours(
											end_work_saturday.split(':')[0],
											end_work_saturday.split(':')[1]
										)

										end.setDate(date.getDate() + distance)
									}
								} else if (weekDay === 'niedziela') {
									if (!start_work_sunday) isDisabled = true
									else {
										const distance = 0 - currentDay

										start.setHours(
											start_work_sunday.split(':')[0],
											start_work_sunday.split(':')[1]
										)
										start.setDate(date.getDate() + distance)
										end.setHours(
											end_work_sunday.split(':')[0],
											end_work_sunday.split(':')[1]
										)

										end.setDate(date.getDate() + distance)
									}
								}

								isDisabled =
									moment(date, 'H:mm') <
										moment(start, 'H:mm') ||
									moment(date, 'H:mm') > moment(end, 'H:mm')

								return {
									className: isDisabled ? 'disabled' : '',
									style: {
										minHeight: isAdminPanel
											? '60px'
											: 'auto',
									},
								}
							}}
							selectable={true}
							selected={selected}
							eventPropGetter={() => ({
								className: isAdminPanel ? 'selectable' : '',
							})}
							onSelectSlot={(slot) =>
								this.openModal('slot', slot)
							}
							onSelectEvent={(event) => {
								if (isAdminPanel) this.openModal('event', event)
							}}
							components={{
								toolbar: Toolbar,
							}}
						/>
					</Card.Body>
				</Card>
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,

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
