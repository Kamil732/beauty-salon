import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FaPhoneAlt } from 'react-icons/fa'
import BarberIllustration from '../assets/images/barber-illustration.svg'
import TimeIllustration from '../assets/images/time-illustration.svg'
import PaymentIllustration from '../assets/images/payment-illustration.svg'
import AppointmentIllustration from '../assets/images/appointment-illustration.svg'

import ButtonContainer from '../layout/buttons/ButtonContainer'
import Button from '../layout/buttons/Button'
import PageHero from '../layout/PageHero'
import Calendar from '../components/meetings/calendar/Calendar'
import WorkHours from '../components/meetings/WorkHours'
import Card from '../layout/cards/Card'
import Pricing from '../components/meetings/Pricing'
import EditBox from '../layout/forms/EditBox'

function Home({
	isAdmin,
	home_title,
	home_content,
	phone_number,
	contact_content_second,
}) {
	return (
		<PageHero>
			<PageHero.Body data-aos="zoom-in">
				<PageHero.Content>
					<PageHero.Title>
						<EditBox
							name={process.env.REACT_APP_HOME_TITLE}
							value={home_title}
							textarea
						>
							{isAdmin && !home_title
								? 'BRAK TREŚCI'
								: home_title}
						</EditBox>
					</PageHero.Title>

					<PageHero.Text>
						<EditBox
							name={process.env.REACT_APP_HOME_CONTENT}
							value={home_content}
							textarea
						>
							{isAdmin && !home_content
								? 'BRAK TREŚCI'
								: home_content}
						</EditBox>
					</PageHero.Text>

					<ButtonContainer style={{ marginTop: '2rem' }}>
						<Button primary to="/my-meetings">
							Umów wizytę
						</Button>
						<Button secondary to="/contact">
							Kontakt
						</Button>
					</ButtonContainer>
				</PageHero.Content>

				<PageHero.Img src={BarberIllustration} />
			</PageHero.Body>

			<PageHero.Body>
				<PageHero.Img src={TimeIllustration} data-aos="fade-right" />
				<PageHero.Content data-aos="fade-left">
					<PageHero.Title>Godziny Pracy</PageHero.Title>
					<Card>
						<Card.Body>
							<div style={{ overflow: 'auto' }}>
								<WorkHours />
							</div>
						</Card.Body>
					</Card>
				</PageHero.Content>
			</PageHero.Body>

			<PageHero.Body
				data-aos="zoom-out-up"
				data-aos-anchor-placement="center-bottom"
			>
				<PageHero.Content>
					<PageHero.Title>Cennik</PageHero.Title>

					<Card>
						<Card.Body>
							<div style={{ overflow: 'auto' }}>
								<Pricing />
							</div>
						</Card.Body>
					</Card>
				</PageHero.Content>

				<PageHero.Img src={PaymentIllustration} />
			</PageHero.Body>

			{phone_number ? (
				<PageHero.Body>
					<PageHero.Content>
						<div data-aos="fade-up">
							<PageHero.Title>Jak umówić wizytę?</PageHero.Title>

							<PageHero.Text>
								Jeśli chcesz umówić wizytę, skonataktuj się ze
								mną:
							</PageHero.Text>

							<a
								href={`tel:+48-${phone_number}`}
								className="unique-text icon-container"
							>
								<FaPhoneAlt className="icon-container__icon" />
								+48 {phone_number}
							</a>
						</div>
						{contact_content_second ? (
							<PageHero.Text data-aos="flip-up">
								{contact_content_second}
							</PageHero.Text>
						) : null}
					</PageHero.Content>

					<PageHero.Img src={AppointmentIllustration} />
				</PageHero.Body>
			) : null}

			<PageHero.Body vertical data-aos="zoom-out-up">
				<PageHero.Title>Kalendarz z wizytami</PageHero.Title>

				<Calendar />
			</PageHero.Body>
		</PageHero>
	)
}

Home.prototype.propTypes = {
	isAdmin: PropTypes.bool,
	home_content: PropTypes.string,
	home_title: PropTypes.string,
	phone_number: PropTypes.string,
	contact_content_second: PropTypes.string,
}

const mapStateToProps = (state) => ({
	isAdmin: state.auth.data.is_admin,
	home_content: state.data.data[process.env.REACT_APP_HOME_CONTENT] || '',
	home_title: state.data.data[process.env.REACT_APP_HOME_TITLE] || '',
	phone_number: state.data.data[process.env.REACT_APP_PHONE_NUMBER] || '',
	contact_content_second:
		state.data.data[process.env.REACT_APP_CONTACT_CONTENT_SECOND] || '',
})

export default connect(mapStateToProps, null)(Home)
