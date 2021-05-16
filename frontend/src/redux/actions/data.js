import {
	GET_DATA,
	GET_NOTIFICATIONS,
	NOTIFICATIONS_LOADING,
	GET_NOTIFICATIONS_ERROR,
	GET_NOTIFICATIONS_UNREAD_AMOUNT,
} from './types'

import { NotificationManager } from 'react-notifications'
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
	dispatch({ type: NOTIFICATIONS_LOADING })

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

		dispatch({
			type: GET_NOTIFICATIONS_ERROR,
		})
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
