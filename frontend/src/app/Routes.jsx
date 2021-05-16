import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'

import Login from '../containers/auth/Login'
import Contact from '../containers/Contact'
import Gallery from '../containers/Gallery'
import Home from '../containers/Home'

import { default as MeetingsRoutes } from '../components/meetings/Routes'
import NotFound from '../containers/NotFound'
import { connect } from 'react-redux'
import BrickLoader from '../layout/loaders/BrickLoader'
import PageHero from '../layout/PageHero'
import PrivateRoute from '../common/PrivateRoute'

class Routes extends Component {
	static propTypes = {
		loading: PropTypes.bool,
		ws: PropTypes.object,
	}

	render() {
		if (this.props.loading || !this.props.ws)
			return (
				<PageHero>
					<PageHero.Body>
						<BrickLoader />
					</PageHero.Body>
				</PageHero>
			)

		return (
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/gallery" component={Gallery} />
				<Route exact path="/contact" component={Contact} />
				<Route exact path="/login" component={Login} />

				<PrivateRoute path="/meetings" component={MeetingsRoutes} />

				<Route path="*" component={NotFound} />
			</Switch>
		)
	}
}

const mapStateToProps = (state) => ({
	loading: state.data.cms.loading,
	ws: state.meetings.ws,
})

export default connect(mapStateToProps, null)(Routes)
