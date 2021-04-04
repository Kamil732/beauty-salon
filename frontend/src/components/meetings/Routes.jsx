import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import PrivateRoute from '../../common/PrivateRoute'

import MyMeetings from '../../containers/meetings/MyMeetings'
import NotFound from '../../containers/NotFound'
import Panel from '../../containers/meetings/Panel'

class Routes extends Component {
	static propTypes = {
		isAdmin: PropTypes.bool,
	}

	render() {
		return (
			<Switch>
				<PrivateRoute
					exact
					path="/meetings/calendar"
					component={this.props.isAdmin ? Panel : MyMeetings}
				/>

				<Route path="*" component={NotFound} />
			</Switch>
		)
	}
}

const mapStateToProps = (state) => ({
	isAdmin: state.auth.data.is_admin,
})

export default connect(mapStateToProps)(Routes)
