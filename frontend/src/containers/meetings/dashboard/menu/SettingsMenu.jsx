import React from 'react'

import { RiBarChartHorizontalFill } from 'react-icons/ri'
import { FaDatabase, FaCalendarAlt, FaIdCardAlt } from 'react-icons/fa'
import { ImUsers } from 'react-icons/im'
import { GrResources } from 'react-icons/gr'
import { IoChatbubbles, IoCard } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'

function CalendarMenu() {
	return (
		<div className="select-menu">
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_WORK_HOURS_URL}
				className="select-menu__item icon-container"
			>
				<RiBarChartHorizontalFill className="icon-container__icon" />
				Grafiki pracy
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_SALON_DATA_URL}
				className="select-menu__item icon-container"
			>
				<FaDatabase className="icon-container__icon" />
				Dane solonu
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_CALENDAR_URL}
				className="select-menu__item icon-container"
			>
				<FaCalendarAlt className="icon-container__icon" />
				Kalendarz
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_WORKERS_URL}
				className="select-menu__item icon-container"
			>
				<FaIdCardAlt className="icon-container__icon" />
				Pracownicy
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_CUSTOMERS_URL}
				className="select-menu__item icon-container"
			>
				<ImUsers className="icon-container__icon" />
				Klienci
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_RESOURCES_URL}
				className="select-menu__item icon-container"
			>
				<GrResources className="icon-container__icon" />
				Zasoby
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_COMMUNICATION_URL}
				className="select-menu__item icon-container"
			>
				<IoChatbubbles className="icon-container__icon" />
				Komunikacja
			</NavLink>
			<NavLink
				to={process.env.REACT_APP_PANEL_SETTINGS_PAYMENT_URL}
				className="select-menu__item icon-container"
			>
				<IoCard className="icon-container__icon" />
				Płatności
			</NavLink>
		</div>
	)
}

export default CalendarMenu
