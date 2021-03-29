import React from 'react'

function Button(props) {
	return (
		<button
			className={`btn${props.primary ? ' btn__primary' : ''} ${
				props.secondary ? ' btn__secondary' : ''
			}`}
		>
			{props.children}
		</button>
	)
}

export default Button
