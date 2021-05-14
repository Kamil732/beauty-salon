import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import logo from '../assets/images/logo.png'

import { getNotifications } from '../redux/actions/data'

import { default as NavigationMenu } from '../components/navigation/Menu'
import { IoMdMegaphone, IoMdNotifications } from 'react-icons/io'
import Button from '../layout/buttons/Button'
import Dropdown from '../layout/buttons/Dropdown'

class Header extends Component {
	static propTypes = {
		message: PropTypes.string,
		isAuthenticated: PropTypes.bool,
		notifications: PropTypes.array,
		getNotifications: PropTypes.func.isRequired,
	}

	state = {
		isNavActive: false,
	}

	render() {
		const { message, isAuthenticated, getNotifications, notifications } =
			this.props
		const { isNavActive } = this.state

		return (
			<>
				<div className="header">
					<div className="mobile-nav">
						<Link to="/">
							<img
								src={logo}
								className="header__logo"
								alt="Damian Kwiecień"
							/>
						</Link>

						{window.innerWidth <= 1024 && isAuthenticated && (
							<Dropdown
								btnContent={<IoMdNotifications size={25} />}
								rounded
								loadItems={getNotifications}
								items={notifications}
								noItemsContent={
									<div style={{ textAlign: 'center' }}>
										<IoMdMegaphone fontSize="80" />
										<h3>Nie masz żadnych powiadomień</h3>
									</div>
								}
							/>
						)}

						<div
							className="nav-btn"
							onClick={() => this.setState({ isNavActive: true })}
						>
							<span className="nav-btn__burger"></span>
							MENU
						</div>
					</div>

					{isNavActive ? (
						<div
							className="dark-bg"
							onClick={() =>
								this.setState({ isNavActive: false })
							}
						></div>
					) : null}

					<nav className={`nav${isNavActive ? ' active' : ''}`}>
						<span
							className="btn-close d-md"
							onClick={() =>
								this.setState({ isNavActive: false })
							}
						></span>

						<NavigationMenu
							closeNavigation={() =>
								setTimeout(
									() => this.setState({ isNavActive: false }),
									300
								)
							}
						/>
					</nav>
				</div>

				{message ? <p className="global-message">{message}</p> : null}
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	message: state.data.data.message,
	notifications: state.data.notifications,
	isAuthenticated: state.auth.isAuthenticated,
})

const mapDispatchToProps = {
	getNotifications,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
