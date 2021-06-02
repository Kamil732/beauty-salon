import React, { lazy, useEffect, useRef, useState, Suspense } from 'react'
import { NavLink, Redirect, Switch } from 'react-router-dom'
import PrivateRoute from '../../common/PrivateRoute'

import { FaCalendarAlt, FaChartPie, FaListAlt } from 'react-icons/fa'
import { IoChatbubbles, IoSettingsSharp } from 'react-icons/io5'
import { ImUsers } from 'react-icons/im'

import ErrorBoundary from '../../components/ErrorBoundary'
import CircleLoader from '../../layout/loaders/CircleLoader'
import Dashboard from '../../layout/Dashboard'

const Calendar = lazy(() =>
	import('../../components/meetings/calendar/Calendar')
)
const Settings = lazy(() => import('./dashboard/Settings'))
const CalendarMenu = lazy(() => import('./dashboard/menu/CalendarMenu'))
const SettingsMenu = lazy(() => import('./dashboard/menu/SettingsMenu'))

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
					<ErrorBoundary>
						<Suspense fallback={<CircleLoader />}>
							<Switch>
								<PrivateRoute
									exact
									path={
										process.env.REACT_APP_PANEL_CALENDAR_URL
									}
									component={CalendarMenu}
								/>
								<PrivateRoute
									exact
									path={
										process.env.REACT_APP_PANEL_SETTINGS_URL
									}
									component={SettingsMenu}
								/>
							</Switch>
						</Suspense>
					</ErrorBoundary>
				</Dashboard.Menu>
			</div>

			<Dashboard.Body>
				<ErrorBoundary>
					<Suspense fallback={<CircleLoader />}>
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

							<Redirect
								to={process.env.REACT_APP_PANEL_CALENDAR_URL}
							/>
						</Switch>
					</Suspense>
				</ErrorBoundary>
			</Dashboard.Body>
		</Dashboard>
	)
}

export default Panel
