import React, { useEffect, useRef, useState } from 'react'

function Dashboard({ children, ...props }) {
	return (
		<div className="dashboard" {...props}>
			{children}
		</div>
	)
}

function Menu({ children, ...props }) {
	const [isOpen, setIsOpen] = useState(false)
	const container = useRef(null)

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (container.current && !container.current.contains(e.target))
				setIsOpen(false)
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen])

	return (
		<div
			className={`dashboard__menu${isOpen ? ' open' : ''}`}
			ref={container}
			{...props}
		>
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
Dashboard.Nav = Nav
Dashboard.Body = Body

export default Dashboard
