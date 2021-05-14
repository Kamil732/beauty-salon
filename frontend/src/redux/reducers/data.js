import {
	GET_DATA,
	GET_NOTIFICATIONS,
	NOTIFICATIONS_LOADING,
	UPDATE_DATA,
} from '../actions/types'

const initialState = {
	loadingData: true,
	loadingNotifications: false,
	data: {},
	notifications: [],
}

// eslint-disable-next-line
export default function (state = initialState, action) {
	switch (action.type) {
		case UPDATE_DATA:
		case GET_DATA:
			return {
				...state,
				loadingData: false,
				data: {
					...state.data,
					...action.payload,
				},
			}
		case NOTIFICATIONS_LOADING:
			return {
				...state,
				loadingNotifications: true,
			}
		case GET_NOTIFICATIONS:
			return {
				...state,
				loadingNotifications: false,
				notifications: [...action.payload, ...state.data],
			}
		default:
			return state
	}
}
