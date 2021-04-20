import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function Button({
	children,
	to,
	primary,
	secondary,
	success,
	danger,
	loading,
	small,
	extraSmall,
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
				}${success ? ' btn__success' : ''}${
					danger ? ' btn__danger' : ''
				}${loading ? ' btn__loading' : ''}${to ? ' btn__link' : ''}${
					small ? ' btn__small' : ''
				}${extraSmall ? ' btn__extraSmall slide-floor' : ''}${
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
			}${success ? ' btn__success' : ''}${danger ? ' btn__danger' : ''}${
				loading ? ' btn__loading' : ''
			}${to ? ' btn__link' : ''}${small ? ' btn__small' : ''}${
				extraSmall ? ' btn__extraSmall slide-floor' : ''
			}${center ? ' center' : ''}`}
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
	success: PropTypes.bool,
	danger: PropTypes.bool,
	small: PropTypes.bool,
	extraSmall: PropTypes.bool,
	center: PropTypes.bool,
	to: PropTypes.string,
}

export default Button
