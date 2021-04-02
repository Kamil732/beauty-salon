import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from '../containers/auth/Login'
import Contact from '../containers/Contact'
import Gallery from '../containers/Gallery'

import Home from '../containers/Home'
import NotFound from '../containers/NotFound'

class Routes extends Component {
	render() {
		return (
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/gallery" component={Gallery} />
				<Route exact path="/contact" component={Contact} />
				<Route exact path="/login" component={Login} />

				<Route path="*" component={NotFound} />
			</Switch>
		)
	}
}

export default Routes
