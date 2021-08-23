import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import useIntersectionObserver from '../helpers/hooks/intersectionObserver'

function PageHero({ children, vertical, ...props }) {
	return (
		<div className={`page-hero${vertical ? ' vertical' : ''}`} {...props}>
			{children}
		</div>
	)
}

PageHero.prototype.propTypes = {
	vertical: PropTypes.bool,
}

function Content({ children, ...props }) {
	return (
		<div className="page-hero__content" {...props}>
			{children}
		</div>
	)
}

function Img({ src, alt, ...props }) {
	return (
		<div className="page-hero__img-container" {...props}>
			<img
				src={src}
				alt={alt ? alt : ''}
				className="page-hero__img"
				loading="lazy"
			/>

			{props.children}
		</div>
	)
}

Img.prototype.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
}

function Title({ children, ...props }) {
	return (
		<div className="page-hero__title" {...props}>
			{children}
		</div>
	)
}

function Text({ children, ...props }) {
	return (
		<div className="page-hero__text" {...props}>
			{children}
		</div>
	)
}

PageHero.Content = Content
PageHero.Img = Img
PageHero.Title = Title
PageHero.Text = Text

export default PageHero
