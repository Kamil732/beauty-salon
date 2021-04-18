import {
	GET_MEETINGS,
	ADD_MEETING,
	REMOVE_MEETING,
	MEETINGS_LOADING,
	MEETINGS_CONNECT_WS,
	LOAD_MEETINGS,
	ADD_LOADED_DATE,
} from '../actions/types'

const initialState = {
	loading: true,
	data: [],
	loadedDates: [],
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
				loading: false,
				ws: action.payload,
			}
		case ADD_LOADED_DATE:
			return {
				...state,
				loadedDates: [...state.loadedDates, action.payload],
			}
		case GET_MEETINGS:
			return {
				...state,
				data: action.payload,
			}
		case LOAD_MEETINGS:
			return {
				...state,
				data: [...state.data, ...action.payload],
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
