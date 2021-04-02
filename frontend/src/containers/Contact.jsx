import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ContactIllustration from '../assets/images/contact-illustration.svg'

import PageHero from '../layout/PageHero'

class Contact extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool,
	}

	render() {
		return (
			<PageHero>
				<PageHero.Body>
					<PageHero.Img src={ContactIllustration} />

					<PageHero.Content>
						<PageHero.Title>Skontaktuj się z nami</PageHero.Title>
						<PageHero.Text>
							Jeśli chcesz dowiedzić się więcej na temat naszego
							salonu fryzjerskiego lub umówić swoją pierwszą
							wizytę, możesz zadzwonic na poniższy numer telefonu.
						</PageHero.Text>
						<a href="tel:+48-500-484-315" className="unique-text">
							+48 500 484 315
						</a>
						<PageHero.Text>
							Stali klienci mają opcję komunikatora tekstowego, są
							również przez niego powiadamiani o nadchodzącej
							wizycie
						</PageHero.Text>
					</PageHero.Content>
				</PageHero.Body>
				<PageHero.Body>
					<PageHero.Content>
						<PageHero.Title>Lokalizacja</PageHero.Title>
						<PageHero.Text>
							Nasz salon fryzjerski znajdziesz pod adresem:
						</PageHero.Text>
						<span className="unique-text" style={{ width: '100%' }}>
							Stefana Żeromskiego 60, 26-680 Wierzbica
						</span>
					</PageHero.Content>
					<div style={{ textAlign: 'center' }}>
						<iframe
							title="map"
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d371.25592612718344!2d21.070607758719838!3d51.246661846651435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471843ae043f723d%3A0x822ca4d3514898!2sSALON%20FRYZJERSKI%20DAMIAN%20KWIECIE%C5%83!5e0!3m2!1spl!2spl!4v1617379006232!5m2!1spl!2spl"
							height="300"
							allowfullscreen=""
							loading="lazy"
						></iframe>
					</div>
				</PageHero.Body>
			</PageHero>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, null)(Contact)
