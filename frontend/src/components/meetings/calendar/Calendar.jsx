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

import {
	Calendar as BigCalendar,
	momentLocalizer,
	Views,
} from 'react-big-calendar'
import Toolbar from './Toolbar'

moment.locale('PL')
const localizer = momentLocalizer(moment)

class Calendar extends Component {
	static propTypes = {
		isAdminPanel: PropTypes.bool,
	}

	constructor(props) {
		super(props)

		this.minDate = new Date()
		this.minDate.setHours(8, 0)

		this.maxDate = new Date()
		this.maxDate.setHours(20, 0)

		this.timeout = 250

		this.state = {
			windowWidth: window.innerWidth,
			ws: null,
			loading: true,
			data: [],
			selected: {},
			isModalOpen: false,
		}

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
		this.checkIsWebSocketClosed = this.checkIsWebSocketClosed.bind(this)
		this.setData = this.setData.bind(this)
		this.connectWebSocket = this.connectWebSocket.bind(this)
		this.openModal = this.openModal.bind(this)
	}

	updateWindowDimensions = () =>
		this.setState({ windowWidth: window.innerWidth })

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
			this.setState({ loading: true })
			const data = JSON.parse(e.data)

			this.setData(data.meetings)
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
		if (this.state.ws) this.state.ws.close()
		window.removeEventListener('resize', this.updateWindowDimensions)
	}

	openModal = (selected) => {
		if (this.props.isAdminPanel)
			this.setState({
				isModalOpen: true,
				selected,
			})
	}

	render() {
		const { isAdminPanel } = this.props
		const { windowWidth, loading, data, isModalOpen, selected } = this.state

		if (loading) return <BrickLoader />

		return (
			<>
				{isAdminPanel && isModalOpen && (
					<Modal
						isOpen={isModalOpen}
						closeModal={() =>
							this.setState({
								isModalOpen: false,
								selected: {},
							})
						}
					>
						<Modal.Header>
							{selected.do_not_work ? (
								<>
									{moment(selected.start).format(
										'DD/MM/YYYY'
									)}{' '}
									-{' '}
									{moment(selected.end).format('DD/MM/YYYY')}
								</>
							) : (
								<>
									{moment(selected.start).format('H:mm')} -{' '}
									{moment(selected.end).format('H:mm')}
								</>
							)}
							<br />
							{selected?.title}
						</Modal.Header>
						<Modal.Body>
							<ButtonContainer>
								<Button primary small>
									Edytuj
								</Button>
								<Button danger small>
									Usuń wizyte
								</Button>
							</ButtonContainer>
						</Modal.Body>
					</Modal>
				)}

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
									style={{ width: '2rem', height: '1rem' }}
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
							slotPropGetter={(date) => ({
								style: {
									minHeight: isAdminPanel ? '60px' : 'auto',
								},
							})}
							selectable={isAdminPanel}
							selected={isAdminPanel ? selected : {}}
							eventPropGetter={(
								event,
								start,
								end,
								isSelected
							) => ({
								className: isAdminPanel ? 'selectable' : '',
							})}
							onSelectEvent={(event) => this.openModal(event)}
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

export default Calendar
