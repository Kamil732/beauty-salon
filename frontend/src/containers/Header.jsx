import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import logo from '../assets/images/logo.png'

import { getNotifications } from '../redux/actions/data'

import { default as NavigationMenu } from '../components/navigation/Menu'
import { IoMdMegaphone, IoMdNotifications } from 'react-icons/io'
import Dropdown from '../layout/buttons/Dropdown'
import { CloseButton } from '../layout/buttons/Button'

class Header extends Component {
	static propTypes = {
		message: PropTypes.string,
		isAuthenticated: PropTypes.bool,
		notificationLoading: PropTypes.bool,
		notifications: PropTypes.array,
		unReadNotificationsAmount: PropTypes.number,
		getNotifications: PropTypes.func.isRequired,
	}

	state = {
		isNavActive: false,
	}

	render() {
		const {
			message,
			isAuthenticated,
			getNotifications,
			notifications,
			unReadNotificationsAmount,
			notificationLoading,
		} = this.props
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

						{window.innerWidth <= 768 && isAuthenticated && (
							<Dropdown
								btnContent={<IoMdNotifications size={25} />}
								rounded
								loading={notificationLoading}
								loadItems={getNotifications}
								items={notifications}
								unReadItems={unReadNotificationsAmount}
								noItemsContent={
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
											height: '100%',
										}}
									>
										<IoMdMegaphone fontSize="100" />
										<h3 style={{ textAlign: 'center' }}>
											Nie masz żadnych powiadomień
										</h3>
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
						<span className="d-md">
							<CloseButton
								onClick={() =>
									this.setState({ isNavActive: false })
								}
							/>
						</span>

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
	message: state.data.cms.data.message,
	notificationLoading: state.data.notifications.loading,
	notifications: state.data.notifications.data,
	unReadNotificationsAmount: state.data.notifications.unRead,
	isAuthenticated: state.auth.isAuthenticated,
})

const mapDispatchToProps = {
	getNotifications,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
