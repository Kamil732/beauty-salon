import React from 'react'
import { Link } from 'react-router-dom'

function Button(props) {
	let classNames = 'btn'

	if (props.primary) classNames += ' btn__primary'
	if (props.secondary) classNames += ' btn__secondary'
	if (props.to) {
		classNames += ' btn__link'

		return (
			<Link to={props.to} className={classNames}>
				{props.children}
			</Link>
		)
	}

	return <button className={classNames}>{props.children}</button>
}

export default Button
