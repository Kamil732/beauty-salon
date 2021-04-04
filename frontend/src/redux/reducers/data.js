import { GET_DATA } from '../actions/types'

const initialState = {
	loading: true,
	data: {},
}

// eslint-disable-next-line
export default function (state = initialState, action) {
	switch (action.type) {
		case GET_DATA:
			return {
				loading: false,
				data: {
					...state.data,
					...action.payload,
				},
			}
		default:
			return state
	}
}
