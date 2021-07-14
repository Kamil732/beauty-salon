import React from 'react'

function ButtonContainer(props) {
	return <div className="btn-container" {...props} />
}

function Group({ className, ...props }) {
	className = className ? ` ${className}` : ''

	return <div className={`btn-group-container${className}`} {...props} />
}

ButtonContainer.Group = Group

export default ButtonContainer
