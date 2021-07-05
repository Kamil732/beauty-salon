import React from 'react'
import { connect } from 'react-redux'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { Views } from 'react-big-calendar'

import { updateResourceMap } from '../../../../redux/actions/meetings'

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
	resourceMapIsMany,
	updateResourceMap,
}) => {
	const goToView = (view) => {
		localStorage.setItem('view', view)
		if (resourceMapIsMany && view !== 'reception')
			updateResourceMap('isMany', false)
		if (!resourceMapIsMany && view === 'reception')
			updateResourceMap('isMany', true)

		onView(view)
	}

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

const mapStateToProps = (state) => ({
	resourceMapIsMany: state.meetings.resourceMap.isMany,
})

const mapStateToDispatch = {
	updateResourceMap,
}

export default connect(mapStateToProps, mapStateToDispatch)(Toolbar)
