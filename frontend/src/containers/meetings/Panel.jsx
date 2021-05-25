import React from 'react'
import { NavLink } from 'react-router-dom'
import Calendar from '../../components/meetings/calendar/Calendar'
import LeftSideNav from '../../layout/LeftSideNav'

import { FaCalendarAlt, FaChartPie } from 'react-icons/fa'
import { IoChatbubbles, IoSettingsSharp } from 'react-icons/io5'
import { ImUsers } from 'react-icons/im'

function Panel() {
	return (
		<LeftSideNav>
			<LeftSideNav.Menu>
				<LeftSideNav.Nav>
					<NavLink
						to={process.env.REACT_APP_CALENDAR_URL}
						className="left-side-nav__btn"
					>
						<span className="left-side-nav__btn__icon">
							<FaCalendarAlt />
						</span>
						Kalendarz
					</NavLink>
					<NavLink
						to={process.env.REACT_APP_CALENDAR_CUSTOMERS_URL}
						className="left-side-nav__btn"
					>
						<span className="left-side-nav__btn__icon">
							<ImUsers />
						</span>
						Klienci
					</NavLink>
					<NavLink
						to={process.env.REACT_APP_CALENDAR_STATISTICS_URL}
						className="left-side-nav__btn"
					>
						<span className="left-side-nav__btn__icon">
							<FaChartPie />
						</span>
						Statystki
					</NavLink>
					<NavLink
						to={process.env.REACT_APP_CALENDAR_COMMUNICATION_URL}
						className="left-side-nav__btn"
					>
						<span className="left-side-nav__btn__icon">
							<IoChatbubbles />
						</span>
						Komunikacja
					</NavLink>
					<NavLink
						to={process.env.REACT_APP_CALENDAR_SERVICES_URL}
						className="left-side-nav__btn"
					>
						<span className="left-side-nav__btn__icon">
							<FaCalendarAlt />
						</span>
						Usługi
					</NavLink>
					<NavLink
						to={process.env.REACT_APP_CALENDAR_SETTINGS_URL}
						className="left-side-nav__btn"
					>
						<span className="left-side-nav__btn__icon">
							<IoSettingsSharp />
						</span>
						Ustawienia
					</NavLink>
				</LeftSideNav.Nav>
			</LeftSideNav.Menu>

			<LeftSideNav.Body>
				<Calendar isAdminPanel />
			</LeftSideNav.Body>
		</LeftSideNav>
	)
}

export default Panel
