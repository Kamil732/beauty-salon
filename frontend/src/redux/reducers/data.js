import {
	GET_DATA,
	GET_NOTIFICATIONS,
	NOTIFICATIONS_LOADING,
	UPDATE_DATA,
} from '../actions/types'

const initialState = {
	serverData: {
		loading: true,
		data: {},
	},
	notifications: {
		loading: false,
		data: [],
	},
}

// eslint-disable-next-line
export default function (state = initialState, action) {
	switch (action.type) {
		case UPDATE_DATA:
		case GET_DATA:
			return {
				...state,
				serverData: {
					...state.serverData,
					loading: false,
					data: {
						...state.data,
						...action.payload,
					},
				},
			}
		case NOTIFICATIONS_LOADING:
			return {
				...state,
				notifications: {
					...state.notifications,
					loading: true,
				},
			}
		case GET_NOTIFICATIONS:
			return {
				...state,
				notifications: {
					loading: false,
					data: [...action.payload, ...state.data],
				},
			}
		default:
			return state
	}
}
