import {
	GET_DATA,
	GET_NOTIFICATIONS,
	NOTIFICATIONS_LOADING,
	GET_NOTIFICATIONS_ERROR,
	GET_NOTIFICATIONS_UNREAD_AMOUNT,
	UPDATE_NOTIFICATION,
} from './types'

import { NotificationManager } from 'react-notifications'

import getHeaders from '../../helpers/getHeaders'
import axios from 'axios'

export const getCMSData = () => async (dispatch) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/data/cms/`
		)

		dispatch({
			type: GET_DATA,
			payload: res.data,
		})
	} catch (err) {
		NotificationManager.error(
			'Wystąpił błąd przy wczytywaniu strony, spróbuj odświeżyć stronę',
			'Błąd',
			10 ** 6
		)
	}
}

export const getUnreadNotificationsAmount = () => async (dispatch) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/data/notifications/unread-amount/`
		)

		dispatch({
			type: GET_NOTIFICATIONS_UNREAD_AMOUNT,
			payload: res.data,
		})
	} catch (err) {
		NotificationManager.error(
			'Nie udało się wczytać liczby nieprzeczytanych powiadomień',
			'Błąd'
		)
	}
}

export const getNotifications = () => async (dispatch) => {
	dispatch({ type: NOTIFICATIONS_LOADING })

	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/data/notifications/`
		)

		dispatch({
			type: GET_NOTIFICATIONS,
			payload: res.data,
		})
	} catch (err) {
		NotificationManager.error(
			'Nie udało się załadować powiadomień',
			'Błąd',
			10 ** 6
		)

		dispatch({
			type: GET_NOTIFICATIONS_ERROR,
		})
	}
}

export const markNotificationAsRead = (id) => async (dispatch) => {
	try {
		const body = JSON.stringify({ read: true })

		const res = await axios.patch(
			`${process.env.REACT_APP_API_URL}/data/notifications/${id}/`,
			body,
			getHeaders(true)
		)
		console.log(res.data)

		dispatch({
			type: UPDATE_NOTIFICATION,
			payload: {
				id,
				...res.data,
			},
		})
	} catch (err) {
		NotificationManager.error(
			'Nie udało zaznaczyć powiadomienia jako przeczytane',
			'Błąd'
		)

		dispatch({
			type: GET_NOTIFICATIONS_ERROR,
		})
	}
}
