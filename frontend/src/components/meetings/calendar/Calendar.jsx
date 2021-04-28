import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import moment from 'moment'
import 'moment/locale/pl'
import getHeaders from '../../../helpers/getHeaders'
import { NotificationManager } from 'react-notifications'

import axios from 'axios'
import { ADD_MEETING, REMOVE_MEETING } from '../../../redux/actions/types'
import { loadMeetings, connectWebSocket } from '../../../redux/actions/meetings'

import Card from '../../../layout/cards/Card'
import BrickLoader from '../../../layout/loaders/BrickLoader'
import Modal from '../../../layout/Modal'

import {
	Calendar as BigCalendar,
	momentLocalizer,
	Views,
} from 'react-big-calendar'
import Toolbar from './Toolbar'
import TouchCellWrapper from './TouchCellWrapper'
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
		connectWebSocket: PropTypes.func.isRequired,

		one_slot_max_meetings: PropTypes.number.isRequired,
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

		const calendarDates = this.getCalendarDates()

		this.state = {
			ws: null,
			windowWidth: window.innerWidth,
			view: window.innerWidth >= 768 ? Views.WEEK : Views.DAY,
			startOfMonth: null,
			endOfMonth: null,
			startOfWeek: null,
			endOfWeek: null,
			minDate: calendarDates.minDate,
			maxDate: calendarDates.maxDate,
			selected: {},
		}

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
		this.getCalendarDates = this.getCalendarDates.bind(this)
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

	getCalendarDates = () => {
		const today = new Date()

		let workHours = [
			{
				end: this.props?.end_work_sunday || null,
				start: this.props?.start_work_sunday || null,
			},
			{
				end: this.props?.end_work_saturday || null,
				start: this.props?.start_work_saturday || null,
			},
			{
				end: this.props?.end_work_friday || null,
				start: this.props?.start_work_friday || null,
			},
			{
				end: this.props?.end_work_thursday || null,
				start: this.props?.start_work_thursday || null,
			},
			{
				end: this.props?.end_work_wednesday || null,
				start: this.props?.start_work_wednesday || null,
			},
			{
				end: this.props?.end_work_tuesday || null,
				start: this.props?.start_work_tuesday || null,
			},
			{
				end: this.props?.end_work_monday || null,
				start: this.props?.start_work_monday || null,
			},
		].filter((workHour) => workHour.start !== null && workHour.end !== null)

		if (workHours.length === 0)
			workHours = [
				{
					start: '8:00',
					end: '17:00',
				},
			]

		workHours = workHours.map((workHour) => ({
			start: moment(
				new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate(),
					workHour.start.split(':')[0],
					workHour.start.split(':')[1]
				)
			),
			end: moment(
				new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate(),
					workHour.end.split(':')[0],
					workHour.end.split(':')[1]
				)
			),
		}))

		const minDate = moment.min(workHours.map((workHour) => workHour.start))
		const maxDate = moment.max(workHours.map((workHour) => workHour.end))

		return {
			minDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				minDate.hours(),
				minDate.minutes() - 30
			),

			maxDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				maxDate.hours(),
				maxDate.minutes()
			),
		}
	}

	openModal = (type, selected) => {
		this.setState({
			selected: {
				selected_type: type,
				...selected,
			},
		})
	}

	componentDidMount = () => {
		window.addEventListener('resize', this.updateWindowDimensions)

		if (!this.props.ws) this.props.connectWebSocket()
		if (this.props.loadedDates.length === 0) this.props.loadMeetings()
	}

	componentWillUnmount = () =>
		window.removeEventListener('resize', this.updateWindowDimensions)

	componentDidUpdate(prevProps, _) {
		if (
			this.props.end_work_sunday !== prevProps.end_work_sunday ||
			this.props.start_work_sunday !== prevProps.start_work_sunday ||
			this.props.end_work_saturday !== prevProps.end_work_saturday ||
			this.props.start_work_saturday !== prevProps.start_work_saturday ||
			this.props.end_work_friday !== prevProps.end_work_friday ||
			this.props.start_work_friday !== prevProps.start_work_friday ||
			this.props.end_work_thursday !== prevProps.end_work_thursday ||
			this.props.start_work_thursday !== prevProps.start_work_thursday ||
			this.props.end_work_wednesday !== prevProps.end_work_wednesday ||
			this.props.start_work_wednesday !==
				prevProps.start_work_wednesday ||
			this.props.end_work_tuesday !== prevProps.end_work_tuesday ||
			this.props.start_work_tuesday !== prevProps.start_work_tuesday ||
			this.props.end_work_monday !== prevProps.end_work_monday ||
			this.props.start_work_monday !== prevProps.start_work_monday
		) {
			const calednarDates = this.getCalendarDates()

			this.setState({
				minDate: calednarDates.minDate,
				maxDate: calednarDates.maxDate,
			})
		}
	}

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
					payload: {
						id: res.data.id,
						from: res.data.start,
						to: res.data.end,
					},
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
		const from =
			this.state.view === Views.MONTH
				? moment(dates.start).format('YYYY-MM-DD')
				: moment(dates[0]).format('YYYY-MM-DD')

		const to =
			this.state.view === Views.MONTH
				? moment(dates.end).format('YYYY-MM-DD')
				: moment(dates[dates.length - 1]).format('YYYY-MM-DD')

		this.props.loadMeetings(from, to)
	}

	slotPropGetter = (date) => {
		const { isAdminPanel, one_slot_max_meetings } = this.props
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
				).length >= one_slot_max_meetings) ||
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
				minHeight: isAdminPanel ? '110px' : 'auto',
			},
		}
	}

	eventPropGetter = (event) => {
		return {
			className: `${event.do_not_work ? 'doNotWork' : ''} ${
				this.props.isAdminPanel ||
				(this.props.isAuthenticated &&
					event.customer_phone_number ===
						this.props.user_phone_number &&
					!event.do_not_work)
					? 'selectable'
					: ''
			}`,
		}
	}

	onSelecting = () => (this.props.isAdminPanel ? true : false)

	onSelectEvent = (event) => {
		if (
			this.props.isAdminPanel ||
			(this.props.isAuthenticated &&
				event.customer_phone_number === this.props.user_phone_number &&
				!event.do_not_work)
		)
			this.openModal('event', event)
	}

	onSelectSlot = (slot) => {
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

		if (this.props.isAdminPanel) {
			if (!isNonWorkingHour) this.openModal('slot', slot)
		} else {
			if (
				eventsOnTheSlot < this.props.one_slot_max_meetings &&
				!isNonWorkingHour &&
				start !== 0
			)
				this.openModal('slot', slot)
		}
	}

	render() {
		const {
			isAdminPanel,
			loading,
			user_phone_number,
			isAuthenticated,
		} = this.props
		const {
			windowWidth,
			view,
			selected,
			minDate,
			maxDate,
			startOfMonth,
			endOfMonth,
			startOfWeek,
			endOfWeek,
		} = this.state

		let meetings = []

		if (view === Views.MONTH)
			meetings = this.props.meetings.filter(
				(meeting) =>
					meeting.allDay &&
					((meeting.start >= startOfMonth &&
						meeting.end <= endOfMonth) ||
						(meeting.start <= startOfMonth &&
							meeting.end >= endOfMonth) ||
						(meeting.start >= startOfMonth &&
							endOfMonth > meeting.start) ||
						(meeting.end <= endOfMonth &&
							startOfMonth < meeting.end))
			)
		else
			meetings = isAdminPanel
				? this.props.meetings.filter(
						(meeting) =>
							(meeting.start >= startOfWeek &&
								meeting.end <= endOfWeek) ||
							(meeting.start <= startOfWeek &&
								meeting.end >= endOfWeek) ||
							(meeting.start >= startOfWeek &&
								endOfWeek > meeting.start) ||
							(meeting.end <= endOfWeek &&
								startOfWeek < meeting.end)
				  )
				: this.props.meetings.filter(
						(meeting) =>
							(meeting.do_not_work ||
								(meeting.customer_phone_number ===
									user_phone_number &&
									isAuthenticated)) &&
							((meeting.start >= startOfWeek &&
								meeting.end <= endOfWeek) ||
								(meeting.start <= startOfWeek &&
									meeting.end >= endOfWeek) ||
								(meeting.start >= startOfWeek &&
									endOfWeek > meeting.start) ||
								(meeting.end <= endOfWeek &&
									startOfWeek < meeting.end))
				  )

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
											0 ||
										this.props.meetings.filter(
											(meeting) =>
												meeting.start >=
													selected.start &&
												meeting.end <= selected.end
										).length >=
											this.props.one_slot_max_meetings
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
								onNavigate={(date) =>
									this.setState({
										startOfMonth: moment(date)
											.startOf('month')
											.startOf('week'),
										endOfMonth: moment(date)
											.endOf('month')
											.endOf('week'),
										startOfWeek: moment(date).startOf(
											'week'
										),
										endOfWeek: moment(date).endOf('week'),
									})
								}
								onView={(view) => {
									if (view === Views.MONTH)
										this.onRangeChange([
											startOfMonth,
											endOfMonth,
										])
								}}
								onRangeChange={this.onRangeChange}
								localizer={localizer}
								events={meetings}
								step={30}
								timeslots={1}
								views={[Views.MONTH, Views.WEEK, Views.DAY]}
								defaultView={view}
								min={minDate}
								max={maxDate}
								dayLayoutAlgorithm="no-overlap"
								slotPropGetter={this.slotPropGetter}
								eventPropGetter={this.eventPropGetter}
								dayPropGetter={this.dayPropGetter}
								selectable={true}
								selected={selected}
								onSelecting={this.onSelecting}
								onSelectSlot={this.onSelectSlot}
								onSelectEvent={this.onSelectEvent}
								components={{
									toolbar: (props) => (
										<Toolbar
											windowWidth={windowWidth}
											setView={(state) =>
												this.setState({ view: state })
											}
											{...props}
										/>
									),
									timeSlotWrapper: (props) => (
										<TouchCellWrapper
											{...props}
											onSelectSlot={this.onSelectSlot}
										/>
									),
								}}
								messages={{
									month: 'Miesiąc',
									week: 'Tydzień',
									day: 'Dzień',
									date: 'Data',
									event: 'Spotkanie',
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
	user_phone_number: state.auth.data.phone_number,
	ws: state.meetings.ws,
	loading: state.meetings.loading,
	meetings: state.meetings.data,
	loadedDates: state.meetings.loadedDates,

	one_slot_max_meetings: state.data.data.one_slot_max_meetings,
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
	connectWebSocket,
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
