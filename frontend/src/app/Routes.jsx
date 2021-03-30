import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from '../containers/auth/Login'
import Register from '../containers/auth/Register'

import Home from '../containers/Home'

class Routes extends Component {
	render() {
		return (
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/register" component={Register} />
			</Switch>
		)
	}
}

export default Routes
