import React, { useEffect, useRef, useState } from 'react'

function LeftSideNav({ children, ...props }) {
	return (
		<div className="left-side-nav" {...props}>
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
		<>
			<button
				className="left-side-nav__open-btn"
				onClick={() => setIsOpen(true)}
			>
				panel
			</button>

			<div
				className={`left-side-nav__menu${isOpen ? ' open' : ''}`}
				ref={container}
				{...props}
			>
				{children}
			</div>
		</>
	)
}

function Nav({ children, ...props }) {
	return (
		<div className="left-side-nav__nav" {...props}>
			{children}
		</div>
	)
}

function Body({ children, ...props }) {
	return (
		<div className="left-side-nav__body" {...props}>
			{children}
		</div>
	)
}

LeftSideNav.Menu = Menu
LeftSideNav.Nav = Nav
LeftSideNav.Body = Body

export default LeftSideNav
