import React, { Component } from 'react'
import '../assets/css/main.css'

import { BrowserRouter as Router } from 'react-router-dom'

import Header from '../containers/Header';
import Footer from '../containers/Footer';
import Routes from './Routes'

class App extends Component {
	render() {
		return (
			<Router>
				<Header />

				<Routes />

				<Footer />
			</Router>
		);
	}
}

export default App;
