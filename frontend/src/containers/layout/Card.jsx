import React from 'react'

function Card({ children }) {
	return <div className="card">{children}</div>
}

function Body({ children }) {
	return <div className="card__body">{children}</div>
}

Card.Body = Body

export default Card
