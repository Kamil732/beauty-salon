import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import moment from 'moment'
import 'moment/locale/pl'
import getHeaders from '../../../helpers/getHeaders'
import { NotificationManager } from 'react-notifications'

import axios from 'axios'
import { ADD_MEETING, REMOVE_MEETING } from '../../../redux/actions/types'
import { loadMeetings, addLoadedDate } from '../../../redux/actions/meetings'

import Card from '../../../layout/cards/Card'
import BrickLoader from '../../../layout/loaders/BrickLoader'
import Modal from '../../../layout/Modal'

import {
	Calendar as BigCalendar,
	momentLocalizer,
	Views,
} from 'react-big-calendar'
import Toolbar from './Toolbar'
import AddMeetingAdminForm from './AddMeetingAdminForm'
import Legend from './Legend'
import AddMeetingForm from './AddMeetingForm'
import EditMeetingAdminForm from './EditMeetingAdminForm'

moment.locale('PL')
const localizer = momentLocalizer(moment)

class Calendar extends Component {
	static propTypes = {
		isAdminPanel: PropTypes.bool,
		isAuthenticated: PropTypes.bool,
		ws: PropTypes.object,
		loading: PropTypes.bool,
		meetings: PropTypes.array,
		loadedDates: PropTypes.array,
		loadMeetings: PropTypes.func.isRequired,
		addLoadedDate: PropTypes.func.isRequired,

		one_slot_meetings_count: PropTypes.string,
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

		const today = new Date()
		const defaultStart = '8:00'
		const defaultEnd = '17:00'

		let workHours = [
			props.end_work_sunday ? props.end_work_sunday : defaultEnd,
			props.start_work_sunday ? props.start_work_sunday : defaultStart,
			props.end_work_saturday ? props.end_work_saturday : defaultEnd,
			props.start_work_saturday
				? props.start_work_saturday
				: defaultStart,
			props.end_work_friday ? props.end_work_friday : defaultEnd,
			props.start_work_friday ? props.start_work_friday : defaultEnd,
			props.end_work_thursday ? props.end_work_thursday : defaultStart,
			props.start_work_thursday ? props.start_work_thursday : defaultEnd,
			props.end_work_wednesday ? props.end_work_wednesday : defaultStart,
			props.start_work_wednesday
				? props.start_work_wednesday
				: defaultEnd,
			props.end_work_tuesday ? props.end_work_tuesday : defaultStart,
			props.start_work_tuesday ? props.start_work_tuesday : defaultEnd,
			props.end_work_monday ? props.end_work_monday : defaultStart,
			props.start_work_monday ? props.start_work_monday : defaultEnd,
		]

		workHours = workHours.map((workHour) =>
			moment(
				new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate(),
					workHour.split(':')[0],
					workHour.split(':')[1]
				)
			)
		)

