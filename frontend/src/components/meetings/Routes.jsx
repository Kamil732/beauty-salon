import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import PrivateRoute from '../../common/PrivateRoute'

import MyMeetings from '../../containers/meetings/MyMeetings'
import NotFound from '../../containers/NotFound'

class Routes extends Component {
	render() {
		return (
			<Switch>
				<PrivateRoute
					exact
					path="/meetings/calendar"
					component={MyMeetings}
				/>

				<Route path="*" component={NotFound} />
			</Switch>
		)
	}
}

export default Routes
