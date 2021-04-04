import { GET_DATA } from './types'

import { NotificationManager } from 'react-notifications'
import axios from 'axios'

export const getData = () => async (dispatch) => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_API_URL}/data/`)

		dispatch({
			type: GET_DATA,
			payload: res.data,
		})
	} catch (err) {
		NotificationManager.error(
			'Wystąpił błąd przy wczytywaniu strony, spróbuj odświeżyć stronę',
			null,
			10 ** 6
		)
	}
}
