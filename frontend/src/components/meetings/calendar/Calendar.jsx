import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import moment from 'moment'
import 'moment/locale/pl'
import getHeaders from '../../../helpers/getHeaders'
import { NotificationManager } from 'react-notifications'

import axios from 'axios'
import {
	ADD_MEETING,
	REMOVE_MEETING,
	UPDATE_MEETING,
} from '../../../redux/actions/types'
import {
	connectMeetingWS,
	loadMeetings,
	changeVisibleMeetings,
	updateCalendarDates,
} from '../../../redux/actions/meetings'
import getWorkHours from '../../../helpers/getWorkHours'

import BrickLoader from '../../../layout/loaders/BrickLoader'
import CircleLoader from '../../../layout/loaders/CircleLoader'
import ErrorBoundary from '../../ErrorBoundary'
import Modal from '../../../layout/Modal'

import {
	Calendar as BigCalendar,
	momentLocalizer,
	Views,
} from 'react-big-calendar'
import Toolbar from './tools/Toolbar'
import TouchCellWrapper from './tools/TouchCellWrapper'
import WeekHeader from './tools/WeekHeader'
import MonthDateHeader from './tools/MonthDateHeader'
import ThreeDaysView from './tools/ThreeDaysView'
import EventWrapper from './tools/EventWrapper'
import getEventTooltip from '../../../helpers/getEventTooltip'

const AddMeetingAdminForm = lazy(() => import('./forms/AddMeetingAdminForm'))
const AddMeetingCustomerForm = lazy(() =>
	import('./forms/AddMeetingCustomerForm')
)
const EditMeetingAdminForm = lazy(() => import('./forms/EditMeetingAdminForm'))
const EditMeetingCustomerForm = lazy(() =>
	import('./forms/EditMeetingCustomerForm')
)

moment.locale('PL')
const localizer = momentLocalizer(moment)

class Calendar extends Component {
	static propTypes = {
		isAdminPanel: PropTypes.bool,
		userId: PropTypes.number,
		ws: PropTypes.object,
		loading: PropTypes.bool,
		meetings: PropTypes.array,
		loadedDates: PropTypes.array,
		visibleMeetings: PropTypes.array,
		barbers: PropTypes.array,

		calendarData: PropTypes.shape({
			currentDate: PropTypes.instanceOf(Date),
			startOfMonth: PropTypes.instanceOf(Date),
			endOfMonth: PropTypes.instanceOf(Date),
			startOfWeek: PropTypes.instanceOf(Date),
			endOfWeek: PropTypes.instanceOf(Date),
			startOf3days: PropTypes.instanceOf(Date),
			endOf3days: PropTypes.instanceOf(Date),
		}),

		changeVisibleMeetings: PropTypes.func.isRequired,
		connectMeetingWS: PropTypes.func.isRequired,
		loadMeetings: PropTypes.func.isRequired,

		serivces: PropTypes.array,
		one_slot_max_meetings: PropTypes.number.isRequired,
		calendar_step: PropTypes.number,
		calendar_timeslots: PropTypes.number,
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

		const calendarDates = this.getCalendarMinAndMaxTime()

		this.state = {
			ws: null,
			windowWidth: window.innerWidth,

			view: window.innerWidth >= 768 ? Views.WEEK : Views.DAY,
			freeSlots: {},

			minDate: calendarDates.minDate,
			maxDate: calendarDates.maxDate,
			selected: {},
		}

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
		this.getCalendarMinAndMaxTime = this.getCalendarMinAndMaxTime.bind(this)
		this.onNavigate = this.onNavigate.bind(this)
		this.onView = this.onView.bind(this)
		this.getDrilldownView = this.getDrilldownView.bind(this)
		this.onDrillDown = this.onDrillDown.bind(this)
		this.onRangeChange = this.onRangeChange.bind(this)
		this.eventPropGetter = this.eventPropGetter.bind(this)
		this.getIsDisabledSlot = this.getIsDisabledSlot.bind(this)
		this.getCountOfFreeSlotsAndMyMeetings =
			this.getCountOfFreeSlotsAndMyMeetings.bind(this)
		this.slotPropGetter = this.slotPropGetter.bind(this)
		this.onSelecting = this.onSelecting.bind(this)
		this.onSelectEvent = this.onSelectEvent.bind(this)
		this.onSelectSlot = this.onSelectSlot.bind(this)
		this.openModal = this.openModal.bind(this)
		this.saveMeeting = this.saveMeeting.bind(this)
		this.deleteMeeting = this.deleteMeeting.bind(this)
		this.addMeeting = this.addMeeting.bind(this)
	}

