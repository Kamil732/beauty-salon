import React from 'react'

import Error404Illustration from '../assets/images/error-404-illustration.svg'
import PageHero from '../layout/PageHero'

function NotFound() {
	return (
		<PageHero>
			<PageHero.Body vertical>
				<PageHero.Img src={Error404Illustration} />
				<PageHero.Text>
					Nie ma takiej strony. Użyj nawigacji na górze strony by
					dostać się tam gdzie chcesz.
				</PageHero.Text>
			</PageHero.Body>
		</PageHero>
	)
}

export default NotFound
