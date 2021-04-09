import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function Button({
	children,
	to,
	primary,
	secondary,
	danger,
	loading,
	small,
	center,
	loadingText,
	...props
}) {
	if (to) {
		return (
			<Link
				to={to}
				className={`btn${primary ? ' btn__primary' : ''}${
					secondary ? ' btn__secondary' : ''
				}${danger ? ' btn__danger' : ''}${
					loading ? ' btn__loading' : ''
				}${to ? ' btn__link' : ''}${small ? ' btn__small' : ''}${
					center ? ' center' : ''
				}`}
				disabled={loading}
				{...props}
			>
				{loading && loadingText ? loadingText : children}
			</Link>
		)
	}

	return (
		<button
			className={`btn${primary ? ' btn__primary' : ''}${
				secondary ? ' btn__secondary' : ''
			}${danger ? ' btn__danger' : ''}${loading ? ' btn__loading' : ''}${
				to ? ' btn__link' : ''
			}${small ? ' btn__small' : ''}${center ? ' center' : ''}`}
			disabled={loading}
			{...props}
		>
			{loading && loadingText ? loadingText : children}
		</button>
	)
}

Button.prototype.propTypes = {
	loading: PropTypes.bool,
	loadingText: PropTypes.string,
	primary: PropTypes.bool,
	secondary: PropTypes.bool,
	danger: PropTypes.bool,
	small: PropTypes.bool,
	center: PropTypes.bool,
	to: PropTypes.string,
}

export default Button
