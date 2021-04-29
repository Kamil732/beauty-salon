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
								name={process.env.REACT_APP_CONTACT_TITLE}
								value={contact_title}
								textarea
							>
								{isAdmin && !contact_title
									? 'BRAK TREŚCI'
									: contact_title}
							</EditBox>
						</PageHero.Title>

						<PageHero.Text>
							<EditBox
								name={process.env.REACT_APP_CONTACT_CONTENT}
								value={contact_content}
								textarea
							>
								{isAdmin && !contact_content
									? 'BRAK TREŚCI'
									: contact_content}
							</EditBox>
						</PageHero.Text>

						<EditBox
							name={process.env.REACT_APP_PHONE_NUMBER}
							value={phone_number}
						>
							{phone_number ? (
								<a
									href={`tel:+48-${phone_number}`}
									className="unique-text icon-container"
								>
									<FaPhoneAlt className="icon-container__icon" />
									+48 {phone_number}
								</a>
							) : isAdmin ? (
								<div className="unique-text icon-container">
									BRAK NUMERU TELEFONU
								</div>
							) : null}
						</EditBox>

						<PageHero.Text>
							<EditBox
								name={
									process.env.REACT_APP_CONTACT_CONTENT_SECOND
								}
								value={contact_content_second}
								textarea
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
							<EditBox
								name={process.env.REACT_APP_LOCATION}
								value={location}
							>
								{location}
							</EditBox>
						</span>
					</PageHero.Content>
					<div style={{ textAlign: 'center' }} data-aos="fade-left">
						<EditBox
							name={process.env.REACT_APP_GOOGLE_MAPS_URL}
							value={google_maps_url}
						>
							<iframe
								title="map"
								src={google_maps_url}
								height="300"
								allowfullscreen=""
								loading="lazy"
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

	contact_title: state.data.data[process.env.REACT_APP_CONTACT_TITLE] || '',
	contact_content:
		state.data.data[process.env.REACT_APP_CONTACT_CONTENT] || '',
	contact_content_second:
		state.data.data[process.env.REACT_APP_CONTACT_CONTENT_SECOND] || '',
	phone_number: state.data.data[process.env.REACT_APP_PHONE_NUMBER] || '',
	location:
		state.data.data[process.env.REACT_APP_LOCATION] || 'BRAK LOKALIZACJI',
	google_maps_url:
		state.data.data[process.env.REACT_APP_GOOGLE_MAPS_URL] || '',
})

export default connect(mapStateToProps, null)(Contact)
