import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'

import { connect } from 'react-redux'
import BrickLoader from '../layout/loaders/BrickLoader'
import PageHero from '../layout/PageHero'
import PrivateRoute from '../common/PrivateRoute'

const NotFound = lazy(() => import('../containers/NotFound'))
const Login = lazy(() => import('../containers/auth/Login'))
const Contact = lazy(() => import('../containers/Contact'))
const Gallery = lazy(() => import('../containers/Gallery'))
const Home = lazy(() => import('../containers/Home'))
const PrivacyPolicy = lazy(() => import('../containers/PrivacyPolicy'))
const TermsOfUse = lazy(() => import('../containers/TermsOfUse'))
const Panel = lazy(() => import('../containers/meetings/Panel'))

class Routes extends Component {
	static propTypes = {
		loadingCMSData: PropTypes.bool,
	}

	render() {
		const { loadingCMSData } = this.props

		const loader = () => (
			<PageHero>
				<BrickLoader />
			</PageHero>
		)

		if (loadingCMSData) return loader()

		return (
			<Suspense fallback={loader()}>
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
						component={Panel}
					/>

					<Route path="*" component={NotFound} />
				</Switch>
			</Suspense>
		)
	}
}

const mapStateToProps = (state) => ({
	loadingCMSData: state.data.cms.loading,
})

export default connect(mapStateToProps, null)(Routes)
