import React, { useEffect } from 'react'
import 'react-notifications/lib/notifications.css'
import 'aos/dist/aos.css'
import '../assets/css/main.css'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import AOS from 'aos'
import Header from '../containers/Header'
import Footer from '../containers/Footer'
import Routes from './Routes'
import { NotificationContainer } from 'react-notifications'

import { Provider } from 'react-redux'
import store from '../redux/store'
import { loadUser } from '../redux/actions/auth'
import { getCMSData } from '../redux/actions/data'

function App() {
	useEffect(() => {
		const getDatas = async () => {
			await store.dispatch(getCMSData())
			await store.dispatch(loadUser())

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
				<Switch>
					<Route path={process.env.REACT_APP_PANEL_URL}>
						<Header isDashboardMode />

						<NotificationContainer />

						<Routes />
					</Route>

					<>
						<Header />

						<div className="content-wrap">
							<NotificationContainer />

							<Routes />
						</div>

						<Footer />
					</>
				</Switch>
			</Router>
		</Provider>
	)
}

export default App
