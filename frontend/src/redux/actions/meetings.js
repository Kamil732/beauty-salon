import {
	REMOVE_MEETING,
	MEETINGS_LOADING,
	MEETINGS_CONNECT_WS,
	LOAD_MEETINGS,
	ADD_LOADED_DATES,
	CHANGE_VISIBLE_MEETINGS,
	UPDATE_MEETING,
	UPDATE_CALENDAR_DATES,
	UPDATE_RESOURCE_MAP,
} from './types'

import moment from 'moment'

import { NotificationManager } from 'react-notifications'
import axios from 'axios'

// Helper functions
const setMeeting = (data, getState) => {
	// Convert data
	data.start = moment(data.start).toDate()
	data.end = moment(data.end).toDate()

	if (
		data.do_not_work &&
		(moment(data.end).diff(moment(data.start), 'days') > 0 ||
			parseInt(moment(data.end).hours()) === 0)
	)
		data.allDay = true

	// Create support data
	let res = []
	for (let i = 0; i < data.services.length; i++) {
		const eventData = {
			id: data.services[i].id,
			start: moment(data.services[i].start).toDate(),
			end: moment(data.services[i].end).toDate(),
			data,
		}

		for (let j = 0; j < data.services[i].resources.length; j++)
			res.push({
				...eventData,
				color: getState().data.cms.data.resources.find(
					({ id }) => id === data.services[i].resources[j]
				).color,
				resourceId: `resource-${data.services[i].resources[j]}`,
			})

		res.push({
			...eventData,
			color: getState().data.barbers.find(
				({ id }) => id === data.services[i].barber
			).color,
			resourceId: `barber-${data.services[i].barber}`,
		})
	}

	return res
}

const getDates = (from, to, loadedDates) => {
	let dates = []
	let currentDate = moment(from).toDate()

	while (currentDate.getTime() <= moment(to).toDate().getTime()) {
		const formatedDate = moment(currentDate).format('YYYY-MM-DD')

		if (!loadedDates.includes(formatedDate)) dates.push(formatedDate)

		currentDate = moment(currentDate).add(1, 'day').toDate()
	}

	return dates
}

const getMeeting = async (id) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/meetings/${id}/`
		)

		NotificationManager.info('Zaktualizowano kalendarz')
		return res.data
	} catch (err) {
		NotificationManager.error('Nie udało sie zaktualizować kalendarza')
	}
}

export const updateCalendarDates = (data) => (dispatch) => {
	dispatch({
		type: UPDATE_CALENDAR_DATES,
		payload: data,
	})
}

export const updateResourceMap = (name, value) => (dispatch) => {
	if (name !== 'isMany')
		localStorage.setItem(`resource-map-${name}`, JSON.stringify(value))

	dispatch({
		type: UPDATE_RESOURCE_MAP,
		payload: { name, value },
	})
}

export const addLoadedDates = (dates) => (dispatch) => {
	dispatch({
		type: ADD_LOADED_DATES,
		payload: dates,
	})
}

export const loadMeetings =
	(
		from = moment().startOf('month').startOf('week').format('YYYY-MM-DD'),
		to = moment().endOf('month').endOf('week').format('YYYY-MM-DD')
	) =>
	async (dispatch, getState) => {
		const dates = getDates(from, to, getState().meetings.loadedDates)

		if (dates.length > 0) {
			dispatch({ type: MEETINGS_LOADING })

			try {
				let data = []
				let res = await axios.get(
					`${process.env.REACT_APP_API_URL}/meetings/?from=${
						dates[0]
					}&to=${dates[dates.length - 1]}`
				)

				for (let i = 0; i < res.data.length; i++)
					data.push(...setMeeting(res.data[i], getState))

				dispatch(addLoadedDates(dates))
				dispatch({
					type: LOAD_MEETINGS,
					payload: data,
				})
			} catch (err) {
				NotificationManager.error(
					'Nie udało się załadować wizyt',
					'Błąd'
				)
			}
		}
	}

export const addMeeting = (data) => async (dispatch, getState) => {
	const dates = getDates(data.from, data.to, getState().meetings.loadedDates)

	if (
		dates.length === 0 &&
		!getState().meetings.data.some((meeting) => meeting.id === data.id)
	) {
		const meeting = await getMeeting(data.id)

		if (meeting)
			dispatch({
				type: LOAD_MEETINGS,
				payload: setMeeting(meeting, getState),
			})
	}
}

export const removeMeeting = (id) => (dispatch) => {
	dispatch({
		type: REMOVE_MEETING,
		payload: id,
	})

	NotificationManager.info('Zaktualizowano kalendarz')
}

export const updateMeeting = (id) => async (dispatch, getState) => {
	if (getState().meetings.data.some((meeting) => meeting.data.id === id)) {
		const meeting = await getMeeting(id)

		if (meeting)
			dispatch({
				type: UPDATE_MEETING,
				payload: {
					id: meeting.id,
					data: setMeeting(meeting, getState),
				},
			})
	}
}

export const changeVisibleMeetings = (data) => (dispatch) => {
	dispatch({
		type: CHANGE_VISIBLE_MEETINGS,
		payload: data,
	})
}

export const connectMeetingWS = () => (dispatch) => {
	const ws = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/meetings/`)
	let connectInterval = null
	let timeout = 250

	// Check if websocket instance is closed, if so call `connect` function.
	const checkIsWebSocketClosed = () => {
		if (!ws || ws.readyState === WebSocket.CLOSED)
			dispatch(connectMeetingWS())
	}

	// websocket onopen event listener
	ws.onopen = () => {
		console.log('Connected meeting websocket')
		dispatch({
			type: MEETINGS_CONNECT_WS,
			payload: ws,
		})

		timeout = 250 // reset timer to 250 on open of websocket connection
		clearTimeout(connectInterval) // clear Interval on on open of websocket connection
		connectInterval = null
	}

	ws.onmessage = (e) => {
		const data = JSON.parse(e.data)

		switch (data.event) {
			case REMOVE_MEETING:
				dispatch(removeMeeting(data.payload))
				break
			case LOAD_MEETINGS:
				dispatch(addMeeting(data.payload))
				break
			case UPDATE_MEETING:
				dispatch(updateMeeting(data.payload))
				break
			default:
				break
		}
	}

	ws.onclose = (e) => {
		console.log(
			`Meeting socket is closed. Reconnect will be attempted in ${Math.min(
				10000 / 1000,
				(timeout + timeout) / 1000
			)} second.`,
			e.reason
		)

		timeout += timeout //increment retry interval
		connectInterval = setTimeout(
			checkIsWebSocketClosed,
			Math.min(10000, timeout)
		) //call checkIsWebSocketClosed function after timeout
	}

	ws.onerror = (err) => {
		console.error(
			'Meeting socket encountered error: ',
			err.message,
			'Closing socket'
		)

		ws.close()
	}
}