	updateWindowDimensions = () =>
		this.setState({ windowWidth: window.innerWidth })

	getIsDisabledSlot = (isAdminPanel, date) => {
		const { one_slot_max_meetings, visibleMeetings } = this.props
		const workingHours = getWorkHours(moment(date).isoWeekday())
		let isDisabled = workingHours.isNonWorkingDay

		// Check if on the slot can be added meeting for non admin
		let notWorkingHours = []
		let eventsOnSlot = []

		if (date < new Date()) isDisabled = true
		else
			for (let i = 0; i < visibleMeetings.length; i++) {
				if (
					visibleMeetings[i].start <= date &&
					visibleMeetings[i].end > date
				) {
					if (visibleMeetings[i].blocked)
						notWorkingHours.push(visibleMeetings[i])
					else if (!isAdminPanel && !visibleMeetings[i].blocked)
						eventsOnSlot.push(visibleMeetings[i])
				}

				if (
					notWorkingHours.length > 0 ||
					eventsOnSlot.length >= one_slot_max_meetings
				) {
					isDisabled = true
					break
				}
			}

		if (!isDisabled) {
			const convertedDate = date.getHours() * 60 + date.getMinutes()
			isDisabled =
				convertedDate < workingHours.start ||
				convertedDate > workingHours.end - this.props.calendar_step
		}

		return isDisabled
	}

	getCalendarMinAndMaxTime = () => {
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
				minDate.minutes() -
					this.props.calendar_step * this.props.calendar_timeslots
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

	getVisibleMeetings = () => {
		const {
			meetings,
			calendarData: {
				startOfMonth,
				startOfWeek,
				startOf3days,
				endOfMonth,
				endOfWeek,
				endOf3days,
			},
		} = this.props
		const { view } = this.state
		let visibleMeetings = []

		const start =
			view === Views.MONTH
				? startOfMonth
				: view === 'threedays'
				? startOf3days
				: startOfWeek
		const end =
			view === Views.MONTH
				? endOfMonth
				: view === 'threedays'
				? endOf3days
				: endOfWeek

		// Try to load meetings in new range
		if (this.props.loadedDates.length !== 0 && !this.props.loading)
			this.props.loadMeetings(start, end)

		setTimeout(() => {
			for (let i = 0; i < meetings.length; i++) {
				if (
					(meetings[i].start >= start && meetings[i].end <= end) ||
					(meetings[i].start <= start && meetings[i].end >= end) ||
					(meetings[i].start >= start &&
						end > this.props.meetings[i].start) ||
					(meetings[i].end <= end &&
						start < this.props.meetings[i].end)
				)
					visibleMeetings.push(meetings[i])
			}

			this.props.changeVisibleMeetings(visibleMeetings)
		}, 0)
	}

	getCountOfFreeSlotsAndMyMeetings = () => {
		const {
			calendar_step,
			calendarData: {
				startOfMonth,
				startOfWeek,
				startOf3days,
				endOfMonth,
				endOfWeek,
				endOf3days,
			},
		} = this.props
		const { view } = this.state

		const start =
			view === Views.MONTH
				? startOfMonth
				: view === 'threedays'
				? startOf3days
				: startOfWeek
		const end =
			view === Views.MONTH
				? endOfMonth
				: view === 'threedays'
				? endOf3days
				: endOfWeek

		// Get free slots count
		let freeSlots = {}

		let currentDate = start

		while (currentDate <= end) {
			const date = moment(currentDate).format('YYYY-MM-DD')
			const workHours = getWorkHours(
				moment(currentDate).isoWeekday(),
				false
			)

			if (!(date in freeSlots)) freeSlots[date] = 0

			if (!workHours.isNonWorkingDay) {
				let currentTime = moment(workHours.start, 'H:mm').toDate()
				while (currentTime < moment(workHours.end, 'H:mm').toDate()) {
					const isDisabled = this.getIsDisabledSlot(
						false,
						moment(currentDate)
							.add(currentTime.getHours(), 'hours')
							.add(currentTime.getMinutes(), 'minutes')
							.toDate()
					)

					if (!isDisabled && !workHours.isNonWorkingDay)
						freeSlots[date] += 1

					currentTime = moment(currentTime)
						.add(calendar_step, 'minutes')
						.toDate()
				}
			}

			const newCurrentDate = moment(currentDate).add(1, 'day').toDate()

			currentDate = newCurrentDate
		}
		this.setState({ freeSlots })
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

		if (this.props.ws === null) this.props.connectMeetingWS()
		if (!this.props.loading && this.props.loadedDates.length === 0)
			this.props.loadMeetings()

		this.getVisibleMeetings()
		this.getCountOfFreeSlotsAndMyMeetings()
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
			const calendarDates = this.getCalendarMinAndMaxTime()

			this.setState({
				minDate: calendarDates.minDate,
				maxDate: calendarDates.maxDate,
			})
			this.getCountOfFreeSlotsAndMyMeetings()
		}

		if (
			prevProps.loadedDates.length !== this.props.loadedDates.length &&
			!this.props.loading &&
			this.props.loadedDates.length === 0
		)
			this.props.loadMeetings()

		if (
			prevProps.meetings !== this.props.meetings ||
			prevProps.calendarData.currentDate !==
				this.props.calendarData.currentDate
		)
			this.getVisibleMeetings()

		if (prevProps.visibleMeetings !== this.props.visibleMeetings)
			this.getCountOfFreeSlotsAndMyMeetings()
	}

