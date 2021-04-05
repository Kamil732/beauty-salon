import React from 'react'

function CardContainer(props) {
	return (
		<div
			className={`card-container${props.vertical ? ' vertical' : ''}`}
			{...props}
		/>
	)
}

export default CardContainer
