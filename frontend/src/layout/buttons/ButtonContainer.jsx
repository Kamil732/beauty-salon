import React from 'react'

function ButtonContainer(props) {
	return <div className="btn-container" {...props} />
}

function Group(props) {
	return <div className="btn-group-container" {...props} />
}

ButtonContainer.Group = Group

export default ButtonContainer
