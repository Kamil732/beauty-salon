import {
	GET_MEETINGS,
	ADD_MEETING,
	REMOVE_MEETING,
	MEETINGS_LOADING,
	MEETINGS_CONNECT_WS,
	UPDATE_DATA,
	LOAD_MEETINGS,
	ADD_LOADED_DATE,
} from './types'

import moment from 'moment'

import { NotificationManager } from 'react-notifications'
import axios from 'axios'

// Helper function
const setMeeting = (data) => {
	data.start = moment.utc(data.start).toDate()
	data.end = moment.utc(data.end).toDate()

	if (data.customer_first_name) {
		data.title = data.customer_first_name
		data.full_title = `${data.customer_first_name}, fr. ${data.barber_first_name}, ${data.type}`
	}

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

export const addLoadedDate = (date) => (dispatch) => {
	dispatch({
		type: ADD_LOADED_DATE,
		payload: date,
	})
}

export const loadMeetings = (data) => (dispatch) => {
	for (let i = 0; i < data.length; i++) data[i] = setMeeting(data[i])

	dispatch({
		type: LOAD_MEETINGS,
		payload: data,
	})
}

export const addMeeting = (data) => (dispatch) => {
	dispatch({
		type: ADD_MEETING,
		payload: setMeeting(data),
	})
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
		NotificationManager.error(
			`Nie można połączyć się z kalendarzem. Następna próba nastąpi za: ${Math.min(
				10000 / 1000,
				(timeout + timeout) / 1000
			)} sekund`,
			'Błąd',
			5000
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

export const getMeetings = () => async (dispatch, getState) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/meetings/`
		)
		let data = res.data

		for (let i = 0; i < data.length; i++) data[i] = setMeeting(data[i])

		dispatch({
			type: GET_MEETINGS,
			payload: data,
		})

		const startOfWekk = moment().startOf('week').format('YYYY-MM-DD')
		if (!getState().meetings.loadedDates.includes(startOfWekk))
			dispatch({
				type: ADD_LOADED_DATE,
				payload: startOfWekk,
			})
	} catch (err) {
		NotificationManager.error(
			'Nie udało się załadować wizyt, następna próba za 2s',
			'Błąd',
			1500
		)

		setTimeout(dispatch(getMeetings()), 2000)
	}
}
