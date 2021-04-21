import React, { Component } from 'react'
import '../assets/css/main.css'
import 'react-notifications/lib/notifications.css'

import { BrowserRouter as Router } from 'react-router-dom'

import Header from '../containers/Header'
import Footer from '../containers/Footer'
import Routes from './Routes'
import { NotificationContainer } from 'react-notifications'

import { Provider } from 'react-redux'
import store from '../redux/store'
import { loadUser } from '../redux/actions/auth'
import { getData } from '../redux/actions/data'
import { getMeetings, connectWebSocket } from '../redux/actions/meetings'

class App extends Component {
	componentDidMount() {
		store.dispatch(getData())
		store.dispatch(loadUser())
		store.dispatch(getMeetings())
		store.dispatch(connectWebSocket())
	}

	// componentDidCatch() {
	// 	window.location.reload()
	// }

	render() {
		return (
			<Provider store={store}>
				<Router>
					<Header />

					<div className="content-wrap">
						<NotificationContainer />
						<Routes />
					</div>

					<Footer />
				</Router>
			</Provider>
		)
	}
}

export default App