		this.minDate = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
			moment.min(workHours).hours(),
			moment.min(workHours).minutes() - 30
		)

		this.maxDate = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
			moment.max(workHours).hours(),
			moment.max(workHours).minutes()
		)

		this.timeout = 250

		this.state = {
			ws: null,
			windowWidth: window.innerWidth,
			selected: {},
		}

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
		this.onRangeChange = this.onRangeChange.bind(this)
		this.eventPropGetter = this.eventPropGetter.bind(this)
		this.slotPropGetter = this.slotPropGetter.bind(this)
		this.onSelecting = this.onSelecting.bind(this)
		this.onSelectEvent = this.onSelectEvent.bind(this)
		this.onSelectSlot = this.onSelectSlot.bind(this)
		this.openModal = this.openModal.bind(this)
		this.deleteMeeting = this.deleteMeeting.bind(this)
		this.addMeeting = this.addMeeting.bind(this)
	}

	updateWindowDimensions = () =>
		this.setState({ windowWidth: window.innerWidth })

	openModal = (type, selected) => {
		// if (this.props.isAuthenticated)
		this.setState({
			selected: {
				selected_type: type,
				...selected,
			},
		})
	}

	componentDidMount = () =>
		window.addEventListener('resize', this.updateWindowDimensions)

	componentWillUnmount = () =>
		window.removeEventListener('resize', this.updateWindowDimensions)

	deleteMeeting = async () => {
		const { selected } = this.state

		try {
			await axios.delete(
				`${process.env.REACT_APP_API_URL}/meetings/${selected.id}/`,
				getHeaders(true)
			)

			this.props.ws.send(
				JSON.stringify({
					event: REMOVE_MEETING,
					payload: selected.id,
				})
			)

			this.setState({ selected: {} })
		} catch (err) {
			NotificationManager.error('Nie udało się usunąć wizyty', 'błąd')
		}
	}

	addMeeting = async (data) => {
		const { start, end } = this.state.selected
		const {
			do_not_work,
			customer,
			customer_first_name,
			customer_last_name,
			customer_phone_number,
			customer_fax_number,
			barber,
			type,
		} = data

		try {
			const body = JSON.stringify({
				start,
				end,
				customer,
				customer_first_name,
				customer_last_name,
				customer_phone_number,
				customer_fax_number,
				barber,
				type: do_not_work ? 'do_not_work' : type,
			})

			const res = await axios.post(
				`${process.env.REACT_APP_API_URL}/meetings/`,
				body,
				getHeaders(true)
			)

			this.props.ws.send(
				JSON.stringify({
					event: ADD_MEETING,
					payload: res.data,
				})
			)
			this.setState({ selected: {} })
		} catch (err) {
			NotificationManager.error('Nie udało się zapisać wizyty', 'błąd')
		}
	}

	checkWorkingHours = (weekDay) => {
		const {
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

		let isNonWorkingHour = false
		let start, end

		if (weekDay === 'poniedziałek') {
			if (!start_work_monday) isNonWorkingHour = true
			else {
				start =
					parseInt(start_work_monday.split(':')[0]) * 60 +
					parseInt(start_work_monday.split(':')[1])
				end =
					parseInt(end_work_monday.split(':')[0]) * 60 +
					parseInt(end_work_monday.split(':')[1])
			}
		} else if (weekDay === 'wtorek') {
			if (!start_work_tuesday) isNonWorkingHour = true
			else {
				start =
					parseInt(start_work_tuesday.split(':')[0]) * 60 +
					parseInt(start_work_tuesday.split(':')[1])
				end =
					parseInt(end_work_tuesday.split(':')[0]) * 60 +
					parseInt(end_work_tuesday.split(':')[1])
			}
		} else if (weekDay === 'środa') {
			if (!start_work_wednesday) isNonWorkingHour = true
			else {
				start =
					parseInt(start_work_wednesday.split(':')[0]) * 60 +
					parseInt(start_work_wednesday.split(':')[1])
				end =
					parseInt(end_work_wednesday.split(':')[0]) * 60 +
					parseInt(end_work_wednesday.split(':')[1])
			}
		} else if (weekDay === 'czwartek') {
			if (!start_work_thursday) isNonWorkingHour = true
			else {
				start =
					parseInt(start_work_thursday.split(':')[0]) * 60 +
					parseInt(start_work_thursday.split(':')[1])
				end =
					parseInt(end_work_thursday.split(':')[0]) * 60 +
					parseInt(end_work_thursday.split(':')[1])
			}
		} else if (weekDay === 'piątek') {
			if (!start_work_friday) isNonWorkingHour = true
			else {
				start =
					parseInt(start_work_friday.split(':')[0]) * 60 +
					parseInt(start_work_friday.split(':')[1])
				end =
					parseInt(end_work_friday.split(':')[0]) * 60 +
					parseInt(end_work_friday.split(':')[1])
			}
		} else if (weekDay === 'sobota') {
			if (!start_work_saturday) isNonWorkingHour = true
			else {
				start =
					parseInt(start_work_saturday.split(':')[0]) * 60 +
					parseInt(start_work_saturday.split(':')[1])
				end =
					parseInt(end_work_saturday.split(':')[0]) * 60 +
					parseInt(end_work_saturday.split(':')[1])
			}
		} else if (weekDay === 'niedziela') {
			if (!start_work_sunday) isNonWorkingHour = true
			else {
				start =
					parseInt(start_work_sunday.split(':')[0]) * 60 +
					parseInt(start_work_sunday.split(':')[1])
				end =
					parseInt(end_work_sunday.split(':')[0]) * 60 +
					parseInt(end_work_sunday.split(':')[1])
			}
		}

		return {
			start,
			end,
			isNonWorkingHour,
		}
	}

	onRangeChange = async (dates) => {
		const from = moment(dates[0]).startOf('week').format('YYYY-MM-DD')
		const to = moment(dates[dates.length - 1]).format('YYYY-MM-DD')

		this.props.loadMeetings(from, to)
	}

	slotPropGetter = (date) => {
		const { isAdminPanel, one_slot_meetings_count } = this.props
		const workingHours = this.checkWorkingHours(moment(date).format('dddd'))
		let isDisabled = workingHours.isNonWorkingHour

		// Check if on the slot can be added meeting for non admin
		if (
			(!isAdminPanel &&
				this.props.meetings.filter(
					(meeting) =>
						!meeting.do_not_work &&
						meeting.start <= date &&
						meeting.end > date
				).length >= one_slot_meetings_count) ||
			this.props.meetings.filter(
				(meeting) =>
					meeting.do_not_work &&
					meeting.start <= date &&
					meeting.end > date
			).length > 0
		)
			isDisabled = true
		else if (!isDisabled) {
			date = date.getHours() * 60 + date.getMinutes()
			isDisabled =
				date < workingHours.start || date > workingHours.end - 30
		}

		return {
			className: isDisabled ? 'disabled' : '',
			style: {
				minHeight: isAdminPanel ? '80px' : 'auto',
			},
		}
	}

	eventPropGetter = (event) => {
		return {
			className: `${event.do_not_work ? 'doNotWork' : ''} ${
				this.props.isAdminPanel ? 'selectable' : ''
			}`,
		}
	}

	onSelecting = () => (this.props.isAdminPanel ? true : false)

	onSelectEvent = (event) => {
		if (this.props.isAdminPanel) this.openModal('event', event)
	}

	onSelectSlot = (slot) => {
		if (this.props.isAdminPanel) {
			this.openModal('slot', slot)
			return
		}

		const workingHours = this.checkWorkingHours(
			moment(slot.start).format('dddd')
		)
		const start = slot.start.getHours() * 60 + slot.start.getMinutes()

		let [eventsOnTheSlot, isNonWorkingHour] = [
			false,
			workingHours.isNonWorkingHour,
		]

		if (start !== 0) {
			if (
				// Check if slot is not between work hours
				start < workingHours.start ||
				start > workingHours.end - 30 ||
				// Check if there is any do_not_work type of meeting
				this.props.meetings.filter(
					(meeting) =>
						meeting.do_not_work &&
						((meeting.start >= slot.start &&
							meeting.end <= slot.end) ||
							(meeting.start <= slot.start &&
								meeting.end >= slot.end) ||
							(meeting.start >= slot.start &&
								slot.end > meeting.start) ||
							(meeting.end <= slot.end &&
								slot.start < meeting.end))
				).length > 0
			)
				isNonWorkingHour = true

			// Check if there are events on the slot
			if (!isNonWorkingHour)
				eventsOnTheSlot = this.props.meetings.filter(
					(meeting) =>
						meeting.start >= slot.start && meeting.end <= slot.end
				).length
		}

		if (
			eventsOnTheSlot < this.props.one_slot_meetings_count &&
			!isNonWorkingHour &&
			start !== 0
		)
			this.openModal('slot', slot)
	}

	render() {
		const { isAdminPanel, loading } = this.props
		const { windowWidth, selected } = this.state

		const meetings = isAdminPanel
			? this.props.meetings
			: this.props.meetings.filter((meeting) => meeting.allDay)

		return (
			<>
				{Object.keys(selected).length ? (
					<Modal
						isOpen={Object.keys(selected).length > 0}
						closeModal={() => this.setState({ selected: {} })}
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
									{moment(selected.start).format('DD/H:mm')} -{' '}
									{moment(selected.end).format('DD/H:mm')}
								</>
							)}
							<br />
							{selected?.full_title}
						</Modal.Header>
						<Modal.Body>
							{selected.selected_type === 'event' ? (
								<EditMeetingAdminForm
									deleteMeeting={this.deleteMeeting}
									selected={selected}
								/>
							) : isAdminPanel ? (
								<AddMeetingAdminForm
									addMeeting={this.addMeeting}
									doNotWork={
										selected.slots.length > 2 ||
										selected.start.getHours() * 60 +
											selected.start.getMinutes() ===
											0
									}
								/>
							) : (
								<AddMeetingForm />
							)}
						</Modal.Body>
					</Modal>
				) : null}

				<Card>
					<Card.Body>
						<Legend />
					</Card.Body>
					<Card.Body>
						<div style={{ display: loading ? 'none' : 'block' }}>
							<BigCalendar
								onRangeChange={this.onRangeChange}
								localizer={localizer}
								events={meetings}
								step={30}
								timeslots={1}
								views={
									windowWidth >= 768
										? [Views.WEEK]
										: [Views.DAY]
								}
								view={
									windowWidth >= 768 ? Views.WEEK : Views.DAY
								}
								min={this.minDate}
								max={this.maxDate}
								dayLayoutAlgorithm="no-overlap"
								longPressThreshold={10}
								slotPropGetter={this.slotPropGetter}
								eventPropGetter={this.eventPropGetter}
								dayPropGetter={this.dayPropGetter}
								selectable={true}
								selected={selected}
								onSelecting={this.onSelecting}
								onSelectSlot={this.onSelectSlot}
								onSelectEvent={this.onSelectEvent}
								components={{
									toolbar: Toolbar,
								}}
							/>
						</div>
						{loading && <BrickLoader />}
					</Card.Body>
				</Card>
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	ws: state.meetings.ws,
	loading: state.meetings.loading,
	meetings: state.meetings.data,
	loadedDates: state.meetings.loadedDates,

	one_slot_meetings_count: state.data.data.one_slot_meetings_count,
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

const mapDispatchToProps = {
	loadMeetings,
	addLoadedDate,
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
