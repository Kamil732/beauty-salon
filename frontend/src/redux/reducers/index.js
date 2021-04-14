import { combineReducers } from 'redux'

import data from './data'
import auth from './auth'
import meetings from './meetings'

export default combineReducers({
	data,
	auth,
	meetings,
})
