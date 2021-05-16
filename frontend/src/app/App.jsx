import React, { Component } from 'react'
import 'react-notifications/lib/notifications.css'
import 'aos/dist/aos.css'
import '../assets/css/main.css'

import { BrowserRouter as Router } from 'react-router-dom'

import AOS from 'aos'
import Header from '../containers/Header'
import Footer from '../containers/Footer'
import Routes from './Routes'
import { NotificationContainer } from 'react-notifications'

import { Provider } from 'react-redux'
import store from '../redux/store'
import { loadUser } from '../redux/actions/auth'
import { getCMSData } from '../redux/actions/data'
import { connectWebSocket } from '../redux/actions/meetings'

class App extends Component {
	componentDidMount() {
		store.dispatch(getCMSData())
		store.dispatch(loadUser())
		store.dispatch(connectWebSocket())

		AOS.init({
			duration: 500,
			once: true,
		})
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
