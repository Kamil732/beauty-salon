import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
	getNotifications,
	markNotificationAsRead,
} from '../../redux/actions/data'

import { IoMdNotifications } from 'react-icons/io'
import { GoMegaphone } from 'react-icons/go'

import { logout } from '../../redux/actions/auth'
import { NavLink } from 'react-router-dom'
import Button from '../../layout/buttons/Button'
import DropdownSelect from '../../layout/buttons/dropdowns/DropdownSelect'
import ReactTooltip from 'react-tooltip'

function Menu({
	loading,
	isAuthenticated,
	isAdmin,
	notificationLoading,
	notificationLoaded,
	notifications,
	unReadNotificationsAmount,
	logout,
	closeNavigation,
	getNotifications,
	markNotificationAsRead,
}) {
	return (
		<>
			<NavLink
				exact
				to="/"
				className="nav__link"
				onClick={closeNavigation}
			>
				Home
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_CONTACT_URL}
				className="nav__link"
				onClick={closeNavigation}
			>
				Kontakt
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_GALLERY_URL}
				className="nav__link"
				onClick={closeNavigation}
				data-tip="Galeria"
				data-for="dark-tooltip"
			>
				Galeria
			</NavLink>
			{!loading ? (
				!isAuthenticated ? (
					<>
						<NavLink
							to={process.env.REACT_APP_LOGIN_URL}
							className="nav__link"
							onClick={closeNavigation}
						>
							Zaloguj się
						</NavLink>
					</>
				) : (
					<>
						{isAdmin ? (
							<NavLink
								to={process.env.REACT_APP_PANEL_URL}
								className="nav__link"
								onClick={closeNavigation}
							>
								Panel
							</NavLink>
						) : (
							<NavLink
								to={process.env.REACT_APP_PANEL_CALENDAR_URL}
								className="nav__link"
								onClick={closeNavigation}
							>
								Moje wizyty
							</NavLink>
						)}
						{window.innerWidth > 768 && (
							<>
								<DropdownSelect
									btnContent={
										<IoMdNotifications
											size={25}
											data-tip="Powiadomienia"
											data-for="dark-tooltip"
										/>
									}
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
									data-tip="Powiadomienia"
									data-for="notificationsTip"
								/>
								<ReactTooltip
									type="dark"
									place="bottom"
									id="notificationsTip"
									effect="solid"
								/>
							</>
						)}
						<Button
							onClick={() => {
								closeNavigation()
								logout()
							}}
							primary
							rounded
						>
							Wyloguj się
						</Button>
					</>
				)
			) : null}
		</>
	)
}

Menu.prototype.propTypes = {
	isAuthenticated: PropTypes.bool,
	loading: PropTypes.bool,
	isAdmin: PropTypes.bool,
	notificationLoading: PropTypes.bool,
	notificationLoaded: PropTypes.bool,
	notifications: PropTypes.array,
	unReadNotificationsAmount: PropTypes.number,
	logout: PropTypes.func.isRequired,
	closeNavigation: PropTypes.func.isRequired,
	getNotifications: PropTypes.func.isRequired,
	markNotificationAsRead: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	loading: state.auth.loading,
	isAdmin: state.auth.data.is_admin,
	notificationLoading: state.data.notifications.loading,
	notificationLoaded: state.data.notifications.loaded,
	notifications: state.data.notifications.data,
	unReadNotificationsAmount: state.data.notifications.unRead,
})

const mapDispatchToProps = {
	logout,
	getNotifications,
	markNotificationAsRead,
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
