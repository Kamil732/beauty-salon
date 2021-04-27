import axios from 'axios'
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	AUTH_LOADING,
	AUTH_SUCCESS,
	AUTH_ERROR,
	CLEAR_MEETINGS,
	MEETINGS_LOADING,
} from './types'

import getHeaders from '../../helpers/getHeaders'

import { NotificationManager } from 'react-notifications'

export const loadUser = () => async (dispatch) => {
	dispatch({ type: AUTH_LOADING })

	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/accounts/current/`,
			getHeaders(true)
		)

		dispatch({
			type: AUTH_SUCCESS,
			payload: res.data,
		})
	} catch (err) {
		dispatch({
			type: AUTH_ERROR,
		})
	}
}

export const login = (recaptchaToken, email, password) => async (dispatch) => {
	const body = JSON.stringify({
		email,
		password,
		'g-recaptcha-response': recaptchaToken,
	})

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/accounts/login/`,
			body,
			getHeaders(true)
		)

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data.user,
		})
		NotificationManager.success(res.data.message, 'Zalogowano')

		dispatch({ type: MEETINGS_LOADING })
		dispatch({ type: CLEAR_MEETINGS })
	} catch (err) {
		if (err.response)
			for (const msg in err.response.data)
				NotificationManager.error(
					err.response.data[msg],
					msg === 'detail' ? 'Błąd' : msg,
					5000
				)

		dispatch({
			type: LOGIN_FAIL,
		})
	}
}

export const signUp = (
	recaptchaToken,
	{ email, password, password2 }
) => async (dispatch) => {
	const body = JSON.stringify({
		email,
		password,
		password2,
		'g-recaptcha-response': recaptchaToken,
	})

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/accounts/signup/`,
			body,
			getHeaders(true)
		)

		dispatch({
			type: REGISTER_SUCCESS,
			payload: res.data,
		})
		dispatch(login(email, password))
	} catch (err) {
		if (err.response)
			for (const msg in err.response.data)
				NotificationManager.error(
					err.response.data[msg],
					msg === 'detail' ? 'Błąd' : msg,
					5000
				)

		dispatch({
			type: REGISTER_FAIL,
		})
	}
}

export const logout = () => async (dispatch) => {
	const body = JSON.stringify({
		withCredentials: true,
	})

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/accounts/logout/`,
			body,
			getHeaders(true)
		)

		dispatch({
			type: LOGOUT,
		})
		NotificationManager.success(res.data.message, 'Wylogowano')

		dispatch({ type: MEETINGS_LOADING })
		dispatch({ type: CLEAR_MEETINGS })
	} catch (err) {
		if (err.response)
			for (const msg in err.response.data)
				NotificationManager.error(
					err.response.data[msg],
					msg === 'detail' ? 'Błąd' : msg,
					5000
				)
	}
}
