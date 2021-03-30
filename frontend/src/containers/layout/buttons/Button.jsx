import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function Button(props) {
	if (props.to) {
		return (
			<Link
				to={props.to}
				className={`btn${props.primary ? ' btn__primary' : ''}${
					props.secondary ? ' btn__secondary' : ''
				}${props.loading ? ' btn__loading' : ''}${
					props.to ? ' btn__link' : ''
				}`}
				disabled={props.loading}
			>
				{props.loading && props.loadingText
					? props.loadingText
					: props.children}
			</Link>
		)
	}

	return (
		<button
			className={`btn${props.primary ? ' btn__primary' : ''}${
				props.secondary ? ' btn__secondary' : ''
			}${props.loading ? ' btn__loading' : ''}${
				props.to ? ' btn__link' : ''
			}`}
			disabled={props.loading}
		>
			{props.loading && props.loadingText
				? props.loadingText
				: props.children}
		</button>
	)
}

Button.prototype.propTypes = {
	loading: PropTypes.bool,
	primary: PropTypes.bool,
	secondary: PropTypes.bool,
	to: PropTypes.string,
}

export default Button
