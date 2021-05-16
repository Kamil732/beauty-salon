import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FaPhoneAlt } from 'react-icons/fa'
import { IoLocationSharp } from 'react-icons/io5'
import ContactIllustration from '../assets/images/contact-illustration.svg'

import PageHero from '../layout/PageHero'
import EditBox from '../layout/forms/EditBox'

class Contact extends Component {
	static propTypes = {
		isAdmin: PropTypes.bool,
		contact_title: PropTypes.string,
		contact_content: PropTypes.string,
		contact_content_second: PropTypes.string,
		phone_number: PropTypes.string,
		location: PropTypes.string,
		google_maps_url: PropTypes.string,
	}

	render() {
		const {
			isAdmin,
			contact_title,
			contact_content,
			contact_content_second,
			phone_number,
			location,
			google_maps_url,
		} = this.props

		return (
			<PageHero>
				<PageHero.Body data-aos="zoom-in-down">
					<PageHero.Img src={ContactIllustration} />

					<PageHero.Content>
						<PageHero.Title>
							<EditBox
								name="contact_title"
								value={contact_title}
								type="textarea"
							>
								{isAdmin && !contact_title
									? 'BRAK TREŚCI'
									: contact_title}
							</EditBox>
						</PageHero.Title>

						<PageHero.Text>
							<EditBox
								name="contact_content"
								value={contact_content}
								type="textarea"
							>
								{isAdmin && !contact_content
									? 'BRAK TREŚCI'
									: contact_content}
							</EditBox>
						</PageHero.Text>

						<EditBox
							name="phone_number"
							value={phone_number}
							regexValidation={
								/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/
							}
							validationErrorMessage="Nie poprawny numer telefonu"
						>
							{phone_number ? (
								<a
									href={`tel:${phone_number}`}
									className="unique-text icon-container"
								>
									<FaPhoneAlt className="icon-container__icon" />
									{phone_number}
								</a>
							) : isAdmin ? (
								<div className="unique-text icon-container">
									BRAK NUMERU TELEFONU
								</div>
							) : null}
						</EditBox>

						<PageHero.Text>
							<EditBox
								name="contact_content_second"
								value={contact_content_second}
								type="textarea"
							>
								{isAdmin && !contact_content_second
									? 'BRAK TREŚCI'
									: contact_content_second}
							</EditBox>
						</PageHero.Text>
					</PageHero.Content>
				</PageHero.Body>

				<PageHero.Body>
					<PageHero.Content data-aos="fade-right">
						<PageHero.Title>
							<div className="icon-container">
								<IoLocationSharp className="icon-container__icon" />
								Lokalizacja
							</div>
						</PageHero.Title>
						<PageHero.Text>
							Nasz salon fryzjerski znajdziesz pod adresem:
						</PageHero.Text>
						<span className="unique-text" style={{ width: '100%' }}>
							<EditBox name="location" value={location}>
								{location}
							</EditBox>
						</span>
					</PageHero.Content>
					<div style={{ textAlign: 'center' }} data-aos="fade-left">
						<EditBox
							name="google_maps_url"
							value={google_maps_url}
							type="url"
							regexValidation={
								/^(https|http):\/\/(www\.|)google\.[a-z]+\/maps/
							}
							validationErrorMessage="Link powinien prowadzić do map google"
						>
							<iframe
								title="map"
								src={google_maps_url}
								allowfullscreen
								loading="lazy"
								className="google_map"
							></iframe>
						</EditBox>
					</div>
				</PageHero.Body>
			</PageHero>
		)
	}
}

const mapStateToProps = (state) => ({
	isAdmin: state.auth.data.is_admin,

	contact_title: state.data.cms.data.contact_title || '',
	contact_content: state.data.cms.data.contact_content || '',
	contact_content_second: state.data.cms.data.contact_content_second || '',
	phone_number: state.data.cms.data.phone_number || '',
	location: state.data.cms.data.location || 'BRAK LOKALIZACJI',
	google_maps_url: state.data.cms.data.google_maps_url || '',
})

export default connect(mapStateToProps, null)(Contact)