	deleteMeeting = async (loading = null) => {
		const { selected } = this.state

		if (loading) loading(true)

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
		} finally {
			if (loading) loading(false)
		}
	}

	addMeeting = async (data, loading = null) => {
		const { start, end } = this.state.selected

		data.start = start
		data.end = end

		if (loading) loading(true)

		try {
			const body = JSON.stringify(data)
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
		} finally {
			if (loading) loading(false)
		}
	}

	saveMeeting = async (data, loading = null) => {
		const {
			selected,
			selected: { start, end },
		} = this.state

		data.start = start
		data.end = end

		if (loading) loading(true)

		try {
			const body = JSON.stringify(data)

			const res = await axios.patch(
				`${process.env.REACT_APP_API_URL}/meetings/${selected.id}/`,
				body,
				getHeaders(true)
			)

			this.props.ws.send(
				JSON.stringify({
					event: UPDATE_MEETING,
					payload: res.data.id,
				})
			)

			this.setState({ selected: {} })
		} catch (err) {
			NotificationManager.error('Nie udało się zapisać wizyty', 'Błąd')
		} finally {
			if (loading) loading(false)
		}
	}

	onNavigate = (date) => this.props.updateCalendarDates(date)

	onView = async (view) => {
		this.setState({ view })

		if (view === Views.MONTH)
			await this.onRangeChange([
				this.props.calendarData.startOfMonth,
				this.props.calendarData.endOfMonth,
			])
		else if (view === 'threedays')
			await this.onRangeChange([
				this.props.calendarData.startOf3days,
				this.props.calendarData.endOf3days,
			])

		setTimeout(this.getVisibleMeetings, 0)
	}

	getDrilldownView = (targetDate, currentViewName, configuredViewNames) => {
		if (
			currentViewName === Views.MONTH &&
			configuredViewNames.includes('threedays')
		)
			return 'threedays'

		return null
	}

	onDrillDown = (date, drilldownView) => {
		this.onNavigate(date)
		setTimeout(() => this.onView(drilldownView), 0)
	}

	onRangeChange = async (dates) => {
		const { view } = this.state

		const from =
			view === Views.MONTH
				? moment(dates.start).format('YYYY-MM-DD')
				: moment(dates[0]).format('YYYY-MM-DD')

		const to =
			view === Views.MONTH
				? moment(dates.end).format('YYYY-MM-DD')
				: moment(dates[dates.length - 1]).format('YYYY-MM-DD')

		await this.props.loadMeetings(from, to)
	}

	slotPropGetter = (date) => {
		const { isAdminPanel } = this.props
		const isDisabled = this.getIsDisabledSlot(isAdminPanel, date)

		return {
			className: isDisabled ? 'disabled' : '',
		}
	}

	eventPropGetter = (event) => {
		const { barbers, isAdminPanel, userId } = this.props

		return {
			className: `${event.blocked ? 'doNotWork' : ''} ${
				isAdminPanel || (event.customer === userId && !event.blocked)
					? 'selectable'
					: ''
			} ${
				!event.blocked
					? barbers.find((barber) => {
							if (event.services.length > 0)
								return barber.id === event.services[0]?.barber
							return barber.id === event.barber
					  })?.color
					: ''
			}`,
		}
	}

	onSelecting = () => (this.props.isAdminPanel ? true : false)

	onSelectEvent = (event) => {
		const { isAdminPanel, userId } = this.props

		if (isAdminPanel || (event.customer === userId && !event.blocked))
			this.openModal('event', event)
	}

	onSelectSlot = (slot) => {
		if (
			this.props.isAdminPanel &&
			(moment(slot.end).diff(moment(slot.start), 'days') > 0 ||
				parseInt(moment(slot.end).hours()) === 0)
		) {
			this.openModal('slot', slot)
			return
		}

		const isDisabled = this.getIsDisabledSlot(
			this.props.isAdminPanel,
			slot.start
		)

		if (!isDisabled) this.openModal('slot', slot)
	}

	render() {
		const {
			loading,
			isAdminPanel,
			userId,
			visibleMeetings,
			services,
			calendarData: {
				currentDate,
				startOfMonth,
				endOfMonth,
				startOfWeek,
				endOfWeek,
				startOf3days,
				endOf3days,
			},
			calendar_timeslots,
			calendar_step,
		} = this.props
		const { windowWidth, view, selected, minDate, maxDate, freeSlots } =
			this.state

		if (services.length === 0)
			return (
				<h1>
					Nie obsługujemy narazie żadnej wizyty zapraszamy w krótce :)
				</h1>
			)

		let meetings = []

		// Filter meetings that should be displayed
		for (let i = 0; i < visibleMeetings.length; i++) {
			const start =
				view === Views.MONTH
					? startOfMonth
					: view === 'threedays'
					? startOf3days
					: startOfWeek
			const end =
				view === Views.MONTH
					? endOfMonth
					: view === 'threedays'
					? endOf3days
					: endOfWeek

			if (
				(visibleMeetings[i].start >= start &&
					visibleMeetings[i].end <= end) ||
				(visibleMeetings[i].start <= start &&
					visibleMeetings[i].end >= end) ||
				(visibleMeetings[i].start >= start &&
					end > visibleMeetings[i].start) ||
				(visibleMeetings[i].end <= end &&
					start < visibleMeetings[i].end)
			) {
				if (
					// MONTH and allDay meeting
					(view === Views.MONTH && visibleMeetings[i].allDay) ||
					// Not MONTH and IsAdminPanel
					(view !== Views.MONTH && isAdminPanel) ||
					// Not MONTH is blocked
					(view !== Views.MONTH && visibleMeetings[i].blocked) ||
					// Is owner of meeting
					visibleMeetings[i].customer === userId
				)
					meetings.push(visibleMeetings[i])
			}
		}
		console.log(view, meetings.length, visibleMeetings.length)

		return (
			<>
				{Object.keys(selected).length > 0 && (
					<Modal closeModal={() => this.setState({ selected: {} })}>
						<Modal.Header>
							{moment(selected.end).diff(
								moment(selected.start),
								'days'
							) > 0 ||
							parseInt(moment(selected.end).hours()) === 0 ? (
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
						</Modal.Header>
						<Modal.Body>
							<ErrorBoundary>
								<Suspense
									fallback={
										<div className="center-container">
											<CircleLoader />
										</div>
									}
								>
									{isAdminPanel ? (
										selected.selected_type === 'event' ? (
											<EditMeetingAdminForm
												saveMeeting={this.saveMeeting}
												deleteMeeting={
													this.deleteMeeting
												}
												selected={selected}
												startDate={selected.start}
												calendarStep={calendar_step}
												changeEndDate={(date) =>
													this.setState({
														selected: {
															...selected,
															end: date,
														},
													})
												}
											/>
										) : (
											<AddMeetingAdminForm
												addMeeting={this.addMeeting}
												isBlocked={
													selected.slots.length > 2 ||
													selected.start.getHours() *
														60 +
														selected.start.getMinutes() ===
														0 ||
													meetings.filter(
														(meeting) =>
															meeting.start >=
																selected.start &&
															meeting.end <=
																selected.end
													).length >=
														this.props
															.one_slot_max_meetings
												}
												startDate={selected.start}
												calendarStep={calendar_step}
												changeEndDate={(date) =>
													this.setState({
														selected: {
															...selected,
															end: date,
														},
													})
												}
											/>
										)
									) : selected.selected_type === 'event' ? (
										<EditMeetingCustomerForm
											saveMeeting={this.saveMeeting}
											deleteMeeting={this.deleteMeeting}
											selected={selected}
											startDate={selected.start}
											calendarStep={calendar_step}
											changeEndDate={(date) =>
												this.setState({
													selected: {
														...selected,
														end: date,
													},
												})
											}
										/>
									) : (
										<AddMeetingCustomerForm
											addMeeting={this.addMeeting}
											startDate={selected.start}
											calendarStep={calendar_step}
											changeEndDate={(date) =>
												this.setState({
													selected: {
														...selected,
														end: date,
													},
												})
											}
										/>
									)}
								</Suspense>
							</ErrorBoundary>
						</Modal.Body>
					</Modal>
				)}

				<div
					style={{
						display: loading ? 'none' : 'block',
						width: '100%',
						height: '100%',
					}}
				>
					<BigCalendar
						onNavigate={this.onNavigate}
						onView={this.onView}
						onRangeChange={this.onRangeChange}
						localizer={localizer}
						events={meetings}
						step={calendar_step}
						timeslots={calendar_timeslots}
						views={{
							week: true,
							month: true,
							threedays: ThreeDaysView,
							day: true,
						}}
						view={view}
						date={currentDate}
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
						getDrilldownView={this.getDrilldownView}
						onDrillDown={this.onDrillDown}
						components={{
							eventWrapper: EventWrapper,
							toolbar: (props) => (
								<Toolbar windowWidth={windowWidth} {...props} />
							),
							timeSlotWrapper: (props) => (
								<TouchCellWrapper
									{...props}
									onSelectSlot={this.onSelectSlot}
								/>
							),
							week: {
								header: (props) => (
									<WeekHeader
										{...props}
										freeSlots={freeSlots}
									/>
								),
							},
							threedays: {
								header: (props) => (
									<WeekHeader
										{...props}
										freeSlots={freeSlots}
									/>
								),
							},
							month: {
								dateHeader: (props) => (
									<MonthDateHeader
										{...props}
										freeSlots={freeSlots}
									/>
								),
							},
						}}
						titleAccessor={(event) =>
							getEventTooltip(event, services, false)
						}
						tooltipAccessor={null}
						messages={{
							month: 'Miesiąc',
							week: 'Tydzień',
							day: 'Dzień',
							date: 'Data',
							event: 'Spotkanie',
							threedays: '3 Dni',
							showMore: (amount) => `+${amount} więcej`,
						}}
					/>
				</div>
				{loading && (
					<div className="center-container">
						<BrickLoader />
					</div>
				)}
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	userId: state.auth.data.profile?.id,
	ws: state.meetings.ws,
	loading: state.meetings.loading,
	meetings: state.meetings.data,
	loadedDates: state.meetings.loadedDates,
	visibleMeetings: state.meetings.visibleData,
	calendarData: state.meetings.calendarData,
	barbers: state.data.barbers,
	services: state.data.cms.data.services,
	one_slot_max_meetings: state.data.cms.data.one_slot_max_meetings,
	calendar_step: state.data.cms.data.calendar_step,
	calendar_timeslots: state.data.cms.data.calendar_timeslots,
	end_work_sunday: state.data.cms.data.end_work_sunday || '',
	start_work_sunday: state.data.cms.data.start_work_sunday || '',
	end_work_saturday: state.data.cms.data.end_work_saturday || '',
	start_work_saturday: state.data.cms.data.start_work_saturday || '',
	end_work_friday: state.data.cms.data.end_work_friday || '',
	start_work_friday: state.data.cms.data.start_work_friday || '',
	end_work_thursday: state.data.cms.data.end_work_thursday || '',
	start_work_thursday: state.data.cms.data.start_work_thursday || '',
	end_work_wednesday: state.data.cms.data.end_work_wednesday || '',
	start_work_wednesday: state.data.cms.data.start_work_wednesday || '',
	end_work_tuesday: state.data.cms.data.end_work_tuesday || '',
	start_work_tuesday: state.data.cms.data.start_work_tuesday || '',
	end_work_monday: state.data.cms.data.end_work_monday || '',
	start_work_monday: state.data.cms.data.start_work_monday || '',
})

const mapDispatchToProps = {
	connectMeetingWS,
	loadMeetings,
	changeVisibleMeetings,
	updateCalendarDates,
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
