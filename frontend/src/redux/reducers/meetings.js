import {
	ADD_MEETING,
	REMOVE_MEETING,
	MEETINGS_LOADING,
	MEETINGS_CONNECT_WS,
	LOAD_MEETINGS,
	CLEAR_MEETINGS,
	ADD_LOADED_DATES,
} from '../actions/types'

const initialState = {
	loading: false,
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
				ws: action.payload,
				loading: state.loadedDates.length > 0 ? false : true,
			}
		case CLEAR_MEETINGS:
			return {
				...state,
				loadedDates: initialState.loadedDates,
				data: initialState.data,
			}
		case ADD_LOADED_DATES:
			return {
				...state,
				loadedDates: [...state.loadedDates, ...action.payload],
				loading: state.ws ? false : true,
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
