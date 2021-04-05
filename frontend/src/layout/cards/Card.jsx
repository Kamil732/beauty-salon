import React from 'react'

function Card(props) {
	return <div className="card" {...props} />
}

function Title(props) {
	return <div className="card__title" {...props} />
}

function Body(props) {
	return <div className="card__body" {...props} />
}

Card.Title = Title
Card.Body = Body

export default Card
