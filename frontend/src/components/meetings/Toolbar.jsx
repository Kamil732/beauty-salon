import React from 'react'

import moment from 'moment'

import { Views } from 'react-big-calendar'
import ButtonContainer from '../../layout/buttons/ButtonContainer'
import Button from '../../layout/buttons/Button'

const Toolbar = (toolbar) => {
	const goToBack = () => toolbar.onNavigate('PREV')

	const goToNext = () => toolbar.onNavigate('NEXT')

	const goToCurrent = () => toolbar.onNavigate('TODAY')

	const label = () => {
		const date = moment(toolbar.date)

		return (
			<span>
				{toolbar.view === Views.DAY ? (
					<span>{date.format('DD')}</span>
				) : null}
				<b> {date.format('MMMM')}</b>
				<span> {date.format('YYYY')}</span>
			</span>
		)
	}

	return (
		<div className="toolbar-container">
			<ButtonContainer>
				<Button primary small onClick={goToBack}>
					&#8249;
				</Button>
				<Button primary small onClick={goToCurrent}>
					Dzisiaj
				</Button>
				<Button primary small onClick={goToNext}>
					&#8250;
				</Button>
			</ButtonContainer>

			<label className="label-date">{label()}</label>
		</div>
	)
}

export default Toolbar
