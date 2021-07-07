import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import moment from 'moment'
import 'moment/locale/pl'
import getHeaders from '../../../helpers/getHeaders'
import { NotificationManager } from 'react-notifications'

import axios from 'axios'
import {
	LOAD_MEETINGS,
	REMOVE_MEETING,
	UPDATE_MEETING,
} from '../../../redux/actions/types'
import {
	connectMeetingWS,
	loadMeetings,
	changeVisibleMeetings,
	updateCalendarDates,
	updateResourceMap,
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
import Day from 'react-big-calendar/lib/Day'

import Toolbar from './tools/Toolbar'
import TouchCellWrapper from './tools/TouchCellWrapper'
import WeekHeader from './tools/WeekHeader'
import MonthDateHeader from './tools/MonthDateHeader'
import ThreeDaysView from './tools/views/ThreeDaysView'
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
		resourceMap: PropTypes.object.isRequired,
		barbers: PropTypes.array,

		calendarDates: PropTypes.shape({
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
		updateResourceMap: PropTypes.func.isRequired,

		serivces: PropTypes.array,
		resourcesLength: PropTypes.number,
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
		let view = localStorage.getItem('view')
		if (
			(view !== Views.WEEK &&
				view !== Views.MONTH &&
				view !== 'threedays' &&
				view !== 'reception') ||
			(view === 'reception' &&
				props.barbers.length + props.resourcesLength <= 1) ||
			(view === 'reception' && !props.isAdminPanel)
		) {
			view = Views.WEEK
			localStorage.setItem('view', view)
		}

		this.state = {
			ws: null,
			windowWidth: window.innerWidth,

			view: window.innerWidth >= 768 ? view : Views.DAY,
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
		if (!isAdminPanel) {
			let eventsOnSlot = 0

			if (date < new Date()) isDisabled = true
			else
				for (let i = 0; i < visibleMeetings.length; i++) {
					if (
						visibleMeetings[i].start <= date &&
						visibleMeetings[i].end > date
					) {
						if (
							visibleMeetings[i].blocked ||
							eventsOnSlot.length >= one_slot_max_meetings
						) {
							isDisabled = true
							break
						} else eventsOnSlot += 1
					}
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
			calendarDates: {
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
			calendarDates: {
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
		const { view } = this.state
		const {
			ws,
			loading,
			loadedDates,
			updateResourceMap,
			loadMeetings,
			connectMeetingWS,
		} = this.props

		window.addEventListener('resize', this.updateWindowDimensions)
		updateResourceMap('isMany', view === 'reception')

		if (ws === null) connectMeetingWS()
		if (!loading && loadedDates.length === 0) loadMeetings()

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
			prevProps.calendarDates.currentDate !==
				this.props.calendarDates.currentDate
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
					event: LOAD_MEETINGS,
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
			selected: {
				data: { id, start, end },
			},
		} = this.state

		data.start = start
		data.end = end

		if (loading) loading(true)

		try {
			const body = JSON.stringify(data)

			const res = await axios.patch(
				`${process.env.REACT_APP_API_URL}/meetings/${id}/`,
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
				this.props.calendarDates.startOfMonth,
				this.props.calendarDates.endOfMonth,
			])
		else if (view === 'threedays')
			await this.onRangeChange([
				this.props.calendarDates.startOf3days,
				this.props.calendarDates.endOf3days,
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

	eventPropGetter = ({ color: eventColor, data: event }) => {
		const { isAdminPanel, userId } = this.props

		return {
			className: `${event.blocked ? 'doNotWork' : ''} ${
				isAdminPanel || (event.customer === userId && !event.blocked)
					? 'selectable'
					: ''
			} ${!event.blocked ? eventColor : ''}`,
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
			barbers,
			userId,
			visibleMeetings,
			services,
			resourcesLength,
			resourceMap,
			calendarDates: {
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

		// Filter meetings that should be displayed
		let meetings = []

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
			// !isAdminPanel || (isAdminPanel && ((resourceMap.isMany && visibleMeetings[i].services.find(service => resourceMap.data.find(resource => resource.id === `barber-${service.barber}`) ) || (!resourceMap.isMany)))

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
				// If NOT `isAdminPanel`, do nothing
				// Otherwise if `resourceMap.isMany` is false get only meetings related to the `resourceMap.selected`
				// && (!isAdminPanel ||
				// 	(isAdminPanel &&
				// 		!resourceMap.isMany &&
				// 		// if barber is in `visibleMeetings[i].services`
				// 		(visibleMeetings[i].data.services.find(
				// 			(service) =>
				// 				resourceMap.selected?.id ===
				// 					`barber-${service.barber}` ||
				// 				// if resource is in `service.resources`
				// 				service.resources.find(
				// 					(id) =>
				// 						`resource-${id}` ===
				// 						resourceMap.selected?.id
				// 				)
				// 		) != null || // if barber or resource is in `visibleMeetings[i]`
				// 			`barber-${visibleMeetings[i].barber}` ===
				// 				resourceMap.selected?.id ||
				// 			`resource-${visibleMeetings[i].resource}` ===
				// 				resourceMap.selected?.id)))
				if (
					// MONTH and allDay meeting
					((view === Views.MONTH && visibleMeetings[i].data.allDay) ||
						// Not MONTH and IsAdminPanel
						(view !== Views.MONTH && isAdminPanel) ||
						// Not MONTH is blocked
						(view !== Views.MONTH &&
							visibleMeetings[i].data.blocked) ||
						// Is owner of meeting
						visibleMeetings[i].data.customer === userId) &&
					// Filter by resources
					((!resourceMap.isMany &&
						visibleMeetings[i].resourceId ===
							resourceMap.selected?.id) ||
						(resourceMap.isMany &&
							resourceMap.data.some(
								(resource) =>
									visibleMeetings[i].resourceId ===
									resource.id
							)))
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
												resourceId={selected.resourceId}
												isBlocked={
													selected.slots.length > 2 ||
													selected.start.getHours() *
														60 +
														selected.start.getMinutes() ===
														0
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
						views={Object.assign(
							{
								week: true,
								month: true,
								threedays: ThreeDaysView,
								day: true,
							},
							barbers.length + resourcesLength > 1 && isAdminPanel
								? { reception: Day }
								: {}
						)}
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
							timeGutterHeader: (props) => (
								<b style={{ margin: '0.5rem' }}>
									tydz. {moment(currentDate).week()}
								</b>
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
						startAccessor={(event) =>
							event.data.blocked ? event.data.start : event.start
						}
						endAccessor={(event) =>
							event.data.blocked ? event.data.end : event.end
						}
						allDayAccessor={(event) => event.data.allDay}
						tooltipAccessor={null}
						resources={
							isAdminPanel && view === 'reception'
								? resourceMap.data
								: null
						}
						messages={{
							month: 'Miesiąc',
							week: 'Tydzień',
							day: 'Dzień',
							reception: 'Recepcja',
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
	calendarDates: state.meetings.calendarDates,
	resourceMap: state.meetings.resourceMap,
	barbers: state.data.barbers,
	resourcesLength: state.data.cms.data.resources.length,
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
	updateResourceMap,
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
