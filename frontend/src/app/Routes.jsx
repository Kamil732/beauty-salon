import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'

import Login from '../containers/auth/Login'
import Contact from '../containers/Contact'
import Gallery from '../containers/Gallery'
import Home from '../containers/Home'

import NotFound from '../containers/NotFound'
import { connect } from 'react-redux'
import BrickLoader from '../layout/loaders/BrickLoader'
import PageHero from '../layout/PageHero'
import PrivateRoute from '../common/PrivateRoute'
import PrivacyPolicy from '../containers/PrivacyPolicy'
import TermsOfUse from '../containers/TermsOfUse'
import Panel from '../containers/meetings/Panel'
import MyMeetings from '../containers/meetings/MyMeetings'

class Routes extends Component {
	static propTypes = {
		isAdmin: PropTypes.bool,
		loadingCMSData: PropTypes.bool,
		ws: PropTypes.object,
	}

	render() {
		const { loadingCMSData, ws } = this.props

		if (loadingCMSData || !ws)
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
				<Route
					exact
					path={process.env.REACT_APP_PRIVACY_POLICY_URL}
					component={PrivacyPolicy}
				/>
				<Route
					exact
					path={process.env.REACT_APP_TERMS_OF_USE_URL}
					component={TermsOfUse}
				/>
				<Route
					exact
					path={process.env.REACT_APP_GALLERY_URL}
					component={Gallery}
				/>
				<Route
					exact
					path={process.env.REACT_APP_CONTACT_URL}
					component={Contact}
				/>
				<Route
					exact
					path={process.env.REACT_APP_LOGIN_URL}
					component={Login}
				/>

				<PrivateRoute
					path={process.env.REACT_APP_PANEL_URL}
					component={this.props.isAdmin ? Panel : MyMeetings}
				/>

				<Route path="*" component={NotFound} />
			</Switch>
		)
	}
}

const mapStateToProps = (state) => ({
	isAdmin: state.auth.data.is_admin,
	loadingCMSData: state.data.cms.loading,
	ws: state.meetings.ws,
})

export default connect(mapStateToProps, null)(Routes)
