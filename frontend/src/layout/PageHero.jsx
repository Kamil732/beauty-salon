import React from 'react'
import PropTypes from 'prop-types'

function PageHero(props) {
	return (
		<div className="page-hero" {...props}>
			{props.children}
		</div>
	)
}

function Body(props) {
	return (
		<div
			className={`page-hero__body${props.vertical ? ' vertical' : ''}`}
			{...props}
		>
			{props.children}
		</div>
	)
}

function Content(props) {
	return (
		<div className="page-hero__content" {...props}>
			{props.children}
		</div>
	)
}

function Img(props) {
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
}

function Title(props) {
	return (
		<div className="page-hero__title" {...props}>
			{props.children}
		</div>
	)
}

function Text(props) {
	return (
		<div className="page-hero__text" {...props}>
			{props.children}
		</div>
	)
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
