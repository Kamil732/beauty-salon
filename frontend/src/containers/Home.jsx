import React from 'react'

import BarberIllustration from '../assets/images/barber-illustration.svg'
import ButtonContainer from '../layout/buttons/ButtonContainer'
import Button from '../layout/buttons/Button'
import PageHero from '../layout/PageHero'
import Calendar from '../components/meetings/Calendar'

function Home() {
	return (
		<PageHero>
			<PageHero.Body>
				<PageHero.Content>
					<PageHero.Title>
						Pełna obsługa mężczyzn i chłopców
					</PageHero.Title>
					<PageHero.Text>
						Wolność w podejmowaniu decyzji, elastyczność w
						wykorzystaniu czasu. Przeżyj czas, kiedy dbanie o włosy
						i brodę było męskie i było częścią bycia mężczyzną
					</PageHero.Text>

					<ButtonContainer>
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
			<PageHero.Body vertical>
				<PageHero.Title>Kalendarz</PageHero.Title>
				<Calendar />
			</PageHero.Body>
		</PageHero>
	)
}

export default Home
