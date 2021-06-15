import moment from 'moment'
import React from 'react'
import ReactTooltip from 'react-tooltip'

function EventWrapper({ event, children, label }) {
	const start = moment(event.start)
	const end = moment(event.end)
	const eventDays = end.diff(start, 'days')

	return (
		<>
			<div data-tip="wef" data-for={`${event.id}Tip`}>
				{children}
			</div>
			<ReactTooltip
				id={`${event.id}Tip`}
				place="right"
				type="light"
				borderColor="grey"
				border
				offset={{ right: 20 }}
				getContent={() => (
					<div className="event-tooltip">
						<b>
							{eventDays > 0 ? (
								<>
									{start.format('DD.MM.YYYY')}
									{eventDays > 1 &&
										` - ${end.format('DD.MM.YYYY')}`}
								</>
							) : (
								label
							)}
						</b>
						{!event.do_not_work && (
							<span>
								{event.customer_first_name}{' '}
								{event.customer_last_name}
							</span>
						)}

						{event.description && (
							<>
								<b>{event.do_not_work ? 'Powód' : 'Opis'}:</b>
								<span>{event.description}</span>
							</>
						)}
					</div>
				)}
			/>
		</>
	)
}

export default EventWrapper
