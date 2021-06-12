import React, { useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'

function RootMenu({
	children,
	isHead,
	title,
	value,
	activeValue,
	onChange,
	...props
}) {
	const labelRef = useRef(null)

	useEffect(() => {
		if (
			!Boolean(ReactDOMServer.renderToStaticMarkup(children)) ||
			!labelRef.current
		)
			return

		// Check if there is active label in root
		// If so, then add class `active` to `ul` otherwise remove it

		labelRef.current.parentElement.innerHTML.includes(
			'root-menu__label active'
		)
			? labelRef.current.parentElement.children[1].classList.add('open')
			: labelRef.current.parentElement.children[1].classList.remove(
					'open'
			  )
	}, [activeValue, children, labelRef])

	const getInput = () => (
		<label
			className={`root-menu__label${
				activeValue === value ? ' active' : ''
			}`}
			ref={labelRef}
		>
			<input
				type="radio"
				name="root-menu"
				value={value}
				onChange={onChange}
				checked={activeValue === value}
			/>
			{title}
		</label>
	)

	return isHead ? (
		<div className="root-menu__container">
			<div className="root-menu head">
				{title && getInput()}

				<ul>{children}</ul>
			</div>
		</div>
	) : (
		<li className="root-menu" {...props}>
			{getInput()}

			{children && <ul>{children}</ul>}
		</li>
	)
}

RootMenu.prototype.propTypes = {
	title: PropTypes.string,
}

export default RootMenu
