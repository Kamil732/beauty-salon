import React, { useEffect, useRef, useState } from 'react'

import { RiMenuUnfoldFill } from 'react-icons/ri'
import Button from './buttons/Button'

function Dashboard({ children, ...props }) {
	return (
		<div className="dashboard" {...props}>
			{children}
		</div>
	)
}

function Menu({ children, navContainer, isOpen, toggleMenu, ...props }) {
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				navContainer.current &&
				!navContainer.current.contains(e.target)
			)
				toggleMenu(false)
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen, toggleMenu, navContainer])

	return (
		<div className={`dashboard__menu${isOpen ? ' open' : ''}`} {...props}>
			{children}
		</div>
	)
}

function MenuToggleBtn({ children, isOpen, toggleMenu, ...props }) {
	return (
		<div
			className={`dashboard__btn dashboard__btn-open${
				isOpen ? ' active' : ''
			}`}
			onClick={() => toggleMenu()}
		>
			<span className="dashboard__btn__icon" {...props}>
				<RiMenuUnfoldFill />
			</span>
			{children}
		</div>
	)
}

function Nav({ children, ...props }) {
	return (
		<div className="dashboard__nav" {...props}>
			{children}
		</div>
	)
}

function Body({ children, ...props }) {
	return (
		<div className="dashboard__body" {...props}>
			{children}
		</div>
	)
}

Dashboard.Menu = Menu
Dashboard.MenuToggleBtn = MenuToggleBtn
Dashboard.Nav = Nav
Dashboard.Body = Body

export default Dashboard
