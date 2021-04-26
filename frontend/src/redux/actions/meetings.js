import {
	ADD_MEETING,
	REMOVE_MEETING,
	MEETINGS_LOADING,
	MEETINGS_CONNECT_WS,
	UPDATE_DATA,
	LOAD_MEETINGS,
	ADD_LOADED_DATES,
} from './types'

import moment from 'moment'

import { NotificationManager } from 'react-notifications'
import axios from 'axios'

// Helper function
const setMeeting = (data) => {
	data.start = moment.utc(data.start).toDate()
	data.end = moment.utc(data.end).toDate()

	if (data.customer_first_name) data.title = data.customer_first_name

	if (data.do_not_work) {
		data.title = 'NIE PRACUJE'
		data.full_title = 'NIE PRACUJE'

		if (parseInt(moment(data.end).hours()) === 0) {
			data.end = moment(data.end).add(23, 'hours')
			data.allDay = true
		}
	}

	return data
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

export const addLoadedDates = (dates) => (dispatch) => {
	dispatch({
		type: ADD_LOADED_DATES,
		payload: dates,
	})
}

export const loadMeetings = (
	from = moment().startOf('month').startOf('week').format('YYYY-MM-DD'),
	to = moment().endOf('month').endOf('week').format('YYYY-MM-DD')
) => async (dispatch, getState) => {
	const dates = getDates(from, to, getState().meetings.loadedDates)

	if (dates.length > 0) {
		dispatch({ type: MEETINGS_LOADING })

		const config = {
			headers: {
				'Accept-Encoding': 'gzip',
			},
		}

		try {
			let res = await axios.get(
				`${process.env.REACT_APP_API_URL}/meetings/?from=${
					dates[0]
				}&to=${dates[dates.length - 1]}`,
				config
			)

			for (let i = 0; i < res.data.length; i++)
				res.data[i] = setMeeting(res.data[i])

			dispatch({
				type: LOAD_MEETINGS,
				payload: res.data,
			})
			dispatch(addLoadedDates(dates))
		} catch (err) {
			NotificationManager.error('Nie udało się załadować wizyt', 'Błąd')
		}
	}
}

export const addMeeting = (data) => async (dispatch, getState) => {
	const dates = getDates(data.from, data.to, getState().meetings.loadedDates)

	if (dates.length === 0) {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/meetings/${data.id}/`
			)

			dispatch({
				type: ADD_MEETING,
				payload: setMeeting(res.data),
			})
		} catch (err) {
			NotificationManager.error('Nie udało sie zaktualizować kalendarza')
		}
	}
}

export const removeMeeting = (id) => (dispatch) => {
	dispatch({
		type: REMOVE_MEETING,
		payload: id,
	})
}

export const connectWebSocket = () => (dispatch) => {
	dispatch({ type: MEETINGS_LOADING })
	const ws = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/meetings/`)
	let connectInterval = null
	let timeout = 250

	// Check if websocket instance is closed, if so call `connect` function.
	const checkIsWebSocketClosed = () => {
		if (!ws || ws.readyState === WebSocket.CLOSED)
			dispatch(connectWebSocket())
	}

	// websocket onopen event listener
	ws.onopen = () => {
		console.log('connected websocket')
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

		if (data.event === REMOVE_MEETING) dispatch(removeMeeting(data.payload))
		else if (data.event === ADD_MEETING) dispatch(addMeeting(data.payload))
		else if (data.event === UPDATE_DATA)
			dispatch({
				type: data.event,
				payload: data.payload,
			})
	}

	ws.onclose = (e) => {
		dispatch({ type: MEETINGS_LOADING })
		console.log(
			`Socket is closed. Reconnect will be attempted in ${Math.min(
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
		dispatch({ type: MEETINGS_LOADING })
		console.error(
			'Socket encountered error: ',
			err.message,
			'Closing socket'
		)

		ws.close()
	}
}
