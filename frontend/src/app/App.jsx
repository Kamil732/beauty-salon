import React, { useEffect } from 'react'
import 'react-notifications/lib/notifications.css'
import 'aos/dist/aos.css'
import '../assets/css/main.css'
import notifySound from '../assets/sounds/pristine-609.mp3'

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
import { connectMeetingWS } from '../redux/actions/meetings'

function App() {
	useEffect(() => {
		const getDatas = async () => {
			await store.dispatch(getCMSData())
			await store.dispatch(loadUser())
			await store.dispatch(connectMeetingWS())

			AOS.init({
				duration: 500,
				once: true,
			})
		}

		getDatas()

		// return () => window.location.reload()
	}, [])

	return (
		<Provider store={store}>
			<Router>
				<Header />

				<div className="content-wrap">
					<NotificationContainer />

					<audio id="audio">
						<source src={notifySound}></source>
					</audio>

					<Routes />
				</div>

				<Footer />
			</Router>
		</Provider>
	)
}

export default App
