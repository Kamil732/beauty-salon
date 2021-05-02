import React from 'react'

import moment from 'moment'

import { Views } from 'react-big-calendar'
import ButtonContainer from '../../../../layout/buttons/ButtonContainer'
import Button from '../../../../layout/buttons/Button'

const Toolbar = ({
	windowWidth,
	setView,
	view,
	views,
	onView,
	onNavigate,
	date,
	localizer,
}) => {
	const goToView = (view) => {
		onView(view)
		setView(view)
	}

	if (windowWidth < 768 && view !== Views.DAY) goToView(Views.DAY)

	const goToBack = () => onNavigate('PREV')

	const goToNext = () => onNavigate('NEXT')

	const goToCurrent = () => onNavigate('TODAY')

	const label = () => {
		date = moment(date)

		return (
			<span>
				{view === Views.DAY && <span>{date.format('DD')}</span>}
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

			{windowWidth >= 768 && views.length > 1 && (
				<ButtonContainer.Group>
					{views.map((v, index) => (
						<React.Fragment key={index}>
							{view !== v && (
								<Button
									primary
									small
									onClick={() => goToView(v)}
								>
									{localizer.messages[v]}
								</Button>
							)}
						</React.Fragment>
					))}
				</ButtonContainer.Group>
			)}
		</div>
	)
}

export default Toolbar
