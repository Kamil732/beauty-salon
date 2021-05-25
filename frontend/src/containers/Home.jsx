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
		<>
			<PageHero>
				<PageHero.Body data-aos="zoom-in">
					<PageHero.Content>
						<PageHero.Title>
							<EditBox
								name="home_title"
								value={home_title}
								label="Tytuł strony głównej"
								type="textarea"
							>
								{isAdmin && !home_title
									? 'BRAK TREŚCI'
									: home_title}
							</EditBox>
						</PageHero.Title>

						<PageHero.Text>
							<EditBox
								name="home_content"
								value={home_content}
								label="Treść strony głównej"
								type="textarea"
							>
								{isAdmin && !home_content
									? 'BRAK TREŚCI'
									: home_content}
							</EditBox>
						</PageHero.Text>

						<ButtonContainer style={{ marginTop: '2rem' }}>
							<Button
								primary
								to={process.env.REACT_APP_CALENDAR_URL}
							>
								Umów wizytę
							</Button>
							<Button
								secondary
								to={process.env.REACT_APP_CONTACT_URL}
							>
								Kontakt
							</Button>
						</ButtonContainer>
					</PageHero.Content>

					<PageHero.Img src={BarberIllustration} />
				</PageHero.Body>

				<PageHero.Body>
					<PageHero.Img
						src={TimeIllustration}
						data-aos="fade-right"
					/>
					<PageHero.Content data-aos="fade-left">
						<PageHero.Title>Godziny Pracy</PageHero.Title>
						<Card>
							<div style={{ overflow: 'auto' }}>
								<WorkHours />
							</div>
						</Card>
					</PageHero.Content>
				</PageHero.Body>

				<PageHero.Body
					data-aos="zoom-out-up"
					data-aos-anchor-placement="center-bottom"
				>
					<PageHero.Content style={{ maxWidth: '80%' }}>
						<PageHero.Title>Cennik</PageHero.Title>

						<Card>
							<div style={{ overflow: 'auto' }}>
								<Pricing />
							</div>
						</Card>
					</PageHero.Content>

					<PageHero.Img src={PaymentIllustration} />
				</PageHero.Body>

				{phone_number ? (
					<PageHero.Body>
						<PageHero.Content>
							<div data-aos="fade-up">
								<PageHero.Title>
									Jak umówić wizytę?
								</PageHero.Title>

								<PageHero.Text>
									Jeśli chcesz umówić wizytę, skonataktuj się
									ze mną:
								</PageHero.Text>

								<a
									href={`tel:+48-${phone_number}`}
									className="unique-text icon-container"
								>
									<FaPhoneAlt className="icon-container__icon" />
									{phone_number}
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

				{window.innerWidth > 768 && (
					<PageHero.Body vertical>
						<PageHero.Title>Kalendarz z wizytami</PageHero.Title>

						<Calendar />
					</PageHero.Body>
				)}
			</PageHero>
			{window.innerWidth <= 768 && (
				<>
					<PageHero.Title style={{ textAlign: 'center' }}>
						Kalendarz z wizytami
					</PageHero.Title>
					<Calendar />
				</>
			)}
		</>
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
	home_content: state.data.cms.data.home_content || '',
	home_title: state.data.cms.data.home_title || '',
	phone_number: state.data.cms.data.phone_number || '',
	contact_content_second: state.data.cms.data.contact_content_second || '',
})

export default connect(mapStateToProps, null)(Home)
