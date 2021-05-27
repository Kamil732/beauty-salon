import React from 'react'

import { RiBarChartHorizontalFill } from 'react-icons/ri'
import { FaDatabase, FaCalendarAlt, FaIdCardAlt } from 'react-icons/fa'
import { ImUsers } from 'react-icons/im'
import { IoChatbubbles, IoCard } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'

function CalendarMenu() {
	return (
		<div className="nav-menu">
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_WORK_HOURS_URL}
				className="nav-menu__item"
			>
				<span className="icon">
					<RiBarChartHorizontalFill />
				</span>
				Grafiki pracy
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_SALON_DATA_URL}
				className="nav-menu__item"
			>
				<span className="icon">
					<FaDatabase />
				</span>
				Dane solonu
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_CALENDAR_URL}
				className="nav-menu__item"
			>
				<span className="icon">
					<FaCalendarAlt />
				</span>
				Kalendarz
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_WORKERS_URL}
				className="nav-menu__item"
			>
				<span className="icon">
					<FaIdCardAlt />
				</span>
				Pracownicy
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_CUSTOMERS_URL}
				className="nav-menu__item"
			>
				<span className="icon">
					<ImUsers />
				</span>
				Klienci
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_COMMUNICATION_URL}
				className="nav-menu__item"
			>
				<span className="icon">
					<IoChatbubbles />
				</span>
				Komunikacja
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_PAYMENT_URL}
				className="nav-menu__item"
			>
				<span className="icon">
					<IoCard />
				</span>
				Płatności
			</NavLink>
		</div>
	)
}

export default CalendarMenu
