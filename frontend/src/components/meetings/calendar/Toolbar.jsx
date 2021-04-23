import React from 'react'

import moment from 'moment'

import { Views } from 'react-big-calendar'
import ButtonContainer from '../../../layout/buttons/ButtonContainer'
import Button from '../../../layout/buttons/Button'

function Toolbar(toolbar) {
	const goToDayView = () => toolbar.onView('day')

	const goToWeekView = () => toolbar.onView('week')

	const goToMonthView = () => toolbar.onView('month')

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

			<ButtonContainer.Group>
				{toolbar.view !== Views.MONTH && (
					<Button primary small onClick={goToMonthView}>
						Miesiąc
					</Button>
				)}
				{toolbar.view !== Views.WEEK && (
					<Button primary small onClick={goToWeekView}>
						Tydzień
					</Button>
				)}

				{toolbar.view !== Views.DAY && (
					<Button primary small onClick={goToDayView}>
						Dzień
					</Button>
				)}
			</ButtonContainer.Group>
		</div>
	)
}

export default Toolbar
