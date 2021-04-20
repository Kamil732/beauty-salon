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
	home_title,
	home_content,
	phone_number,
	contact_content_second,
}) {
	return (
		<PageHero>
			<PageHero.Body>
				<PageHero.Content>
					<PageHero.Title>
						<EditBox name="home_title" value={home_title} textarea>
							{home_title}
						</EditBox>
					</PageHero.Title>

					<PageHero.Text>
						<EditBox
							name="home_content"
							value={home_content}
							textarea
						>
							{home_content}
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
				<PageHero.Img src={TimeIllustration} />
				<PageHero.Content>
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

			<PageHero.Body>
				<PageHero.Content>
					<PageHero.Title>Cennik</PageHero.Title>
					<PageHero.Text>
						<Pricing />
					</PageHero.Text>
				</PageHero.Content>

				<PageHero.Img src={PaymentIllustration} />
			</PageHero.Body>

			{phone_number ? (
				<PageHero.Body>
					<PageHero.Content>
						<PageHero.Title>Jak umówić wizytę?</PageHero.Title>

						<PageHero.Text>
							Jeśli chcesz umówić wizytę, skonataktuj się ze mną:
						</PageHero.Text>

						<a
							href={`tel:+48-${phone_number}`}
							className="unique-text icon-container"
						>
							<FaPhoneAlt className="icon-container__icon" />
							+48 {phone_number}
						</a>
						{contact_content_second ? (
							<PageHero.Text>
								{contact_content_second}
							</PageHero.Text>
						) : null}
					</PageHero.Content>

					<PageHero.Img src={AppointmentIllustration} />
				</PageHero.Body>
			) : null}

			<PageHero.Body vertical>
				<PageHero.Title>Kalendarz z wizytami</PageHero.Title>

				<Calendar />
			</PageHero.Body>
		</PageHero>
	)
}

Home.prototype.propTypes = {
	home_content: PropTypes.string,
	home_title: PropTypes.string,
	phone_number: PropTypes.string,
	contact_content_second: PropTypes.string,
}

const mapStateToProps = (state) => ({
	home_content: state.data.data.home_content,
	home_title: state.data.data.home_title,
	phone_number: state.data.data.phone_number,
	contact_content_second: state.data.data.contact_content_second,
})

export default connect(mapStateToProps, null)(Home)
