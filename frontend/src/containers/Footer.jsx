import React, { Component } from 'react'

class Footer extends Component {
	render() {
		return (
			<div className="footer">
				Copyright &copy; 2021
				<span className="text-broken">
					Sounds from{' '}
					<a href="https://notificationsounds.com">
						Notification Sounds
					</a>
				</span>
			</div>
		)
	}
}

export default Footer
