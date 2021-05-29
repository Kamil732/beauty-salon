import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Redirect, Switch } from 'react-router-dom'
import PrivateRoute from '../../common/PrivateRoute'

import Dashboard from '../../layout/Dashboard'
import Calendar from '../../components/meetings/calendar/Calendar'
import Settings from './dashboard/Settings'

import CalendarMenu from './dashboard/menu/CalendarMenu'
import SettingsMenu from './dashboard/menu/SettingsMenu'

import { FaCalendarAlt, FaChartPie, FaListAlt } from 'react-icons/fa'
import { IoChatbubbles, IoSettingsSharp } from 'react-icons/io5'
import { ImUsers } from 'react-icons/im'

function Panel() {
	const [isMenuOpen, toggleMenu] = useState(false)
	const navContainer = useRef(null)

	useEffect(() => {
		const body = document.querySelector('body')
		body.style.overflow = 'hidden'

		return () => {
			body.style.overflow = 'auto'
		}
	}, [])

	return (
		<Dashboard>
			<div ref={navContainer} style={{ display: 'inherit' }}>
				<Dashboard.Nav>
					<Dashboard.MenuToggleBtn
						isOpen={isMenuOpen}
						toggleMenu={() => toggleMenu(!isMenuOpen)}
					>
						MENU
					</Dashboard.MenuToggleBtn>
					<NavLink
						to={process.env.REACT_APP_PANEL_CALENDAR_URL}
						className="dashboard__btn"
					>
						<span className="dashboard__btn__icon">
							<FaCalendarAlt />
						</span>
						Kalendarz
					</NavLink>
					<NavLink
						to={process.env.REACT_APP_PANEL_CUSTOMERS_URL}
						className="dashboard__btn"
					>
						<span className="dashboard__btn__icon">
							<ImUsers />
						</span>
						Klienci
					</NavLink>
					<NavLink
						to={process.env.REACT_APP_PANEL_STATISTICS_URL}
						className="dashboard__btn"
					>
						<span className="dashboard__btn__icon">
							<FaChartPie />
						</span>
						Statystki
					</NavLink>
					<NavLink
						to={process.env.REACT_APP_PANEL_COMMUNICATION_URL}
						className="dashboard__btn"
					>
						<span className="dashboard__btn__icon">
							<IoChatbubbles />
						</span>
						Łączność
					</NavLink>
					<NavLink
						to={process.env.REACT_APP_PANEL_SERVICES_URL}
						className="dashboard__btn"
					>
						<span className="dashboard__btn__icon">
							<FaListAlt />
						</span>
						Usługi
					</NavLink>
					<NavLink
						to={process.env.REACT_APP_PANEL_SETTINGS_URL}
						className="dashboard__btn"
					>
						<span className="dashboard__btn__icon">
							<IoSettingsSharp />
						</span>
						Ustawienia
					</NavLink>
				</Dashboard.Nav>

				<Dashboard.Menu
					isOpen={isMenuOpen}
					toggleMenu={(state) => toggleMenu(state)}
					navContainer={navContainer}
				>
					<Switch>
						<PrivateRoute
							exact
							path={process.env.REACT_APP_PANEL_CALENDAR_URL}
							component={CalendarMenu}
						/>
						<PrivateRoute
							exact
							path={process.env.REACT_APP_PANEL_SETTINGS_URL}
							component={SettingsMenu}
						/>
					</Switch>
				</Dashboard.Menu>
			</div>

			<Dashboard.Body>
				<Switch>
					<PrivateRoute
						exact
						path={process.env.REACT_APP_PANEL_CALENDAR_URL}
						component={() => <Calendar isAdminPanel />}
					/>
					<PrivateRoute
						exact
						path={process.env.REACT_APP_PANEL_SETTINGS_URL}
						component={Settings}
					/>

					<Redirect to={process.env.REACT_APP_PANEL_CALENDAR_URL} />
				</Switch>
			</Dashboard.Body>
		</Dashboard>
	)
}

export default Panel
