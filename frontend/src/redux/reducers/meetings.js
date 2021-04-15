import {
	GET_MEETINGS,
	ADD_MEETING,
	REMOVE_MEETING,
	MEETINGS_LOADING,
	MEETINGS_CONNECT_WS,
} from '../actions/types'

const initialState = {
	loading: true,
	data: [],
	ws: null,
}

// eslint-disable-next-line
export default function (state = initialState, action) {
	switch (action.type) {
		case MEETINGS_LOADING:
			return {
				...state,
				loading: true,
			}
		case MEETINGS_CONNECT_WS:
			return {
				...state,
				ws: action.payload,
			}
		case GET_MEETINGS:
			return {
				...state,
				loading: false,
				data: action.payload,
			}
		case ADD_MEETING:
			return { ...state, data: [...state.data, action.payload] }
		case REMOVE_MEETING:
			return {
				...state,
				data: state.data.filter(
					(meeting) => meeting.id !== action.payload
				),
			}
		default:
			return state
	}
}
