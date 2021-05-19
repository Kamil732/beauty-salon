import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Footer extends Component {
	render() {
		return (
			<div className="footer">
				Copyright &copy; {new Date().getFullYear()} <br />
				<span className="text-broken">
					Sounds from{' '}
					<a
						href="https://notificationsounds.com"
						className="slide-floor"
					>
						Notification Sounds
					</a>
				</span>{' '}
				<br />
				<Link to="/privacy-policy" className="slide-floor">
					Privacy & policy
				</Link>{' '}
				<br />
				<Link to="/terms-of-use" className="slide-floor">
					Terms Of Use
				</Link>
			</div>
		)
	}
}

export default Footer
