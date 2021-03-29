import React from 'react'
import PropTypes from 'prop-types'

function Card({ children }) {
	return <div className="card">{children}</div>
}

function Img({ src, alt }) {
	return <img className="card__img" src={src} alt={alt ? alt : ''} />
}

function Body({ children }) {
	return <div className="card__body">{children}</div>
}

Img.prototype.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
}

Card.Img = Img
Card.Body = Body

export default Card
