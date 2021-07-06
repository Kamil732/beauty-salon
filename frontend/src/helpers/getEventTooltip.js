import React, { useCallback } from 'react'
import moment from 'moment'

import { GrResources } from 'react-icons/gr'

export default function getEventTooltip(
	{ id: eventServiceId, data: event },
	services,
	showTime = true
) {
	const start = moment(event.start)
	const end = moment(event.end)
	const eventDays = end.diff(start, 'days')

	return (
		<div className="event-tooltip">
			{showTime && (
				<b>
					{eventDays > 0 ? (
						<>
							{start.format('DD.MM.YYYY')}
							{eventDays > 1 && ` - ${end.format('DD.MM.YYYY')}`}
						</>
					) : (
						`${start.format('H:mm')} - ${end.format('H:mm')}`
					)}
				</b>
			)}
			{!event.blocked && (
				<>
					<span>
						{event.customer_first_name} {event.customer_last_name}
					</span>
					<b>Usługi:</b>
					<ol style={{ listStyle: 'none' }}>
						{event.services.map((service, index) => (
							<li
								key={service.id}
								style={{
									fontWeight:
										service.id === eventServiceId
											? 600
											: 400,
								}}
							>
								{index + 1}/{event.services.length}{' '}
								{
									services.find(({ id }) => id === service.id)
										.name
								}{' '}
								{service.resources.length > 0 && (
									<>
										<GrResources />{' '}
										{service.resources.length}
									</>
								)}
							</li>
						))}
					</ol>
				</>
			)}

			{event.description && (
				<>
					<b>{event.blocked ? 'Powód' : 'Opis'}:</b>
					<p>{event.description}</p>
				</>
			)}
		</div>
	)
}
