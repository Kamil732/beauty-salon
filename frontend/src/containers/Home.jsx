import React, { Component } from 'react'

import BarberIllustration from '../assets/images/barber-illustration.png'
import ButtonContainer from './layout/buttons/ButtonContainer'
import Button from './layout/buttons/Button'
import PageHero from './layout/PageHero'

class Home extends Component {
	render() {
		return (
			<PageHero>
				<PageHero.Body>
					<PageHero.Img src={BarberIllustration} />

					<PageHero.Content>
						<h1>Pełna obsługa mężczyzn i chłopców</h1>
						<p>
							Wolność w podejmowaniu decyzji, elastyczność w
							wykorzystaniu czasu. Przeżyj czas, kiedy dbanie o
							włosy i brodę było męskie i było częścią bycia
							mężczyzną
						</p>

						<ButtonContainer>
							<Button primary to="/my-meetings">
								Kalendarz
							</Button>
							<Button secondary to="/contact">
								Kontakt
							</Button>
						</ButtonContainer>
					</PageHero.Content>
				</PageHero.Body>
			</PageHero>
		)
	}
}

export default Home
