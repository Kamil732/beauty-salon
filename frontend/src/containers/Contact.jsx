import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FaPhoneAlt } from 'react-icons/fa'
import { IoLocationSharp } from 'react-icons/io5'
import ContactIllustration from '../assets/images/contact-illustration.svg'

import PageHero from '../layout/PageHero'

class Contact extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool,
		contact_title: PropTypes.string,
		contact_content: PropTypes.string,
		contact_content_second: PropTypes.string,
		phone_number: PropTypes.string,
		location: PropTypes.string,
		google_maps_url: PropTypes.string,
	}

	render() {
		const {
			contact_title,
			contact_content,
			contact_content_second,
			phone_number,
			location,
			google_maps_url,
		} = this.props

		return (
			<PageHero>
				<PageHero.Body>
					<PageHero.Img src={ContactIllustration} />

					{contact_title ||
					contact_content ||
					contact_content_second ||
					phone_number ? (
						<PageHero.Content>
							{contact_title ? (
								<PageHero.Title>{contact_title}</PageHero.Title>
							) : null}
							{contact_content ? (
								<PageHero.Text>{contact_content}</PageHero.Text>
							) : null}

							{phone_number ? (
								<a
									href={`tel:+48-${phone_number}`}
									className="unique-text icon-container"
								>
									<FaPhoneAlt className="icon-container__icon" />
									+48 {phone_number}
								</a>
							) : null}
							{contact_content_second ? (
								<PageHero.Text>
									{contact_content_second}
								</PageHero.Text>
							) : null}
						</PageHero.Content>
					) : null}
				</PageHero.Body>
				{location ? (
					<PageHero.Body>
						<PageHero.Content>
							<PageHero.Title>
								<div className="icon-container">
									<IoLocationSharp className="icon-container__icon" />
									Lokalizacja
								</div>
							</PageHero.Title>
							<PageHero.Text>
								Nasz salon fryzjerski znajdziesz pod adresem:
							</PageHero.Text>
							<span
								className="unique-text"
								style={{ width: '100%' }}
							>
								{location}
							</span>
						</PageHero.Content>
						<div style={{ textAlign: 'center' }}>
							<iframe
								title="map"
								src={google_maps_url}
								height="300"
								allowfullscreen=""
								loading="lazy"
							></iframe>
						</div>
					</PageHero.Body>
				) : null}
			</PageHero>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	contact_title: state.data.data.contact_title,
	contact_content: state.data.data.contact_content,
	contact_content_second: state.data.data.contact_content_second,
	phone_number: state.data.data.phone_number,
	location: state.data.data.location,
	google_maps_url: state.data.data.google_maps_url,
})

export default connect(mapStateToProps, null)(Contact)
