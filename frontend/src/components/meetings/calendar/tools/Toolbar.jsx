import React from 'react'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

import { Views } from 'react-big-calendar'
import ButtonContainer from '../../../../layout/buttons/ButtonContainer'
import Button from '../../../../layout/buttons/Button'

const Toolbar = ({
	windowWidth,
	view,
	views,
	onView,
	onNavigate,

	localizer,
	label,
}) => {
	const goToView = (view) => onView(view)

	if (windowWidth < 768 && view !== Views.DAY) goToView(Views.DAY)
	else if (windowWidth >= 768 && view === Views.DAY) goToView('threedays')

	const goToBack = () => onNavigate('PREV')

	const goToNext = () => onNavigate('NEXT')

	const goToCurrent = () => onNavigate('TODAY')

	return (
		<div className="toolbar-container">
			<ButtonContainer>
				<ButtonContainer.Group>
					<Button primary small onClick={goToBack}>
						<IoIosArrowBack />
					</Button>

					<Button primary small onClick={goToNext}>
						<IoIosArrowForward />
					</Button>
				</ButtonContainer.Group>
				<Button primary small onClick={goToCurrent}>
					Dzisiaj
				</Button>
			</ButtonContainer>

			<label className="label-date">{label}</label>

			{windowWidth >= 768 && views.length > 1 && (
				<ButtonContainer.Group>
					{views.map((v, index) => (
						<React.Fragment key={index}>
							{view !== v && v !== Views.DAY && (
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
