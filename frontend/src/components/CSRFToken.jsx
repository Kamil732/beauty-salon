import React, { Component } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

class CSRFToken extends Component {
	state = {
		csrftoken: '',
	}

	componentDidMount = async () => {
		try {
			await axios.get(
				`${process.env.REACT_APP_API_URL}/accounts/csrf_cookie/`
			)

			this.setState({ csrftoken: Cookies.get('csrftoken') })
		} catch (err) {
			console.error(err)
		}
	}

	render() {
		const { csrftoken } = this.state

		return (
			<input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
		)
	}
}

export default CSRFToken
