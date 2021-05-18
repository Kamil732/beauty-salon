import {
	ADD_UNREAD_NOTIFICATIONS_AMOUNT,
	CLEAR_NOTIFICATIONS,
	GET_DATA,
	GET_NOTIFICATION,
	GET_NOTIFICATIONS,
	GET_NOTIFICATIONS_ERROR,
	GET_NOTIFICATIONS_UNREAD_AMOUNT,
	NOTIFICATIONS_LOADING,
	NOTIFICATION_CONNECT_WS,
	UPDATE_DATA,
	UPDATE_NOTIFICATION,
} from '../actions/types'

const initialState = {
	cms: {
		loading: true,
		data: {},
	},
	notifications: {
		loading: false,
		ws: null,
		unRead: 0,
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
				cms: {
					...state.cms,
					loading: false,
					data: {
						...state.cms.data,
						...action.payload,
					},
				},
			}
		case NOTIFICATION_CONNECT_WS:
			return {
				...state,
				notifications: {
					...state.notifications,
					ws: action.payload,
					loading: false,
				},
			}
		case CLEAR_NOTIFICATIONS:
			if (state.notifications.ws) state.notifications.ws.destroy()

			return {
				...state,
				notifications: {
					...state.notifications,
					data: initialState.notifications.data,
					ws: initialState.notifications.ws,
					unRead: initialState.notifications.unRead,
					loading: initialState.notifications.loading,
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
		case GET_NOTIFICATIONS_UNREAD_AMOUNT:
			return {
				...state,
				notifications: {
					...state.notifications,
					unRead: action.payload,
				},
			}
		case ADD_UNREAD_NOTIFICATIONS_AMOUNT:
			return {
				...state,
				notifications: {
					...state.notifications,
					unRead: state.notifications.unRead + action.payload,
				},
			}
		case GET_NOTIFICATIONS:
			return {
				...state,
				notifications: {
					...state.notifications,
					loading: state.notifications.ws ? false : true,
					data: action.payload,
				},
			}
		case GET_NOTIFICATION:
			return {
				...state,
				notifications: {
					...state.notifications,
					data: [action.payload, ...state.notifications.data],
				},
			}
		case GET_NOTIFICATIONS_ERROR:
			return {
				...state,
				notifications: {
					...state.notifications,
					loading: false,
				},
			}
		case UPDATE_NOTIFICATION:
			return {
				...state,
				notifications: {
					...state.notifications,
					unRead:
						state.notifications.unRead -
						(action.payload?.read ? 1 : 0),
					data: state.notifications.data.map((notification) => {
						if (notification.id !== action.payload.id)
							return notification

						return {
							...notification,
							...action.payload,
						}
					}),
				},
			}
		default:
			return state
	}
}
