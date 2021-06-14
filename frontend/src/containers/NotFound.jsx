import React from 'react'

import Error404Illustration from '../assets/svgs/error-404-illustration.svg'
import PageHero from '../layout/PageHero'

function NotFound() {
	return (
		<PageHero vertical data-aos="slide-up">
			<PageHero.Img src={Error404Illustration} />
			<PageHero.Text>
				Nie ma takiej strony. Użyj nawigacji na górze strony by dostać
				się tam gdzie chcesz.
			</PageHero.Text>
		</PageHero>
	)
}

export default NotFound
