import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import logo from '../assets/images/logo.png'

import {
	connectNotificationWS,
	getNotifications,
	getUnreadNotificationsAmount,
	markNotificationAsRead,
} from '../redux/actions/data'

import { default as NavigationMenu } from '../components/navigation/Menu'
import { IoMdNotifications } from 'react-icons/io'
import { GoMegaphone } from 'react-icons/go'
import Dropdown from '../layout/buttons/Dropdown'
import { CloseButton } from '../layout/buttons/Button'
import { useEffect } from 'react'

function Header({
	message,
	ws,
	loadingCMSData,
	isAuthenticated,
	getUnreadNotificationsAmount,
	getNotifications,
	markNotificationAsRead,
	notifications,
	unReadNotificationsAmount,
	notificationLoading,
	notificationLoaded,
	connectNotificationWS,
	isDashboardMode,
	...props
}) {
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		if (isAuthenticated && unReadNotificationsAmount === null)
			getUnreadNotificationsAmount()
	}, [
		isAuthenticated,
		getUnreadNotificationsAmount,
		unReadNotificationsAmount,
	])

	useEffect(() => {
		if (isAuthenticated && !ws) connectNotificationWS()
	}, [isAuthenticated, ws, connectNotificationWS])

	useEffect(() => {
		const body = document.querySelector('body')

		body.style.overflow = isOpen ? 'hidden' : 'auto'
	}, [isOpen])

	if (loadingCMSData) return null

	return (
		<>
			<div
				className={`header${isDashboardMode ? ' dashboard-mode' : ''}`}
				{...props}
			>
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
							loaded={notificationLoaded}
							loadItems={getNotifications}
							items={notifications}
							unReadItems={unReadNotificationsAmount}
							markRead={markNotificationAsRead}
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
									<GoMegaphone fontSize="100" />
									<h3 style={{ textAlign: 'center' }}>
										Nie masz żadnych powiadomień
									</h3>
								</div>
							}
						/>
					)}

					<div className="nav-btn" onClick={() => setIsOpen(true)}>
						<span className="nav-btn__burger"></span>
						MENU
					</div>
				</div>

				{isOpen && (
					<div
						className="dark-bg"
						onClick={() => setIsOpen(false)}
					></div>
				)}

				<nav className={`nav${isOpen ? ' active' : ''}`}>
					<span className="d-md">
						<CloseButton onClick={() => setIsOpen(false)} />
					</span>

					<NavigationMenu
						closeNavigation={() =>
							setTimeout(() => setIsOpen(false), 300)
						}
					/>
				</nav>
			</div>

			{message ? <p className="global-message">{message}</p> : null}
		</>
	)
}

Header.prototype.propTypes = {
	isDashboardMode: PropTypes.bool,
	message: PropTypes.string,
	ws: PropTypes.object,
	loadingCMSData: PropTypes.bool,
	isAuthenticated: PropTypes.bool,
	notificationLoading: PropTypes.bool,
	notificationLoaded: PropTypes.bool,
	notifications: PropTypes.array,
	unReadNotificationsAmount: PropTypes.number,
	getUnreadNotificationsAmount: PropTypes.func.isRequired,
	getNotifications: PropTypes.func.isRequired,
	markNotificationAsRead: PropTypes.func.isRequired,
	connectNotificationWS: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	message: state.data.cms.data.message,
	ws: state.data.notifications.ws,
	loadingCMSData: state.data.cms.loading,
	notificationLoading: state.data.notifications.loading,
	notificationLoaded: state.data.notifications.loaded,
	notifications: state.data.notifications.data,
	unReadNotificationsAmount: state.data.notifications.unRead,
	isAuthenticated: state.auth.isAuthenticated,
})

const mapDispatchToProps = {
	connectNotificationWS,
	getUnreadNotificationsAmount,
	getNotifications,
	markNotificationAsRead,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
