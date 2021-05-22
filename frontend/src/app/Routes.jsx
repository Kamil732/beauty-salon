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
import PrivacyPolicy from '../containers/PrivacyPolicy'
import TermsOfUse from '../containers/TermsOfUse'

class Routes extends Component {
	static propTypes = {
		loading: PropTypes.bool,
		ws: PropTypes.object,
	}

	render() {
		const { loading, ws } = this.props

		if (loading || !ws)
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
				<Route exact path="/privacy-policy" component={PrivacyPolicy} />
				<Route exact path="/terms-of-use" component={TermsOfUse} />
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
