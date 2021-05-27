import React from 'react'
import { NavLink, Redirect, Switch } from 'react-router-dom'
import Calendar from '../../components/meetings/calendar/Calendar'
import Dashboard from '../../layout/Dashboard'

import CalendarMenu from './dashboard/menu/CalendarMenu'
import SettingsMenu from './dashboard/menu/SettingsMenu'
import Settings from './dashboard/Settings'

import { FaCalendarAlt, FaChartPie } from 'react-icons/fa'
import { IoChatbubbles, IoSettingsSharp } from 'react-icons/io5'
import { ImUsers } from 'react-icons/im'
import PrivateRoute from '../../common/PrivateRoute'

function Panel() {
	return (
		<Dashboard>
			<Dashboard.Nav>
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
					Komunikacja
				</NavLink>
				<NavLink
					to={process.env.REACT_APP_PANEL_SERVICES_URL}
					className="dashboard__btn"
				>
					<span className="dashboard__btn__icon">
						<FaCalendarAlt />
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

			<Dashboard.Menu>
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
