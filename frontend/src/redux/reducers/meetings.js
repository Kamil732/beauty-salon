import {
	ADD_MEETING,
	REMOVE_MEETING,
	MEETINGS_LOADING,
	MEETINGS_CONNECT_WS,
	LOAD_MEETINGS,
	CLEAR_MEETINGS,
	ADD_LOADED_DATES,
	CHANGE_VISIBLE_MEETINGS,
	UPDATE_MEETING,
	LOAD_BARBERS,
	LOAD_CUSTOMERS,
} from '../actions/types'

const initialState = {
	loading: false,
	data: [],
	loadedDates: [],
	visibleData: [],
	barberChoiceList: [],
	customerChoiceList: [],
	ws: null,
}

// eslint-disable-next-line
export default function (state = initialState, action) {
	switch (action.type) {
		case LOAD_BARBERS:
			return {
				...state,
				barberChoiceList: action.payload,
			}
		case LOAD_CUSTOMERS:
			let newCustomers = []

			for (let i = 0; i < action.payload.length; i++) {
				const found = state.customerChoiceList.some(
					(item) => item.value.id === action.payload[i].value.id
				)
				if (!found) newCustomers.push(action.payload[i])
			}

			return {
				...state,
				customerChoiceList: [
					...state.customerChoiceList,
					...newCustomers,
				],
			}
		case MEETINGS_LOADING:
			return {
				...state,
				loading: true,
			}
		case MEETINGS_CONNECT_WS:
			return {
				...state,
				ws: action.payload,
				loading: state.loadedDates.length > 0 ? false : state.loading,
			}
		case CLEAR_MEETINGS:
			return {
				...state,
				loadedDates: initialState.loadedDates,
				data: initialState.data,
			}
		case CHANGE_VISIBLE_MEETINGS:
			return {
				...state,
				visibleData: action.payload,
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
		case UPDATE_MEETING:
			return {
				...state,
				data: state.data.map((item) => {
					if (item.id !== action.payload.id) return item

					const { start, end, ...data } = action.payload

					return {
						...item,
						...data,
					}
				}),
			}
		// TODO: update vivisbleMeetings as well
		default:
			return state
	}
}
