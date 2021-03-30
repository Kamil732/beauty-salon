import React from 'react'
import PropTypes from 'prop-types'

function PageHero({ children }) {
	return <div className="page-hero">{children}</div>
}

function Body({ children }) {
	return <div className="page-hero__body">{children}</div>
}

function Content({ children }) {
	return <div className="page-hero__content">{children}</div>
}

function Img(props) {
	if (props.children)
		return (
			<div className="page-hero__img-container">
				<img
					src={props.src}
					alt={props.alt ? props.alt : ''}
					className="page-hero__img"
				/>
				{props.children}
			</div>
		)
	return (
		<img
			src={props.src}
			alt={props.alt ? props.alt : ''}
			className="page-hero__img"
		/>
	)
}

function Title({ children }) {
	return <div className="page-hero__title">{children}</div>
}

function Text({ children }) {
	return <div className="page-hero__text">{children}</div>
}

Img.prototype.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
}

PageHero.Body = Body
PageHero.Content = Content
PageHero.Img = Img
PageHero.Title = Title
PageHero.Text = Text

export default PageHero
