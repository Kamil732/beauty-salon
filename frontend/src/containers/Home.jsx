import React from 'react'
import PropTypes from 'prop-types'

import BarberIllustration from '../assets/images/barber-illustration.svg'
import ButtonContainer from '../layout/buttons/ButtonContainer'
import Button from '../layout/buttons/Button'
import PageHero from '../layout/PageHero'
import Calendar from '../components/meetings/Calendar'
import { connect } from 'react-redux'

function Home({ home_title, home_content }) {
	return (
		<PageHero>
			<PageHero.Body>
				<PageHero.Content>
					{home_title ? (
						<PageHero.Title>{home_title}</PageHero.Title>
					) : null}
					{home_content ? (
						<PageHero.Text>{home_content}</PageHero.Text>
					) : null}

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

Home.prototype.propTypes = {
	home_content: PropTypes.string,
	home_title: PropTypes.string,
}

const mapStateToProps = (state) => ({
	home_content: state.data.data.home_content,
	home_title: state.data.data.home_title,
})

export default connect(mapStateToProps, null)(Home)
