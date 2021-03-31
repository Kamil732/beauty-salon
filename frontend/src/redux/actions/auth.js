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
} from './types'

import Cookies from 'js-cookie'

import { NotificationManager } from 'react-notifications'

export const loadUser = () => async (dispatch) => {
	dispatch({ type: AUTH_LOADING })

	const config = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Accept-Language': 'en',
			'X-CSRFToken': Cookies.get('csrftoken'),
		},
	}

	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/accounts/current/`,
			config
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

	const config = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Accept-Language': 'en',
			'X-CSRFToken': Cookies.get('csrftoken'),
		},
	}

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/accounts/login/`,
			body,
			config
		)

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data.user,
		})

		NotificationManager.success(res.data.message, 'Sukces', 3000)
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

	const config = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Accept-Language': 'en',
			'X-CSRFToken': Cookies.get('csrftoken'),
		},
	}

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/accounts/signup/`,
			body,
			config
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
	const config = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-CSRFToken': Cookies.get('csrftoken'),
		},
	}

	const body = JSON.stringify({
		withCredentials: true,
	})

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/accounts/logout/`,
			body,
			config
		)

		dispatch({
			type: LOGOUT,
		})

		NotificationManager.success(res.data.message, 'Sukces', 3000)
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
